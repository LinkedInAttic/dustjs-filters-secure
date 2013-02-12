/*
 * @venus-library jasmine
 * @venus-include ../../node_modules/dustjs-linkedin/dist/dust-full-1.1.1.js
 * @venus-include ../../lib/dust-filters-secure.js
 * @venus-include ../setup/simple-strings.js
 * @venus-include ../setup/bad-strings.js
 * @venus-include ../setup/simple-html.js
 * @venus-include ../setup/bad-html.js
 * @venus-fixture xss.fixture.html
 */

/*
var aStrings = require('../setup/simple-strings'),
    aBadStrings = require('../setup/bad-strings'),
    aHTMLStrings = require('../setup/simple-html'),
    aBadHTMLStrings = require('../setup/bad-html'),
    testStrings = aStrings.concat(aBadStrings).concat(aHTMLStrings).concat(aBadHTMLStrings);
*/

var testStrings = arrayOfSimpleStrings.concat(arrayOfBadStrings).concat(arrayOfSimpleHTMLStrings).concat(arrayOfBadHTMLStrings),
    dustFilters = dust.filters;

describe('Dust\'s escapeHtml |h filter', function() {

  it('should return a string', function(){
    var before, after;
    for (var i=0, len=testStrings.length; i<len; i++){
      before = testStrings[i];
      after = dustFilters.h(before);
      expect(typeof after).toEqual('string');
    }
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
      // console.log(dustFilters.h(testStrings[i]));
    }
  });

  it('should escape html elements', function(){
    var output,
        container = document.getElementById('test');
    for (var i=0, len=testStrings.length; i<len; i++){
      container.innerHTML = dustFilters.h(testStrings[i]);
      expect(container.children.length).toBe(0);
    }
  });

  it('should have the custom escapeHtml method', function(){
    expect(oldFilters.h).not.toBe(dustFilters.h);
  });

  it('should be backwards compatible', function(){
    // for (var i=0, len=testStrings.length; i<len; i++){
    // console.log(dustFilters.h(testStrings[i]), oldFilters.h(testStrings[i]));
    // expect(dustFilters.h(testStrings[i])).toEqual(oldFilters.h(testStrings[i]));
    // }
  });

  it('should unescape to the original string', function(){
    for (var i=0, len=testStrings.length; i<len; i++){
      expect(dust.unescapeHTML(dustFilters.h(testStrings[i]))).toMatch(testStrings[i]);
    }
  });
});
