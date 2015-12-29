'use strict';
var expect = require('chai').expect;
var EventEmitter = require('events').EventEmitter;
var DynamoDBStore = require('../../lib/store').DynamoDBStore;

describe('DynamoDBStore', function() {
  it('should inherit from EventEmiter', function() {
    expect(DynamoDBStore.prototype).to.be.an.instanceOf(EventEmitter);
  });

  describe('should implement the mandatory methods', function() {
    it('mandatory: store.destroy(sid, callback)', function() {
      expect(DynamoDBStore).to.respondTo('destroy');
    });
    it('mandatory: store.get(sid, callback)', function() {
      expect(DynamoDBStore).to.respondTo('get');
    });
    it('mandatory: store.set(sid, session, callback)', function() {
      expect(DynamoDBStore).to.respondTo('set');
    });
  });
});
