'use strict';
var expect = require('chai').expect;
var mocks = require('./fixtures/energy-db-mock');
var DynamoDBStore = require('../../lib/store');
var EnergyTable = require('../../node_modules/energy-db/lib/energy-table').EnergyTable;

describe('DynamoDBStore', function() {
  it('should be able to acquire a connection to DynamoDB (using EnergyDB table)', function(done) {

    var store = new DynamoDBStore({
      tableName: 'Table-HashKey',
      dbConnector: mocks.connectorMock
    });

    store.getTable(function(err, table) {
      expect(table).to.be.an.instanceOf(EnergyTable);
      done();
    });

  });
});
