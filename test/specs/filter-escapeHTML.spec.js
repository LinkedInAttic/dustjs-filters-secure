var aStrings = require('../setup/simple-strings'),
    aBadStrings = require('../setup/bad-strings'),
    aHTMLStrings = require('../setup/simple-html'),
    aBadHTMLStrings = require('../setup/bad-html'),
    // testArray = aStrings.concat(aBadStrings).concat(aHTMLStrings).concat(aBadHTMLStrings);
    testArray = aHTMLStrings.concat(aBadHTMLStrings);


console.log(testArray);

describe('dust escapeHtml |h filters works', function() {
  it('should not contain < > or double quotes', function(){
    for (var i=0, len=testArray.length; i<len; i++){
      expect(dustFilters.h(aHTMLStrings[i])).not.toMatch('/[<>"]/');
      console.log(dustFilters.h(aHTMLStrings[i]));
    }
  });
  it('should have the custom escapeHtml method', function(){
    expect(oldFilters.h).not.toBe(dustFilters.h);
  });
  it('should be backwards compatible', function(){
    // for (var i=0, len=aHTMLStrings.length; i<len; i++){
      // console.log(dustFilters.h(aHTMLStrings[i]), oldFilters.h(aHTMLStrings[i]));
      // expect(dustFilters.h(aHTMLStrings[i])).toEqual(oldFilters.h(aHTMLStrings[i]));
    // }
  });
});
