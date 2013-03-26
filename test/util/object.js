/* bunch of object methods */
var o = {
  clone: function(source) {
    var obj = {};
    for (var prop in source) {
      if (source.hasOwnProperty(prop)){
        obj[prop] = source[prop];
      }
    }
    return obj;
  }
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = o;
}
