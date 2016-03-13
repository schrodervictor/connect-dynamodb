'use strict';
var chai = require('chai');
var mocks = require('./fixtures/energy-db-mock');
var DynamoDBStore = require('../../lib/store').DynamoDBStore;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

var EnergyTable = require('../../node_modules/energy-db/lib/energy-table').EnergyTable;

before(function() {
  process.env.AWS_ACCESS_KEY = 'AAAAAAAAAA';
  process.env.AWS_SECRET_KEY = 'SSSSSSSSSS';
  process.env.AWS_REGION = 'fi-narnia-1';
});

describe('DynamoDBStore', function() {
  it('should aquire a connection to DynamoDB to the table specified when needed', function(done) {

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

  it('should be able to discover the AWS credentials from the env variables',
    function(done) {

      var store = new DynamoDBStore({
        tableName: 'Table-HashKey',
        dbConnector: mocks.connectorMock,
      });

      var energyDBSettings = {
        accessKeyId: 'AAAAAAAAAA',
        secretAccessKey: 'SSSSSSSSSS',
        region: 'fi-narnia-1'
      };

      var stub = sinon.stub(require('energy-db'), 'connect', mocks.connect);

      store.getTable(function(err, table) {
        expect(stub).to.have.been.calledWith(
          sinon.match(energyDBSettings)
        );
        stub.restore();
        done();
      });

    }
  );

  it('should not call the AWS API multiple times to describe table', function(done) {

    var store = new DynamoDBStore({
      tableName: 'Table-HashKey',
      dbConnector: mocks.connectorMock
    });

    var spy = sinon.spy(mocks.connectorMock, 'describeTable');

    store.getTable(function(err, table) {
      store.getTable(function(err, table) {
        expect(spy).to.have.been.calledOnce
        spy.restore();
        done();
      });
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

  describe('#destroy(sid, callback)', function() {

    it('should be able to delete sessions by sid', function(done) {

      var store = new DynamoDBStore({
        tableName: 'Table-HashKey',
        dbConnector: mocks.connectorMock
      });

      var spy = sinon.spy(mocks.connectorMock, 'deleteItem');

      var expectedQuery = {
        TableName: 'Table-HashKey',
        Key: {'sid': {S:
          'some-sid-here'
        }}
      }

      store.destroy('some-sid-here', function(err) {
        if (err) return done(err);
        expect(spy).to.have.been.calledWith(
          sinon.match(expectedQuery)
        );
        done();
      });

    });
  });

  describe('#get(sid, callback)', function() {
    it('should be able to query and retrieve the session by sid', function(done) {
      var store = new DynamoDBStore({
        tableName: 'Table-HashKey',
        dbConnector: mocks.connectorMock
      });

      var expectedQuery = {
        TableName: 'Table-HashKey',
        ConsistentRead: true,
        ExpressionAttributeNames: {
          '#k0': 'sid',
        },
        ExpressionAttributeValues: {
          ':v0': {S: 'sid-unique-identifier-example'},
        },
        KeyConditionExpression: '#k0 = :v0'
      };

      var expectedResponse = {
        TableName: 'Table-HashKey',
        Items: [
          {
            sid: {S: 'sid-unique-identifier-example'},
            key1: {S: 'some session data'},
            key2: {N: 12345}
          }
        ]
      };

      var expectedSession = {
        sid: 'sid-unique-identifier-example',
        key1: 'some session data',
        key2: 12345
      };

      var stub = sinon.stub(mocks.connectorMock, 'query', function(query, callback) {
          return callback(null, expectedResponse);
      });

      store.get('sid-unique-identifier-example', function(err, session, callback) {
        expect(session).to.deep.equals(expectedSession);
        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(
          sinon.match(expectedQuery)
        );
        stub.restore();
        done();
      });
    });
  });

  describe('#set(sid, session, callback)', function() {
    it('should be able to save the session for a given sid', function(done) {
      var store = new DynamoDBStore({
        tableName: 'Table-HashKey',
        dbConnector: mocks.connectorMock
      });

      var sessionToSave = {
        key1: 'some session data',
        key2: 12345
      };

      var expectedQuery = {
        TableName: 'Table-HashKey',
        Item: {
          sid: {S: 'sid-unique-identifier-example'},
          key1: {S: 'some session data'},
          key2: {N: '12345'}
        }
      };

      var stub = sinon.stub(mocks.connectorMock, 'putItem', function(query, callback) {
          return callback();
      });

      store.set('sid-unique-identifier-example', sessionToSave, function(err) {
        if (err) return done(err);
        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(
          sinon.match(expectedQuery)
        );
        stub.restore();
        done();
      });
    });
  });
});
