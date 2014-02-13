var util = require('util');

function oquery(id) {

  this._id = id;
}

// Support needed for complex types
// & deep nested nav props

oquery.prototype._createId = function (arr) {

  if (typeof this._id === 'object') {
    var composite = '';
    for (var id in this._id) {
      /* istanbul ignore else */
      if (this._id.hasOwnProperty(id)) {
        composite += id + '=' + this._id[id] + ',';
      }
    }
    return '(' + composite.substring(0, composite.length - 1) + ')';
  }

  if (this._id === 0 || this._id) {
    return '(' + this._id + ')';
  }
  return '';
};


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

oquery.prototype._createFilter = function (url) {

  if (!this._filter) {
    return '';
  }

  var f = '$filter=';
  return this._appendConnector(url) + f + this._filter;
};



oquery.prototype.orderby = function (exp) {

  this._orderby = exp;
  return this;
};

oquery.prototype._createOrderby = function (url) {

  if (!this._orderby) {
    return '';
  }

  var o = '$orderby=';
  return this._appendConnector(url) + o + this._orderby;
};



oquery.prototype.skip = function (count) {

  this._skip = count;
  return this;
};

oquery.prototype._createSkip = function (url) {

  if (!this._skip) {
    return '';
  }

  var s = '$skip=';
  return this._appendConnector(url) + s + this._skip;
};




oquery.prototype.top = function (count) {

  this._top = count;
  return this;
};

oquery.prototype._createTop = function (url) {

  if (!this._top) {
    return '';
  }

  var t = '$top=';
  return this._appendConnector(url) + t + this._top;
};




oquery.prototype.inlinecount = function () {

  this._inlinecount = true;
  return this;
};

oquery.prototype._createInlinecount = function (url) {

  if (!this._inlinecount) {
    return '';
  }

  return this._appendConnector(url) + '$inlinecount=allpages';
};




oquery.prototype.select = function (props) {

  this._select = props;
  // from this point the query can expand
  // and filter further, but will be a task for later
  return this;
};

oquery.prototype._createSelect = function (url) {

  if (!this._select) {
    return '';
  }

  return this._appendConnector(url) + '$select=' + this._select;
};


oquery.prototype._appendConnector = function (url) {

  return url ? '&' : '';
};


oquery.prototype.toUrl = function () {

  var url = '';

  url += this._createExpand(url);
  url += this._createFilter(url);
  url += this._createOrderby(url);
  url += this._createSkip(url);
  url += this._createTop(url);
  url += this._createInlinecount(url);
  url += this._createSelect(url);

  return this._createId() + (url ? ('?' + url) : url);
};

module.exports = oquery;
