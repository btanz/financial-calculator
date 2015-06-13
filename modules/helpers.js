var validator = require('validator');

/* VALIDATEINPUTS function that validates an object of inputs against an object of properties
 *
 * ARGUMENTS
 *   inputs                   object; inputs such as {'price': 20.00, 'maturity': 4}
 *   expectedInputs           object; expected properties; {'price': 'Number','maturity': 'Number' }
 *
 * ACTIONS
 *   none
 *
 * RETURNS
 *   false                    if the properties of both object do not match exactly in content and number
 *                            or if a Number can not be cast to a number
 *   true                     otherwise
 */
exports.validateInputs = function (inputs, expectedInputs){
  var count = 0;
  for (var key in inputs) {
    if (inputs.hasOwnProperty(key)) {
      count += 1;
      if (Object.keys(expectedInputs).indexOf(key) === -1) {
        console.log("An invalid key is present");
        return false;   // return false when invalid key is present
      }

      if (expectedInputs[key] === 'Number') {  // if number
        if(validator.isFloat(inputs[key])) {
          inputs[key] = Number(inputs[key]);
        } else {
          console.log(inputs[key]);
          return false;
        }
      } else if (expectedInputs[key] === 'String') { // if string
        inputs[key] = validator.escape(inputs[key]);
        inputs[key] = validator.trim(inputs[key]);
      }
    }
  }
  if (count === Object.keys(expectedInputs).length){
    return true;
  } else {
    console.log("Number of expected inputs does not match");
    return false;
  }
};