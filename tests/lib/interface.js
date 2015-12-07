'use strict';
var expect = require('chai').expect;
var EventEmitter = require('events').EventEmitter;
var DynamoDBStore = require('../../lib/store');

describe('DynamoDBStore', function() {
  it('should inherit from EventEmiter', function() {
    expect(DynamoDBStore.prototype).to.be.an.instanceOf(EventEmitter);
  });

  describe('should implement the mandatory methods', function() {
    it('mandatory: store.destroy(sid, calback)', function() {
      expect(DynamoDBStore).to.respondTo('destroy');
    });
    it('mandatory: store.get(sid, calback)', function() {
      expect(DynamoDBStore).to.respondTo('get');
    });
    it('mandatory: store.set(sid, session, calback)', function() {
      expect(DynamoDBStore).to.respondTo('set');
    });
  });
});
