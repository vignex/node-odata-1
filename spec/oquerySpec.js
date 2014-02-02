var chai = require('chai');
var expect = chai.expect;
var oquery = require('../src/oquery');

var fakeUrl = 'fakeUrl';

describe('oquery', function () {

  it('should accept a url', function () {

    var query = new oquery(fakeUrl);
    expect(query.rootUrl).to.equal(fakeUrl);
  });

  it('should throw if no url is provided', function () {

    var errorThrown = false;
    try {
      var query = new oquery();
    } catch (e) {
      errorThrown = true;
      expect(e).to.equal('Cannot create a query without a URL');
    }

    expect(errorThrown).to.equal(true);
  });

  it('should have an expand function that returns this', function () {

    var query = new oquery(fakeUrl);
    var result = query.get().expand();
    expect(query).to.equal(result);
  });

  it('should have a filter function that returns this', function () {

    var query = new oquery(fakeUrl);
    var result = query.get().filter();
    expect(query).to.equal(result);
  });

  it('should have an orderby function that returns this', function () {

    var query = new oquery(fakeUrl);
    var result = query.get().orderby();
    expect(query).to.equal(result);
  });

  it('should have a skip function that returns this', function () {

    var query = new oquery(fakeUrl);
    var result = query.get().skip();
    expect(query).to.equal(result);
  });

  it('should have a top function that returns this', function () {

    var query = new oquery(fakeUrl);
    var result = query.get().top();
    expect(query).to.equal(result);
  });

  it('should have an inlinecount function that returns this', function () {

    var query = new oquery(fakeUrl);
    var result = query.get().inlinecount();
    expect(query).to.equal(result);
  });

  it('should have a select function that returns this', function () {

    var query = new oquery(fakeUrl);
    var result = query.get().select();
    expect(query).to.equal(result);
  });

  it('should default to the url passed in', function () {

    var query = new oquery(fakeUrl);
    expect(query.get().toUrl()).to.equal(fakeUrl);
  });

  it('should add an id to the url if passed in get', function () {

    var query = new oquery(fakeUrl);
    var result = query.get(2);
    expect(result.toUrl()).to.equal(fakeUrl + '(2)');
  });

  it('should add an expand option on expand()', function () {

    var query = new oquery(fakeUrl);
    var result = query.get().expand('navProp');
    expect(result.toUrl()).to.equal(fakeUrl + '$expand=navProp');
  });

  it('should allow an array of expands', function () {

    var query = new oquery(fakeUrl);
    var result = query.get().expand(['prop1', 'prop2']);
    expect(result.toUrl()).to.equal(fakeUrl + '$expand=prop1,prop2');
  });

  it('should add a filter option on filter', function () {

    var query = new oquery(fakeUrl);
    var result = query.get().filter('test eq 2');
    expect(result.toUrl()).to.equal(fakeUrl + '$filter=test eq 2');
  });

  it('should add a orderby option on orderby', function () {

    var query = new oquery(fakeUrl);
    var result = query.get().orderby('something desc');
    expect(result.toUrl()).to.equal(fakeUrl + '$orderby=something desc');
  });

  it('should add a skip option on skip', function () {

    var query = new oquery(fakeUrl);
    var result = query.get().skip(20);
    expect(result.toUrl()).to.equal(fakeUrl + '$skip=20');
  });

  it('should add a top option on top', function () {

    var query = new oquery(fakeUrl);
    var result = query.get().top(10);
    expect(result.toUrl()).to.equal(fakeUrl + '$top=10');
  });

  it('should add an inlinecount allpages on inlinecount', function () {

    var query = new oquery(fakeUrl);
    var result = query.get().inlinecount();
    expect(result.toUrl()).to.equal(fakeUrl + '$inlinecount=allpages');
  });


  it('should add a select query on select', function () {

    var query = new oquery(fakeUrl);
    var result = query.get().select('thing1,thing2');
    expect(result.toUrl()).to.equal(fakeUrl + '$select=thing1,thing2');
  });

  it('should hit the built url on fire()', function () {

    var query = new oquery(fakeUrl);
    query.req = function (args) {

      expect(args.url).to.equal(query.toUrl());
      return { then: function () {} };
    };
    query.get(1).fire();
  });

  it('should return an error of fire error', function () {

    var query = new oquery(fakeUrl);
    query.req = function () {

      return {
        then: function (cb) {

          return cb('FAIL');
        }
      };
    };

    query.get(1).fire(function (error) {

      expect(error).to.equal('FAIL');
    });
  });

  it('should return the data on fire success', function () {

    var query = new oquery(fakeUrl);
    query.req = function () {

      return {
        then: function (cb) {

          return cb(null, { data: 'DATA' });
        }
      };
    };

    query.get(1).fire(function (err, res) {

      expect(res).to.equal('DATA');
    });
  });

  it('should use the rootUrl and POST for insert()', function () {

    var query = new oquery(fakeUrl);
    var usedArgs;
    query.req = function (args) {

      usedArgs = args;
      return {
        then: function (cb) {

          return cb();
        }
      }
    };

    query.insert();
    expect(usedArgs.url).to.equal(query.rootUrl);
    expect(usedArgs.method).to.equal('POST');
  });

  it('should use the rootUrl + id and PUT for update()', function () {

    var query = new oquery(fakeUrl);
    var usedArgs;

    query.req = function (args) {

      usedArgs = args;
      return {
        then: function (cb) {

          return cb();
        }
      };
    };

    query.update(2);
    expect(usedArgs.url).to.equal(query.rootUrl + '(2)');
    expect(usedArgs.method).to.equal('PUT');
  });

  it('should use the rootUrl + id and DELETE for delete()', function () {

    var query = new oquery(fakeUrl);
    var usedArgs;

    query.req = function (args) {

      usedArgs = args;
      return {
        then: function (cb) {

          return cb();
        }
      };
    };

    query.delete(3);
    expect(usedArgs.url).to.equal(query.rootUrl + '(3)');
    expect(usedArgs.method).to.equal('DELETE');
  });

});
