/*
 * @venus-library jasmine
 * @venus-include ../../node_modules/dustjs-linkedin/dist/dust-full-1.1.1.js
 * @venus-fixture xss.fixture.html
 */

describe("sanity check that dust is correctly setup", function() {
  it("should be defined", function(){
    expect(dust).not.toBeUndefined();
  });
});