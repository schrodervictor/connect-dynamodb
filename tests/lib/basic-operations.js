'use strict';
var chai = require('chai');
var mocks = require('./fixtures/energy-db-mock');
var DynamoDBStore = require('../../lib/store');

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

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

  it('should pass the EnergyDB settings to EnergyDB connection', function(done) {

    var store = new DynamoDBStore({
      tableName: 'Table-HashKey',
      dbConnector: mocks.connectorMock,
      endpoint: 'test-value',
      accessKeyId: 'test-value',
      secretAccessKey: 'test-value',
      region: 'test-value'
    });

    var energyDBSettings = {
      endpoint: 'test-value',
      accessKeyId: 'test-value',
      secretAccessKey: 'test-value',
      region: 'test-value'
    };

    var stub = sinon.stub(require('energy-db'), 'connect', mocks.connect);

    store.getTable(function(err, table) {
      expect(stub).to.have.been.calledWith(
        sinon.match(energyDBSettings)
      );
      stub.restore();
      done();
    });

  });

  it('should use consistent reads by default', function(done) {

    var store = new DynamoDBStore({
      tableName: 'Table-HashKey',
      dbConnector: mocks.connectorMock
    });

    store.getTable(function(err, table) {
      expect(table.queryBase.ConsistentRead).to.be.true;
      done();
    });

  });

  it('should be possible to use eventual consistent reads, if needed', function(done) {

    var store = new DynamoDBStore({
      tableName: 'Table-HashKey',
      dbConnector: mocks.connectorMock,
      consistentRead: false
    });

    store.getTable(function(err, table) {
      expect(table.queryBase.ConsistentRead).to.be.false;
      done();
    });

  });

});
