
'use strict';
var expect = require('chai').expect;
var EventEmitter = require('events').EventEmitter;

var Store = require('../../index')();

describe('DynamoDBStore (exported constructor)', function() {
  it('should inherit from EventEmiter', function() {
    expect(Store.prototype).to.be.an.instanceOf(EventEmitter);
  });

  describe('should implement the mandatory methods', function() {
    it('mandatory: store.destroy(sid, callback)', function() {
      expect(Store).to.respondTo('destroy');
    });
    it('mandatory: store.get(sid, callback)', function() {
      expect(Store).to.respondTo('get');
    });
    it('mandatory: store.set(sid, session, callback)', function() {
      expect(Store).to.respondTo('set');
    });
  });

});
