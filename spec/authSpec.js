var chai = require('chai');
var expect = chai.expect;
var auth = require('../src/auth');

function errorRequest(options, callback) {
  callback('http error');
}

function successRequest(options, callback) {
  callback(null, {
    statusCode: 200,
    headers: {'set-cookie': ['monster']}
  }, {d: true});
}

function badAuthRequest(options, callback) {
  callback(null, {statusCode: 200}, {d: false});
}

function failRequest(options, callback) {
  callback(null, {statusCode: 404});
}

describe('auth', function () {
  describe('login', function () {
    it('should return an error if the login returns an error',
      function () {
        var service = auth(errorRequest, {});
        service.login(null, null, function (err) {
          expect(err).to.equal('http error');
        });
      }
    );

    it('should return the cookie to the callback', function () {
      var service = auth(successRequest, {});
      service.login(null, null, function (err, cookie) {
        expect(cookie).to.equal('monster');
      });
    });

    it('should raise an error if the service returns auth failure',
      function () {
        var service = auth(badAuthRequest, {});
        service.login(null, null, function (err) {
          expect(err).to.equal('Username or password is incorrect');
        });
      }
    );

    it('should raise an error if the statusCode is not 200', function () {
      var service = auth(failRequest, {});
      service.login(null, null, function (err) {
        expect(err).to.equal('Authentication service call failed');
      });
    });

  });
});
