var chai = require('chai');
var expect = chai.expect;
var serviceFactory = require('../src/serviceFactory');
var oquery = require('../src/oquery');

describe('serviceFactory', function () {

  it('should expose a createServices function', function () {

    var factory = serviceFactory({});
    expect(typeof factory.createServices).to.equal('function');
  });


  describe('createServices', function () {

    it('should add a login service if authUrl endpoint passed', function (done) {

      var factory = serviceFactory({});

      var promise = factory.createServices({authUrl: 'someUrl'});
      promise.then(function (services) {

        expect(services.login).to.exist;
        done();
      });
    });


    it('should reject if passed preAuth without authUrl', function (done) {

      var factory = serviceFactory({});

      var promise = factory.createServices({preAuth: {}});
      promise.then(null, function () {

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


    it('should fire auth before endpoints if preAuth specified', function () {

      var url;
      var urls = [];
      var firstPass = true;
      var factory = serviceFactory(function req(args, cb) {

        if (firstPass) {
          firstPass = false;
          url = args.url;
          return cb(null, {
            headers: {'set-cookie': ['cookie']}
          }, {value: []});
        }

        return cb({}, {}, {value: []});
      });

      var promise = factory.createServices({
        preAuth: {},
        authUrl: 'auth'
      });

      expect(url).to.equal('auth');
    });


    it('should result ignore service if a url causes an error', function (done) {

      var factory = serviceFactory(function (args, cb) {

        cb('error', {name: 'e1', url: 'end1'});
      });

      var promise = factory.createServices({test: 'test/'});
      promise.then(function (services) {

        expect(services.test).to.not.exist;
        done();
      });
    });


    it('should add an endpoint for each url result', function (done) {

      var factory = serviceFactory(function (args, cb) {

        cb(null, null, {
          value: [
            {name: 'e1', url: 'end1'},
            {name: 'e2', url: 'end2'}
          ]
        }, '');
      });

      var promise = factory.createServices({test: 'test/'});
      promise.then(function (services) {

        expect(services.test).to.exist;
        expect(typeof services.test.e1.get).to.equal('function');
        expect(typeof services.test.e2.get).to.equal('function');
        done();
      });
    });

    describe('endpoint operations', function () {

      var factory, error, oerror, method, calledUrl;

      beforeEach(function () {

        error = false;
        oerror = false;
        var secondQuery = false;
        factory = serviceFactory(function (args, cb) {

          if (secondQuery) {
            calledUrl = args.url;
            method = args.method;
            return cb(
              error ? 'error' : null,
              null,
              oerror ? {'odata.error': 'odataerror'} : 'data');
          }
          secondQuery = true;

          return cb(null, null, {
            value: [
              {name: 'e', url: 'e'}
            ]
          }, '');
        });
      });

      it('should fire a request to the url on get', function (done) {

        factory.createServices({test: 'test'})
          .then(function (services) {

            services.test.e.get(new oquery(1), null, function (err, data) {

              expect(method).to.equal('GET');
              expect(data).to.equal('data');
              expect(calledUrl).to.equal('test/e(1)');
              done();
            });
          });
      });

      it('should fire a GET request on get', function (done) {

        factory.createServices({test: 'test'})
          .then(function (services) {

            services.test.e.get(null, null, function (err, data) {

              expect(method).to.equal('GET');
              expect(data).to.equal('data');
              done();
            });
          });
      });

      it('should return an error on get error', function (done) {

        factory.createServices({test: 'test'})
          .then(function (services) {

            error = true;
            services.test.e.get(null, null, function (err) {

              expect(err).to.equal('error');
              done();
            });
          });
      });

      it('should return an error on get odata.error', function (done) {

        factory.createServices({test: 'test'})
          .then(function (services) {

            oerror = true;
            services.test.e.get(null, null, function (err) {

              expect(err).to.equal('odataerror');
              done();
            });
          });
      });

      it('should fire a POST request on insert', function (done) {

        factory.createServices({test: 'test'})
          .then(function (services) {

            services.test.e.insert(null, null, function (err, data) {

              expect(method).to.equal('POST');
              expect(data).to.equal('data');
              done();
            });
          });
      });

      it('should return an error on insert error', function (done) {

        factory.createServices({test: 'test'})
          .then(function (services) {

            error = true;
            services.test.e.insert(null, null, function (err) {

              expect(err).to.equal('error');
              done();
            });
          });
      });

      it('should return an error on insert odata.error', function (done) {

        factory.createServices({test: 'test'})
          .then(function (services) {

            oerror = true;
            services.test.e.insert(null, null, function (err) {

              expect(err).to.equal('odataerror');
              done();
            });
          });
      });

      it('should fire a PATCH request on update', function (done) {
        factory.createServices({test: 'test'})
          .then(function (services) {

            services.test.e.update(1, null, null, function (err, data) {

              expect(method).to.equal('PATCH');
              expect(data).to.equal('data');
              done();
            });
          });
      });

      it('should return an error on update error', function (done) {

        factory.createServices({test: 'test'})
          .then(function (services) {

            error = true;
            services.test.e.update(1, null, null, function (err) {

              expect(err).to.equal('error');
              done();
            });
          });
      });

      it('should return an error on update odata.error', function (done) {

        factory.createServices({test: 'test'})
          .then(function (services) {

            oerror = true;
            services.test.e.update(1, null, null, function (err) {

              expect(err).to.equal('odataerror');
              done();
            });
          });
      });

      it('should fire a DELETE request on delete', function (done) {

        factory.createServices({test: 'test'})
          .then(function (services) {

            services.test.e.delete(1, null, function (err, data) {

              expect(method).to.equal('DELETE');
              expect(data).to.equal('data');
              done();
            });
          });
      });

      it('should return an error on delete error', function (done) {

        factory.createServices({test: 'test'})
          .then(function (services) {

            error = true;
            services.test.e.delete(null, null, function (err) {

              expect(err).to.equal('error');
              done();
            });
          });
      });

      it('should return an error on get odata.error', function (done) {

        factory.createServices({test: 'test'})
          .then(function (services) {

            oerror = true;
            services.test.e.delete(null, null, function (err) {

              expect(err).to.equal('odataerror');
              done();
            });
          });
      });
    });
  });
});
