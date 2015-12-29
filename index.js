'use strict';
var util = require('util');
var DynamoDBStore = require('./lib/store').DynamoDBStore;
var decorate = require('./lib/store').decorate;

module.exports = function(session) {

  var Store = function(settings) {
    // Calls the same constructor of DynamoDBStore in this context
    DynamoDBStore.call(this, settings);
  }

  if ('Store' in session) {
    util.inherits(Store, session.Store);
    decorate(Store);
  } else {
    util.inherits(Store, DynamoDBStore);
  }

  return Store;
};
