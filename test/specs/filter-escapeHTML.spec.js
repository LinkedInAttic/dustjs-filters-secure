/*
 * @venus-library jasmine
 * @venus-include ../util/object.js
 * @venus-include ../../node_modules/dustjs-linkedin/dist/dust-full-1.1.1.js
 * @venus-include ../setup/old-filters.js
 * @venus-include ../../lib/dust-filters-secure.js
 * @venus-include ../setup/simple-strings.js
 * @venus-include ../setup/bad-strings.js
 * @venus-include ../setup/unrecoverable-strings.js
 * @venus-include ../setup/simple-html.js
 * @venus-include ../setup/bad-html.js
 * @venus-fixture xss.fixture.html
 */

  var arrayOfSimpleStrings,
      arrayOfBadStrings,
      arrayOfSimpleHTMLStrings,
      arrayOfBadHTMLStrings,
      arrayOfUnrecoverableStrings,
      testStrings;

if (typeof module !== 'undefined' && module.exports) {
  arrayOfSimpleStrings = require('../setup/simple-strings');
  arrayOfBadStrings = require('../setup/bad-strings');
  arrayOfSimpleHTMLStrings = require('../setup/simple-html');
  arrayOfBadHTMLStrings = require('../setup/bad-html');
  arrayOfUnrecoverableStrings = require('../setup/unrecoverable-strings');
}

  testStrings = arrayOfSimpleStrings
                   .concat(arrayOfBadStrings)
                   .concat(arrayOfSimpleHTMLStrings)
                   .concat(arrayOfBadHTMLStrings);

if (typeof module == 'undefined'){
  dustFilters = dust.filters;
}

describe('Dust\'s escapeHtml |h filter', function() {

  it('should return a string', function(){
    var before, after;
    for (var i=0, len=testStrings.length; i<len; i++){
      before = testStrings[i];
      after = dustFilters.h(before);
      expect(typeof after).toEqual('string');
    }
  });

  it('should return a null when has null input', function(){
      expect(dustFilters.h(null)).toEqual(null);
  });

  it('should return a string when input is number of boolean', function(){
    expect(typeof dustFilters.h(5)).toEqual('string');
    expect(typeof dustFilters.h(true)).toEqual('string');
  });

  it('should return a string that is around the same length or greater than the original', function(){
    var before, after;
    for (var i=0, len=testStrings.length; i<len; i++){
      before = testStrings[i];
      after = dustFilters.h(before);
      expect(typeof after).toEqual('string');
      expect(after.length).not.toBeLessThan(before.length);
    }
  });

  it('should not contain < > or double quotes', function(){
    for (var i=0, len=testStrings.length; i<len; i++){
      expect(dustFilters.h(testStrings[i])).not.toMatch('/[<>"]/');
    }
  });

  it('should escape html elements', function(){
    if (typeof document !== 'undefined') {
      var output,
          container = document.getElementById('test');
      for (var i=0, len=testStrings.length; i<len; i++){
        container.innerHTML = dustFilters.h(testStrings[i]);
        expect(container.children.length).toBe(0);
      }
    }
  });

  it('should unescape to the original string', function(){
    for (var i=0, len=testStrings.length; i<len; i++) {
      expect(dust.unescapeHTML(dustFilters.h(testStrings[i]))).toEqual(testStrings[i]);
    }
  });

  it('should remove unrecoverable characters', function(){
    for (var i=0, len=arrayOfUnrecoverableStrings.length; i<len; i++) {
      expect(dust.unescapeHTML(dustFilters.h(arrayOfUnrecoverableStrings[i]))).not.toEqual(arrayOfUnrecoverableStrings[i]);
    }
  });

  it('unescape should return null when undefinded input', function(){
    var string;
    expect(dust.unescapeHTML(string)).toEqual(null);

    string= null;
    expect(dust.unescapeHTML(string)).toEqual(null);
  });

  it('unescape should return string when number of boolean input', function(){
    expect(typeof dust.unescapeHTML(5)).toEqual("string");
    expect(typeof dust.unescapeHTML(true)).toEqual("string");
  });

});
