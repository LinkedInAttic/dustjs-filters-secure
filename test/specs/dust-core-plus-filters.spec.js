/*
 * @venus-library jasmine
 * @venus-include ../util/object.js
 * @venus-include ../../node_modules/dustjs-linkedin/dist/dust-full-1.1.1.js
 * @venus-include ../setup/old-filters.js
 * @venus-include ../../lib/dust-filters-secure.js 
 * @venus-include ../setup/simple-strings.js
 * @venus-fixture xss.fixture.html
 */

describe("dust core plus filters works", function() {
  it("should have dust and dust filters defined", function(){
    expect(dust).not.toBeUndefined();
    expect(dust.filters).toEqual(jasmine.any(Object));
  });
  it("should have all filters that original dust.filters had", function(){
    for (var filterName in oldFilters){
      expect(dust.filters[filterName]).not.toBeUndefined();
    }
  });
  it("should have enhanced filters ha, j, uc, js, ul, x", function(){
    expect(oldFilters.ha).not.toEqual(dust.filters.ha);
    expect(oldFilters.j).not.toEqual(dust.filters.j);
    expect(oldFilters.uc).not.toEqual(dust.filters.uc);
    expect(oldFilters.js).not.toEqual(dust.filters.js);
    expect(oldFilters.ul).not.toEqual(dust.filters.ul);
    expect(oldFilters.x).not.toEqual(dust.filters.x);
  });
});
