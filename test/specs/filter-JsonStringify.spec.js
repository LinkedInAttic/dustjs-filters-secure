/*
 * @venus-library jasmine
 * @venus-include ../util/object.js
 * @venus-include ../../node_modules/dustjs-linkedin/dist/dust-full-1.1.1.js
 * @venus-include ../setup/old-filters.js
 * @venus-include ../../lib/dust-filters-secure.js
 * @venus-include ../setup/simple-json.js
 * @venus-fixture xss.fixture.html
 */

var arrayOfJsStrings,
    customJSONStringify = dust.filters.js;

if (typeof module !== 'undefined' && module.exports) {
  arrayOfJsStrings = require('../setup/simple-json');
}

describe('dust JSONstringify |js filters works', function() {
  it('should not contain unescaped bunch of stuff', function(){
    for (var i=0, len=arrayOfJsStrings.length; i<len; i++){
      expect(customJSONStringify(arrayOfJsStrings[i])).not.toMatch(/[\/<>&%\u0000\u2028\u2029*()'=!?`#]/);
    }
  });
});
