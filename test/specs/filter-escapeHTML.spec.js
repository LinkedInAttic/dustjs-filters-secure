var dust = require('dustjs-linkedin'),
    aStrings = require('../setup/simple-strings'),
    aHTMLStrings = require('../setup/simple-html'),
    o = require('../util/object'),
    oldFilters = o.clone(dust.filters),
    oldEscapeHtml = oldFilters.h,
    customEscapeHtml;

require('../../lib/dust-filters-secure');
customEscapeHtml = dust.filters.h;

describe("dust escapeHtml |h filters works", function() {
  it("should not contain < > or double quotes", function(){
    for (var i=0, len=aHTMLStrings.length; i<len; i++){
      expect(customEscapeHtml(aHTMLStrings[i])).not.toMatch('/[<>"]/');
    }
  });
  it("should have the custom escapeHtml method", function(){
    expect(oldEscapeHtml).not.toBe(customEscapeHtml);
  });
  it("should be backwards compatible", function(){
    for (var i=0, len=aHTMLStrings.length; i<len; i++){
      console.log(customEscapeHtml(aHTMLStrings[i]), oldEscapeHtml(aHTMLStrings[i]));
      expect(customEscapeHtml(aHTMLStrings[i])).toEqual(oldEscapeHtml(aHTMLStrings[i]));
    }
  });
});
