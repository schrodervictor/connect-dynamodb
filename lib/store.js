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
}

// Must inherit from EventEmitter
util.inherits(DynamoDBStore, EventEmitter);

// Mandatory methods
DynamoDBStore.prototype.destroy = function destroy(sid, callback) {
  this.getTable(function(err, table) {
    if (err) return callback(err);
    table.delete({sid: sid}, callback);
  });
};

DynamoDBStore.prototype.get = function get(sid, callback) {
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

DynamoDBStore.prototype.set = function set(sid, session, callback) {
  this.getTable(function(err, table) {
    if (err) return callback(err);
    session['sid'] = sid;
    table.putItem(session, callback);
  });
};

DynamoDBStore.prototype.getTable = function(callback) {

  var self = this;
  var tableName = this.settings.tableName;
  var dbConnector = this.settings.dbConnector || null;
  var energyDBSettings = {};

  // Copy the settings needed by EnergyDB
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

  energyDB.connect(energyDBSettings, dbConnector, function(err, db) {
    if (err) return callback(err);
    db.table(tableName, function(err, table) {
      if (err) return callback(err);
      table.addQueryParam('ConsistentRead', self.settings.consistentRead);
      return callback(null, table);
    });
  });
};

module.exports = DynamoDBStore;
