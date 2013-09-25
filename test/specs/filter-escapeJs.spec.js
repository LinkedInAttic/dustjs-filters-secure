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
    arrayOfJsStrings,
    arrayOfBadJsStrings,
    testStrings;

if (typeof module !== 'undefined' && module.exports) {
  arrayOfSimpleStrings = require('../setup/simple-strings'),
  arrayOfBadStrings = require('../setup/bad-strings'),
  arrayOfJsStrings = require('../setup/simple-js'),
  arrayOfBadJsStrings = require('../setup/bad-js');
}

testStrings = arrayOfSimpleStrings
              .concat(arrayOfBadStrings)
              .concat(arrayOfJsStrings)
              .concat(arrayOfBadJsStrings);

describe("dust escapeJs |j filter works", function() {
  it("should not contain unescaped backslashes or single quote", function(){
    for (var i=0, len=testStrings.length; i<len; i++){
      expect(dust.filters.js(testStrings[i])).not.toMatch('/\'/');
    }
  });

  it('should return a string', function(){
    for (var i=0, len=testStrings.length; i<len; i++){
      expect(typeof dust.filters.j(testStrings[i])).toEqual('string');
    }
  });

  it('should return a null when has null input', function(){
      expect(dust.filters.j(null)).toEqual(null);
  });

  it('should return a string when input is number of boolean', function(){
    expect(typeof dust.filters.j(5)).toEqual('string');
    expect(typeof dust.filters.j(true)).toEqual('string');
  });

  it('should escape all the non alphanumeric characters', function() {
    expect(dust.filters.j('qwerty~!@#$%^&*()_+`-={}|[]\\:";\'<>?,./')).toEqual('qwerty\\u007e\\u0021\\u0040\\u0023\\u0024\\u0025\\u005e\\u0026\\u002a\\u0028\\u0029_\\u002b\\u0060\\u002d\\u003d\\u007b\\u007d\\u007c\\u005b\\u005d\\u005c\\u003a\\u0022\\u003b\\u0027\\u003c\\u003e\\u003f\\u002c\\u002e\\u002f');
    expect(dust.filters.j('<script>alert (0); </script>')).toEqual('\\u003cscript\\u003ealert\\u0020\\u00280\\u0029\\u003b\\u0020\\u003c\\u002fscript\\u003e');
  });
});
