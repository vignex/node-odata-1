module.exports = function (req) {

  var auth = require('./auth');
  var Q = require('q');

  function createServices(endpoints) {

    var services = {};

    var names = [];
    var calls = [];

    for (var e in endpoints) {
      if (e === 'authUrl') {
        var d = Q.defer();
        calls.push(d.promise);
        d.resolve({login: auth(req, endpoints.authUrl).login});
      } else {
        calls.push(createService(e, endpoints[e]));
      }
    }

    return Q.allSettled(calls);
  }


  function createService(name, url) {

    var deferred = Q.defer();

    req({
      url: url
    }, function serviceRequest(err, res, body) {

      if (err) {
        deferred.reject(err);
        return;
      }

      var service = {};
      for (var i = 0; i < res.value.length; i += 1) {
        service[res.value[i].name] = {
          get: function (query, cb) {

            var q = query ? query.toUrl() : '';
            req({
              method: 'GET',
              url: url + q
            }, function (err, res, body) {

              if (err) {
                return cb(err);
              }

              return cb(null, res.data);
            });
          },

          insert: function (data, cb) {

            req({
              method: 'POST',
              url: url,
              data: data
            }, function (err, res, body) {

              if (err) {
                return cb(err);
              }

              return cb(null, res.data);
            });
          },

          update: function (id, data, cb) {

            req({
              method: 'PUT',
              url: url + '(' + id + ')',
              data: data
            }, function (err, res, body) {

              if (err) {
                return cb(err);
              }

              return cb(null, res.data);
            });
          },

          delete: function (id, cb) {

            req({
              method: 'DELETE',
              url: url + '(' + id + ')',
            }, function (err, res, body) {

              if (err) {
                return cb(err);
              }

              return cb(null, res.data);
            });
          }
        };
      }

      var s = {};
      s[name] = service;
      deferred.resolve(s);
    });

    return deferred.promise;
  }

  return {
    createServices: createServices
  };
};
