'use strict';
var EnergyDB = require('energy-db').EnergyDB;

var infoTableHashKey = {
  Table: {
    TableName: 'Table-HashKey',
    KeySchema: [
      { AttributeName: 'sid', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'sid', AttributeType: 'S' },
    ]
  }
};

var connectorMock = {
  putItem: function(item, callback) {
    return callback();
  },
  query: function(item, callback) {
    return callback();
  },
  scan: function(item, callback) {
    return callback();
  },
  deleteItem: function(item, callback) {
    return callback();
  },
  describeTable: function(query, callback) {
    if (query['TableName'] === 'Table-HashKey') {
      return callback(null, infoTableHashKey);
    } else {
      return callback(new Error());
    }
  }
};

var connect = function(settings, dbConnector, callback) {
  if (!callback && typeof dbConnetor === 'function') {
    callback = dbConnector;
  }
  // in this mock, we don't care about custom dbConnectors,
  // we always use the EnergyDB connector.
  return callback(null, new EnergyDB(settings, connectorMock));
};

module.exports = {
  'Table-HashKey': infoTableHashKey,
  connectorMock: connectorMock,
  connect: connect
};
