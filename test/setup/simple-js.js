var arrayOfJsStrings = [
  'var a = 12, b ={}, c=\'string here\'',
  'var d = function{){',
  '};',
  'debugger',
  'console.log(\'something here\')',
  'eval(\'bad\')',
  'return'
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = arrayOfJsStrings;
}