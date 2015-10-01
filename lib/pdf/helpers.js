/** helpers file for pdf */
"use strict";

var helpers = exports;

helpers.decimalPlaces = function decimalPlaces(num) {
  num = num.replace(/,/g,'.');
  var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);

  //console.log(match);
  if (!match) { return 0; }
  return Math.max(
      0,
      // Number of digits right of decimal point.
      (match[1] ? match[1].length : 0)
        // Adjust for scientific notation.
      - (match[2] ? +match[2] : 0));
};
