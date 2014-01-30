var chai = require('chai');
var expect = chai.expect;
var query = require('../src/query');

describe('query', function () {

  describe('request', function () {

    it('should return the returned data', function () {
      function dataSuccess(o, cb) {
        cb(null, {statusCode: 200}, 'data');
      }

      var service = query(dataSuccess);
      service.request({}, function (err, data) {
        expect(data).to.equal('data');
      });
    });

    it('should return an error when the request errors', function () {
      function error(o, cb) {
        cb('ERROR');
      }

      var service = query(error);
      service.request({}, function (err) {
        expect(err).to.equal('ERROR');
      });
    });

    it('should return an error if the request returns non 200', function () {
      function fail(o, cb) {
        cb(null, {statusCode: 400});
      }

      var service = query(fail);
      service.request({}, function (err) {
        expect(err).to.equal('odata request failed');
      });
    });

    it('should default to GET', function () {
      var method;
      var service = query(function (o) {
        method = o.method;
      });

      service.request({});
      expect(method).to.equal('GET');
    });

    it('should append the cookie if passed', function () {
      var cookie;
      var service = query(function (o) {
        cookie = o.headers.Cookie;
      });

      service.request({cookie: 'monster'});
      expect(cookie).to.equal('monster');
    });

    it('should add prefix "?" for the first option and "&" for subsequent options', function () {
      var url;
      var service = query(function (o) {
        url = o.url;
      });

      service.request({filter: 'filter', expand: 'expand', url: '/'});
      expect(url).to.equal('/?$filter=filter&$expand=expand');
    });

    it('should add (id) if "id" is a specified', function () {
      var url;
      var service = query(function (o) {
        url = o.url;
      });

      service.request({id: 1, url: 'test'});
      expect(url).to.equal('test(1)');
    });

    it('should add the id if id is 0', function () {
      var url;
      var service = query(function (o) {
        url = o.url;
      });

      service.request({id: 0, url: 'test'});
      expect(url).to.equal('test(0)');
    });

    it('should add $filter if specified', function () {
      var url;
      var service = query(function (o) {
        url = o.url;
      });

      service.request({filter: 'filter', url: ''});
      expect(url).to.equal('?$filter=filter');
    });

    it('should add $orderby if specified', function () {
      var url;
      var service = query(function (o) {
        url = o.url;
      });

      service.request({orderBy: 'orderby', url: ''});
      expect(url).to.equal('?$orderby=orderby');
    });

    it('should add $expand if specified', function () {
      var url;
      var service = query(function (o) {
        url = o.url;
      });

      service.request({expand: 'expand', url: ''});
      expect(url).to.equal('?$expand=expand');
    });
  });
});
