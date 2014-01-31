var request = require('request');
var req = request.defaults({
  headers: {
    'Accept': 'application/json'
  },
  jar: false
});

var serviceFactory = require('./serviceFactory')(req);

module.exports = serviceFactory.createServices;
