var aStrings = require('../setup/simple-strings');


describe("dust core plus filters works", function() {
  it("should have dust and dust filters defined", function(){
    // should.exist(dust);
    // dust.filters.should.be.a('object');
    expect(dust).not.toBeUndefined();
    expect(dustFilters).toEqual(jasmine.any(Object));
  });
  it("should have my custom dust filters defined", function(){
    // oldFilters.should.not.equal(newFilters);
    // (typeof dust.filters.temp).should.equal("function");
    // expect(oldFilters).not.toEqual(newFilters);
    expect(typeof dustFilters.temp).toEqual("function");
    // for (var i=0, len=aStrings.length; i<len; i++){
      // dust.filters.temp(aStrings[i]).should.equal(aStrings[i]);
      // expect(dust.filters.temp(aStrings[i])).toEqual(aStrings[i]);
    // }
  });
  it("should continue to have the existing filter defined", function(){
    /* this modules does not change the encodeURI filter */
    // oldFilters.u.should.equal(newFilters.u);
    expect(oldFilters.u).toEqual(dustFilters.u);
  });
});
