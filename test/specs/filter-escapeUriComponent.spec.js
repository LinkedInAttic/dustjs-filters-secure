/*
 * @venus-library jasmine
 * @venus-include ../util/object.js
 * @venus-include ../../node_modules/dustjs-linkedin/dist/dust-full-1.1.1.js
 * @venus-include ../setup/old-filters.js
 * @venus-include ../../lib/dust-filters-secure.js
 * @venus-include ../setup/simple-strings.js
 * @venus-include ../setup/bad-strings.js
 * @venus-fixture xss.fixture.html
 */

var arrayOfSimpleStrings,
    arrayOfBadStrings,
    customEscapeUri,
    testStrings;

if (typeof module !== 'undefined' && module.exports) {
  arrayOfSimpleStrings = require('../setup/simple-strings');
  arrayOfBadStrings = require('../setup/bad-strings');
}

customEscapeUri = dust.filters.uc;
testStrings = arrayOfSimpleStrings.concat(arrayOfBadStrings);

describe("dust escapeURIComponent |uc filters works", function() {
  it("should not contain unescaped !, space, star or parens", function(){
    for (var i=0, len=testStrings.length; i<len; i++){
      expect(customEscapeUri(testStrings[i])).not.toMatch('/[! ()*]/');
    }
  });
  it('escape should return null when undefinded input', function(){
      var string;
      expect(dust.filters.uc(string)).toEqual(null);
      string= null;
      expect(dust.filters.uc(string)).toEqual(null);
  });

  it('escape should return string when number of boolean input', function(){
      expect(typeof dust.filters.uc(5)).toEqual("string");
      expect(typeof dust.filters.uc(true)).toEqual("string");
  });
  it('should unescape to the original string', function(){
      for (var i=0, len=testStrings.length; i<len; i++) {
          expect(dust.unescapeURIComponent(dust.filters.uc(testStrings[i]))).toEqual(testStrings[i]);
      }
  });

  it('unescape should return null when undefinded input', function(){
      var string;
      expect(dust.unescapeURIComponent(string)).toEqual(null);
      string= null;
      expect(dust.unescapeURIComponent(string)).toEqual(null);
  });

  it('unescape should return string when number of boolean input', function(){
      expect(typeof dust.unescapeURIComponent(5)).toEqual("string");
      expect(typeof dust.unescapeURIComponent(true)).toEqual("string");
  });
});
