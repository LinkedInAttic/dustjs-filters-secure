/*
 * @venus-library jasmine
 * @venus-include ../util/object.js
 * @venus-include ../../node_modules/dustjs-linkedin/dist/dust-full-1.1.1.js
 * @venus-include ../setup/old-filters.js
 * @venus-include ../../lib/dust-filters-secure.js
 * @venus-include ../setup/simple-strings.js
 * @venus-include ../setup/bad-strings.js
 * @venus-include ../setup/simple-urls.js
 * @venus-include ../setup/bad-urls.js
 * @venus-fixture xss.fixture.html
 */

var arrayOfSimpleStrings,
    arrayOfBadStrings,
    arrayOfSimpleUrls,
    arrayOfBadUrls;

if (typeof module !== 'undefined' && module.exports) {
  arrayOfSimpleStrings = require('../setup/simple-strings');
  arrayOfBadStrings = require('../setup/bad-strings');
  arrayOfSimpleUrls = require('../setup/simple-urls');
  arrayOfBadUrls = require('../setup/bad-urls');
}

testStrings = arrayOfSimpleStrings
              .concat(arrayOfBadStrings)
              .concat(arrayOfSimpleUrls)
              .concat(arrayOfBadUrls);

describe('dust escapeUrl |url filters works', function() {
  it('should not contain spaces, <, > or semicolons', function(){
    for (var i=0, len=testStrings.length; i<len; i++){
      expect(dust.filters.u(testStrings[i])).not.toMatch('/[ <>;]/');
    }
  });
});
