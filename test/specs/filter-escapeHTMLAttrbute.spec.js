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

describe('Dust\'s escapeHTMLAttribute |ha filter', function() {

  it('should return a string', function(){
    var before, after;
    for (var i=0, len=testStrings.length; i<len; i++){
      before = testStrings[i];
      after = dust.filters.ha(before);
      expect(typeof after).toEqual('string');
    }
  });

  it('should return a null when has null input', function(){
      expect(dust.filters.ha(null)).toEqual(null);
  });

  it('should return a string when input is number of boolean', function(){
    expect(typeof dust.filters.ha(5)).toEqual('string');
    expect(typeof dust.filters.ha(true)).toEqual('string');
  });

  it('should return a string that is around the same length or greater than the original', function(){
    var before, after;
    for (var i=0, len=testStrings.length; i<len; i++){
      before = testStrings[i];
      after = dust.filters.ha(before);
      expect(typeof after).toEqual('string');
      expect(after.length).not.toBeLessThan(before.length);
    }
  });

  it('should not contain < > or double quotes', function(){
    for (var i=0, len=testStrings.length; i<len; i++){
      expect(dust.filters.ha(testStrings[i])).not.toMatch('/[<>"]/');
    }
  });

  it('should escape htmlAttribute elements', function(){
    if (typeof document !== 'undefined') {
      var container = document.getElementById('test');
      for (var i=0, len=testStrings.length; i<len; i++){
        container.innerHTML = dust.filters.ha(testStrings[i]);
        expect(container.firstElementChild).toEqual(null);
      }
    }
  });

  it('should escape all the non alphanumeric characters', function() {
    expect(dust.filters.ha('qwerty~!@#$%^&*()_+`-={}|[]\\:";\'<>?,./')).toEqual('qwerty&#x7E;&#x21;&#x40;&#x23;&#x24;&#x25;&#x5E;&#x26;&#x2A;&#x28;&#x29;_&#x2B;&#x60;&#x2D;&#x3D;&#x7B;&#x7D;&#x7C;&#x5B;&#x5D;&#x5C;&#x3A;&#x22;&#x3B;&#x27;&#x3C;&#x3E;&#x3F;&#x2C;&#x2E;&#x2F;');
    expect(dust.filters.ha('<script>alert (0); </script>')).toEqual('&#x3C;script&#x3E;alert&#x20;&#x28;0&#x29;&#x3B;&#x20;&#x3C;&#x2F;script&#x3E;');
  });

    it('should unescape to the original string', function(){
        for (var i=0, len=testStrings.length; i<len; i++) {
            expect(dust.unescapeHTMLAttribute(dust.filters.ha(testStrings[i]))).toEqual(testStrings[i]);
        }
    });

    it('unescape should return null when undefinded input', function(){
        var string;
        expect(dust.unescapeHTMLAttribute(string)).toEqual(null);

        string= null;
        expect(dust.unescapeHTMLAttribute(string)).toEqual(null);
    });

    it('unescape should return string when number of boolean input', function(){
        expect(typeof dust.unescapeHTMLAttribute(5)).toEqual("string");
        expect(typeof dust.unescapeHTMLAttribute(true)).toEqual("string");
    });
});
