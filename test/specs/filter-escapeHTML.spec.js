var aStrings = require('../setup/simple-strings'),
    aBadStrings = require('../setup/bad-strings'),
    aHTMLStrings = require('../setup/simple-html'),
    aBadHTMLStrings = require('../setup/bad-html'),
    // testArray = aStrings.concat(aBadStrings).concat(aHTMLStrings).concat(aBadHTMLStrings);
    testArray = aHTMLStrings.concat(aBadHTMLStrings);


describe('dust escapeHtml |h filters works', function() {
  it('should return a string', function(){
    var before, after;
    for (var i=0, len=testArray.length; i<len; i++){
      before = testArray[i];
      after = dustFilters.h(before);
      expect(typeof after).toEqual('string');
    }
  });
  it('should return a string that is around the same length or greater than the original', function(){
    var before, after;
    for (var i=0, len=testArray.length; i<len; i++){
      before = testArray[i];
      after = dustFilters.h(before);
      expect(typeof after).toEqual('string');
      expect(after.length).toBeGreaterThan(before.length);
      expect(after.length).toBeLessThan(before.length * 3);
      // console.log(dustFilters.h(testArray[i]));
    }
  });
  it('should not contain < > or double quotes', function(){
    for (var i=0, len=testArray.length; i<len; i++){
      expect(dustFilters.h(testArray[i])).not.toMatch('/[<>"]/');
      // console.log(dustFilters.h(testArray[i]));
    }
  });
  it('should have the custom escapeHtml method', function(){
    expect(oldFilters.h).not.toBe(dustFilters.h);
  });
  it('should be backwards compatible', function(){
    // for (var i=0, len=testArray.length; i<len; i++){
      // console.log(dustFilters.h(testArray[i]), oldFilters.h(testArray[i]));
      // expect(dustFilters.h(testArray[i])).toEqual(oldFilters.h(testArray[i]));
    // }
  });
});
