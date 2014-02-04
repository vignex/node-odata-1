var request = require('request');
var req = request.defaults({
  headers: {
    'Accept': 'application/json'
  },
  jar: false
});

var serviceFactory = require('./serviceFactory')(req);
var oquery = require('./oquery');

module.exports = {
  createServices: serviceFactory.createServices,
  Oquery: oquery
};
