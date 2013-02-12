var arrayOfBadHTMLStrings = [
	  '" class="xss"',  // break out of attributes
	  '\' class="xss"',  // break out of attributes
	  '</script><a class="xss">xss</a>' //break out of script blocks
	];

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = arrayOfBadHTMLStrings;
}
