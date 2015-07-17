var validator = require('validator');
var _ = require('underscore');



// a simple function that does addition
// mainly used as callback in _reduce tasks
exports.add = function(a,b){
  return a + b;
};



// a messaging object that is intended to be used for communicating messages occurring in calculations to the user
// it is used for messages that allow continuation of the calculation
// usage in calculation modules: (helpers).messages.set("My message",1)
// the message is then returned to the user along with the results
// massgeType is a number that represents
// 1  error
// 2  notification
// 3  success
exports.messages = {
  messageText: '',
  messageType: '',
  messageMap: [],
  set: function (messageText, messageType){
    this.messageText = messageText;
    this.messageType = messageType;
    this.messageMap.push(_.pick(this,'messageText','messageType'));
  },
  clear: function(){
    this.messageMap = [];
  }
};

// a messaging object that is intended to be used for communicating error messages occurring in calculations to the user
// it is used for messages that DO NOT allow continuation of the calculation
// usage in calculation modules: (helpers).errors.set("My error message")
// the message is then returned to the user along with the results
exports.errors = {
  errorMessage: '',
  errorInput: '',
  errorPrint: '',
  errorMap: [],
  set: function (errorMessage, errorKey, printToUser){
    this.errorMessage = errorMessage;
    this.errorInput = errorKey;
    this.errorPrint = printToUser || false;
    this.errorMap.push(_.pick(this,'errorMessage','errorKey','errorPrint'));
  },
  clear: function(){
    this.errorMap = [];
  }
};




/* VALIDATEINPUTS function that validates an object of inputs against an object of properties
 * TODO finish documentation
 * TODO integrate exports.errors
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
exports.validate = function(inputs, _expectedInputs){

  var expectedInputs = _.clone(_expectedInputs);

  // initialize error object
  var error = {
    errorMessage: '',
    errorInput: '',
    errorPrint: '',
    errorMap: [],
    setError: function (errorMessage, errorInput, printToUser){
      this.errorMessage = errorMessage;
      this.errorInput = errorInput;
      this.errorPrint = printToUser || false;
      this.errorMap.push(_.pick(this,'errorMessage','errorInput','errorPrint'));
    }
  };

  // *** extend expectedInputs with array values ***
  // this appends keys for array elements
  // it is assumed that each key with array = true has a parent, defined in arrayParent, which contains the number
  // of elements of the array; the function then creates new keys with arrayName0, arrayName1, ... arrayName{#elements}
  // and deletes the original array key
  _.each(expectedInputs, function(elem, key) {

    // check for arrays
    if( elem.array === 'true' || elem.array === true ){

      // check whether parentElem is defined properly
      if (!elem.arrayParent){ // parentElem not defined in ArrayElem
        error.setError('Das Mutterelement für Array ' + key + ' ist nicht definiert.', key, false);
      } else if (!expectedInputs[elem.arrayParent]) { // parentElem defined in ArrayElem, but not in schema
        error.setError('Das Mutterelement für Array ' + key + ' konnte nicht gefunden werden.', key, false);
      } else if (!inputs[elem.arrayParent]){ // value for parentElem is not in Schema (parentElems are always required)
        error.setError('Die Eingabe ' + elem.arrayParent + ' ist notwendig, fehlt jedoch.', key, false);
      }

      // attach array keys to main obj
      for (var i = 0; i < inputs[elem.arrayParent]; i++ ){
        expectedInputs[String(key) + String(i)] = _.omit(expectedInputs[key],'array');
      }

      // remove original array
      delete expectedInputs[key];
    }
  });



  // *** check whether the input object is in correct shape regaring number of arguments and the like ***

  // check whether input property is in expectedInputs and trim all inputs
  _.each(inputs, function(elem, key){

    inputs[key] = validator.trim(inputs[key]);

    if (!expectedInputs.hasOwnProperty(key)) {
      error.setError('Die Eingabe ' + key + ' ist unerwartet.', key, false);
    }
  });

  // check whether expectedInputproperty is in inputs and not empty
  _.each(expectedInputs, function(elem, key){


    if(!inputs.hasOwnProperty(key)){
      if(!(elem.optional === 'true') && !(elem.optional === true)){
        error.setError('Die Eingabe ' + key + ' ist notwendig, fehlt jedoch.', key, false);
      }
    } else if (typeof inputs[key] === 'undefined' || inputs[key] === ''){
      if(!(elem.optional === 'true') && !(elem.optional === true)){
        error.setError('Das Feld ' + elem.label + ' muss korrekt ausgefüllt sein.', key, false);
      }
    }

  });

  _.each(expectedInputs, function(elem, key){

    // *** jump over undefined and empty values
    if (typeof inputs[key] === 'undefined' || inputs[key] === '')
      return;

    // *** check Format 'Number' *** //
    if(elem.vtype === 'number'){
      // replace commas with dots
      if (typeof inputs[key] === 'string'){
        inputs[key] = inputs[key].replace(/,/g, '.')
      }
      // convert to number
      if (validator.isFloat(inputs[key])){
        inputs[key] = Number(inputs[key]);
      } else {
        error.setError('Die Eingabe für ' + elem.label + ' muss eine Zahl sein', key, true);
      }
      // check boundary conditions supplied with args
      if (elem.args && typeof Number(elem.args[0]) === 'number' && typeof Number(elem.args[1]) === 'number' ){
        if (inputs[key] < elem.args[0] || inputs[key] > elem.args[1]){
          error.setError('Die Wert für ' + elem.label + ' muss zwischen ' + elem.args[0] + ' und ' + elem.args[1] + ' liegen.', key, true);
        }
      }
    }

    // *** check Format 'String' *** //
    else if(elem.vtype === 'string'){
      if (typeof inputs[key] === 'string'){
        inputs[key] = validator.escape(inputs[key]);
      } else {
        error.setError('Die Eingabe für ' + elem.label + ' muss ein String sein.', key, true);
      }
    }

    // *** check Format 'Bool' *** //
    else if(elem.vtype === 'bool'){
      if (validator.isBoolean(inputs[key])){
        inputs[key] = validator.toBoolean(inputs[key]);
      } else {
        error.setError('Der Wert für ' + elem.label + ' muss ein Wahrheitswert (wahr / falsch) sein.', key, false);
      }
    }

    // *** check Format 'Date' *** //
    else if(elem.vtype === 'date'){
      // need to switch date and month for validator
      inputs[key] = inputs[key].split('.')[1] + '.' + inputs[key].split('.')[0] + '.' + inputs[key].split('.')[2];
      if (validator.isDate(inputs[key])){
        inputs[key] = validator.toDate(inputs[key]);
      } else {
        error.setError('Die Eingabe für ' + elem.label + ' muss ein gültiges Datum sein.', key, true);
      }
    }


  });

  expectedInputs = null;
  return error.errorMap;

};