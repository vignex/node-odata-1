node-odata
==========

An odata client module for Node

## Initial Idea

User should be able to set up multitude of odata service endpoints

```javascript
var client = new OData([url1, url2, url3]);
```

And it should return an object with all the services requested
with endpoints for each type it finds on the service


```javascript
var client = new OData([{name: 'serviceOne', url: 'url1'}]);

var endpoint = client.serviceOne.someEndpoint;

var result = endpoint.get(1).orderby('someKey');
```

Endpoints should be chainable, and support either get, put, post, delete
followed by where, orderby, filter, or expand (and all the other odata options
as we go along)