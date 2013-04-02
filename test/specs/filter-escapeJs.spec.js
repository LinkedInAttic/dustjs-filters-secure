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

});
