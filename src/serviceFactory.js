module.exports = function (req) {

  var auth = require('./auth');
  var Oquery = require('./oquery');
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
        service[res.value[i].name] = new Oquery(url + res.value[i].url);
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
