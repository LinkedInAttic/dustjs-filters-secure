var aStrings = require('../setup/simple-strings'),
    aBadStrings = require('../setup/bad-strings'),
    aJsStrings = require('../setup/simple-js'),
    aBadJsStrings = require('../setup/bad-js'),
    customEscapeJs = dustFilters.j,
    testStrings = aStrings.concat(aBadStrings).concat(aJsStrings).concat(aBadJsStrings);

describe("dust escapeJs |j filters works", function() {
  it("should not contain unescaped backslashes or single quote", function(){
    for (var i=0, len=testStrings.length; i<len; i++){
      expect(customEscapeJs(testStrings[i])).not.toMatch('/\'/');
    }
  });
});
