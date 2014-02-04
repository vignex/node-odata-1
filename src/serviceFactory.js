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
        console.log(res.value[i].name);
        service[res.value[i].name] = {
          get: function (query, cb) {

            // fire request
            req({
              method: 'GET',
              url: url + query.toUrl()
            }).then(function (err, res, body) {
              // body...
            });
          },
          insert: function (data, cb) {

            // fire request
            req({
              method: 'POST',
              url: url,
              data: data
            }).then(function (err, res, body) {
              // body...
            });
          },
          update: function (id, data, cb) {

            // fire request
            req({
              method: 'PUT',
              url: url + '(' + id + ')',
              data: data
            }).then(function (err, res, body) {
              // body...
            });
          },
          delete: function (id, cb) {

            // fire request
            req({
              method: 'DELETE',
              url: url + '(' + id + ')',
            }).then(function (err, res, body) {
              // body...
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
