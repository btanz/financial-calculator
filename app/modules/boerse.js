//var Calc = require('mongoose').model('DailyStockprices');
var request = require('request');
var fx = require('money');
var _ = require('underscore');
var stats = require('jStat').jStat;
var math = require('./math');
var quandl = require('../../lib/quandl');
var f = require('../../lib/finance');
var helpers = require('./helpers');
var calcElems = require('../../data/static/calcElems.json');
//var Calc = require('../../app/models/calc.elem.model');



var cumNormalHelper, cumNormalPrimeHelper;

/* ************************ BEGIN BOERSE MODULE PUBLIC FUNCTIONS *****************************/

/* BLACKSCHOLES function that computes value and other parameters of an option using black scholes
 *
 * ARGUMENTS
 *   object inputs with the following properties
 *     optiontype               number {1 = 'Call-Option',2 = 'Put-Option'} that holds the option type
 *     price                    number containing the current price of the underlying
 *     strike                   number containing the strike price of the option
 *     interest                 number containing the current interest rate in percent
 *     maturity                 number containing the maturity of the option in days
 *     vola                     number containing the volatility of the underlying on %
 *
 * ACTIONS
 *   none
 *
 * RETURNS
 *   object result._1.
 *     value                    object, containing description, value and unit of BS-value of the option
 *     delta                    object, containing description, value and unit of option delta
 *     gamma                    object, containing description, value and unit of option gamma
 *     vega                     object, containing description, value and unit of option vega
 *     theta                    object, containing description, value and unit of option theta
 *     rho                      object, containing description, value and unit of option rho
 *     intrinsicValue           object, containing description, value and unit of intrinsic value of the option
 *     timeValue                object, containing description, value and unit of time value of the option
 *
 *     On calculation error, the function will return null;
 */
exports.blackScholes = function (inputs) {

  /* ******** 1. INIT AND ASSIGN ******** */
  var value, delta, gamma, vega, theta, intrinsicValue, timeValue, rho, d1, d2;
  var result = {}; result._1 = {};
  var localElems = calcElems.options.results_1;
  var expectedInputs = calcElems.options.inputs;
  var errorMap;
  var helper = {};

  // todo: remove mongoose tinkering
  console.log(Calc);


  /* ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
  errorMap = helpers.validate(inputs, expectedInputs);
  if (errorMap.length !== 0){
    return errorMap;
  }
  // do unit conversions
  inputs.interest = inputs.interest/100;
  inputs.maturity = inputs.maturity/365;
  inputs.vola = inputs.vola/100;


  /* ******** 3. COMPUTATIONS ******** */
  // compute d1 and d2 parameters
  d1 = (Math.log(inputs.price / inputs.strike) + (inputs.interest + inputs.vola * inputs.vola / 2.0) * inputs.maturity) / (inputs.vola * Math.sqrt(inputs.maturity));
  d2 = d1 - inputs.vola * Math.sqrt(inputs.maturity);
  // return value based on PutCallFlag
  if (inputs.optiontype === 1){ // call
    helper.value =  inputs.price * cumNormalHelper(d1)-inputs.strike * Math.exp(-inputs.interest * inputs.maturity) * cumNormalHelper(d2);
    helper.delta = cumNormalHelper(d1);
    helper.gamma = cumNormalPrimeHelper(d1) / (inputs.price*inputs.vola*Math.sqrt(inputs.maturity));
    helper.vega = 0.01 * inputs.strike * Math.sqrt(inputs.maturity) * cumNormalPrimeHelper(d1);
    helper.theta = (- (inputs.price * cumNormalPrimeHelper(d1) * inputs.vola/(2*Math.sqrt(inputs.maturity))) - inputs.interest * inputs.strike * Math.exp(-inputs.interest*inputs.maturity) * cumNormalHelper(d2))/365;
    helper.rho = 0.01 * inputs.strike * inputs.maturity * Math.exp(- inputs.interest * inputs.maturity) * cumNormalHelper(d2);
    helper.intrinsicValue = Math.max(inputs.price - inputs.strike,0);
    helper.timeValue = helper.value - helper.intrinsicValue;
  } else if (inputs.optiontype === 2) { // put
    helper.value = inputs.strike * Math.exp(-inputs.interest * inputs.maturity) * cumNormalHelper(-d2) - inputs.price * cumNormalHelper(-d1);
    helper.delta = cumNormalHelper(d1) - 1;
    helper.gamma = cumNormalPrimeHelper(d1) / (inputs.price*inputs.vola*Math.sqrt(inputs.maturity));
    helper.vega = 0.01 * inputs.price * Math.sqrt(inputs.maturity) * cumNormalPrimeHelper(d1);
    helper.theta = (- (inputs.price * cumNormalPrimeHelper(d1) * inputs.vola/(2*Math.sqrt(inputs.maturity))) + inputs.interest * inputs.strike * Math.exp(-inputs.interest*inputs.maturity) * cumNormalHelper(-d2))/365;
    helper.rho = - 0.01 * inputs.strike * inputs.maturity * Math.exp(- inputs.interest * inputs.maturity) * cumNormalHelper(-d2);
    helper.intrinsicValue = Math.max(inputs.strike-inputs.price,0);
    helper.timeValue = helper.value - helper.intrinsicValue;
  } else {
    return null;
  }

  /* ******** 4. CONSTRUCT RESULT OBJECT ******** */
  result.id = calcElems.options.id;
  ['value','delta','gamma','theta','vega','rho','intrinsicValue','timeValue'].forEach(function(val){
    result._1[val] = _.extend(localElems[val], {"value": helper[val]});
  });

  return result;

};


// query exchange rates using the fixer.io API (ECB exchange rates)
// todo: documentation
exports.fxConvert = function (inputs,callback) {

  /* ******** 1. INIT AND ASSIGN ******** */
  var value, returnResults;
  var localElems = calcElems.fx.results_1;
  var result = {}; result._1 = {}; result._2 = {};
  var expectedInputs = calcElems.fx.inputs;
  var errorMap;
  var adjustment = 1, rate;


  /* ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
  errorMap = helpers.validate(inputs, expectedInputs);

  if (errorMap.length !== 0){
    callback(errorMap);
    return;
  }

  /* ******** 3. COMPUTATIONS ******** */
  request('http://openexchangerates.org/api/latest.json?app_id=42c2d766a7314fcf83a86efc88f4b8a2', function(error,response,body){
    if (!error && response.statusCode == 200) {
      var fxData = JSON.parse(body);
      fx.rates = fxData.rates;
      fx.base = fxData.base;
      value = fx.convert(inputs.principal, {from: inputs.from, to: inputs.to});
      returnResults(value);
    } else {
      return null;
    }
  });

  returnResults = function(value){
    /* ******** 4. CONSTRUCT RESULT OBJECT ******** */

    // calc_id
    result.id = calcElems.fx.id;

    rate = value/inputs.principal;
    while(Math.abs(rate/adjustment)>10){adjustment *= 10;}
    while(Math.abs(rate/adjustment)<0.1){adjustment /= 10;}

    // first result container
    result._1.value = _.extend(localElems.value, {"value": value, 'unit': inputs.to});

    // second result container
    result._2.title = 'Umrechnungstabelle';
    result._2.header = [inputs.from, inputs.to, inputs.to, inputs.from];
    result._2.body = [];
    [1,2,3,4,5,10,15,20,25,50,100,250,500,1000,10000,100000].forEach(function(element, index){
      result._2.body.push([(element/adjustment), (element/adjustment)*(value/inputs.principal), (element*adjustment), (element*adjustment)/(value/inputs.principal)]);
    });
  callback(null, result);
  }

};



// compute return from equity investment
// todo: documentation
exports.equityReturn = function(inputs, callback) {

  /* ******** 1. INIT AND ASSIGN ******** */
  var result = {}; result._1 = {}; result._2 = {};
  var i, dividendData = [], helper, holding, irr;
  var expectedInputs = calcElems.equityreturn.inputs;
  var errorMap;
  var localElems = calcElems.equityreturn.results_1;


  /* ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
  errorMap = helpers.validate(inputs, expectedInputs);

  if (errorMap.length !== 0){
    return errorMap;
  }

  // write dividendData to array dividends array
  for (i = 0; i < inputs.dividends; i++){
    helper = ['dividendDate'.concat(i),'dividendAmount'.concat(i)];
    dividendData.push([inputs[helper[0]],inputs[helper[1]]]);
  }


  /* ******** 3. COMPUTATIONS ******** */
  // check for fees and adjust buy and sell
  if (isFinite(inputs.feebuy)){inputs.buy += inputs.feebuy};
  if (isFinite(inputs.feesell)){inputs.sell -= inputs.feesell};


  // function to compute NPV for guess; function is 0 at the correct discount rate XXX
  function NPV(discountRate){
    var npv = 0;
    for(var t = 0; t < dividendData.length; t++) {
      npv += dividendData[t][1] / Math.pow((1+ discountRate),dividendData[t][2]/365);
    }
    return npv-inputs.buy;
  }

  // convert date sequence in holding time sequence
  var ONE_DAY = 1000 * 60 * 60 * 24;
  holding = (inputs.selldate-inputs.buydate)/ONE_DAY;

  // attach holding time to dividend array + plus check for invalid dividend dates
  for(i=0; i < inputs.dividends; i++){
    if (dividendData[i][0] < inputs.buyDate || dividendData[i][0] > inputs.sellDate){return null;}
    dividendData[i].push((dividendData[i][0] - inputs.buydate)/ONE_DAY);
  }

  // attach final payment to dividend array and make it a payments array
  dividendData.push([inputs.selldate,inputs.sell,holding]);

  // compute irr
  irr = math.roots(NPV,0.1,1500) * 100;

  if(!isFinite(irr)){ return false; }

  /* ******** 4. CONSTRUCT RESULT OBJECT ******** */
  result.id = calcElems.equityreturn.id;
  result._1.irr = _.extend(localElems.irr, {"value": irr});
  result._1.holding = _.extend(localElems.holding, {"value": holding});
  console.log(result._1);
  return result;
};




/** BOERSE-PORTFOLIO function that computes parameters for Markowitz portfolio optimization
 * ARGUMENTS XXX todo: documenation

 * ACTIONS
 *   none
 * RETURNS XXX

 */
exports.portfolio = function(inputs, callback){

  /** ******** 1. INIT AND ASSIGN ******** */
  helpers.messages.clear();
  helpers.errors.clear();
  var result = {};
  result._1 = {};
  result._2 = {};
  var stocks = [], stocksHelper = [];

  var e = [];
  var re = /(stock\d+)/;
  var localElems = calcElems.portfolio.results_1;
  var helper = {};
  result._chart1 = {};


  /** ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
  // push stocks on array
  _.each(inputs, function(val, key){
    if (key.match(re)){ // check whether input is stock
      if(stocksHelper.indexOf(val.split('.')[1]) === -1){  // check for uniqueness
        stocks.push(val.split('.'));
        stocksHelper.push(val.split('.')[1])
      }
    }
  });

  console.log(inputs);

  /** set return frequency */
  var freqInd = inputs.frequency;


  inputs.return = inputs.return / 100;

  result.id = calcElems.portfolio.id;
  result._2.title = 'Parameter Aktien';
  result._2.header = ['Aktie', 'Ticker', 'Mittlere erwartete Rendite <br> (%, annualisiert)', 'Standardabweichung <br> (%, annualisiert)', 'N'];
  result._2.body = [];

  /** ******** 3. DEFINE HELPER FUNCTIONS ******** */

  /** function that computes efficient frontier and charts */
  function efficientFrontier(pfReturn, returns, effOptions){
    var i, cReturn = [], cChart = [];

    for(i = 1; i <= 20; i++){
      cReturn.push(i * pfReturn / 10);
    }

    cReturn.forEach(function(val){
      cChart.push({x: f.basic.round(100 * Math.sqrt(f.equity.efficientPortfolio(val, returns, effOptions).portfolioVariance),4), y: f.basic.round(100 * val,4)});
    });

    // create chart
    result._chart1.id = 'chart1';
    result._chart1.title = 'Effizienzlinie bei gegebener Aktienauswahl';
    result._chart1.label = {x: 'Risiko (Standardabweichung, %)', y: "Erwartete Rendite (%)"};
    result._chart1.type = 'Line';
    result._chart1.data = {series: [cChart]};
    result._chart1.options = {axisX: {onlyInteger: false, low: 0}};
    result._chart1.autoscaleAxisX = true;
  }


  /** construct first result container */
  function firstContainer(pfReturn, efficientPf, stocks){
    /** construct first result container */
    result._1.portfolioReturn  = _.extend(localElems.portfolioreturn, {"value": 100 * pfReturn});
    result._1.portfolioRisk    = _.extend(localElems.portfoliorisk,   {"value": 100 * Math.sqrt(efficientPf.portfolioVariance)});
    result._1.portfolioWeight  = _.extend(localElems.portfolioweightintro, {"value": ''});
    stocks.forEach(function(asset, ind){
      result._1['portfolioWeight' + ind] = {description: asset[1], unit: localElems.portfolioweight.unit, digits: localElems.portfolioweight.digits, importance: localElems.portfolioweight.importance, tooltip: localElems.portfolioweight.tooltip, value: 100 * efficientPf.weights[ind]};
    });
  }


  // todo: remove quandle tinkering
  var qReturn = [];
  var helpReturn = [];

  function constructReturnMatrix(data){

    data.forEach(function(asset){
      asset.data.forEach(function(val){
        helpReturn.push(val[1]);
      });
      qReturn.push(helpReturn);
      helpReturn = [];
    });

    return qReturn;
  }

  // todo: move declarations up

  /** set asset request matrix */

  var frequency = [['weekly','monthly','quarterly','annual'], [52,12,4,1]];


  /** construct options object for efficientPortfolio calculation */
  var effOptions = {freq: frequency[1][freqInd]};



  /** construct quandl request code */
  var reqCode = [];
  stocks.forEach(function(val){
    reqCode.push({source: val[0], table: val[1]});
  });


  /** construct quandl request object */
  var reqObj = {
    column_index: '4',
    transform: 'rdiff',
    collapse: frequency[0][freqInd]
  };


  return quandl.getMultiData(reqCode,reqObj)
      .then(constructReturnMatrix)
      .then(function(data){

        data.forEach(function(returnVector, ind){
          var expReturn = stats.mean(returnVector) * frequency[1][freqInd];
          var stdev = stats.stdev(returnVector, true) * Math.sqrt(frequency[1][freqInd]);

          /** construct second result container */
          result._2.body.push(['TODO', stocks[ind][1], 100 * expReturn, 100 * stdev, returnVector.length]);

          e.push([expReturn]);

        });

        /** compute efficient portfolio */
        helper = f.equity.efficientPortfolio(inputs.return, data, effOptions);

        /** construct first result container */
        firstContainer(inputs.return, helper, stocks);

        /** construct first chart with efficient frontier */
        efficientFrontier(inputs.return, data, effOptions);

        return result;

      });
};





/* ************************ END BOERSE MODULE PUBLIC FUNCTIONS *********************************/


/* ************************ BEGIN BOERSE MODULE HELPERS (NOT EXPOSED) **************************/
/* The cummulative Normal distribution function: */
cumNormalHelper = function cumNormalHelper(x){
  var a1, a2, a3, a4 ,a5, k ;
  a1 = 0.31938153, a2 =-0.356563782, a3 = 1.781477937, a4= -1.821255978 , a5= 1.330274429;
  if(x<0.0)
    return 1-cumNormalHelper(-x);
  else
    k = 1.0 / (1.0 + 0.2316419 * x);
  return 1.0 - Math.exp(-x * x / 2.0)/ Math.sqrt(2*Math.PI) * k
      * (a1 + k * (-0.356563782 + k * (1.781477937 + k * (-1.821255978 + k * 1.330274429)))) ;
};

cumNormalPrimeHelper = function (x){
  return (1/Math.sqrt(2* Math.PI))*Math.exp(-x*x/2);
};

/* ************************ END BOERSE MODULE HELPERS (NOT EXPOSED) *****************************/