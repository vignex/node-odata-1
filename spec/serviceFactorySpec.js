var chai = require('chai');
var expect = chai.expect;
var serviceFactory = require('../src/serviceFactory');

describe('serviceFactory', function () {

  it('should expose a createServices function', function () {
    var factory = serviceFactory({});
    expect(typeof factory.createServices).to.equal('function');
  });

  describe('createServices', function () {

    it('should add a login service if authUrl endpoint passed', function () {
      var factory = serviceFactory({});

      var res = factory.createServices({authUrl: 'someUrl'});
      expect(res.login).to.exist;
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

  });

});
