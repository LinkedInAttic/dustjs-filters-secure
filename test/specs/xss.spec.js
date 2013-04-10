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
if(typeof document !== 'undefined'){
  describe ("Test dust filters in various contexts", function() {
    for (var i = 0; i < contextTests.length; i++) {
      var test = contextTests[i];
      for (var j = 0; j < test.data.length; j++) {
        it (test.message, render(test, test.data[j]));
      }
    }
  });
}

function render(test, datum) {
  return function() {
    try {
      dust.loadSource(dust.compile(test.template, test.name, false));
      dust.render(test.name, datum.context, function(err, output) {
        expect(err).toBeNull();
        document.body.innerHTML=output;
        expect(datum.expected(document)).toEqual(true);
      });
    }
    catch (error) {
      expect(test.error || {} ).toEqual(error.message);
    }
  };
}