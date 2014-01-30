var chai = require('chai');
var expect = chai.expect;
var odata = require('../src/odata');

describe('odata', function () {

  it('should build an object with services', function () {
    var od = odata({test: 'test', other: 'other'});

    expect(od.test).to.exist;
    expect(od.other).to.exist;
  });

  it('should maybe build a validation model from metadata', function () {
    throw 'unimplemented';
  });

  it('should put a get/put/post/delete request on each service', function () {
    throw 'unimplemented';
  });

  it('should provide the auth login as login', function () {
    var od = odata({authUrl: 'authTest'});

    expect(od.login).to.exist;
  });

  it('should default requests to accept json', function () {
    throw 'unimplemented';
  });

  it('should return an error if one of the endpoints fails', function () {
    throw 'unimplemented';
  });

});
