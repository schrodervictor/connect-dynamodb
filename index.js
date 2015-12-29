'use strict';
var DynamoDBStore = require('./lib/store');

module.exports = function() {
  return DynamoDBStore;
};
