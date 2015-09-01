var assert = require("assert");
var mongoose = require('../config/mongoose');
var _ = require("underscore");
var deposits = require("../app/modules/deposits");

/** initialize */
var ROUND_PRECISION = 100;   // 1/100 rounding precision



describe("Deposits calculators are correct", function() {


  describe("Deposits-interestpenalty correct", function() {
    var data = [],
        expectations = [];
    before(function () {
      data[0] = {calcselect: '2', principal: '12000',     interest: '4.5',  term: '27',   interestgain: '',        selection: 'false', taxes: 'false', taxrate: '26.375', taxfree: '801',    taxtime: 'false'};

      data[0] = {principal: '10621.91', interest: '4.04', allowance: '1611.54', term: '473', factor: '19.3',  interestdays: '365.25'};
      data[1] = {principal: '17526.83', interest: '4.42', allowance: '8511.54', term: '313', factor: '83.85', interestdays: '360'};
      data[2] = {principal: '37282.11', interest: '1.46', allowance: '6201.2',  term: '300', factor: '94.42', interestdays: '360'};
      data[3] = {principal: '21249.65', interest: '1.81', allowance: '4590.64', term: '314', factor: '83.08', interestdays: '360'};
      data[4] = {principal: '40852.41', interest: '3.08', allowance: '4692.42', term: '148', factor: '54.98', interestdays: '365'};
      data[5] = {principal: '31171.18', interest: '2.77', allowance: '8872.4',  term: '318', factor: '61.49', interestdays: '365'};
      data[6] = {principal: '23573.81', interest: '3.68', allowance: '2703.54', term: '407', factor: '41.51', interestdays: '360'};
      data[7] = {principal: '13530.69', interest: '1.34', allowance: '4721.64', term: '288', factor: '69.15', interestdays: '365'};
      data[8] = {principal: '4391.27',  interest: '2.99', allowance: '8464.46', term: '88',  factor: '44.64', interestdays: '365'};
      data[9] = {principal: '10192.27', interest: '0.46', allowance: '5996.14', term: '408', factor: '39.53', interestdays: '365.25'};
      data[10]= {principal: '43866.42', interest: '3.07', allowance: '3335.02', term: '133', factor: '49.69', interestdays: '365'};
      data[11]= {principal: '25938.65', interest: '3.72', allowance: '4650.2',  term: '335', factor: '71.62', interestdays: '365'};
      data[12]= {principal: '48169.22', interest: '1.5',  allowance: '58.03',   term: '245', factor: '82.92', interestdays: '365.25'};
      data[13]= {principal: '19316.74', interest: '3.28', allowance: '4623.27', term: '177', factor: '23.12', interestdays: '365.25'};
      data[14]= {principal: '8431.02',  interest: '1.81', allowance: '5683.72', term: '278', factor: '62.96', interestdays: '360'};
      data[15]= {principal: '35238.97', interest: '3.24', allowance: '8571.92', term: '324', factor: '51.64', interestdays: '365'};
      data[16]= {principal: '27873.1',  interest: '2.33', allowance: '5712.02', term: '270', factor: '89.73', interestdays: '360'};
      data[17]= {principal: '15953.83', interest: '3.1',  allowance: '2218.81', term: '485', factor: '78.47', interestdays: '365.25'};
      data[18]= {principal: '14482.62', interest: '1.85', allowance: '3574.19', term: '55',  factor: '46.41', interestdays: '360'};
      data[19]= {principal: '27902.16', interest: '2.21', allowance: '5128.43', term: '76',  factor: '24.69', interestdays: '360'};

      expectations[0] = {interestprincipal: 9010.37,  interest: 0.78, interestpenalty: 90.98};
      expectations[1] = {interestprincipal: 9015.29,  interest: 3.71, interestpenalty: 290.50};
      expectations[2] = {interestprincipal: 31080.91, interest: 1.38, interestpenalty: 357.05};
      expectations[3] = {interestprincipal: 16659.01, interest: 1.50, interestpenalty: 218.5};
      expectations[4] = {interestprincipal: 36159.99, interest: 1.69, interestpenalty: 248.29};
      expectations[5] = {interestprincipal: 22298.78, interest: 1.70, interestpenalty: 330.9};
      expectations[6] = {interestprincipal: 20870.27, interest: 1.53, interestpenalty: 360.43};
      expectations[7] = {interestprincipal: 8809.05,  interest: 0.93, interestpenalty: 64.41};
      expectations[8] = {interestprincipal: 0,        interest: 1.33, interestpenalty: 0};
      expectations[9] = {interestprincipal: 4196.13,  interest: 0.18, interestpenalty: 8.52};
      expectations[10]= {interestprincipal: 40531.4,  interest: 1.53, interestpenalty: 225.3};
      expectations[11]= {interestprincipal: 21288.45, interest: 2.66, interestpenalty: 520.56};
      expectations[12]= {interestprincipal: 48111.19, interest: 1.24, interestpenalty: 401.4};
      expectations[13]= {interestprincipal: 14693.47, interest: 0.76, interestpenalty: 54};
      expectations[14]= {interestprincipal: 2747.3,   interest: 1.14, interestpenalty: 24.18};
      expectations[15]= {interestprincipal: 26667.05, interest: 1.67, interestpenalty: 396.06};
      expectations[16]= {interestprincipal: 22161.08, interest: 2.09, interestpenalty: 347.49};
      expectations[17]= {interestprincipal: 13735.02, interest: 2.43, interestpenalty: 443.66};
      expectations[18]= {interestprincipal: 10908.43, interest: 0.86, interestpenalty: 14.31};
      expectations[19]= {interestprincipal: 22773.73, interest: 0.55, interestpenalty: 26.23};
    });

    it('Passes 1st test set', function(done){
      deposits.interestpenalty(data[0]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[0]));
        done();
      }).onReject(done);
    });

    it('Passes 2nd test set', function(done){
      deposits.interestpenalty(data[1]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[1]));
        done();
      }).onReject(done);
    });

    it('Passes 3rd test set', function(done){
      deposits.interestpenalty(data[2]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[2]));
        done();
      }).onReject(done);
    });

    it('Passes 4th test set', function(done){
      deposits.interestpenalty(data[3]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[3]));
        done();
      }).onReject(done);
    });

    it('Passes 5th test set', function(done){
      deposits.interestpenalty(data[4]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[4]));
        done();
      }).onReject(done);
    });

    it('Passes 6th test set', function(done){
      deposits.interestpenalty(data[5]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[5]));
        done();
      }).onReject(done);
    });

    it('Passes 7th test set', function(done){
      deposits.interestpenalty(data[6]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[6]));
        done();
      }).onReject(done);
    });

    it('Passes 8th test set', function(done){
      deposits.interestpenalty(data[7]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[7]));
        done();
      }).onReject(done);
    });

    it('Passes 9th test set', function(done){
      deposits.interestpenalty(data[8]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[8]));
        done();
      }).onReject(done);
    });

    it('Passes 10th test set', function(done){
      deposits.interestpenalty(data[9]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[9]));
        done();
      }).onReject(done);
    });

    it('Passes 11th test set', function(done){
      deposits.interestpenalty(data[10]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[10]));
        done();
      }).onReject(done);
    });

    it('Passes 12th test set', function(done){
      deposits.interestpenalty(data[11]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[11]));
        done();
      }).onReject(done);
    });

    it('Passes 13th test set', function(done){
      deposits.interestpenalty(data[12]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[12]));
        done();
      }).onReject(done);
    });

    it('Passes 14th test set', function(done){
      deposits.interestpenalty(data[13]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[13]));
        done();
      }).onReject(done);
    });

    it('Passes 15th test set', function(done){
      deposits.interestpenalty(data[14]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[14]));
        done();
      }).onReject(done);
    });

    it('Passes 16th test set', function(done){
      deposits.interestpenalty(data[15]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[15]));
        done();
      }).onReject(done);
    });

    it('Passes 17th test set', function(done){
      deposits.interestpenalty(data[16]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[16]));
        done();
      }).onReject(done);
    });

    it('Passes 18th test set', function(done){
      deposits.interestpenalty(data[17]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[17]));
        done();
      }).onReject(done);
    });

    it('Passes 19th test set', function(done){
      deposits.interestpenalty(data[18]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[18]));
        done();
      }).onReject(done);
    });

    it('Passes 20th test set', function(done){
      deposits.interestpenalty(data[19]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[19]));
        done();
      }).onReject(done);
    });

  });



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

    it('Passes 1st test set', function(done){
      deposits.timedeposit(data[0]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[0]));
        done();
      }).onReject(done);
    });

    it('Passes 2nd test set', function(done){
      deposits.timedeposit(data[1]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[1]));
        done();
      }).onReject(done);
    });

    it('Passes 3rd test set', function(done){
      deposits.timedeposit(data[2]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[2]));
        done();
      }).onReject(done);
    });

    it('Passes 4th test set', function(done){
      deposits.timedeposit(data[3]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[3]));
        done();
      }).onReject(done);
    });

    it('Passes 5th test set', function(done){
      deposits.timedeposit(data[4]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[4]));
        done();
      }).onReject(done);
    });

    it('Passes 6th test set', function(done){
      deposits.timedeposit(data[5]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[5]));
        done();
      }).onReject(done);
    });

    it('Passes 7th test set', function(done){
      deposits.timedeposit(data[6]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[6]));
        done();
      }).onReject(done);
    });

    it('Passes 8th test set', function(done){
      deposits.timedeposit(data[7]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[7]));
        done();
      }).onReject(done);
    });

    it('Passes 9th test set', function(done){
      deposits.timedeposit(data[8]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[8]));
        done();
      }).onReject(done);
    });

    it('Passes 10th test set', function(done){
      deposits.timedeposit(data[9]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[9]));
        done();
      }).onReject(done);
    });

    it('Passes 11th test set', function(done){
      deposits.timedeposit(data[10]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[10]));
        done();
      }).onReject(done);
    });

    it('Passes 12th test set', function(done){
      deposits.timedeposit(data[11]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[11]));
        done();
      }).onReject(done);
    });

    it('Passes 13th test set', function(done){
      deposits.timedeposit(data[12]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[12]));
        done();
      }).onReject(done);
    });

    it('Passes 14th test set', function(done){
      deposits.timedeposit(data[13]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[13]));
        done();
      }).onReject(done);
    });

    it('Passes 15th test set', function(done){
      deposits.timedeposit(data[14]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[14]));
        done();
      }).onReject(done);
    });

    it('Passes 16th test set', function(done){
      deposits.timedeposit(data[15]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[15]));
        done();
      }).onReject(done);
    });

    it('Passes 17th test set', function(done){
      deposits.timedeposit(data[16]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[16]));
        done();
      }).onReject(done);
    });

    it('Passes 18th test set', function(done){
      deposits.timedeposit(data[17]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[17]));
        done();
      }).onReject(done);
    });

    it('Passes 19th test set', function(done){
      deposits.timedeposit(data[18]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[18]));
        done();
      }).onReject(done);
    });

    it('Passes 20th test set', function(done){
      deposits.timedeposit(data[19]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[19]));
        done();
      }).onReject(done);
    });

  });



  describe("Deposits-savingscheme correct", function() {
    var data = [],
        expectations = [];
    before(function () {

      data[0] = {calcselect: '2', principal: '700038.56', terminal: '857326.9',  term : '2',  interestselection: 'false', interest0: '2.93', interest1: '1.77', taxes: 'false', taxrate: '33.26', taxfree: '3060', taxtime: 'false'};
      data[1] = {calcselect: '2', principal: '355407.37', terminal: '321514.31', term : '5', interestselection: 'false', interest0: '2.31', interest1: '2.66', interest2: '1.74', interest3: '2.84', interest4: '4.58', interest4: '4.58', taxes: 'false', taxrate: '32.02', taxfree: '1042.89', taxtime: 'true'};
      data[2] = {calcselect: '3', principal: '607119',    terminal: '588292.48', term : '8', interestselection: 'false', interest0: '1.84', interest1: '1.66', interest2: '1.59', interest3: '4.22', interest4: '4.24', interest4: '4.24', interest5: '1.84', interest6: '5.49', interest7: '6.74', taxes: 'false', taxrate: '17.59', taxfree: '89.76', taxtime: 'true'};
      data[3] = {calcselect: '2', principal: '430647.51', terminal: '919304.07', term : '5', interestselection: 'true',  interest0: '1.55', interest1: '0.88', interest2: '0.18', interest3: '3.96', interest4: '2.89', interest4: '2.89', taxes: 'false', taxrate: '16.77', taxfree: '1411.9', taxtime: 'false'};
      data[4] = {calcselect: '3', principal: '200337.56', terminal: '756278.24', term : '1', interestselection: 'false', interest0: '2.52', taxes: 'false', taxrate: '14', taxfree: '3727.06', taxtime: 'false'};
      data[5] = {calcselect: '2', principal: '797585.62', terminal: '289982.18', term : '3', interestselection: 'true',  interest0: '1.66', interest1: '1.84', interest2: '0.19', taxes: 'false', taxrate: '13.56', taxfree: '1574.05', taxtime: 'true'};
      data[6] = {calcselect: '2', principal: '513926.43', terminal: '673255.26', term : '7', interestselection: 'true',  interest0: '0.29', interest1: '1.88', interest2: '0.9', interest3: '3', interest4: '4.63', interest4: '4.63', interest5: '1.72', interest6: '4.44', taxes: 'false', taxrate: '11.97', taxfree: '3908.07', taxtime: 'false'};
      data[7] = {calcselect: '3', principal: '375910.68', terminal: '696107.1',  term : '5',  interestselection: 'true',  interest0: '1.04', interest1: '1.74', interest2: '2.27', interest3: '3.27', interest4: '2.95', interest4: '2.95', taxes: 'true', taxrate: '26.66', taxfree: '3438.72', taxtime: 'true'};
      data[8] = {calcselect: '2', principal: '489000.18', terminal: '111821.77', term : '7', interestselection: 'true',  interest0: '2.98', interest1: '1.12', interest2: '1.28', interest3: '1.34', interest4: '0.35', interest4: '0.35', interest5: '4.98', interest6: '3.48', taxes: 'true', taxrate: '14.38', taxfree: '1358.86', taxtime: 'true'};
      data[9] = {calcselect: '3', principal: '272188.56', terminal: '143585.89', term : '6', interestselection: 'true',  interest0: '2.55', interest1: '2.61', interest2: '0.51', interest3: '0.63', interest4: '2.01', interest4: '2.01', interest5: '0.75', taxes: 'true', taxrate: '16.22', taxfree: '3487.36', taxtime: 'true'};
      data[10]= {calcselect: '2', principal: '795260.16', terminal: '436702.89', term : '8', interestselection: 'true',  interest0: '0.38', interest1: '1.99', interest2: '1.67', interest3: '2.17', interest4: '1.19', interest4: '1.19', interest5: '0.9', interest6: '5.37', interest7: '2.55', taxes: 'false', taxrate: '2.14', taxfree: '2932.52', taxtime: 'false'};
      data[11]= {calcselect: '3', principal: '118727.05', terminal: '927304.02', term : '2', interestselection: 'false', interest0: '0.99', interest1: '0.79', taxes: 'false', taxrate: '29.02', taxfree: '1596.03', taxtime: 'false'};
      data[12]= {calcselect: '2', principal: '709532.73', terminal: '864592.77', term : '6', interestselection: 'false', interest0: '1.55', interest1: '2.98', interest2: '2.23', interest3: '2.14', interest4: '4.59', interest4: '4.59', interest5: '2.76', taxes: 'true', taxrate: '22.8', taxfree: '1761.93', taxtime: 'false'};
      data[13]= {calcselect: '3', principal: '58254.65',  terminal: '364700.35', term : '3', interestselection: 'false', interest0: '2.52', interest1: '2.92', interest2: '0.5', taxes: 'false', taxrate: '30.39', taxfree: '3543.64', taxtime: 'false'};
      data[14]= {calcselect: '3', principal: '333200.56', terminal: '217144.79', term : '10',interestselection: 'true',  interest0: '1.31', interest1: '0.92', interest2: '2.53', interest3: '3.24', interest4: '2.1', interest4: '2.1', interest5: '2.4', interest6: '7.56', interest7: '4.68', interest8: '6.98', interest9: '6.01', taxes: 'true', taxrate: '19.44', taxfree: '75.96', taxtime: 'false'};
      data[15]= {calcselect: '3', principal: '941022.52', terminal: '230656.11', term : '10',interestselection: 'false', interest0: '0.75', interest1: '1.97', interest2: '2.64', interest3: '3.8', interest4: '4.54', interest4: '4.54', interest5: '0.59', interest6: '4.25', interest7: '7.89', interest8: '2.07', interest9: '2.57', taxes: 'false', taxrate: '12.46', taxfree: '3168.81', taxtime: 'false'};
      data[16]= {calcselect: '2', principal: '548565.14', terminal: '769661.49', term : '10',interestselection: 'false', interest0: '0.43', interest1: '1.57', interest2: '0.35', interest3: '1.23', interest4: '1.87', interest4: '1.87', interest5: '0.37', interest6: '1.92', interest7: '3.31', interest8: '4.58', interest9: '3.5', taxes: 'false', taxrate: '23.08', taxfree: '3824.57', taxtime: 'false'};
      data[17]= {calcselect: '3', principal: '819161.48', terminal: '470853.47', term : '9', interestselection: 'true',  interest0: '2.57', interest1: '0.67', interest2: '2.75', interest3: '1.55', interest4: '2.79', interest4: '2.79', interest5: '2.47', interest6: '2.89', interest7: '4.59', interest8: '3.38', taxes: 'false', taxrate: '28.51', taxfree: '3744.68', taxtime: 'false'};
      data[18]= {calcselect: '3', principal: '280076.4',  terminal: '914524.59', term : '3', interestselection: 'true',  interest0: '1.21', interest1: '0', interest2: '2.23', taxes: 'false', taxrate: '24.91', taxfree: '2439.36', taxtime: 'true'};
      data[19]= {calcselect: '3', principal: '670145.24', terminal: '76914.1',   term : '4',   interestselection: 'false', interest0: '2.74', interest1: '2.4', interest2: '2.34', interest3: '2.27', taxes: 'true', taxrate: '9.33', taxfree: '3155.83', taxtime: 'true'};


      expectations[0] = {terminal: 732940.37, interest: 32901.81, averageinterest: 2.35, linearinterest: 2.35, effectiveinterest: 2.36};
      expectations[1] = {terminal: 405626.43, interest: 50219.06, averageinterest: 2.83, linearinterest: 2.83, effectiveinterest: 2.8};
      expectations[2] = {principal: 460972.01, interest: 127320.47, averageinterest: 3.45, linearinterest: 3.45, effectiveinterest: 3.34};
      expectations[3] = {terminal: 472745.5, interest: 42097.99, averageinterest: 1.89, linearinterest: 1.96, effectiveinterest: 1.88};
      expectations[4] = {principal: 737688.49, interest: 18589.75, averageinterest: 2.52, linearinterest: 2.52, effectiveinterest: 2.52};
      expectations[5] = {terminal: 827313.65, interest: 29728.03, averageinterest: 1.23, linearinterest: 1.24, effectiveinterest: 1.23};
      expectations[6] = {terminal: 606604.11, interest: 92677.68, averageinterest: 2.41, linearinterest: 2.58, effectiveinterest: 2.4};
      expectations[7] = {principal: 639939.60, interest: 75335.06, taxes: -19167.56, averageinterest: 2.25, linearinterest: 1.76, effectiveinterest: 1.7};
      expectations[8] = {terminal: 558333.12, interest: 80749.28, taxes: -11416.34, averageinterest: 2.22, linearinterest: 2.03, effectiveinterest: 1.91};
      expectations[9] = {principal: 132596.69, interest: 12441.57, taxes: -1452.37, averageinterest: 1.51, linearinterest: 1.38, effectiveinterest: 1.34};
      expectations[10]= {terminal: 933064.43, interest: 137804.27, averageinterest: 2.03, linearinterest: 2.17, effectiveinterest: 2.02};
      expectations[11]= {principal: 911086.68, interest: 16217.34, averageinterest: 0.89, linearinterest: 0.89, effectiveinterest: 0.89};
      expectations[12]= {terminal: 800953.93, interest: 115299.07, taxes: -23877.87, averageinterest: 2.71, linearinterest: 2.15, effectiveinterest: 2.13};
      expectations[13]= {principal: 344251.79, interest: 20448.56, averageinterest: 1.98, linearinterest: 1.98, effectiveinterest: 1.99};
      expectations[14]= {principal: 161076.64, interest: 69414.70, averageinterest: 3.77, linearinterest: 3.48, effectiveinterest: 3.03};
      expectations[15]= {principal: 175979.33, interest: 54676.78, averageinterest: 3.11, linearinterest: 3.11, effectiveinterest: 3.04};
      expectations[16]= {terminal: 653505.65, interest: 104940.51, averageinterest: 1.91, linearinterest: 1.91, effectiveinterest: 1.85};
      expectations[17]= {principal: 372954.74, interest: 97898.73, averageinterest: 2.63, linearinterest: 2.92, effectiveinterest: 2.62};
      expectations[18]= {principal: 883880.6, interest: 30643.99, averageinterest: 1.15, linearinterest: 1.16, effectiveinterest: 1.14};
      expectations[19]= {principal: 70396.39, interest: 6863.65, averageinterest: 2.44, linearinterest: 2.31, effectiveinterest: 2.32};


    });


    it('Passes 1st test set', function(done){
      deposits.savingscheme(data[0]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[0]));
        done();
      }).onReject(done);
    });

    it('Passes 2nd test set', function(done){
      deposits.savingscheme(data[1]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[1]));
        done();
      }).onReject(done);
    });

    it('Passes 3rd test set', function(done){
      deposits.savingscheme(data[2]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[2]));
        done();
      }).onReject(done);
    });

    it('Passes 4th test set', function(done){
      deposits.savingscheme(data[3]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[3]));
        done();
      }).onReject(done);
    });

    it('Passes 5th test set', function(done){
      deposits.savingscheme(data[4]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[4]));
        done();
      }).onReject(done);
    });

    it('Passes 6th test set', function(done){
      deposits.savingscheme(data[5]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[5]));
        done();
      }).onReject(done);
    });

    it('Passes 7th test set', function(done){
      deposits.savingscheme(data[6]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[6]));
        done();
      }).onReject(done);
    });

    it('Passes 8th test set', function(done){
      deposits.savingscheme(data[7]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[7]));
        done();
      }).onReject(done);
    });

    it('Passes 9th test set', function(done){
      deposits.savingscheme(data[8]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[8]));
        done();
      }).onReject(done);
    });

    it('Passes 10th test set', function(done){
      deposits.savingscheme(data[9]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[9]));
        done();
      }).onReject(done);
    });

    it('Passes 11th test set', function(done){
      deposits.savingscheme(data[10]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[10]));
        done();
      }).onReject(done);
    });

    it('Passes 12th test set', function(done){
      deposits.savingscheme(data[11]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[11]));
        done();
      }).onReject(done);
    });

    it('Passes 13th test set', function(done){
      deposits.savingscheme(data[12]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[12]));
        done();
      }).onReject(done);
    });

    it('Passes 14th test set', function(done){
      deposits.savingscheme(data[13]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[13]));
        done();
      }).onReject(done);
    });

    it('Passes 15th test set', function(done){
      deposits.savingscheme(data[14]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[14]));
        done();
      }).onReject(done);
    });

    it('Passes 16th test set', function(done){
      deposits.savingscheme(data[15]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[15]));
        done();
      }).onReject(done);
    });

    it('Passes 17th test set', function(done){
      deposits.savingscheme(data[16]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[16]));
        done();
      }).onReject(done);
    });

    it('Passes 18th test set', function(done){
      deposits.savingscheme(data[17]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[17]));
        done();
      }).onReject(done);
    });

    it('Passes 19th test set', function(done){
      deposits.savingscheme(data[18]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[18]));
        done();
      }).onReject(done);
    });

    it('Passes 20th test set', function(done){
      deposits.savingscheme(data[19]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[19]));
        done();
      }).onReject(done);
    });

  });




  describe("Deposits-overnight correct", function() {
    var data = [],
        expectations = [];
    before(function () {

      data[0] = {calcselect: '1', principal: '45896.49',  interest: '9.97', interestperiod: '0', periodselect: 'false', interestdays: '290',  interestgain: '260.76', daycount: 'act365', taxes: 'true',  taxrate: '12.11', taxfree: '463.35', interesttype: 'true' ,specialinterestpositions: '3', specialinterestthreshold0: '0', specialinterest0: '1.36', specialinterestthreshold1: '2781.67', specialinterest1: '0.35', specialinterestthreshold2: '14740.55', specialinterest2: '6.47'};
      data[1] = {calcselect: '1', principal: '341044.52', interest: '8.94', interestperiod: '0', periodselect: 'false', interestdays: '226',  interestgain: '640.76', daycount: 'act365', taxes: 'false', taxrate: '6.01', taxfree: '102.1', interesttype: 'true' ,specialinterestpositions: '3', specialinterestthreshold0: '0', specialinterest0: '1.77', specialinterestthreshold1: '4555.57', specialinterest1: '6.51', specialinterestthreshold2: '18228.12', specialinterest2: '7.32'};
      data[2] = {calcselect: '1', principal: '312003.84', interest: '0.94', interestperiod: '2', periodselect: 'false', interestdays: '1497', interestgain: '105.95', daycount: 'act360', taxes: 'true',  taxrate: '0.54', taxfree: '413.82', interesttype: 'false' ,specialinterestpositions: '0'};
      data[3] = {calcselect: '1', principal: '12432.1',   interest: '1.5',  interestperiod: '2', periodselect: 'false', interestdays: '776',  interestgain: '497.54', daycount: 'actact', taxes: 'false', taxrate: '0', taxfree: '69.97', interesttype: 'false' ,specialinterestpositions: '0'};
      data[4] = {calcselect: '1', principal: '312761.36', interest: '2.91', interestperiod: '0', periodselect: 'false', interestdays: '210',  interestgain: '258.63', daycount: 'act360', taxes: 'true',  taxrate: '17.11', taxfree: '444.6', interesttype: 'true' ,specialinterestpositions: '3', specialinterestthreshold0: '0', specialinterest0: '0.37', specialinterestthreshold1: '4269.52', specialinterest1: '5.99', specialinterestthreshold2: '25247.72', specialinterest2: '9.68'};
      data[5] = {calcselect: '1', principal: '125226.8',  interest: '1.96', interestperiod: '0', periodselect: 'false', interestdays: '78',   interestgain: '497.07', daycount: 'act365', taxes: 'false', taxrate: '3.21', taxfree: '232.61', interesttype: 'false' ,specialinterestpositions: '0'};
      data[6] = {calcselect: '1', principal: '353596.57', interest: '6.84', interestperiod: '0', periodselect: 'false', interestdays: '224',  interestgain: '242.36', daycount: 'a30360', taxes: 'true',  taxrate: '14.32', taxfree: '36.98', interesttype: 'true' ,specialinterestpositions: '3', specialinterestthreshold0: '0', specialinterest0: '4.62', specialinterestthreshold1: '429.97', specialinterest1: '2.23', specialinterestthreshold2: '23853.39', specialinterest2: '4.03'};
      data[7] = {calcselect: '1', principal: '42666.15',  interest: '5.08', interestperiod: '0', periodselect: 'false', interestdays: '955',  interestgain: '341.38', daycount: 'act360', taxes: 'false', taxrate: '2.42', taxfree: '178.96', interesttype: 'true' ,specialinterestpositions: '3', specialinterestthreshold0: '0', specialinterest0: '2.5', specialinterestthreshold1: '2053.59', specialinterest1: '0.06', specialinterestthreshold2: '9689.16', specialinterest2: '7.22'};
      data[8] = {calcselect: '1', principal: '326600.35', interest: '3.98', interestperiod: '0', periodselect: 'false', interestdays: '1314', interestgain: '847.74', daycount: 'a30360', taxes: 'false', taxrate: '10.55', taxfree: '309.96', interesttype: 'true' ,specialinterestpositions: '3', specialinterestthreshold0: '0', specialinterest0: '0.82', specialinterestthreshold1: '4340.25', specialinterest1: '7.4', specialinterestthreshold2: '42827.7', specialinterest2: '2.83'};
      data[9] = {calcselect: '1', principal: '375207.9',  interest: '0.61', interestperiod: '1', periodselect: 'false', interestdays: '1304', interestgain: '684.83', daycount: 'act360', taxes: 'true',  taxrate: '16.76', taxfree: '261.7', interesttype: 'false' ,specialinterestpositions: '0'};
      data[10]= {calcselect: '2', principal: '382648.61', interest: '1.99', interestperiod: '0', periodselect: 'false', interestdays: '1487', interestgain: '762.03', daycount: 'act365', taxes: 'false', taxrate: '7.7', taxfree: '332.99', interesttype: 'false' ,specialinterestpositions: '0'};
      data[11]= {calcselect: '2', principal: '391869.25', interest: '0.74', interestperiod: '0', periodselect: 'false', interestdays: '4',    interestgain: '786.61', daycount: 'act365', taxes: 'false', taxrate: '24.28', taxfree: '376.39', interesttype: 'true' ,specialinterestpositions: '3', specialinterestthreshold0: '0', specialinterest0: '4.77', specialinterestthreshold1: '2545.09', specialinterest1: '5.26', specialinterestthreshold2: '49320.97', specialinterest2: '7.18'};
      data[12]= {calcselect: '2', principal: '300145.16', interest: '4.52', interestperiod: '1', periodselect: 'false', interestdays: '1268', interestgain: '267.57', daycount: 'act365', taxes: 'false', taxrate: '20.31', taxfree: '236.68', interesttype: 'false' ,specialinterestpositions: '0'};
      data[13]= {calcselect: '2', principal: '285188.34', interest: '0.72', interestperiod: '2', periodselect: 'false', interestdays: '797',  interestgain: '345.76', daycount: 'act360', taxes: 'true',  taxrate: '21.53', taxfree: '365.6',  interesttype: 'false' ,specialinterestpositions: '0'};
      data[14]= {calcselect: '2', principal: '274582.82', interest: '2.5',  interestperiod: '0', periodselect: 'false', interestdays: '1214', interestgain: '882.01', daycount: 'actact', taxes: 'true',  taxrate: '19.76', taxfree: '405.5',  interesttype: 'true' , specialinterestpositions: '3', specialinterestthreshold0: '0', specialinterest0: '2.45', specialinterestthreshold1: '2677.59', specialinterest1: '3.95', specialinterestthreshold2: '18263.24', specialinterest2: '4.79'};
      data[15]= {calcselect: '3', principal: '272886.44', interest: '5.91', interestperiod: '4', periodselect: 'false', interestdays: '715',  interestgain: '255.04', daycount: 'act365', taxes: 'true',  taxrate: '23.98', taxfree: '174.08', interesttype: 'false' ,specialinterestpositions: '0'};
      data[16]= {calcselect: '3', principal: '273695.42', interest: '3.91', interestperiod: '0', periodselect: 'false', interestdays: '190',  interestgain: '919.07', daycount: 'act365', taxes: 'false', taxrate: '20.99', taxfree: '186.41', interesttype: 'false' ,specialinterestpositions: '0'};
      data[17]= {calcselect: '3', principal: '310040.23', interest: '4.31', interestperiod: '3', periodselect: 'false', interestdays: '147',  interestgain: '358.28', daycount: 'actact', taxes: 'false', taxrate: '2.82',  taxfree: '151.83', interesttype: 'false' ,specialinterestpositions: '0'};
      data[18]= {calcselect: '3', principal: '149242.5',  interest: '1.29', interestperiod: '5', periodselect: 'false', interestdays: '16',   interestgain: '167.46', daycount: 'act360', taxes: 'true',  taxrate: '0.18',  taxfree: '338.01', interesttype: 'false' ,specialinterestpositions: '0'};
      data[19]= {calcselect: '3', principal: '336121.58', interest: '1.84', interestperiod: '5', periodselect: 'false', interestdays: '317',  interestgain: '604.34', daycount: 'act365', taxes: 'true',  taxrate: '6.16',  taxfree: '227.32', interesttype: 'false' ,specialinterestpositions: '0'};
      data[20]= {calcselect: '4', principal: '301360.95', interest: '4.36', interestperiod: '5', periodselect: 'false', interestdays: '1131', interestgain: '507.38', daycount: 'act365', taxes: 'true',  taxrate: '5.4',   taxfree: '173.14', interesttype: 'false' ,specialinterestpositions: '0'};
      data[21]= {calcselect: '4', principal: '177446.71', interest: '0.6',  interestperiod: '0', periodselect: 'false', interestdays: '710',  interestgain: '922.04', daycount: 'a30360', taxes: 'true',  taxrate: '8.7',   taxfree: '432.74', interesttype: 'false' ,specialinterestpositions: '0'};
      data[22]= {calcselect: '4', principal: '43091.63',  interest: '9.58', interestperiod: '0', periodselect: 'false', interestdays: '1060', interestgain: '685.92', daycount: 'act360', taxes: 'true',  taxrate: '15.53', taxfree: '282.62', interesttype: 'true' , specialinterestpositions: '3', specialinterestthreshold0: '0', specialinterest0: '2.12', specialinterestthreshold1: '3137.14', specialinterest1: '4.75', specialinterestthreshold2: '30728.84', specialinterest2: '8.1'};
      data[23]= {calcselect: '4', principal: '351331.26', interest: '7.1',  interestperiod: '1', periodselect: 'false', interestdays: '154',  interestgain: '975.69', daycount: 'act360', taxes: 'false', taxrate: '18.95', taxfree: '95.18',  interesttype: 'false' ,specialinterestpositions: '0'};
      data[24]= {calcselect: '4', principal: '28216.91',  interest: '5.79', interestperiod: '0', periodselect: 'false', interestdays: '1330', interestgain: '606.48', daycount: 'a30360', taxes: 'false', taxrate: '24.74', taxfree: '289.31', interesttype: 'true' , specialinterestpositions: '3', specialinterestthreshold0: '0', specialinterest0: '3.93', specialinterestthreshold1: '1789.16', specialinterest1: '1.5', specialinterestthreshold2: '35353.85', specialinterest2: '3.2'};


      expectations[0] = {interestgainAfterTax: 1519.39, taxes: -145.51, interestfactor: 0.79};
      expectations[1] = {value: 15232.32, interestfactor: 0.62};
      expectations[2] = {interestgainAfterTax: 12375.21, taxes: -55.96, interestfactor: 4.16};
      expectations[3] = {value: 402.32, interestfactor: 2.12};
      expectations[4] = {interestgainAfterTax: 14148.44, taxes: -2828.72, interestfactor: 0.58};
      expectations[5] = {value: 524.51, interestfactor: 0.21};
      expectations[6] = {interestgainAfterTax: 7378.8, taxes: -1227.06, interestfactor: 0.62};
      expectations[7] = {value: 6464.45, interestfactor: 2.65};
      expectations[8] = {value: 39837.66, interestfactor: 3.65};
      expectations[9] = {interestgainAfterTax: 7142.05, taxes: -1227.25, interestfactor: 3.62};
      expectations[10]= {interestfactor: 4.07, principal: 9399.42};
      expectations[11]= {interestfactor: 0.01, principal: 1013058.44};
      expectations[12]= {interestfactor: 3.47, principal: 1573.83};
      expectations[13]= {interestfactor: 2.21, principal: 21525.37};
      expectations[14]= {interestfactor: 3.32, principal: 8628.73};
      expectations[15]= {interestfactor: 1.96, interest: 0.05, taxes: 0};
      expectations[16]= {interestfactor: 0.52, interest: 0.65};
      expectations[17]= {interestfactor: 0.4, interest: 0.29};
      expectations[18]= {interestfactor: 0.04, interest: 2.52, taxes: 0};
      expectations[19]= {interestfactor: 0.87, interest: 0.22, taxes: -24.75};
      expectations[20]= {taxes: -19.08, interestfactor: 0.04, interestdays: 14.62};
      expectations[21]= {taxes: -46.63, interestfactor: 0.91, interestdays: 327.53};
      expectations[22]= {taxes: -74.15, interestfactor: 0.32, interestdays: 115.04};
      expectations[23]= {interestfactor: 0.04, interestdays: 14.06};
      expectations[24]= {interestfactor: 1.3, interestdays: 467.79};


    });


    it('Passes 1st test set', function(done){
      deposits.overnight(data[0]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[0]));
        done();
      }).onReject(done);
    });

    it('Passes 2nd test set', function(done){
      deposits.overnight(data[1]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[1]));
        done();
      }).onReject(done);
    });

    it('Passes 3rd test set', function(done){
      deposits.overnight(data[2]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[2]));
        done();
      }).onReject(done);
    });

    it('Passes 4th test set', function(done){
      deposits.overnight(data[3]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[3]));
        done();
      }).onReject(done);
    });

    it('Passes 5th test set', function(done){
      deposits.overnight(data[4]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[4]));
        done();
      }).onReject(done);
    });

    it('Passes 6th test set', function(done){
      deposits.overnight(data[5]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[5]));
        done();
      }).onReject(done);
    });

    it('Passes 7th test set', function(done){
      deposits.overnight(data[6]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[6]));
        done();
      }).onReject(done);
    });

    it('Passes 8th test set', function(done){
      deposits.overnight(data[7]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[7]));
        done();
      }).onReject(done);
    });

    it('Passes 9th test set', function(done){
      deposits.overnight(data[8]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[8]));
        done();
      }).onReject(done);
    });

    it('Passes 10th test set', function(done){
      deposits.overnight(data[9]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[9]));
        done();
      }).onReject(done);
    });

    it('Passes 11th test set', function(done){
      deposits.overnight(data[10]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[10]));
        done();
      }).onReject(done);
    });

    it('Passes 12th test set', function(done){
      deposits.overnight(data[11]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[11]));
        done();
      }).onReject(done);
    });

    it('Passes 13th test set', function(done){
      deposits.overnight(data[12]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[12]));
        done();
      }).onReject(done);
    });

    it('Passes 14th test set', function(done){
      deposits.overnight(data[13]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[13]));
        done();
      }).onReject(done);
    });

    it('Passes 15th test set', function(done){
      deposits.overnight(data[14]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[14]));
        done();
      }).onReject(done);
    });

    it('Passes 16th test set', function(done){
      deposits.overnight(data[15]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[15]));
        done();
      }).onReject(done);
    });

    it('Passes 17th test set', function(done){
      deposits.overnight(data[16]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[16]));
        done();
      }).onReject(done);
    });

    it('Passes 18th test set', function(done){
      deposits.overnight(data[17]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[17]));
        done();
      }).onReject(done);
    });

    it('Passes 19th test set', function(done){
      deposits.overnight(data[18]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[18]));
        done();
      }).onReject(done);
    });

    it('Passes 20th test set', function(done){
      deposits.overnight(data[19]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[19]));
        done();
      }).onReject(done);
    });

    it('Passes 21th test set', function(done){
      deposits.overnight(data[20]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[20]));
        done();
      }).onReject(done);
    });

    it('Passes 22th test set', function(done){
      deposits.overnight(data[21]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[21]));
        done();
      }).onReject(done);
    });

    it('Passes 23th test set', function(done){
      deposits.overnight(data[22]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[22]));
        done();
      }).onReject(done);
    });

    it('Passes 24th test set', function(done){
      deposits.overnight(data[23]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[23]));
        done();
      }).onReject(done);
    });

    it('Passes 25th test set', function(done){
      deposits.overnight(data[24]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[24]));
        done();
      }).onReject(done);
    });



  });



  describe("Deposits-savings correct", function() {
    var data = [],
        expectations = [];
    before(function () {

      data[0] = {select: '0', principal: '99654.6', inflow: '794.34', inflowfreq: '1', inflowtype: '2', dynamic: '0.32', interest: '3.45', interestperiod: '12', compounding: '2', term: '6.66', termfix: '2.5', terminal: '180563.03'}
      data[1] = {select: '1', principal: '11432.12', inflow: '467.83', inflowfreq: '4', inflowtype: '2', dynamic: '1.11', interest: '2.62', interestperiod: '2', compounding: '2', term: '13.8', termfix: '4.1', terminal: '153616.29'};
      data[2] = {select: '1', principal: '14574.72', inflow: '346.54', inflowfreq: '4', inflowtype: '2', dynamic: '0.74', interest: '0.94', interestperiod: '2', compounding: '1', term: '13', termfix: '4.3', terminal: '6013.12'};
      data[3] = {select: '3', principal: '53351.2', inflow: '735.81', inflowfreq: '12', inflowtype: '2', dynamic: '1.24', interest: '0.34', interestperiod: '4', compounding: '2', term: '9.1', termfix: '2.3', terminal: '19179.92'};
      data[4] = {select: '4', principal: '84881.97', inflow: '951.6', inflowfreq: '2', inflowtype: '2', dynamic: '1.75', interest: '1.2', interestperiod: '12', compounding: '1', term: '9.6', termfix: '3.1', terminal: '159402.29'};
      data[5] = {select: '3', principal: '67540', inflow: '744.57', inflowfreq: '12', inflowtype: '2', dynamic: '1.82', interest: '0.56', interestperiod: '2', compounding: '2', term: '8.4', termfix: '4.6', terminal: '167169.33'};
      data[6] = {select: '1', principal: '8416.22', inflow: '866.21', inflowfreq: '12', inflowtype: '2', dynamic: '1.22', interest: '1.47', interestperiod: '4', compounding: '2', term: '13.5', termfix: '4.2', terminal: '36369.83'};
      data[7] = {select: '0', principal: '5790.18', inflow: '57.14', inflowfreq: '1', inflowtype: '2', dynamic: '0.45', interest: '2.25', interestperiod: '2', compounding: '1', term: '2.83', termfix: '2.16', terminal: '118278.25'}
      data[8] = {select: '2', principal: '96862.71', inflow: '254.17', inflowfreq: '12', inflowtype: '2', dynamic: '1.02', interest: '0.89', interestperiod: '12', compounding: '2', term: '8.5', termfix: '2.9', terminal: '172114.63'};
      data[9] = {select: '4', principal: '48449.06', inflow: '610.58', inflowfreq: '4', inflowtype: '2', dynamic: '0.89', interest: '3.18', interestperiod: '12', compounding: '2', term: '10.6', termfix: '0.9', terminal: '146976.57'};
      data[10]= {select: '4', principal: '8897.3', inflow: '3.45', inflowfreq: '1', inflowtype: '2', dynamic: '1.88', interest: '2.3', interestperiod: '2', compounding: '2', term: '7', termfix: '4.1', terminal: '181662.55'};
      data[11]= {select: '4', principal: '73188.04', inflow: '61.76', inflowfreq: '4', inflowtype: '1', dynamic: '0.45', interest: '3.64', interestperiod: '2', compounding: '2', term: '11.7', termfix: '3.6', terminal: '114003.32'};
      data[12]= {select: '1', principal: '99988.21', inflow: '390.93', inflowfreq: '4', inflowtype: '2', dynamic: '0.25', interest: '3.71', interestperiod: '4', compounding: '2', term: '13.8', termfix: '1.3', terminal: '45317.51'};
      data[13]= {select: '4', principal: '59372.8', inflow: '592.3', inflowfreq: '4', inflowtype: '2', dynamic: '1.53', interest: '2.24', interestperiod: '4', compounding: '2', term: '8.2', termfix: '0.9', terminal: '32067.68'};
      data[14]= {select: '4', principal: '82994.88', inflow: '879.92', inflowfreq: '4', inflowtype: '2', dynamic: '1.88', interest: '2.29', interestperiod: '12', compounding: '2', term: '9.8', termfix: '2.5', terminal: '162478.13'};
      data[15]= {select: '3', principal: '34675.95', inflow: '582.65', inflowfreq: '12', inflowtype: '2', dynamic: '1.04', interest: '2.54', interestperiod: '4', compounding: '2', term: '6.5', termfix: '0.9', terminal: '44689.45'};
      data[16]= {select: '3', principal: '18704.51', inflow: '585.9', inflowfreq: '2', inflowtype: '1', dynamic: '1.39', interest: '1.58', interestperiod: '12', compounding: '1', term: '8.8', termfix: '4.3', terminal: '90752.73'};
      data[17]= {select: '2', principal: '95572.74', inflow: '815.55', inflowfreq: '1', inflowtype: '2', dynamic: '1.56', interest: '0.59', interestperiod: '12', compounding: '1', term: '5.4', termfix: '0.7', terminal: '143893.44'};
      data[18]= {select: '3', principal: '80447.1', inflow: '195.25', inflowfreq: '12', inflowtype: '2', dynamic: '0.74', interest: '1.02', interestperiod: '12', compounding: '1', term: '3.9', termfix: '0.6', terminal: '99623.11'};
      data[19]= {select: '0', principal: '58360.44', inflow: '119', inflowfreq: '1', inflowtype: '1', dynamic: '1.77', interest: '2.54', interestperiod: '12', compounding: '2', term: '12.25', termfix: '1.92', terminal: '179029.58'}


      expectations[0] = {value: 137976.33, inflow: 5614.05, interest: 32707.68};
      expectations[1] = {value: 80269.19};
      expectations[2] = {value: -12630.07};
      expectations[3] = {value: 0};
      expectations[4] = {value: 3.55};
      expectations[5] = {value: 9.31};
      expectations[6] = {value: -110515.48};
      expectations[7] = {value: 6663.89, inflow: 172.19, interest: 701.52};
      expectations[8] = {value: 580.35};
      expectations[9] = {value: 9.85};
      expectations[10]= {value: 174.55};
      expectations[11]= {value: 3.3};
      expectations[12]= {value: 10670.92};
      expectations[13]= {value: -7.52};
      expectations[14]= {value: 3.24};
      expectations[15]= {value: 1.13};
      expectations[16]= {value: 30.18};
      expectations[17]= {value: 7836.98};
      expectations[18]= {value: 5.63};
      expectations[19]= {value: 81361.34, inflow: 1575.55, interest: 21425.35};

    });


    it('Passes 1st test set', function(done){
      deposits.savings(data[0]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[0]));
        done();
      }).onReject(done);
    });

    it('Passes 2nd test set', function(done){
      deposits.savings(data[1]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[1]));
        done();
      }).onReject(done);
    });

    it('Passes 3rd test set', function(done){
      deposits.savings(data[2]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[2]));
        done();
      }).onReject(done);
    });

    it('Passes 4th test set', function(done){
      deposits.savings(data[3]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[3]));
        done();
      }).onReject(done);
    });

    it('Passes 5th test set', function(done){
      deposits.savings(data[4]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[4]));
        done();
      }).onReject(done);
    });

    it('Passes 6th test set', function(done){
      deposits.savings(data[5]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[5]));
        done();
      }).onReject(done);
    });

    it('Passes 7th test set', function(done){
      deposits.savings(data[6]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[6]));
        done();
      }).onReject(done);
    });

    it('Passes 8th test set', function(done){
      deposits.savings(data[7]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[7]));
        done();
      }).onReject(done);
    });

    it('Passes 9th test set', function(done){
      deposits.savings(data[8]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[8]));
        done();
      }).onReject(done);
    });

    it('Passes 10th test set', function(done){
      deposits.savings(data[9]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[9]));
        done();
      }).onReject(done);
    });

    it('Passes 11th test set', function(done){
      deposits.savings(data[10]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[10]));
        done();
      }).onReject(done);
    });

    it('Passes 12th test set', function(done){
      deposits.savings(data[11]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[11]));
        done();
      }).onReject(done);
    });

    it('Passes 13th test set', function(done){
      deposits.savings(data[12]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[12]));
        done();
      }).onReject(done);
    });

    it('Passes 14th test set', function(done){
      deposits.savings(data[13]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[13]));
        done();
      }).onReject(done);
    });

    it('Passes 15th test set', function(done){
      deposits.savings(data[14]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[14]));
        done();
      }).onReject(done);
    });

    it('Passes 16th test set', function(done){
      deposits.savings(data[15]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[15]));
        done();
      }).onReject(done);
    });

    it('Passes 17th test set', function(done){
      deposits.savings(data[16]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[16]));
        done();
      }).onReject(done);
    });

    it('Passes 18th test set', function(done){
      deposits.savings(data[17]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[17]));
        done();
      }).onReject(done);
    });

    it('Passes 19th test set', function(done){
      deposits.savings(data[18]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[18]));
        done();
      }).onReject(done);
    });

    it('Passes 20th test set', function(done){
      deposits.savings(data[19]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[19]));
        done();
      }).onReject(done);
    });



  });

});