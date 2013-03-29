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
});