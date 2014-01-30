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


// {
// odata.metadata: "http://202.141.210.78/MTData.Transport.DataService/VehicleService.svc/$metadata"
// value: [20]
// 0:  {
// name: "MassDeclarations"
// url: "MassDeclarations"
// }-
// 1:  {
// name: "Events"
// url: "Events"
// }-
// 2:  {
// name: "EventTypes"
// url: "EventTypes"
// }-
// 3:  {
// name: "Vehicles"
// url: "Vehicles"
// }-
// 4:  {
// name: "VehicleClasses"
// url: "VehicleClasses"
// }-
// 5:  {
// name: "VehicleGpsConfigChecks"
// url: "VehicleGpsConfigChecks"
// }-
// 6:  {
// name: "VehicleGroups"
// url: "VehicleGroups"
// }-
// 7:  {
// name: "VehicleHistory"
// url: "VehicleHistory"
// }-
// 8:  {
// name: "VehicleIgnitions"
// url: "VehicleIgnitions"
// }-
// 9:  {
// name: "VehicleLogs"
// url: "VehicleLogs"
// }-
// 10:  {
// name: "VehicleLogCategories"
// url: "VehicleLogCategories"
// }-
// 11:  {
// name: "VehicleNotifications"
// url: "VehicleNotifications"
// }-
// 12:  {
// name: "VehicleNotificationsGrouped"
// url: "VehicleNotificationsGrouped"
// }-
// 13:  {
// name: "VehicleNotificationReasons"
// url: "VehicleNotificationReasons"
// }-
// 14:  {
// name: "VehicleOwners"
// url: "VehicleOwners"
// }-
// 15:  {
// name: "VehicleRoles"
// url: "VehicleRoles"
// }-
// 16:  {
// name: "VehicleSchedules"
// url: "VehicleSchedules"
// }-
// 17:  {
// name: "VehicleStartups"
// url: "VehicleStartups"
// }-
// 18:  {
// name: "VehicleTypes"
// url: "VehicleTypes"
// }-
// 19:  {
// name: "VehicleWatchLists"
// url: "VehicleWatchLists"
// }-
// -
// }