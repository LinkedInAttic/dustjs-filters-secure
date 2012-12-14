var aStrings = require('../setup/simple-strings'),
    aBadStrings = require('../setup/bad-strings'),
    customEscapeUri = dustFilters.uc,
    testStrings = aStrings.concat(aBadStrings);

describe("dust escapeURIComponent |uc filters works", function() {
  it("should not contain unescaped !, space, star or parens", function(){
    for (var i=0, len=testStrings.length; i<len; i++){
      expect(customEscapeUri(testStrings[i])).not.toMatch('/[! ()*]/');
    }
  });
});
