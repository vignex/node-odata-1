var chai = require('chai');
var expect = chai.expect;
var oquery = require('../src/oquery');

describe('oquery', function () {

  it('should accept a url and options', function () {
    var args = {t: 2};
    var query = new oquery('fakeUrl', args);
    expect(query.rootUrl).to.equal('fakeUrl');
    expect(query.opts).to.equal(args);
  });

  it('should have a where function that returns this', function () {
    var query = new oquery();
    var result = query.where();
    expect(query).to.equal(result);
  });

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

  it('should default to the url passed in', function () {
    var query = new oquery('fake');
    expect(query.toUrl()).to.equal('fake');
  });

});
