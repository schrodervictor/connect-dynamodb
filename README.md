dynamodb-session-store
======================

DynamoDB is a fully managed key/value store offered by AWS that promisses to
be highly scalable and fast.

Although, those that already tried to deal with this NoSQL database, know that
the query structure can be very annoying with the so-called, strong-typed JSON.

It would be nice to use DynamoDB to store your node.js sessions without having
to construct those queries by hand... Fear no more! This module will make your
life easier.

Based on the [EnergyDB][1] adapter (which simplifies the document handling when
dealing with DynamoDB), the job to save and retrieve sessions objects is made
easy here, and offered as a standard express-session storage.

Please note that this module still BETA!

## Instalation

If you are reading you know how to install a npm module. Just put it in your
dependencies list or install it globally if you are one of those people.

## How to use it

When creating the middleware for your express application, do as usual for
most of the session storages out there:


```javascript
var session = require('express-session');
var DynamoDBStore = require('dynamodb-session-store')(session);
 
var options = {
  tableName: 'Ultraviolet-Sessions'
};

app.use(session({
  store: new DynamoDBStore(options),
  secret: 'There... are... four... lights!!!'
}));
```

The parameter `options` is an object that contains the settings to store
instance. It can contain anything an instance of EnergyDB or DynamoDB expects
as settings. It's mandatory to provide a `tableName`.

Some particular useful settings are the AWS credentials related values. In
order to connect to your table in DynamoDB, you need to provide the access key,
the secret key and the region where is table is located. It's highly recommended
that you use the same region where your application is running, otherwise you
will experience big latency.

By default, the DynamoDBStore will use consistent reads by default. You can
override this setting in the options, setting `consistentRead` to `false`.

Here is an example of how the `options` object may look like:

```javascript
var options = {
  tableName: 'THX-1138-Table',
  consistentRead: false,
  accessKeyId: 'AAAAAAAAAAAAAAAAAAAAAAAAAAA',
  secretAccessKey: 'SSSSSSSSSSSSSSSSSSSSSSSSSSS',
  region: 'fi-narnia-1'
};
```

If you don't provide `accessKeyId`, `secretAccessKey` and/or `region`,
we are going to try to find these values among the enviromental variable,
more precisely `AWS_ACCESS_KEY`, `AWS_SECRET_KEY` and `AWS_REGION`.

Because we are [EnergyDB][1], you don't have to care about converting the objects
back and forth from js to dynamo-strong-typed-json. [DynamoDoc][2] is used
internally to make this convertion for you.

As usual, I suggest you to take a look on the code and the tests, if you want
to do something more complex.

## Unit tests

We try to keep everything very simple and to cover things with tests (most of
the times writing them first). Limitations of the [EnergyDB][1], about some error
handling, will reflect in this module too.

## Contributing

Fork the repo, create a branch, do awesome additions and submit a
pull-request. Only PR's with tests will be considered.

## Releases

* 0.0.2

  * Changes the name of the package to 'dynamodb-session-store'


* 0.0.1

  * Initial release
  * support to destroy, get and set operations

[1]: https://www.npmjs.com/package/energy-db
[2]: https://www.npmjs.com/package/dynamo-doc
