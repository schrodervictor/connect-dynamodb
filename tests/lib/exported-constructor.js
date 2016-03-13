
'use strict';
var expect = require('chai').expect;
var EventEmitter = require('events').EventEmitter;
var ExpressSessionStore = require('./fixtures/express-session-store');

var Store = require('../../index')({Store: ExpressSessionStore});

describe('DynamoDBStore (exported constructor)', function() {
  it('should inherit from EventEmiter', function() {
    expect(Store.prototype).to.be.an.instanceOf(EventEmitter);
  });

  it('should (ideally) inherit from the default session Store', function() {
    expect(Store.prototype).to.be.an.instanceOf(ExpressSessionStore);
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

  describe('should respond to the methods implemented by the default store', function() {
    it('store.regenerate(req, fn)', function() {
      expect(Store).to.respondTo('regenerate');
    });
    it('store.regenerate(sid, fn)', function() {
      expect(Store).to.respondTo('load');
    });
    it('store.createSession(req, sess)', function() {
      expect(Store).to.respondTo('createSession');
    });
  });
});
