module.exports = function (req, auth) {

  var Q = require('q');

  function createServices(endpoints) {

    var allFinished = Q.defer();

    if ('preAuth' in endpoints) {
      if (!('authUrl' in endpoints)) {
        allFinished.reject('authUrl required for preAuth')
      }
      else {
        auth(req, endpoints.authUrl).login(
          endpoints.preAuth.username,
          endpoints.preAuth.password,
          function (err, cookie) {

            if (err) {
              allFinished.reject(err);
            }

            delete endpoints.preAuth;
            queueServiceCreation(endpoints, cookie).then(function (results) {

              allFinished.resolve(constructServiceObject(results));
            }, function (error) {

              allFinished.reject(error);
            });
          });
      }
    } else {
      queueServiceCreation(endpoints).then(function (results) {

        allFinished.resolve(constructServiceObject(results));
      }, function (error) {

        allFinished.reject(error);
      });
    }

    return allFinished.promise;
  }


  function constructServiceObject(results) {

    var services = {};

    results.forEach(function (service) {

      for (var i in service) {
        /* istanbul ignore else */
        if (service.hasOwnProperty(i)) {
          services[i] = service[i];
        }
      }
    });

    return services;
  }


  function queueServiceCreation(endpoints, cookie) {

    var calls = [];

    for (var e in endpoints) {

      if (e === 'authUrl') {
        var d = Q.defer();
        calls.push(d.promise);
        d.resolve({login: auth(req, endpoints.authUrl).login});
      } else {
        calls.push(createService(e, cookie, endpoints[e]));
      }
    }

    return Q.all(calls);
  }


  function createService(name, cookie, url) {

    var deferred = Q.defer();

    req({
      url: url,
      headers: {
        'Accept': 'application/json',
        'Cookie': cookie
      }
    }, function serviceRequest(err, res, body) {

      if (err) {
        deferred.reject(err);
      } else {
        var service = {};
        for (var i = 0; i < body.value.length; i += 1) {
          service[body.value[i].name] = createMethods(url, body.value[i].url);
        }

        var s = {};
        s[name] = service;
        deferred.resolve(s);
      }
    });

    return deferred.promise;
  }


  function createMethods(baseUrl, endpointUrl) {

    return {
      get: function (query, cookie, cb) {

        var q = query ? query.toUrl() : '';
        req({
          method: 'GET',
          url:  baseUrl + '/' + endpointUrl + q,
          headers: {
            'Accept': 'application/json',
            'Cookie': cookie
          }
        }, function (err, res, body) {

          if (err) {
            return cb(err);
          }

          if (body['odata.error']) {
            return cb(body['odata.error']);
          }

          return cb(null, body);
        });
      },

      insert: function (data, cookie, cb) {

        req({
          method: 'POST',
          url: baseUrl + '/' + endpointUrl,
          body: JSON.stringify(data),
          headers: {
            'Accept': 'application/json',
            'Cookie': cookie,
            'Content-Type': 'application/json',
            'Prefer': 'return-content'
          }
        }, function (err, res, body) {

          if (err) {
            return cb(err);
          }

          if (body['odata.error']) {
            return cb(body['odata.error']);
          }

          return cb(null, body);
        });
      },

      update: function (id, data, cookie, cb) {

        req({
          method: 'PATCH',
          url: baseUrl + '/' + endpointUrl + '(' + id + ')',
          body: JSON.stringify(data),
          headers: {
            'Accept': 'application/json',
            'Cookie': cookie,
            'Content-Type': 'application/json',
            'Prefer': 'return-content'
          }
        }, function (err, res, body) {

          if (err) {
            return cb(err);
          }

          if (body['odata.error']) {
            return cb(body['odata.error']);
          }

          return cb(null, body);
        });
      },

      delete: function (id, cookie, cb) {

        req({
          method: 'DELETE',
          url: baseUrl + '/'  + endpointUrl + '(' + id + ')',
          headers: {
            'Accept': 'application/json',
            'Cookie': cookie
          }
        }, function (err, res, body) {

          if (err) {
            return cb(err);
          }

          if (body['odata.error']) {
            return cb(body['odata.error']);
          }

          return cb(null, body);
        });
      }
    };
  }

  return {
    createServices: createServices
  };
};
