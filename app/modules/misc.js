var _ = require('underscore');
var validator = require('validator');
var moment = require('moment');
var helpers = require('./helpers');

var daycount, isLeapYear, isdaGerman, isdaBondBasis, yearFrac;


/* ************************ BEGIN MISC MODULE PUBLIC FUNCTIONS *****************************/

/* DAYCOUNT function that computes interest days for various daycount conventions
 * todo: complete
 * ARGUMENTS
 *
 *
 * ACTIONS
 *   none
 *
 * RETURNS
 *
 */
daycount = function(inputs){


  /** ******** 1. INIT AND ASSIGN ******** */
  var Calc = require('mongoose').model('Calc');
  helpers.errors.clear();
  helpers.messages.clear();
  var actDays, start, end, a30E360interestdays, a30360interestdays, actactDenom;
  var result = {}; result._1 = {};
  var errorMap;
  var oneDay = 24*60*60*1000;


  function compute(data){
    /** ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
    if (inputs.skipvalidation && inputs.skipvalidation === true ){
    } else {
      errorMap = helpers.validate(inputs, data[0].inputs);
      if (errorMap.length !== 0){
        return errorMap;
      }

      if(inputs.enddate < inputs.begindate){
        return [{errorMessage: 'Das Enddatum kann nicht vor dem Anfangsdatum liegen.', errorInput: '', errorPrint: true}];
      }
    }

    /** ******** 3. COMPUTATIONS ******** */
    start = new Date(inputs.begindate);
    end = new Date(inputs.enddate);

    // compute actual days between to dates
    actDays = Math.round(Math.abs((start.getTime() - end.getTime())/(oneDay)));

    a30E360interestdays = isdaGerman(start, end);
    a30360interestdays = isdaBondBasis(start, end);
    actactDenom = yearFrac(start, end,1);

    /** ******** 4. CONSTRUCT RESULT OBJECT ******** */
    result.id = data[0].id;

    result._1.actdays            = _.extend(_.findWhere(data[0].results_1,{name: 'actdays'}),  {"value": actDays});
    //result._1.actdays            = _.extend(localElems.actdays, {"value": actDays});
    result._1.a30E360            = _.extend(_.findWhere(data[0].results_1,{name: 'a30E360'}),  {"value": ""});
    //result._1.a30E360            =  _.extend(localElems.a30E360,  {"value": ""});
    result._1.a30E360interestdays= _.extend(_.findWhere(data[0].results_1,{name: 'a30E360interestdays'}),  {"value": a30E360interestdays});
    //result._1.a30E360interestdays=  _.extend(localElems.a30E360interestdays,  {"value": a30E360interestdays});
    result._1.a30E360factor      = _.extend(_.findWhere(data[0].results_1,{name: 'a30E360factor'}),  {"value": a30E360interestdays / 360});
    //result._1.a30E360factor      =  _.extend(localElems.a30E360factor,  {"value": a30E360interestdays / 360});
    result._1.a30E360factorF      = _.extend(_.findWhere(data[0].results_1,{name: 'a30E360factorF'}),  {"value": a30E360interestdays + ' / 360' });
    //result._1.a30E360factorF     =  _.extend(localElems.a30E360factorF,  {"value": a30E360interestdays + ' / 360' });
    result._1.a30360      = _.extend(_.findWhere(data[0].results_1,{name: 'a30360'}), {"value": ""});
    //result._1.a30360             =  _.extend(localElems.a30360,  {"value": ""});
    result._1.a30360interestdays      = _.extend(_.findWhere(data[0].results_1,{name: 'a30360interestdays'}), {"value": a30360interestdays});
    //result._1.a30360interestdays =  _.extend(localElems.a30360interestdays,  {"value": a30360interestdays});
    result._1.a30360factor      = _.extend(_.findWhere(data[0].results_1,{name: 'a30360factor'}), {"value": a30360interestdays / 360});
    //result._1.a30360factor       =  _.extend(localElems.a30360factor,  {"value": a30360interestdays / 360});
    result._1.a30360factorF      = _.extend(_.findWhere(data[0].results_1,{name: 'a30360factorF'}), {"value": a30360interestdays + ' / 360' });
    //result._1.a30360factorF      =  _.extend(localElems.a30360factorF,  {"value": a30360interestdays + ' / 360' });
    result._1.act360      = _.extend(_.findWhere(data[0].results_1,{name: 'act360'}), {"value": ""});
    //result._1.act360             =  _.extend(localElems.act360,  {"value": ""});
    result._1.act360interestdays      = _.extend(_.findWhere(data[0].results_1,{name: 'act360interestdays'}), {"value": actDays});
    //result._1.act360interestdays =  _.extend(localElems.act360interestdays,  {"value": actDays});
    result._1.act360factor      = _.extend(_.findWhere(data[0].results_1,{name: 'act360factor'}), {"value": actDays / 360});
    //result._1.act360factor       =  _.extend(localElems.act360factor,  {"value": actDays / 360});
    result._1.act360factorF      = _.extend(_.findWhere(data[0].results_1,{name: 'act360factorF'}), {"value": actDays + ' / 360' });
    //result._1.act360factorF      =  _.extend(localElems.act360factorF,  {"value": actDays + ' / 360' });
    result._1.act365      = _.extend(_.findWhere(data[0].results_1,{name: 'act365'}), {"value": ""});
    //result._1.act365             =  _.extend(localElems.act365,  {"value": ""});
    result._1.act365interestdays      = _.extend(_.findWhere(data[0].results_1,{name: 'act365interestdays'}), {"value": actDays});
    //result._1.act365interestdays =  _.extend(localElems.act365interestdays,  {"value": actDays});
    result._1.act365factor      = _.extend(_.findWhere(data[0].results_1,{name: 'act365factor'}), {"value": actDays / 365});
    //result._1.act365factor       =  _.extend(localElems.act365factor,  {"value": actDays / 365});
    result._1.act365factorF      = _.extend(_.findWhere(data[0].results_1,{name: 'act365factorF'}), {"value": actDays + ' / 365' });
    //result._1.act365factorF      =  _.extend(localElems.act365factorF,  {"value": actDays + ' / 365' });
    result._1.actact      = _.extend(_.findWhere(data[0].results_1,{name: 'actact'}), {"value": ""});
    //result._1.actact             =  _.extend(localElems.actact,  {"value": ""});
    result._1.actactinterestdays      = _.extend(_.findWhere(data[0].results_1,{name: 'actactinterestdays'}), {"value": actDays});
    //result._1.actactinterestdays =  _.extend(localElems.actactinterestdays,  {"value": actDays});
    result._1.actactfactor      = _.extend(_.findWhere(data[0].results_1,{name: 'actactfactor'}), {"value": actactDenom});
    //result._1.actactfactor       =  _.extend(localElems.actactfactor,  {"value": actactDenom});
    result._1.actactfactorF      = _.extend(_.findWhere(data[0].results_1,{name: 'actactfactorF'}), {"value": actDays + ' / ' + actDays/actactDenom });
    //result._1.actactfactorF      =  _.extend(localElems.actactfactorF,  {"value": actDays + ' / ' + actDays/actactDenom });


    return result;
  }

  return Calc.findByCalcname('daycount')
      .then(compute)
      .onReject(function(){
        console.log("Database read error");
        helpers.errors.set("Leider ist bei der Berechnung ein Fehler aufgetreten.",undefined , true);
        return helpers.errors.errorMap;
      });



};


// expose functions
module.exports = {
  daycount: daycount
};




/* ************************ END MISC MODULE PUBLIC FUNCTIONS *********************************/

/* ************************ BEGIN MISC MODULE HELPERS (NOT EXPOSED) **************************/

// function that returns true if the supplied year (format XXXX) is a leap year and false otherwise (null if error)
isLeapYear = function (year){
  if (!isFinite(year)){
    return null;
  }

  if (year%100!==0){
    if(year%4===0){
      return true;
    }
  } else {
    if(year%400===0){
      return true;
    }
  }
  return false;
};


// function that computes interest days according to 30E/360 ISDA / German method
// depends on isLeapYear
isdaGerman = function(start, end){

  if(!(start instanceof Date) || !(end instanceof Date)){
    return null;
  }

  var d1, d2, day1, day2, month1, month2, year1, year2;
  day1 = start.getDate();
  day2 = end.getDate();
  month1 = start.getMonth() + 1;
  month2 = end.getMonth() + 1;
  year1 = start.getFullYear();
  year2 = end.getFullYear();

  if (day1 === 31){
    d1 = 30;
  } else if (day1 === 28 && month1 === 2 && !isLeapYear(year1)){
    d1 = 30;
  } else if (day1 === 29 && month1 === 2 && isLeapYear(year1)) {
    d1 = 30;
  } else {
    d1 = day1;
  }

  if (day2 === 31){
    d2 = 30;
  } else {
    d2 = day2;
  }

  return 360 * (year2 - year1) + 30 * (month2 - month1) + d2 - d1;

};

// function that computes interest days according to 30/360 ISDA / Bond basis method
// depends on isLeapYear
isdaBondBasis = function(start, end){

  if(!(start instanceof Date) || !(end instanceof Date)){
    return null;
  }

  var d1, d2, day1, day2, month1, month2, year1, year2;
  day1 = start.getDate();
  day2 = end.getDate();
  month1 = start.getMonth() + 1;
  month2 = end.getMonth() + 1;
  year1 = start.getFullYear();
  year2 = end.getFullYear();

  if (day1 === 31){
    d1 = 30;
  } else {
    d1 = day1;
  }

  if (day2 === 31 && day1 === 30){
    d2 = 30;
  } else if (day2 === 31 && day1 === 31) {
    d2 = 30;
  } else {
    d2 = day2;
  }

  return 360 * (year2 - year1) + 30 * (month2 - month1) + d2 - d1;

};

// function that computes the interest day fraction act/act
// the function mirrors excels yearfrac
yearFrac = function(start_date, end_date, basis) {

  // Initialize parameters
  var basis = (typeof basis === 'undefined') ? 0 : basis;
  var sdate = moment(new Date(start_date));
  var edate = moment(new Date(end_date));

  // Return error if either date is invalid
  if (!sdate.isValid() || !edate.isValid()) return '#VALUE!';

  // Return error if basis is neither 0, 1, 2, 3, or 4
  if ([0,1,2,3,4].indexOf(basis) === -1) return '#NUM!';

  // Return zero if start_date and end_date are the same
  if (sdate === edate) return 0;

  // Swap dates if start_date is later than end_date
  if (sdate.diff(edate) > 0) {
    var edate = moment(new Date(start_date));
    var sdate = moment(new Date(end_date));
  }

  // Lookup years, months, and days
  var syear = sdate.year();
  var smonth = sdate.month();
  var sday = sdate.date();
  var eyear = edate.year();
  var emonth = edate.month();
  var eday = edate.date();

  switch (basis) {
    case 0:
      // US (NASD) 30/360
      // Note: if eday == 31, it stays 31 if sday < 30
      if (sday === 31 && eday === 31) {
        sday = 30;
        eday = 30;
      } else if (sday === 31) {
        sday = 30;
      } else if (sday === 30 && eday === 31) {
        eday = 30;
      } else if (smonth === 1 && emonth === 1 && sdate.daysInMonth() === sday && edate.daysInMonth() === eday) {
        sday = 30;
        eday = 30;
      } else if (smonth === 1 && sdate.daysInMonth() === sday) {
        sday = 30;
      }
      return ((eday + emonth * 30 + eyear * 360) - (sday + smonth * 30 + syear * 360)) / 360;
      break;

    case 1:
      // Actual/actual
      var feb29Between = function(date1, date2) {
        // Requires year2 == (year1 + 1) or year2 == year1
        // Returns TRUE if February 29 is between the two dates (date1 may be February 29), with two possibilities:
        // year1 is a leap year and date1 <= Februay 29 of year1
        // year2 is a leap year and date2 > Februay 29 of year2

        var mar1year1 = moment(new Date(date1.year(), 2, 1));
        if (moment([date1.year()]).isLeapYear() && date1.diff(mar1year1) < 0 && date2.diff(mar1year1) >= 0) {
          return true;
        }
        var mar1year2 = moment(new Date(date2.year(), 2, 1));
        if (moment([date2.year()]).isLeapYear() && date2.diff(mar1year2) >= 0 && date1.diff(mar1year2) < 0) {
          return true;
        }
        return false;
      };
      var ylength = 365;
      if (syear === eyear || ((syear + 1) === eyear) && ((smonth > emonth) || ((smonth === emonth) && (sday >= eday)))) {
        if (syear === eyear && moment([syear]).isLeapYear()) {
          ylength = 366;
        } else if (feb29Between(sdate, edate) || (emonth === 1 && eday === 29)) {
          ylength = 366;
        }
        return edate.diff(sdate, 'days') / ylength;
      } else {
        var years = (eyear - syear) + 1;
        var days = moment(new Date(eyear + 1, 0, 1)).diff(moment(new Date(syear, 0, 1)), 'days');
        var average = days / years;
        return edate.diff(sdate, 'days') / average;
      }
      break;

    case 2:
      // Actual/360
      return edate.diff(sdate, 'days') / 360;
      break;

    case 3:
      // Actual/365
      return edate.diff(sdate, 'days') / 365;
      break;

    case 4:
      // European 30/360
      if (sday === 31) sday = 30;
      if (eday === 31) eday = 30;
      // Remarkably, do NOT change February 28 or February 29 at ALL
      return ((eday + emonth * 30 + eyear * 360) - (sday + smonth * 30 + syear * 360)) / 360;
      break;
  }
}

/* ************************ END MISC MODULE HELPERS (NOT EXPOSED) *****************************/