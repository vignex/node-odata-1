var request = require('request');
var auth = require('./auth');
var query = require('./query');

var req = request.defaults({
  headers: {
    'Accept': 'application/json'
  },
  jar: false
});

function odata(endpoints) {
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
    // at this point one could query
    // req({
    //   url: res.value['odata.metadata']
    // });
    // the odata.metadata property
    // and scrape validation information and add
    // validation to put and post requests
    // this only returns xml however and will fail
    // if you pass a application/json accept header
    var i, service;
    for (i = 0; i < res.value.length; i += 1) {
      createGet(service[res.value[i].name], url + res.value[i].url);
      createPost(service[res.value[i].name], url + res.value[i].url);
      createPut(service[res.value[i].name], url + res.value[i].url);
      createDelete(service[res.value[i].name], url + res.value[i].url);
    }
    return service;
  });
}

function createGet(obj, url) {
  obj.get = function (id, cookie, cb) {
    query.request({
      url: url + id,
      id: id,
      cookie: cookie
    }, cb);
  };
}

function createPost(obj, url) {
  obj.post = function (data, cookie, cb) {
    query.request({
      method: 'POST',
      url: url,
      cookie: cookie,
      data: data
    });
  };
}

function createPut(obj, url) {
  obj.put = function (id, data, cookie, cb) {
    query.request({
      method: 'PUT',
      url: url + id,
      cookie: cookie,
      data: data
    });
  }
}

function createDelete(obj, url) {
  obj.delete = function (id, cookie, cb) {
    query.request({
      method: 'DELETE',
      url: url + id,
      cookie: cookie
    })
  }
}


function noop() {}

module.exports = odata;
