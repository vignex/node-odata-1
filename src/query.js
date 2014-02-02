module.exports = function query(req) {

  function tweakOptions(options) {

    options.method = 'GET';
    if (options.cookie) {
      options.headers = {
        'Accept': 'application/json',
        'Cookie': options.cookie
      };
    }

    if (options.id || options.id === 0) {
      options.url += '(' + options.id + ')';
    }

    var firstAdded = false;
    if (options.filter) {
      options.url += createAppend(
        '$filter=' + encodeURIComponent(options.filter), firstAdded);
      firstAdded = true;
    }
    if (options.orderBy) {
      options.url += createAppend(
        '$orderby=' + options.orderBy, firstAdded);
      firstAdded = true;
    }
    if (options.expand) {
      options.url += createAppend(
        '$expand=' + options.expand, firstAdded);
      firstAdded = true;
    }
    return options;
  }

  function createAppend(option, extra) {

    return (extra ? '&' : '?') + option;
  }

  function request(options, callback) {

    req(tweakOptions(options), function odataCallback(err, res, body) {

      if (err) {
        callback(err);
      } else if (res.statusCode !== 200) {
        callback('odata request failed');
      } else {
        callback(null, body);
      }
    });
  }

  return {
    request: request
  };

};
