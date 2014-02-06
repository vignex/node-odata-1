var request = require('request');
var req = request.defaults({
  headers: {
    'Accept': 'application/json'
  },
  jar: false,
  json: true
});

var serviceFactory = require('./serviceFactory')(req);
var oquery = require('./oquery');

module.exports = {
  createServices: serviceFactory.createServices,
  Oquery: oquery
};
