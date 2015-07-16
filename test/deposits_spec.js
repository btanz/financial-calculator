var assert = require("assert");
var _ = require("underscore");
var deposits = require("../modules/deposits");

var ROUND_PRECISION = 100;   // 1/100 rounding precision


describe("Deposits calculators are correct", function() {

  describe("Deposits-timedeposit correct", function() {
    var data = [],
        expectations = [];
    before(function () {

      data[0] = {calcselect: '2', principal: '12000',     interest: '4.5',  term: '27',   interestgain: '',        selection: 'false', taxes: 'false', taxrate: '26.375', taxfree: '801',    taxtime: 'false'};
      data[1] = {calcselect: '3', principal: '876342.03', interest: '7.86', term: '66.9', interestgain: '8911.46', selection: 'false', taxes: 'true',  taxrate: '9.2',    taxfree: '757.04', taxtime: 'true'};
      data[2] = {calcselect: '3', principal: '208162.85', interest: '2.53', term: '76.3', interestgain: '132.17',  selection: 'true',  taxes: 'true',  taxrate: '33.8',   taxfree: '527.08', taxtime: 'true'};
      data[3] = {calcselect: '3', principal: '467248.84', interest: '0.2',  term: '43',   interestgain: '2028',    selection: 'false', taxes: 'true',  taxrate: '34.72',  taxfree: '81.31',  taxtime: 'false'};
      data[4] = {calcselect: '3', principal: '940209.04', interest: '1.45', term: '39.71',interestgain: '8101.51', selection: 'false', taxes: 'true',  taxrate: '21.49',  taxfree: '386.48', taxtime: 'false'};
      data[5] = {calcselect: '2', principal: '8810.78',   interest: '7.31', term: '39.65',interestgain: '4411.9',  selection: 'false', taxes: 'true',  taxrate: '29.01',  taxfree: '821.76', taxtime: 'false'};
      data[6] = {calcselect: '5', principal: '486439.84', interest: '5.19', term: '61',   interestgain: '4940.24', selection: 'false', taxes: 'false', taxrate: '39.6',   taxfree: '818.12', taxtime: 'true'};
      data[7] = {calcselect: '4', principal: '23127.4',   interest: '1.2',  term: '71.9', interestgain: '2727.89', selection: 'false', taxes: 'true',  taxrate: '5.53',   taxfree: '99.75',  taxtime: 'false'};
      data[8] = {calcselect: '4', principal: '329484',    interest: '8.5',  term: '31.99',interestgain: '5097.52', selection: 'true',  taxes: 'true',  taxrate: '7.96',   taxfree: '820.39', taxtime: 'false'};
      data[9] = {calcselect: '2', principal: '965501.03', interest: '6.57', term: '13.61',interestgain: '3156.68', selection: 'true',  taxes: 'true',  taxrate: '31.18',  taxfree: '895.38', taxtime: 'false'};
      data[10]= {calcselect: '3', principal: '106580.95', interest: '5.84', term: '64.03',interestgain: '21.57',   selection: 'true',  taxes: 'false', taxrate: '35.14',  taxfree: '137.95', taxtime: 'true'};
      data[11]= {calcselect: '4', principal: '483295.49', interest: '9.32', term: '62.24',interestgain: '8884.71', selection: 'false', taxes: 'true',  taxrate: '10.02',  taxfree: '280.51', taxtime: 'true'};
      data[12]= {calcselect: '3', principal: '715315.78', interest: '1.12', term: '16',   interestgain: '8965.17', selection: 'false', taxes: 'true',  taxrate: '35.42',  taxfree: '893.49', taxtime: 'false'};
      data[13]= {calcselect: '2', principal: '661405.65', interest: '0.24', term: '31',   interestgain: '7465.3',  selection: 'false', taxes: 'true',  taxrate: '2.74',   taxfree: '191.9',  taxtime: 'false'};
      data[14]= {calcselect: '2', principal: '589639.31', interest: '5.51', term: '96.6', interestgain: '9508.27', selection: 'false', taxes: 'false', taxrate: '13.73',  taxfree: '790.55', taxtime: 'true'};
      data[15]= {calcselect: '4', principal: '854043.15', interest: '3.95', term: '91.17',interestgain: '6397.89', selection: 'true',  taxes: 'true',  taxrate: '2.17',   taxfree: '4.95',   taxtime: 'true'};
      data[16]= {calcselect: '2', principal: '30237.08',  interest: '3.64', term: '7',    interestgain: '8835.53', selection: 'true',  taxes: 'true',  taxrate: '22.02',  taxfree: '336.74', taxtime: 'false'};
      data[17]= {calcselect: '2', principal: '813562.09', interest: '3.99', term: '45.06',interestgain: '4511.34', selection: 'false', taxes: 'true',  taxrate: '25.24',  taxfree: '965.29', taxtime: 'true'};
      data[18]= {calcselect: '4', principal: '384443.84', interest: '0.17', term: '41',   interestgain: '4980.61', selection: 'false', taxes: 'false', taxrate: '1.73',   taxfree: '718.48', taxtime: 'true'};
      data[19]= {calcselect: '5', principal: '878806.41', interest: '4.14', term: '83',   interestgain: '1316.92', selection: 'true',  taxes: 'true',  taxrate: '13.04',  taxfree: '821.62', taxtime: 'false'};


      expectations[0] = {value: 1215};  // value is interestgain
      expectations[1] = {interestgainwotax: 9737.68, value: 22189.08, taxes: -826.22};
      expectations[2] = {interestgainwotax: 132.17, value: 759.69, taxes: 0};
      expectations[3] = {interestgainwotax: 2933.63, value: 409344.36, taxes: -905.63};
      expectations[4] = {interestgainwotax: 9895.93, value: 204743.30, taxes: -1794.42};
      expectations[5] = {value: 2146.89, interestgainwotax: 2146.89, taxes: 0};
      expectations[6] = {value: 2.35};
      expectations[7] = {interestgainwotax: 2852.54, value: 2.06, taxes: -124.65};
      expectations[8] = {interestgainwotax: 5325.52, value: 0.6, taxes: -228.00};
      expectations[9] = {value: 51820.13, interestgainwotax: 74486.73, taxes: -22666.6};
      expectations[10]= {value: 59.84};
      expectations[11]= {interestgainwotax: 9842.86, value: 0.39, taxes: -958.15};
      expectations[12]= {interestgainwotax: 12902.17, value: 863984.63, taxes: -3937};
      expectations[13]= {value: 4004.13, interestgainwotax: 4100.72, taxes: -96.59};
      expectations[14]= {value: 262620.44};
      expectations[15]= {interestgainwotax: 6539.69, value: 0.1, taxes: -141.80};
      expectations[16]= {value: 574.81, interestgainwotax: 642.03, taxes: -67.23};
      expectations[17]= {value: 93270.74, interestgainwotax: 124434.32, taxes: -31163.58};
      expectations[18]= {value: 0.38};
      expectations[19]= {interestgainwotax: 1391.19, value: 0.46, taxes: -74.27};


    });

    it('Passes 1st test set', function(){
      var results = deposits.timedeposit(data[0]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[0]));
    });

    it('Passes 2nd test set', function(){
      var results = deposits.timedeposit(data[1]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[1]));
    });

    it('Passes 3rd test set', function(){
      var results = deposits.timedeposit(data[2]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[2]));
    });

    it('Passes 4th test set', function(){
      var results = deposits.timedeposit(data[3]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[3]));
    });

    it('Passes 5th test set', function(){
      var results = deposits.timedeposit(data[4]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[4]));
    });

    it('Passes 6th test set', function(){
      var results = deposits.timedeposit(data[5]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[5]));
    });

    it('Passes 7th test set', function(){
      var results = deposits.timedeposit(data[6]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[6]));
    });

    it('Passes 8th test set', function(){
      var results = deposits.timedeposit(data[7]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[7]));
    });

    it('Passes 9th test set', function(){
      var results = deposits.timedeposit(data[8]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[8]));
    });

    it('Passes 10th test set', function(){
      var results = deposits.timedeposit(data[9]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[9]));
    });

    it('Passes 11th test set', function(){
      var results = deposits.timedeposit(data[10]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[10]));
    });

    it('Passes 12th test set', function(){
      var results = deposits.timedeposit(data[11]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[11]));
    });

    it('Passes 13th test set', function(){
      var results = deposits.timedeposit(data[12]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[12]));
    });

    it('Passes 14th test set', function(){
      var results = deposits.timedeposit(data[13]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[13]));
    });

    it('Passes 15th test set', function(){
      var results = deposits.timedeposit(data[14]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[14]));
    });

    it('Passes 16th test set', function(){
      var results = deposits.timedeposit(data[15]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[15]));
    });

    it('Passes 17th test set', function(){
      var results = deposits.timedeposit(data[16]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[16]));
    });

    it('Passes 18th test set', function(){
      var results = deposits.timedeposit(data[17]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[17]));
    });

    it('Passes 19th test set', function(){
      var results = deposits.timedeposit(data[18]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[18]));
    });

    it('Passes 20th test set', function(){
      var results = deposits.timedeposit(data[19]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[19]));
    });

  });


});