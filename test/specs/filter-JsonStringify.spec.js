var aJSONs = require('../setup/simple-json'),
    customJSONStringify = dustFilters.js;

describe('dust JSONstringify |js filters works', function() {
   /*    \/<>&%\u0000\u2028\u2029*()'=!?`#  */
  it('should not contain unescaped bunch of stuff', function(){
    for (var i=0, len=aJSONs.length; i<len; i++){
      expect(customJSONStringify(aJSONs[i])).not.toMatch(/[\/<>&%\u0000\u2028\u2029*()'=!?`#]/);
    }
  });
});
