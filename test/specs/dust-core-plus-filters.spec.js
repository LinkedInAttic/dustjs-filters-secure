var aStrings = require('../setup/simple-strings');


describe("dust core plus filters works", function() {
  it("should have dust and dust filters defined", function(){
    expect(dust).not.toBeUndefined();
    expect(dustFilters).toEqual(jasmine.any(Object));
  });
  it("should have my custom dust filters defined", function(){
    /* TODO: replace this with something good */
    expect(typeof dustFilters.temp).toEqual("function");
  });
  it("should continue to have the existing filter defined", function(){
    /* this modules does not change the encodeURI filter */
    expect(oldFilters.u).toEqual(dustFilters.u);
  });
});
