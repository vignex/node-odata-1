module.exports = function (req) {

  var auth = require('./auth');
  var oquery = require('./oquery');

  function createServices(endpoints) {
    var services = {};

    for (var e in endpoints) {
      if (e === 'authUrl') {
        services.login = auth(req, endpoints.authUrl).login;
      } else {
        services[e] = createService(endpoints[e]);
      }
    }

    return services;
  }

  function createService(url) {
    req({
      url: url
    }, function (err, res, body) {
      if (err) {
        console.log(err);
        return;
      }

      var i, service;
      for (i = 0; i < res.value.length; i += 1) {
        service[res.value[i].name] = new Oquery(url + res.value[i].url);
      }
      return service;
    });
  }

  return {
    createServices: createServices
  };

};
