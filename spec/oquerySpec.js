var chai = require('chai');
var expect = chai.expect;
var oquery = require('../src/oquery');

describe('oquery', function () {

  it('should have an expand function that returns this', function () {

    var query = new oquery();
    var result = query.expand();
    expect(query).to.equal(result);
  });


  it('should have a filter function that returns this', function () {

    var query = new oquery();
    var result = query.filter();
    expect(query).to.equal(result);
  });


  it('should have an orderby function that returns this', function () {

    var query = new oquery();
    var result = query.orderby();
    expect(query).to.equal(result);
  });


  it('should have a skip function that returns this', function () {

    var query = new oquery();
    var result = query.skip();
    expect(query).to.equal(result);
  });


  it('should have a top function that returns this', function () {

    var query = new oquery();
    var result = query.top();
    expect(query).to.equal(result);
  });


  it('should have an inlinecount function that returns this', function () {

    var query = new oquery();
    var result = query.inlinecount();
    expect(query).to.equal(result);
  });


  it('should have a select function that returns this', function () {

    var query = new oquery();
    var result = query.select();
    expect(query).to.equal(result);
  });


  it('should default to nothing', function () {

    var query = new oquery();
    expect(query.toUrl()).to.equal('');
  });


  it('should add an expand option on expand()', function () {

    var query = new oquery();
    var result = query.expand('navProp');
    expect(result.toUrl()).to.equal('$expand=navProp');
  });


  it('should allow an array of expands', function () {

    var query = new oquery();
    var result = query.expand(['prop1', 'prop2']);
    expect(result.toUrl()).to.equal('$expand=prop1,prop2');
  });


  it('should add a filter option on filter', function () {

    var query = new oquery();
    var result = query.filter('test eq 2');
    expect(result.toUrl()).to.equal('$filter=test eq 2');
  });


  it('should add a orderby option on orderby', function () {

    var query = new oquery();
    var result = query.orderby('something desc');
    expect(result.toUrl()).to.equal('$orderby=something desc');
  });


  it('should add a skip option on skip', function () {

    var query = new oquery();
    var result = query.skip(20);
    expect(result.toUrl()).to.equal('$skip=20');
  });


  it('should add a top option on top', function () {

    var query = new oquery();
    var result = query.top(10);
    expect(result.toUrl()).to.equal('$top=10');
  });


  it('should add an inlinecount allpages on inlinecount', function () {

    var query = new oquery();
    var result = query.inlinecount();
    expect(result.toUrl()).to.equal('$inlinecount=allpages');
  });


  it('should add a select query on select', function () {

    var query = new oquery();
    var result = query.select('thing1,thing2');
    expect(result.toUrl()).to.equal('$select=thing1,thing2');
  });
});
