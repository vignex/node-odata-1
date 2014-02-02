var util = require('util');


function oquery(url, req) {

  if (!url) {
    throw 'Cannot create a query without a URL';
  }
  this.rootUrl = url;
  this.req = req;
}


oquery.prototype.get = function (id) {

  this.q = { id: id };
  return this;
};


oquery.prototype.expand = function (arr) {

  this.q.expand = arr;
  return this;
};

oquery.prototype.createExpand = function () {

  if (!this.q.expand) {
    return '';
  }

  var e = '$expand=';
  if (!util.isArray(this.q.expand)) {
    return e + this.q.expand;
  }

  for (var i = 0; i < this.q.expand.length; i += 1) {
    e += this.q.expand[i] + ',';
  }
  // remove last comma
  return e.slice(0, e.length - 1);
};


// eq, ne, gt, lt
oquery.prototype.filter = function (exp) {

  this.q.filter = exp;
  return this;
};

oquery.prototype.createFilter = function () {

  if (!this.q.filter) {
    return '';
  }

  var f = '$filter=';
  return f + this.q.filter;
};



oquery.prototype.orderby = function (exp) {

  this.q.orderby = exp;
  return this;
};

oquery.prototype.createOrderby = function () {

  if (!this.q.orderby) {
    return '';
  }

  var o = '$orderby=';
  return o + this.q.orderby;
};



oquery.prototype.skip = function (count) {

  this.q.skip = count;
  return this;
};

oquery.prototype.createSkip = function () {

  if (!this.q.skip) {
    return '';
  }

  var s = '$skip=';
  return s + this.q.skip;
};




oquery.prototype.top = function (count) {

  this.q.top = count;
  return this;
};

oquery.prototype.createTop = function () {

  if (!this.q.top) {
    return '';
  }

  var t = '$top=';
  return t + this.q.top;
};




oquery.prototype.inlinecount = function () {

  this.q.inlinecount = true;
  return this;
};

oquery.prototype.createInlinecount = function () {

  if (!this.q.inlinecount) {
    return '';
  }

  return '$inlinecount=allpages';
};




oquery.prototype.select = function (props) {

  this.q.select = props;
  // from this point the query can expand
  // and filter further, but will be a task for later
  return this;
};

oquery.prototype.createSelect = function () {

  if (!this.q.select) {
    return '';
  }

  return '$select=' + this.q.select;
};




oquery.prototype.toUrl = function () {

  var url = this.rootUrl;
  if (this.q.id) {
    url += '(' + this.q.id + ')';
  }

  url += this.createExpand();
  url += this.createFilter();
  url += this.createOrderby();
  url += this.createSkip();
  url += this.createTop();
  url += this.createInlinecount();
  url += this.createSelect();


  return url;
};


oquery.prototype.fire = function (cb) {

  this.req({
    url: this.toUrl()
  }).then(function (err, res, body) {

    if (err) {
      return cb(e);
    }

    return cb(null, res.data);
  });
};


oquery.prototype.insert = function () {

  this.req({
    url: this.rootUrl,
    method: 'POST'
  }).then(function () {

  });
};


oquery.prototype.update = function (id) {

  this.req({
    url: this.rootUrl + '(' + id + ')',
    method: 'PUT'
  }).then(function () {

  });
};


oquery.prototype.delete = function (id) {

  this.req({
    url: this.rootUrl + (' + id + '),
    method: 'DELETE'
  }).then(function () {

  });
};


module.exports = oquery;
