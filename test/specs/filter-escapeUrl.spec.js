var aStrings = require('../setup/simple-strings'),
    aBadStrings = require('../setup/bad-strings'),
    aUrls = require('../setup/simple-urls'),
    aBadUrls = require('../setup/bad-urls'),
    customEscapeUrl = dustFilters.url,
    testStrings = aStrings.concat(aUrls).concat(aBadStrings).concat(aBadUrls);


describe('dust escapeUrl |url filters works', function() {
  it('should not contain spaces, <, > or semicolons', function(){
    for (var i=0, len=testStrings.length; i<len; i++){
      expect(customEscapeUrl(testStrings[i])).not.toMatch('/[ <>;]/');
    }
  });
});
