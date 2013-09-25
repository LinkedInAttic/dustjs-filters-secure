/*
 * @venus-library jasmine
 * @venus-include ../util/object.js
 * @venus-include ../../node_modules/dustjs-linkedin/dist/dust-full-1.1.1.js
 * @venus-include ../setup/old-filters.js
 * @venus-include ../../lib/dust-filters-secure.js
 * @venus-include ../setup/simple-strings.js
 * @venus-include ../setup/bad-strings.js
 * @venus-include ../setup/simple-js.js
 * @venus-include ../setup/bad-js.js
 * @venus-fixture xss.fixture.html
 */

var arrayOfSimpleStrings,
    arrayOfBadStrings,
    arrayOfCSSStrings,
    arrayOfBadCSSStrings,
    testStrings;

if (typeof module !== 'undefined' && module.exports) {
  arrayOfSimpleStrings = require('../setup/simple-strings'),
  arrayOfBadStrings = require('../setup/bad-strings'),
  arrayOfCSSStrings = require('../setup/simple-css');
}

testStrings = arrayOfSimpleStrings
              .concat(arrayOfBadStrings)
              .concat(arrayOfCSSStrings);

describe("dust escapeCSS |x filter works", function() {
  it('should return a string', function(){
    for (var i=0, len=testStrings.length; i<len; i++){
      expect(typeof dust.filters.x(testStrings[i])).toEqual('string');
    }
  });

  it('should return a null when has null input', function(){
      expect(dust.filters.x(null)).toEqual(null);
  });

  it('should return a string when input is number of boolean', function(){
    expect(typeof dust.filters.x(5)).toEqual('string');
    expect(typeof dust.filters.x(true)).toEqual('string');
  });

  it('should escape all the non alphanumeric characters', function() {
    expect(dust.filters.x('qwerty~!@#$%^&*()_+`-={}|[]\\:";\'<>?,./')).toEqual('qwerty\\7E \\21 \\40 \\23 \\24 \\25 \\5E \\26 \\2A \\28 \\29 _\\2B \\60 \\2D \\3D \\7B \\7D \\7C \\5B \\5D \\5C \\3A \\22 \\3B \\27 \\3C \\3E \\3F \\2C \\2E \\2F ');
    expect(dust.filters.x('<script>alert (0); </script>')).toEqual('\\3C script\\3E alert\\20 \\28 0\\29 \\3B \\20 \\3C \\2F script\\3E ');
  });

    it('should unescape to the original string', function(){
        for (var i=0, len=testStrings.length; i<len; i++) {
            expect(dust.unescapeCSS(dust.filters.x(testStrings[i]))).toEqual(testStrings[i]);
        }
    });

    it('unescape should return null when undefinded input', function(){
        var string;
        expect(dust.unescapeCSS(string)).toEqual(null);

        string= null;
        expect(dust.unescapeCSS(string)).toEqual(null);
    });

    it('unescape should return string when number of boolean input', function(){
        expect(typeof dust.unescapeCSS(5)).toEqual("string");
        expect(typeof dust.unescapeCSS(true)).toEqual("string");
    });
});
