node-odata
==========

An odata client module for Node
[![Build Status](https://travis-ci.org/zclark/node-odata.png?branch=master)](https://travis-ci.org/zclark/node-odata)

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
```javascript``
services.someService.someEndpoint
  .delete(1, cookie, function (err, data) {
  
    // check for errors and celebrate success
  });;
```

An oquery is built from an optional id
followed by orderby, filter, expand, skip, top, inlinecount, and select
