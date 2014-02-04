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
```

Each endpoint has a get function
```javascript
var query = new oquery(1).filter().top(10);
var result = endpoint.get(query);
```

An insert function
```javascript
endpoint.insert(data);
```

An update function
```javascript
endpoint.update(1, data);
```

And a delete function
```javascript``
endpoint.delete(1);
```

An oquery is built from an optional id
followed by orderby, filter, expand, skip, top, inlinecount, and select