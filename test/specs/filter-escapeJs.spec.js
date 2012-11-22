var aStrings = require('../setup/simple-strings'),
    aJsStrings = require('../setup/simple-js'),
    customEscapeJs = dustFilters.j;

describe("dust escapeJs |j filters works", function() {
  it("should not contain unescaped backslashes or single quote", function(){
    for (var i=0, len=aJsStrings.length; i<len; i++){
      expect(customEscapeJs(aJsStrings[i])).not.toMatch('/\'/');
    }
  });
});
