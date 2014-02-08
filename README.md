node-odata
==========

An odata client module for Node
[![Build Status](https://travis-ci.org/zclark/node-odata.png?branch=master)](https://travis-ci.org/zclark/node-odata)

## Installation

```bash
npm install nodata
```


## Usage

This module generates endpoints based from odata service urls

```javascript
var odata = require('odata');

odata.createServices([{name: 'name', url: 'url1', {name: 'name2', url: 'url2']);
```

This will return a promise containing the potential generated endpoints for each service queried

```javascript
odata([{name: 'serviceOne', url: 'url1'}])
  .then(function (results) {
  
    var services = {};
    results.forEach(function (result) {
    
      var service = result.value;
      for (var i in service) {
        if (service.hasOwnProperty(i)) {
          services[i] = service[i];
        }
      }
    });
});
```

If passed a 'authUrl', it will generate a login endpoint which can be used
to obtain a cookie for subsequent requests.
```javascript
services.login('username', 'password', function (error, cookie) {

  // I Have a cookie now
});
```


Each endpoint has a get function
```javascript
var Oquery = require('odata').Oquery;

services.someService.someEndpoint
  .get(new Oquery(1).expand('someNavProp'), cookie, function (error, data) {

    // check for errors and do something with data
  });
```

An insert function
```javascript
services.someService.someEndpoint
  .insert(someJsonItem, cookie, function (err, data) {
  
    // check for errors and celebrate success
  });
```

An update function
```javascript
services.someService.someEndpoint
  .update(1, someJsonItem, cookie, function (err, data) {

    // check for errors and celebrate success
  });
```

And a delete function
```javascript
services.someService.someEndpoint
  .delete(1, cookie, function (err, data) {
  
    // check for errors and celebrate success
  });;
```

### Query Syntax
An Oquery is built from an optional id
followed by orderby, filter, expand, skip, top, inlinecount, and select
```javascript
var Oqeury = require('odata').Oquery;

var query = new Oquery(1).orderby('id')
  .filter('state eq 2').expand('someNavProp')
  .skip(5).top(10).select('someNavProp').inlinecount();
  
endpoint.get(query, cookie, function () {});
```
