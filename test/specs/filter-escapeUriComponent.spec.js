var aStrings = require('../setup/simple-strings'),
    customEscapeUri = dustFilters.uc;

describe("dust escapeURIComponent |uc filters works", function() {
  it("should not contain unescaped !, space, star or parens", function(){
    for (var i=0, len=aStrings.length; i<len; i++){
      expect(customEscapeUri(aStrings[i])).not.toMatch('/[! ()*]/');
    }
  });
});
