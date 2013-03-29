/*
 * @venus-library jasmine
 * @venus-include ../util/object.js
 * @venus-include ../../node_modules/dustjs-linkedin/dist/dust-full-1.1.1.js
 * @venus-include ../setup/old-filters.js
 * @venus-include ../../lib/dust-filters-secure.js
 * @venus-include ../setup/xss-test-doms.js 
 * @venus-fixture xss.fixture.html
 */

/* encode with escapeHTML look for 
 *  1. extra tags on the page
 *  2. broken script tags
 */

var testDoms,
    customJSONStringify = dust.filters.js;

if (typeof module !== 'undefined' && module.exports) {
  testDoms = require('../setup/simple-json');
}

describe ('HTML encoded strings injected to a DOM', function() {
  it ('should not have new nodes', function() {
/*
    var container = document.getElementById('test');
    for (var i=0, len=testDoms.length; i<len; i++){
        container.innerHTML = dust.filters.h(testDoms[i].markup);
        expect(testDoms[i].check(document)).toBe(true);
    }
*/
  });
  it ('should not be double encoded', function() {
    // expect Number of dom child nodes to equal 0
  });
});

describe ('JS encoded strings injected to a DOM', function() {
  // get the array of test strings and create an array of safe strings
  it ('should not have extra JS variables', function() {
    // expect Number of dom child nodes to equal 0
  });
  it ('should not be double encoded', function() {
    // expect Number of dom child nodes to equal 0
  });
});

// for (var i, len=aTestStrings.length; i<len; i++) {
//   // create a DOM
//
//   // 
//   // innerHTML the encode
// }
