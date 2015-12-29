'use strict';
var DynamoDBStore = require('./lib/store').DynamoDBStore;

module.exports = function() {
  return DynamoDBStore;
};
