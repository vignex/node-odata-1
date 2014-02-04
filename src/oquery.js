var util = require('util');

function oquery() { }


oquery.prototype.expand = function (arr) {

  this._expand = arr;
  return this;
};

oquery.prototype._createExpand = function () {

  if (!this._expand) {
    return '';
  }

  var e = '$expand=';
  if (!util.isArray(this._expand)) {
    return e + this._expand;
  }

  for (var i = 0; i < this._expand.length; i += 1) {
    e += this._expand[i] + ',';
  }
  // remove last comma
  return e.slice(0, e.length - 1);
};


// eq, ne, gt, lt
oquery.prototype.filter = function (exp) {

  this._filter = exp;
  return this;
};

oquery.prototype._createFilter = function () {

  if (!this._filter) {
    return '';
  }

  var f = '$filter=';
  return f + this._filter;
};



oquery.prototype.orderby = function (exp) {

  this._orderby = exp;
  return this;
};

oquery.prototype._createOrderby = function () {

  if (!this._orderby) {
    return '';
  }

  var o = '$orderby=';
  return o + this._orderby;
};



oquery.prototype.skip = function (count) {

  this._skip = count;
  return this;
};

oquery.prototype._createSkip = function () {

  if (!this._skip) {
    return '';
  }

  var s = '$skip=';
  return s + this._skip;
};




oquery.prototype.top = function (count) {

  this._top = count;
  return this;
};

oquery.prototype._createTop = function () {

  if (!this._top) {
    return '';
  }

  var t = '$top=';
  return t + this._top;
};




oquery.prototype.inlinecount = function () {

  this._inlinecount = true;
  return this;
};

oquery.prototype._createInlinecount = function () {

  if (!this._inlinecount) {
    return '';
  }

  return '$inlinecount=allpages';
};




oquery.prototype.select = function (props) {

  this._select = props;
  // from this point the query can expand
  // and filter further, but will be a task for later
  return this;
};

oquery.prototype._createSelect = function () {

  if (!this._select) {
    return '';
  }

  return '$select=' + this._select;
};


oquery.prototype._appendConnector = function (url) {

  if (url) {
    url += '&';
  }
  return url;
};


oquery.prototype.toUrl = function () {

  var url = '';
  url += this._createExpand();
  url += this._createFilter();
  url += this._createOrderby();
  url += this._createSkip();
  url += this._createTop();
  url += this._createInlinecount();
  url += this._createSelect();

  return url;
};

module.exports = oquery;
