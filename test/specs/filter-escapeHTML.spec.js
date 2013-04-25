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

describe('Dust\'s escapeHtml |h filter', function() {

  it('should return a string', function(){
    var before, after;
    for (var i=0, len=testStrings.length; i<len; i++){
      before = testStrings[i];
      after = dust.filters.h(before);
      expect(typeof after).toEqual('string');
    }
  });

  it('should return a string that is around the same length or greater than the original', function(){
    var before, after;
    for (var i=0, len=testStrings.length; i<len; i++){
      before = testStrings[i];
      after = dust.filters.h(before);
      expect(typeof after).toEqual('string');
      expect(after.length).not.toBeLessThan(before.length);
    }
  });

  it('should not contain < > or double quotes', function(){
    for (var i=0, len=testStrings.length; i<len; i++){
      expect(dust.filters.h(testStrings[i])).not.toMatch('/[<>"]/');
    }
  });

  it('should escape html elements', function(){
    if (typeof document !== 'undefined') {
      var output,
          container = document.getElementById('test');
      for (var i=0, len=testStrings.length; i<len; i++){
        container.innerHTML = dust.filters.h(testStrings[i]);
        expect(container.children.length).toBe(0);
      }
    }
  });

  it('should unescape to the original string', function(){
    for (var i=0, len=testStrings.length; i<len; i++) {
      expect(dust.unescapeHTML(dust.filters.h(testStrings[i]))).toEqual(testStrings[i]);
    }
  });

  it('should remove unrecoverable characters', function(){
    for (var i=0, len=arrayOfUnrecoverableStrings.length; i<len; i++) {
      expect(dust.unescapeHTML(dust.filters.h(arrayOfUnrecoverableStrings[i]))).not.toEqual(arrayOfUnrecoverableStrings[i]);
    }
  });
});