module.exports = function auth(req, url) {

  function login(username, password, callback) {
    req({
      url: url,
      method: 'POST',
      json: {
        userName: username,
        password: password,
        createPersistentCookie: true
      }
    }, function (err, res, body) {
      if (err) {
        callback(err);
      } else if (res.statusCode !== 200) {
        callback('Authentication service call failed');
      } else {
        if (!body.d) {
          return callback('Username or password is incorrect');
        }

        var odataCookie = res.headers['set-cookie'][0];
        return callback(null, odataCookie);
      }
    });
  }

  return {
    login: login
  };

};
