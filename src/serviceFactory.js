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
      for (var i = 0; i < body.value.length; i += 1) {
        service[body.value[i].name] = (function (endpointUrl) {
          return {
            get: function (query, cookie, cb) {

              var q = query ? query.toUrl() : '';
              req({
                method: 'GET',
                url:  url + '/' + endpointUrl + q,
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
                url: url + '/' + endpointUrl,
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
                url: url + '/' + endpointUrl + '(' + id + ')',
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
                url: url + '/'  + endpointUrl + '(' + id + ')',
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
        }(body.value[i].url));
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
