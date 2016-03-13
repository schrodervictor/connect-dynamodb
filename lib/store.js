'use strict';
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var energyDB = require('energy-db');

function DynamoDBStore(settings) {
  // Default settings
  this.settings = {
    consistentRead: true
  };

  for (var setting in settings) {
    this.settings[setting] = settings[setting];
  }

  // Table instance, not table name
  this.table = null;
}

// Must inherit from EventEmitter
util.inherits(DynamoDBStore, EventEmitter);

function decorate(constructorFunction) {

  // Mandatory methods
  constructorFunction.prototype.destroy = function destroy(sid, callback) {
    this.getTable(function(err, table) {
      if (err) return callback(err);
      table.delete({sid: sid}, callback);
    });
  };

  constructorFunction.prototype.get = function get(sid, callback) {
    this.getTable(function(err, table) {
      if (err) return callback(err);
      table.query({sid: sid}, function(err, queryData) {

        // We cannot pass the callback directly because the table.query
        // method returns an array of results, but we need to pass ahead
        // only the first result... table should have a 'findOne' method

        if (err) return callback(err);
        if (!queryData || queryData.length != 1) {
          return callback();
        } else {
          return callback(null, queryData[0]);
        }
      });
    });
  };

  constructorFunction.prototype.set = function set(sid, session, callback) {
    this.getTable(function(err, table) {
      if (err) return callback(err);
      session['sid'] = sid;
      table.putItem(session, callback);
    });
  };

  constructorFunction.prototype.getTable = function(callback) {

    if (this.table) {
      return callback(null, this.table);
    }

    var self = this;
    var tableName = this.settings.tableName;
    var dbConnector = this.settings.dbConnector || null;
    var energyDBSettings = {};

    [
      'endpoint',
      'accessKeyId',
      'secretAccessKey',
      'region',
    ].forEach(function(key) {
      if (key in self.settings) {
        energyDBSettings[key] = self.settings[key];
      }
    });

    if (!energyDBSettings.accessKeyId && process.env.AWS_ACCESS_KEY) {
      energyDBSettings.accessKeyId = process.env.AWS_ACCESS_KEY;
    }

    if (!energyDBSettings.secretAccessKey && process.env.AWS_SECRET_KEY) {
      energyDBSettings.secretAccessKey = process.env.AWS_SECRET_KEY;
    }

    if (!energyDBSettings.region && process.env.AWS_REGION) {
      energyDBSettings.region = process.env.AWS_REGION;
    }


    energyDB.connect(energyDBSettings, dbConnector, function(err, db) {
      if (err) return callback(err);
      db.table(tableName, function(err, table) {
        if (err) return callback(err);

        table.addQueryParam('ConsistentRead', self.settings.consistentRead);
        self.table = table;

        return callback(null, table);
      });
    });
  };
}

decorate(DynamoDBStore);

module.exports = {
  DynamoDBStore: DynamoDBStore,
  decorate: decorate
};
