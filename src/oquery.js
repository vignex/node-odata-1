function oquery(url, opts) {
  this.rootUrl = url;
  this.opts = opts;
}

oquery.prototype.where = function () {
  return this;
};

oquery.prototype.expand = function () {
  return this;
};

oquery.prototype.filter = function () {
  return this;
};

oquery.prototype.orderby = function () {
  return this;
};

oquery.prototype.toUrl = function () {
  var url = this.rootUrl;
  // add id from opts
  // add where clause
  // add expand
  // add filter
  return url;
};

module.exports = oquery;
