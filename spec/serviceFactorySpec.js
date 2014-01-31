var chai = require('chai');
var expect = chai.expect;
var serviceFactory = require('../src/serviceFactory');

describe('serviceFactory', function () {

  it('should expose a createServices function', function () {
    var factory = serviceFactory({});
    expect(typeof factory.createServices).to.equal('function');
  });

  describe('createServices', function () {

    it('should add a login service if authUrl endpoint passed', function (done) {
      var factory = serviceFactory({});

      var promise = factory.createServices({authUrl: 'someUrl'});
      promise.then(function (results) {
        try {
          results.forEach(function (result) {
            expect(result.value.login).to.exist;
          });
        } catch (err) {
          done(err);
          return;
        }
        done();
      });
    });

    it('should query the urls of each endpoint passed', function () {
      var urls = [];
      var factory = serviceFactory(function (args) {
        urls.push(args.url);
      });

      var res = factory.createServices({one: 'one', two: 'three'});
      expect(urls[0]).to.equal('one');
      expect(urls[1]).to.equal('three');
    });

    it('should result an error if a url causes an error', function (done) {
      var factory = serviceFactory(function (args, cb) {
        cb('error', {name: 'e1', url: 'end1'});
      });

      var promise = factory.createServices({test: 'test/'});
      promise.then(function (results) {
        try {
          results.forEach(function (result) {
            expect(result.reason).to.equal('error');
          });
        } catch (err) {
          done(err);
          return;
        }
        done();
      });
    });

    it('should add an endpoint for each url result', function (done) {
      var factory = serviceFactory(function (args, cb) {
        cb(null, {
          value: [
            {name: 'e1', url: 'end1'},
            {name: 'e2', url: 'end2'}
          ]
        }, '');
      });

      var promise = factory.createServices({test: 'test/'});
      promise.then(function (results) {
        try {
          var e1created = false;
          var e2created = false;
          results.forEach(function (result) {
            expect(result.value.test).to.exist;
            expect(result.value.test.e1.rootUrl).to.equal('test/end1');
            expect(result.value.test.e2.rootUrl).to.equal('test/end2');
          });
        } catch (err) {
          done(err);
          return;
        }
        done();
      });
    });

  });

});
