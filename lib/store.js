'use strict';
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function DynamoDBStore() {}

// Must inherit from EventEmitter
util.inherits(DynamoDBStore, EventEmitter);

// Mandatory methods
DynamoDBStore.prototype.destroy = function destroy(sid, callback) {};
DynamoDBStore.prototype.get = function get(sid, callback) {};
DynamoDBStore.prototype.set = function set(sid, session, callback) {};

module.exports = DynamoDBStore;
