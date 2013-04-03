/*
 * @venus-library jasmine
 * @venus-include ../util/object.js
 * @venus-include ../../node_modules/dustjs-linkedin/dist/dust-full-1.1.1.js
 * @venus-include ../setup/old-filters.js
 * @venus-include ../../lib/dust-filters-secure.js
 * @venus-include ../setup/xss-test-doms.js 
 * @venus-fixture xss.fixture.html
 */

var contextTests;
if (typeof module !== 'undefined' && module.exports) {
  contextTests = require('../setup/xss-test-doms');
}

//run this for browser version only - when we have document object
if(typeof document != 'undefined'){
  describe ("Test dust filters in various contexts", function() {
    for (var i = 0; i < contextTests.length; i++) {
      var test = contextTests[i];
      it (test.message, render(test));
    }
  });
}

function render(test) {
  return function() {
    try {
      dust.loadSource(dust.compile(test.source, test.name, test.strip));
      dust.render(test.name, test.context, function(err, output) {
        expect(err).toBeNull();
        document.body.innerHTML=output;
        expect(test.expected(document)).toEqual(true);
      });
    }
    catch (error) {
      expect(test.error || {} ).toEqual(error.message);
    }
  };
}