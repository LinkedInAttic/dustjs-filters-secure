var dust = require('dustjs-linkedin'),
    aStrings = require('../setup/simple-strings'),
    aJsStrings = require('../setup/simple-js'),
    o = require('../util/object'),
    oldFilters,
    customEscapeJs;

beforeEach(function(){
  oldFilters = o.clone(dust.filters);
  require('../../lib/dust-filters-secure');
  customEscapeJs = dust.filters.j;
});
afterEach(function(){
  dust.filters = oldFilters;
});

describe("dust escapeJs |j filters works", function() {
  it("should not contain unescaped backslashes or single quote", function(){
    for (var i=0, len=aJsStrings.length; i<len; i++){
      // console.log(aJsSStrings[i]+ ' escaped to be : ';
      expect(customEscapeJs(aJsStrings[i])).not.toMatch('/\'/');
    }
  });
});
