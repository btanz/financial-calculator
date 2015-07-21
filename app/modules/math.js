/*
 * math.js
 * Mathematics helpers
 */


// calculate roots of a function
exports.roots = function(f,initX,iterBound,devY,delt){
  var delt = delt || 0.000001;  // set default
  var Y, X_new, X = initX || 0; // initial guess
  var iterBound = iterBound || 1500;
  var devY = devY || 0.0000001;
  var iter = 0;

  // numerical derivative
  var df = function(x){
    return (f(x+delt)-f(x))/delt;
  };

  do{
    Y = f(X);
    X_new = X-Y/df(X);
    X = X_new;
    iter++;
    //console.log('X is: ' + X + ' Y is: '+Y);
    if (iter > iterBound){

      console.log('No convergence');
      return null;
    }
  } while(Math.abs(Y) > devY)
  return X;
};


// a simple function that does transposition on an array
// the function expects and array and returns the transpose of it
exports.transpose = function(arr){
  return arr[0].map(function (col, i) {return arr.map(function (row) {return row[i];})});
};

