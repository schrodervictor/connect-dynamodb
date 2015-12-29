var EventEmitter = require('events').EventEmitter;

var Store = module.exports = function Store(options){};

Store.prototype.__proto__ = EventEmitter.prototype;

Store.prototype.regenerate = function(req, fn){};
Store.prototype.load = function(sid, fn){};
Store.prototype.createSession = function(req, sess){};
