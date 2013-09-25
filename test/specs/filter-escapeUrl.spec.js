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

describe('dust escapeUrl |ul filters works', function() {
    it('should return a string', function(){
        var before, after;
        for (var i=0, len=testStrings.length; i<len; i++){
            before = testStrings[i];
            after = dust.filters.ul(before);
            expect(typeof after).toEqual('string');
        }
        for (var i=0, len=testStrings.length; i<len; i++){
            before = testStrings[i];
            after = dust.filters.uc(before);
            expect(typeof after).toEqual('string');
        }
    });

    it('should return a null when has null input', function(){
        expect(dust.filters.ul(null)).toEqual(null);
        expect(dust.filters.uc(null)).toEqual(null);
    });

    it('should return a string that is around the same length or greater than the original', function(){
        var before, after;
        for (var i=0, len=testStrings.length; i<len; i++){
            before = testStrings[i];
            after = dust.filters.ul(before);
            expect(typeof after).toEqual('string');
            expect(after.length).not.toBeLessThan(before.length);
        }
    });

  it('should not contain spaces, <, > or semicolons', function(){
    for (var i=0, len=testStrings.length; i<len; i++){
      expect(dust.filters.u(testStrings[i])).not.toMatch('/[ <>;]/');
    }
  });
  it('should escape url properly', function() {
   expect(dust.filters.ul('http://www.linkedin.com')).toEqual('http&#x3A;&#x2F;&#x2F;www&#x2E;linkedin&#x2E;com');
   expect(dust.filters.ul('https://www.linkedin.com/search?keywords=AT%26T+company&foo=bar#hash')).toEqual('https&#x3A;&#x2F;&#x2F;www&#x2E;linkedin&#x2E;com&#x2F;search&#x3F;keywords&#x3D;AT%26T+company&#x26;foo&#x3D;bar&#x23;hash');
   expect(dust.filters.ul('https://www.linkedin.com/search?keywords="\'<script>alert(123)</script>&foo=bar#hash')).toEqual('https&#x3A;&#x2F;&#x2F;www&#x2E;linkedin&#x2E;com&#x2F;search&#x3F;keywords&#x3D;%22%27%3Cscript%3Ealert%28123%29%3C%2Fscript%3E&#x26;foo&#x3D;bar&#x23;hash');
   expect(dust.filters.ul('https://www.linkedin.com/search?keywords="\'<script>alert(123)</script>&foo=bar')).toEqual('https&#x3A;&#x2F;&#x2F;www&#x2E;linkedin&#x2E;com&#x2F;search&#x3F;keywords&#x3D;%22%27%3Cscript%3Ealert%28123%29%3C%2Fscript%3E&#x26;foo&#x3D;bar');
   expect(dust.filters.ul('http://twitter.com/#!hash')).toEqual('http&#x3A;&#x2F;&#x2F;twitter&#x2E;com&#x2F;&#x23;&#x21;hash');
   expect(dust.filters.ul('//www.google.com')).toEqual('&#x2F;&#x2F;www&#x2E;google&#x2E;com');
   expect(dust.filters.ul('scp://foo')).toEqual('scp&#x3A;&#x2F;&#x2F;foo');
   expect(dust.filters.ul('" foo="bar"')).toEqual('&#x22;&#x20;foo&#x3D;&#x22;bar&#x22;');
   });
});
