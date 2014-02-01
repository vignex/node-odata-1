node-odata
==========

An odata client module for Node
[![Build Status](https://travis-ci.org/zclark/node-odata.png?branch=master)](https://travis-ci.org/zclark/node-odata)

## Usage

This module generates endpoints based from odata service urls

```javascript
var client = new OData([url1, url2, url3]);
```

This will return a promise containing the potential generated endpoints for each service queried

```javascript
var client = new OData([{name: 'serviceOne', url: 'url1'}]).then(function (results) {
  results.forEach(function (result) {
    // endpoints of the form - result.value = { serviceOne: { generatedEndpoints... }}
  });
});

var result = endpoint.get(1).orderby('someKey');
```

Endpoints should be chainable, and support either get, put, post, delete
followed by where, orderby, filter, expand, skip, top, inlinecount, and select