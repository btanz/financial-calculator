var _ = require('underscore');
var validator = require('validator');
var helpers = require('./helpers');
var math = require('./math');
var misc = require('./misc');
var f = require('../../lib/finance');


exports.annuity = function(inputs){
  // todo: proper testing and debugging for this function


  /** ******** 1. INIT AND ASSIGN ******** */
  var Calc = require('mongoose').model('Calc');
  helpers.messages.clear();
  helpers.errors.clear();
  var helper = {};
  var result = {}; result._1 = {}; result._2 = {};
  var errorMap;
  var selectMap = ['repay','residual','term','rate','principal'];
  var paymentfreeinterest = 0;
  var repaymentFreeNPVind = 0;
  var cash = [], cashAnnual = [], sum = [], cashT;
  var remaining;
  var i, j = 0, oddPeriodFlag = false, year;


  function compute (data){
    /** ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */

    /** read out term choices and remove choice inputs */
    helper.termperiods = 1;
    helper.repaymentfreetermperiods = 1;

    /** drop elements that are to be computed from inputs and expectedinputs object */
    delete inputs[selectMap[inputs.select]];
    data[0].inputs.splice(_.findIndex(data[0].inputs, {name: selectMap[inputs.select]}),1);

    /** run validation method */
    errorMap = helpers.validate(inputs, data[0].inputs);
    if (errorMap.length !== 0){
      return errorMap;
    }

    /** convert terms with subannual choices to month */
    helper.term              = inputs.term              * 12 / helper.termperiods;
    inputs.term              = inputs.term              * 12 / helper.termperiods;
    inputs.repaymentfreeterm = inputs.repaymentfreeterm * 12 / helper.repaymentfreetermperiods;

    /** convert terms that are not period multiples to period multiples and convert back to years*/
    inputs.term              = (Math.ceil( inputs.term              / (12 / inputs.repayfreq)) * (12 / inputs.repayfreq)) / 12;
    inputs.repaymentfreeterm = (Math.ceil( inputs.repaymentfreeterm )) / 12;

    /** convert percentage values to decimals */
    inputs.disagioamount = inputs.disagioamount / 100;
    inputs.rate = inputs.rate / 100;



    /** ******** 3. COMPUTATIONS ******** */
    if(inputs.select === 1) { /** selection is residual */
      /** compute schedule with Term, Paymentfrequency, Annuity, Principal and Interest given; RESIDUAL OPEN */
      dyn = f.annuity.schedule.call({
        mode: 1,
        annualvals: true,
        finalvals: true,
        disagio: inputs.disagio,
        disagioamount: inputs.disagioamount,
        fees: inputs.fees,
        feeamount: inputs.feeamount,
        feeupfront: (inputs.feetype === 3),
        principal: inputs.principal,
        term: inputs.term,
        repayfreq: inputs.repayfreq,
        repay: inputs.repay,
        repaymentfree: inputs.repaymentfree,
        repaymentfreeterm: inputs.repaymentfreeterm,
        repaymentfreetype: inputs.repaymentfreetype,
        specialrepay: null,
        interest: inputs.rate
      });
    } else if (inputs.select === 2) {
      /** selection is term */
      dyn = f.annuity.schedule.call({
        mode: 2,
        annualvals: true,
        finalvals: true,
        disagio: inputs.disagio,
        disagioamount: inputs.disagioamount,
        fees: inputs.fees,
        feeamount: inputs.feeamount,
        feeupfront: (inputs.feetype === 3),
        principal: inputs.principal,
        residual: inputs.residual,
        repayfreq: inputs.repayfreq,
        repay: inputs.repay,
        repaymentfree: inputs.repaymentfree,
        repaymentfreeterm: inputs.repaymentfreeterm,
        repaymentfreetype: inputs.repaymentfreetype,
        specialrepay: null,
        interest: inputs.rate
      });
    }


    /** assign residual if not given */
    inputs.residual = inputs.residual || dyn.residual;

    /** assign term if not given */
    inputs.term = inputs.term || dyn.term / 12;



    helper.totalrepay     = dyn.totalrepay;
    helper.totalinterest  = dyn.totalinterest;
    helper.totalreduction = dyn.totalreduction;
    helper.totalrepaymentfreeinterest = dyn.totalrepaymentfreeinterest;
    helper.irr            = dyn.irr;


    /** re-convert */
    inputs.rate            *= 100;


    /** ******** 4. CONSTRUCT RESULT OBJECT ******** */
    result.id = data[0].id;

    /**
     * 4.A FIRST RESULT CONTAINER
     */
    result._1.value           = _.extend(_.findWhere(data[0].results_1,{name: selectMap[inputs.select]}), {"value": inputs[selectMap[inputs.select]]});
    result._1.totalrepay      = _.extend(_.findWhere(data[0].results_1,{name: 'totalrepay'}),  {"value": helper.totalrepay});
    result._1.totalreduction  = _.extend(_.findWhere(data[0].results_1,{name: 'totalreduction'}),  {"value": helper.totalreduction});
    result._1.totalinterest   = _.extend(_.findWhere(data[0].results_1,{name: 'totalinterest'}),  {"value": helper.totalinterest});
    (inputs.repaymentfree && inputs.repaymentfreetype === 3) ? result._1.repaymentfreetotal     = _.extend(_.findWhere(data[0].results_1,{name: 'repaymentfreetotal'}),  {"value": helper.totalrepaymentfreeinterest}) : null;
    (inputs.disagio) ? result._1.disagio = _.extend(_.findWhere(data[0].results_1,{name: 'disagio'}),  {"value": inputs.principal * inputs.disagioamount})  : null;
    (inputs.fees && inputs.feetype === 3) ? result._1.fees     = _.extend(_.findWhere(data[0].results_1,{name: 'fees'}),  {"value": inputs.feeamount}) : null;
    result._1.irr             = _.extend(_.findWhere(data[0].results_1,{name: 'irr'}),   {"value": helper.irr * 100});



    /**
     * 4.B SECOND RESULT CONTAINER
     */
    result._2.title = 'Tilgungsplan';
    result._2.header = ['Monat', 'Restschuld <br> Beginn', 'Rate', 'Zins- & <br> Gebührenanteil', 'Tilgungsanteil', 'Restschuld <br> Ende'];
    result._2.body = dyn.schedule;

    /** ******** 5. ATTACH INFORMATION MESSAGES ******** */


    result.messages = helpers.messages.messageMap;

    return result;



  }

  return Calc.findByCalcname('annuity')
      .then(compute)
      .onReject(function(){
        console.log("Database read error");
        helpers.errors.set("Leider ist bei der Berechnung ein Fehler aufgetreten.",undefined , true);
        return helpers.errors.errorMap;
      });



};









exports.dispo = function(inputs){


  /** ******** 1. INIT AND ASSIGN ******** */
  var Calc = require('mongoose').model('Calc');
  var result = {}; result._1 = {};
  var amount, interest, factor, daycount, range;
  var errorMap;

  function compute(data){
    /** ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */

    // run validations
    errorMap = helpers.validate(inputs, data[0].inputs);
    if (errorMap.length !== 0){
      return errorMap;
    }

    // custom validation
    if (inputs.periodchoice === "dates" && inputs.enddate === ""){
      return [{errorMessage: 'Das Enddatum muss ausgefüllt sein.', errorInput: '', errorPrint: true}];
    } else if (inputs.periodchoice === "dates" && inputs.startdate === ""){
      return [{errorMessage: 'Das Anfangsdatum muss ausgefüllt sein.', errorInput: '', errorPrint: true}];
    }else if(inputs.periodchoice === "dates" && inputs.enddate < inputs.startdate){
      return [{errorMessage: 'Das Enddatum kann nicht vor dem Anfangsdatum liegen.', errorInput: '', errorPrint: true}];
    }

    /** ******** 3. COMPUTATIONS ******** */
    factor = Math.min(inputs.principal, inputs.limit) * (inputs.dispointerest / 100) + Math.max(0,inputs.principal - inputs.limit) * (inputs.otherinterest / 100);


    if (inputs.periodchoice === "days"){
      switch(inputs.daycount){
        case "a30E360":
          amount = factor * inputs.days / 360;
          interest = (amount / inputs.principal) * (360 / inputs.days) * 100;
          return resultObj(amount, interest);
          break;
        case "a30360":
          amount = factor * inputs.days / 360;
          interest = (amount / inputs.principal) * (360 / inputs.days) * 100;
          return resultObj(amount, interest);
          break;
        case "act360":
          amount = factor * inputs.days / 360;
          interest = (amount / inputs.principal) * (360 / inputs.days) * 100;
          return resultObj(amount, interest);
          break;
        case "act365":
          amount = factor * inputs.days / 365;
          interest = (amount / inputs.principal) * (365 / inputs.days) * 100;
          return resultObj(amount, interest);
          break;
        case "actact":
          amount = factor * inputs.days / 365.25;
          interest = (amount / inputs.principal) * (365.25 / inputs.days) * 100;
          return resultObj(amount, interest);
          break;
      }
    } else if (inputs.periodchoice === "dates"){

      range = {"begindate": inputs.startdate, "enddate": inputs.enddate, "skipvalidation": true};
      daycount = misc.daycount(range);

      switch(inputs.daycount){
        case "a30E360":
          return daycount.then(function(daycount){
            amount = factor * daycount._1.a30E360factor.value;
            interest = (amount / inputs.principal) * (360 / daycount._1.a30E360interestdays.value) * 100;
            return resultObj(amount, interest);
          });
          break;
        case "a30360":
          return daycount.then(function(daycount) {
            amount = factor * daycount._1.a30360factor.value;
            interest = (amount / inputs.principal) * (360 / daycount._1.a30360interestdays.value) * 100;
            return resultObj(amount, interest);
          });
          break;
        case "act360":
          return daycount.then(function(daycount) {
            amount = factor * daycount._1.act360factor.value;
            interest = (amount / inputs.principal) * (360 / daycount._1.act360interestdays.value) * 100;
            return resultObj(amount, interest);
          });
          break;
        case "act365":
          return daycount.then(function(daycount) {
            amount = factor * daycount._1.act365factor.value;
            interest = (amount / inputs.principal) * (365 / daycount._1.act365interestdays.value) * 100;
            return resultObj(amount, interest);
          });
          break;
        case "actact":
          return daycount.then(function(daycount) {
            amount = factor * daycount._1.actactfactor.value;
            interest = (amount / inputs.principal) * (1 / daycount._1.actactfactor.value) * 100;
            return resultObj(amount, interest);
          });
          break;
      }
    }


    /** ******** 4. CONSTRUCT RESULT OBJECT ******** */
    function resultObj(amount, interest){
      result.id = data[0].id;
      result._1.interestamount  = _.extend(_.findWhere(data[0].results_1,{name: 'interestamount'}), {"value": amount});
      result._1.averageinterest  = _.extend(_.findWhere(data[0].results_1,{name: 'averageinterest'}), {"value": interest});
      return result;
    }
  }

  return Calc.findByCalcname('dispo')
      .then(compute)
      .onReject(function(){
        console.log("Database read error");
        helpers.errors.set("Leider ist bei der Berechnung ein Fehler aufgetreten.",undefined , true);
        return helpers.errors.errorMap;
      });


};





/** DEBT-REPAYSURROGATE function that checks whether it is more attractive to safe and pay back
 * a loan in full at the end of the term or pay back annuities
 * ARGUMENTS XXX todo: documenation

 * ACTIONS
 *   none
 * RETURNS XXX

 */
exports.repaysurrogat = function(inputs){

  /** ******** 1. INIT AND ASSIGN ******** */
  var Calc = require('mongoose').model('Calc');
  helpers.messages.clear();
  helpers.errors.clear();
  var result = {}; result._1 = {}; result._2 = {}; helper = {};
  var i;
  var errorMap;
  var dyn = []; dyn[0] = []; dyn[1] = []; dyn[2] = []; dyn[3] = []; dyn[4] = []; dyn[5] = []; dyn[6] = []; dyn[7] = []; dyn[8] = []; dyn[9] = [];
  var dynT, dynAnnual, dynAnnualT;

  function compute(data){
    /** ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
    // drop elems that are to be computed
    if(inputs.selection === "2"){
      delete inputs['term'];
      data[0].inputs.splice(_.findIndex(data[0].inputs, {name: 'term'}),1);
      //delete _expectedInputs['term'];
      delete inputs['repay'];
      data[0].inputs.splice(_.findIndex(data[0].inputs, {name: 'repay'}),1);
      //delete _expectedInputs['repay'];
    } else if(inputs.selection === "3") {
      delete inputs['initrepay'];
      data[0].inputs.splice(_.findIndex(data[0].inputs, {name: 'initrepay'}),1);
      //delete _expectedInputs['initrepay'];
      delete inputs['repay'];
      data[0].inputs.splice(_.findIndex(data[0].inputs, {name: 'repay'}),1);
      //delete _expectedInputs['repay'];
    } else if(inputs.selection === "4") {
      delete inputs['initrepay'];
      data[0].inputs.splice(_.findIndex(data[0].inputs, {name: 'initrepay'}),1);
      //delete _expectedInputs['initrepay'];
      delete inputs['term'];
      data[0].inputs.splice(_.findIndex(data[0].inputs, {name: 'term'}),1);
      //delete _expectedInputs['term'];
    } else {  // sthg wrong
      return;
    }



    if(inputs.taxes === 'false'){
      delete inputs['taxrate'];
      delete inputs['taxfree'];
      delete inputs['taxtime'];
      data[0].inputs.splice(_.findIndex(data[0].inputs, {name: 'taxrate'}),1);
      //delete _expectedInputs['taxrate'];
      data[0].inputs.splice(_.findIndex(data[0].inputs, {name: 'taxfree'}),1);
      //delete _expectedInputs['taxfree'];
      data[0].inputs.splice(_.findIndex(data[0].inputs, {name: 'taxtime'}),1);
      //delete _expectedInputs['taxtime'];
    }

    errorMap = helpers.validate(inputs, data[0].inputs);
    if (errorMap.length !== 0){
      return errorMap;
    }

    inputs.debtinterest = inputs.debtinterest / 100;
    inputs.initrepay = inputs.initrepay / 100;
    inputs.saveinterest = inputs.saveinterest / 100;
    inputs.taxrate = inputs.taxrate / 100;

    var taxend = (inputs.taxtime === 'true') ? true : false;


    /** ******** 3. COMPUTATIONS ******** */
    /*
     * 3.A STATIC CALCULATIONS
     */
    if (inputs.selection === 4){
      helper.term = f.annuity.annuityTerm(inputs.principal, inputs.repay, inputs.debtinterest, inputs.interval);
      if(isNaN(helper.term)){
        helpers.errors.set("Realistische Ergebnisse können nicht berechnet werden, da die Darlehenszahlungen zu gering sind, um das Darlehen zu tilgen. Erhöhen Sie die Darlehensrate und/oder das Zahlungsintervall bzw. verringern Sie den Darlehensbetrag.", undefined , true);
        return helpers.errors.errorMap;
      }
      helper.term = Math.round(helper.term * 100) / 100;
      helper.adjustedterm = f.basic.adjustTermToHigherFullPeriod(helper.term, inputs.interval);
      helper.annuity = inputs.repay;
      helper.totalcost = helper.adjustedterm * inputs.interval * helper.annuity;
      helper.debtinterest = inputs.principal * inputs.debtinterest * helper.adjustedterm;
      helper.repaysubstitute = helper.totalcost - helper.debtinterest;
      helper.repayrate = (inputs.interval * helper.annuity - inputs.principal * inputs.debtinterest) / inputs.principal;
      if(helper.term !== helper.adjustedterm){  // send message if rate was adjusted
        helpers.messages.set("Hinweis: Die errechnete Darlehenslaufzeit von " + helper.term + " ist kein Vielfaches des Zahlungsintervalls. Die Darlehenslaufzeit wurde entsprechend auf das nächsthöhere Vielfache eines Zahlungsintervalls angepasst. Der angepasste Wert beträgt " + Math.round(helper.adjustedterm * 100) / 100 + ".",2);
      }
    } else if (inputs.selection === 3){
      helper.adjustedterm = f.basic.adjustTermToHigherFullPeriod(inputs.term, inputs.interval);
      helper.annuity = Math.round(100 * f.annuity.annuity(inputs.principal, inputs.debtinterest, inputs.interval, helper.adjustedterm)) / 100;
      helper.totalcost = helper.adjustedterm * inputs.interval * helper.annuity;
      helper.debtinterest = inputs.principal * inputs.debtinterest * helper.adjustedterm;
      helper.repaysubstitute = helper.totalcost - helper.debtinterest;
      helper.repayrate = (inputs.interval * helper.annuity - inputs.principal * inputs.debtinterest) / inputs.principal;
      if(inputs.term !== helper.adjustedterm){  // send message if rate was adjusted
        helpers.messages.set("Hinweis: Die eingegebene Darlehenslaufzeit von " + inputs.term + " ist kein Vielfaches des Zahlungsintervalls. Die Darlehenslaufzeit wurde entsprechend auf das nächsthöhere Vielfache eines Zahlungsintervalls angepasst. Der angepasste Wert beträgt " + Math.round(helper.adjustedterm * 100) / 100 + ".",2);
      }

    } else if (inputs.selection === 2){
      helper.annuity = Math.round(100 * ((inputs.initrepay * inputs.principal + inputs.principal * inputs.debtinterest) / inputs.interval)) / 100;
      helper.term = f.annuity.annuityTerm(inputs.principal, helper.annuity, inputs.debtinterest, inputs.interval);
      if(isNaN(helper.term)){
        helpers.errors.set("Realistische Ergebnisse können nicht berechnet werden, da der Tilgungssatz zu gering ist, um das Darlehen zu tilgen. Bitte erhöhen Sie den Tilgungssatz.", undefined , true);
        return helpers.errors.errorMap;
      }
      helper.term = Math.round(helper.term * 100) / 100;
      helper.adjustedterm = f.basic.adjustTermToHigherFullPeriod(helper.term, inputs.interval);
      helper.totalcost = helper.adjustedterm * inputs.interval * helper.annuity;
      helper.debtinterest = inputs.principal * inputs.debtinterest * helper.adjustedterm;
      helper.repaysubstitute = helper.totalcost - helper.debtinterest;
      helper.repayrate = (inputs.interval * helper.annuity - inputs.principal * inputs.debtinterest) / inputs.principal;
      if(helper.term !== helper.adjustedterm){  // send message if rate was adjusted
        helpers.messages.set("Hinweis: Die errechnete Darlehenslaufzeit von " + helper.term + " ist kein Vielfaches des Zahlungsintervalls. Die Darlehenslaufzeit wurde entsprechend auf das nächsthöhere Vielfache eines Zahlungsintervalls angepasst. Der angepasste Wert beträgt " + Math.round(helper.adjustedterm * 100) / 100 + ".",2);
      }

    } else { //sthg wrong
      return
    }


    /*
     * 3.B DYNAMIC CALCULATIONS
     */
    var period = 1, year = 1;
    var escape = false;
    var accum = [0,0,0,0,0,0,0,0,0,0];
    for (i = 1; period <= helper.adjustedterm * inputs.interval; i++){
      if (escape){
        dyn[0][i-1] = year;
        dyn[1][i-1] = accum[1];
        dyn[2][i-1] = accum[2];
        dyn[3][i-1] = accum[3];
        dyn[4][i-1] = accum[4];
        if(taxend) {
          dyn[9][i-1] = dyn[9][i-2];
          dyn[5][i-1] = dyn[5][i-2] + dyn[4][i-1];
          dyn[6][i-1] = - inputs.principal + dyn[5][i-1];
        } else {
          dyn[9][i-1] = (dyn[4][i - 1] > inputs.taxfree) ? -(dyn[4][i - 1] - inputs.taxfree) * inputs.taxrate : 0;
          dyn[5][i-1] = dyn[5][i-2] + dyn[4][i-1] + dyn[9][i-1];
          dyn[6][i-1] = - inputs.principal + dyn[5][i-1];
        }
        dyn[7][i-1] = true;   // annual val indicator
        dyn[8][i-1] = ". Jahr";

        escape = false; year += 1;
        accum[0] = 0; accum[1] = 0; accum[2] = 0; accum[3] = 0; accum[4] = 0; accum[5] = 0;
      } else {
        dyn[0][i-1] = period * (12/inputs.interval);        // period
        dyn[1][i-1] = inputs.principal * (inputs.debtinterest / inputs.interval);   // interest payment
        dyn[2][i-1] = helper.annuity - dyn[1][i-1]   // repay surrogat
        dyn[3][i-1] = helper.annuity;
        //dyn[4][i-1] = (period-1) * dyn[2][i-1] * inputs.saveinterest / inputs.interval;      // interest received
        (i === 1) ? dyn[5][i-1] = dyn[2][i-1] : dyn[5][i-1] = dyn[5][i-2] + dyn[2][i-1];
        (i === 1) ? dyn[4][i-1] = 0 : dyn[4][i-1] = dyn[5][i-2] * inputs.saveinterest / inputs.interval;
        dyn[6][i-1] = -inputs.principal + dyn[5][i-1];

        // accumulate periodical vals
        accum[1] += dyn[1][i-1];
        accum[2] += dyn[2][i-1];
        accum[3] += dyn[3][i-1];
        accum[4] += dyn[4][i-1];
        accum[9] += dyn[4][i-1];
        if(taxend){
          dyn[9][i-1] = - Math.max(0,(accum[9]-inputs.taxfree) * inputs.taxrate);
        } else {
          dyn[9][i-1] = (accum[4] > inputs.taxfree) ? -Math.min( dyn[4][i-1],accum[4] - inputs.taxfree) * inputs.taxrate : 0;
        }

        if(period % inputs.interval === 0){
          escape = true;
        }
        period += 1;
      }
    }

    // attach final year
    dyn[0][i-1] = year;
    dyn[1][i-1] = accum[1];
    dyn[2][i-1] = accum[2];
    dyn[3][i-1] = accum[3];
    dyn[4][i-1] = accum[4];
    if(taxend) {
      dyn[9][i-1] = dyn[9][i-2];
      dyn[5][i-1] = dyn[5][i-2] + dyn[4][i-1];
      dyn[6][i-1] = - inputs.principal + dyn[5][i-1];
    } else {
      dyn[9][i-1] = (dyn[4][i - 1] > inputs.taxfree) ? -(dyn[4][i - 1] - inputs.taxfree) * inputs.taxrate : 0;
      dyn[5][i-1] = dyn[5][i-2] + dyn[4][i-1] + dyn[9][i-1];
      dyn[6][i-1] = - inputs.principal + dyn[5][i-1];
    }
    dyn[7][i-1] = true;   // annual val indicator
    dyn[8][i-1] = ". Jahr";

    // transpose dyn
    dynT = dyn[0].map(function(col,i){
      return dyn.map(function(row){
        return row[i];
      })
    });

    // compute array with annual vals
    dynAnnual = _.filter(dynT, function(subarray){ return subarray[7]===true});

    // transpose dynAnnual
    dynAnnualT = dynAnnual[0].map(function(col,i){
      return dynAnnual.map(function(row){
        return row[i];
      })
    });

    helper.interestgain = _.reduce(dynAnnualT[4], helpers.add, 0);
    if(taxend) {
      helper.terminalvalue = dyn[5][i-2] + accum[4];
      helper.taxdeduct = dyn[9][i-1];
    } else {
      helper.terminalvalue = dyn[5][i-2] + accum[4] + dyn[9][i-1];
      helper.taxdeduct = _.reduce(dynAnnualT[9], helpers.add, 0);
    }
    helper.pnl = -inputs.principal + dyn[5][i-2] + accum[4] + dyn[9][i-1];


    // attach final sums
    dynT.push(['Gesamt', _.reduce(dynAnnualT[1], helpers.add, 0), _.reduce(dynAnnualT[2], helpers.add, 0), _.reduce(dynAnnualT[3], helpers.add, 0), helper.interestgain, (taxend) ? helper.terminalvalue + helper.taxdeduct :  helper.terminalvalue , helper.pnl ,true, , helper.taxdeduct]);




    /** ******** 4. CONSTRUCT RESULT DATA OBJECT ******** */
    result.id = data[0].id;
    /*
     6.A FIRST RESULT CONTAINER
     */
    if(helper.pnl > 0){
      result._1.pnlcategory  = _.extend(_.findWhere(data[0].results_1,{name: 'pnlcategory'}),  {"value": "JA"});
      //result._1.pnlcategory  = _.extend(localElems['pnlcategory'],  {"value": "JA"});
      result._1.pnl          = _.extend(_.findWhere(data[0].results_1,{name: 'pnlpos'}),  {"value": helper.pnl});
      //result._1.pnl          = _.extend(localElems['pnlpos'],       {"value": helper.pnl});
    } else {
      result._1.pnlcategory  = _.extend(_.findWhere(data[0].results_1,{name: 'pnlcategory'}),  {"value": "NEIN"});
      //result._1.pnlcategory  = _.extend(localElems['pnlcategory'],  {"value": "NEIN"});
      result._1.pnl          = _.extend(_.findWhere(data[0].results_1,{name: 'pnlneg'}),  {"value": helper.pnl});
      //result._1.pnl          = _.extend(localElems['pnlneg'],       {"value": helper.pnl});
    }
    result._1.totalcost      = _.extend(_.findWhere(data[0].results_1,{name: 'totalcost'}),   {"value": helper.totalcost});
    //result._1.totalcost      = _.extend(localElems['totalcost'],      {"value": helper.totalcost});
    result._1.debtinterest   = _.extend(_.findWhere(data[0].results_1,{name: 'debtinterest'}),  {"value": helper.debtinterest});
    //result._1.debtinterest   = _.extend(localElems['debtinterest'],   {"value": helper.debtinterest});
    result._1.repaysubstitute= _.extend(_.findWhere(data[0].results_1,{name: 'repaysubstitute'}),  {"value": helper.repaysubstitute});
    //result._1.repaysubstitute= _.extend(localElems['repaysubstitute'],{"value": helper.repaysubstitute});
    result._1.annuity        = _.extend(_.findWhere(data[0].results_1,{name: 'annuity'}),  {"value": helper.annuity});
    //result._1.annuity        = _.extend(localElems['annuity'],        {"value": helper.annuity});
    result._1.repayrate        = _.extend(_.findWhere(data[0].results_1,{name: 'repayrate'}),  {"value": helper.repayrate * 100});
    //result._1.repayrate      = _.extend(localElems['repayrate'],      {"value": helper.repayrate * 100});
    result._1.term        = _.extend(_.findWhere(data[0].results_1,{name: 'term'}),  {"value": helper.adjustedterm});
    //result._1.term           = _.extend(localElems['term'],           {"value": helper.adjustedterm});
    result._1.terminalvalue        = _.extend(_.findWhere(data[0].results_1,{name: 'terminalvalue'}),  {"value": helper.terminalvalue});
    //result._1.terminalvalue  = _.extend(localElems['terminalvalue'],  {"value": helper.terminalvalue});
    result._1.interestgain        = _.extend(_.findWhere(data[0].results_1,{name: 'interestgain'}),  {"value": helper.interestgain});
    //result._1.interestgain   = _.extend(localElems['interestgain'],   {"value": helper.interestgain});
    if (inputs.taxes === 'true'){
      result._1.taxdeduct        = _.extend(_.findWhere(data[0].results_1,{name: 'taxdeduct'}), {"value": helper.taxdeduct});
      //result._1.taxdeduct    = _.extend(localElems['taxdeduct'],      {"value": helper.taxdeduct});
      if(taxend){
        result._1.terminalwotax        = _.extend(_.findWhere(data[0].results_1,{name: 'terminalwotax'}), {"value": helper.terminalvalue + helper.taxdeduct});
        //result._1.terminalwotax    = _.extend(localElems['terminalwotax'],      {"value": helper.terminalvalue + helper.taxdeduct});
      }
    }

    /*
     6.B SECOND RESULT CONTAINER
     */
    result._2.title = 'Wertentwicklung';

    result._2.header = ['Monat', 'Zins- <br> aufwand', 'Tilgungs- <br> surrogat', 'Gesamt- <br> rate','Zins- <br> ertrag','Anlage- <br> kapital','Saldo',,,'Steuer- <br> abzug'];
    result._2.body = dynT;
    if (inputs.taxes === 'true'){
      result._2.tax = true;
      if(taxend){
        result._2.taxend = true;
      } else {
        result._2.taxan = true;
      }
    } else {
      result._2.tax = false;
    }

    // attach messages
    result.messages = helpers.messages.messageMap;

    return result;
  }

  return Calc.findByCalcname('repaysurrogat')
      .then(compute)
      .onReject(function(){
        console.log("Database read error");
        helpers.errors.set("Leider ist bei der Berechnung ein Fehler aufgetreten.",undefined , true);
        return helpers.errors.errorMap;
      });

};



