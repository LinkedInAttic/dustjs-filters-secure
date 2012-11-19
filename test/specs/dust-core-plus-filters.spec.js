var dust = require('dustjs-linkedin'),
    aStrings = require('../setup/simple-strings'),
    o = require('../util/object'),
    oldFilters = o.clone(dust.filters),
    newFilters;

require('../../lib/dust-filters-secure');
newFilters = dust.filters;

describe("dust core plus filters works", function() {
  it("should have dust and dust filters defined", function(){
    expect(dust).not.toBeUndefined();
    expect(dust.filters).toEqual(jasmine.any(Object));
  });
  it("should have my custom dust filters defined", function(){
    expect(oldFilters).not.toBe(newFilters);
    expect(typeof dust.filters.temp).toEqual("function");
    for (var i=0, len=aStrings.length; i<len; i++){
      expect(dust.filters.temp(aStrings[i])).toEqual(aStrings[i]);
    }
  });
  it("should continue to have the existing filter defined", function(){
    /* this modules does not change the encodeURI filter */
    // console.log(oldFilters, newFilters);
    expect(oldFilters.u).toEqual(newFilters.u);
  });
});
