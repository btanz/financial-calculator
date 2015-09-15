var assert = require("assert");
var mongoose = require('../config/mongoose');
var _ = require("underscore");
var debt = require("../app/modules/debt");



/** initialize */
var ROUND_PRECISION = 100;   // 1/100 rounding precision



/** run tests */
describe("Debt calculators are correct", function() {

  describe("Debt-repaysurrogat correct", function() {
    var data = [],
        expectations = [];
    before(function () {
      data[0] = {principal: '100000.00', debtinterest: '4.00', selection: '3', term: '10', initrepay: '0', repay: '0', interval: '12', saveinterest: '6.00', taxes: 'FALSE', taxrate: '0', taxfree: '0', taxtime: 'false'};
      data[1] = {principal: '181944.84', debtinterest: '5.22', selection: '4', term: '6.25', initrepay: '4.83', repay: '3652.14', interval: '12', saveinterest: '5.25', taxes: 'true', taxrate: '45.97', taxfree: '3012.03', taxtime: 'true'};
      data[2] = {principal: '407925.94', debtinterest: '1.6', selection: '4', term: '1.00', initrepay: '0.63', repay: '15648.98', interval: '2', saveinterest: '2.43', taxes: 'true', taxrate: '46.22', taxfree: '3809.28', taxtime: 'true'};
      data[3] = {principal: '29755.75', debtinterest: '8.12', selection: '4', term: '4.67', initrepay: '3.24', repay: '6992.44', interval: '2', saveinterest: '5.09', taxes: 'true', taxrate: '21.56', taxfree: '4390.99', taxtime: 'false'};
      data[4] = {principal: '549965.19', debtinterest: '3.12', selection: '2', term: '6.75', initrepay: '0.55', repay: '1496.02', interval: '12', saveinterest: '3.96', taxes: 'true', taxrate: '8.06', taxfree: '2231.19', taxtime: 'true'};
      data[5] = {principal: '44575.25', debtinterest: '0.74', selection: '2', term: '5.83', initrepay: '1.36', repay: '6643.81', interval: '4', saveinterest: '5.02', taxes: 'true', taxrate: '38.46', taxfree: '2397.22', taxtime: 'false'};
      data[6] = {principal: '434681.74', debtinterest: '4.92', selection: '4', term: '5.33', initrepay: '1.99', repay: '469.48', interval: '12', saveinterest: '3.41', taxes: 'false', taxrate: '16.99', taxfree: '4892.27', taxtime: 'false'};
      data[7] = {principal: '182610.87', debtinterest: '7.85', selection: '3', term: '3.75', initrepay: '7.82', repay: '10870.55', interval: '4', saveinterest: '2.07', taxes: 'true', taxrate: '38.92', taxfree: '1079.68', taxtime: 'false'};
      data[8] = {principal: '307254.03', debtinterest: '6.11', selection: '4', term: '3.58', initrepay: '5.04', repay: '27097.05', interval: '1', saveinterest: '0.78', taxes: 'false', taxrate: '18.53', taxfree: '2986.93', taxtime: 'true'};
      data[9] = {principal: '725952.36', debtinterest: '2.8', selection: '2', term: '8.08', initrepay: '2.98', repay: '2340.1', interval: '12', saveinterest: '3.41', taxes: 'false', taxrate: '19.3', taxfree: '2179.28', taxtime: 'false'};
      data[10]= {principal: '891362.31', debtinterest: '8.22', selection: '2', term: '7.33', initrepay: '2.53', repay: '3196.77', interval: '12', saveinterest: '4.78', taxes: 'false', taxrate: '18.9', taxfree: '1597.97', taxtime: 'false'};
      data[11]= {principal: '37524.2', debtinterest: '1.82', selection: '2', term: '6.33', initrepay: '6.32', repay: '8753.91', interval: '2', saveinterest: '1.09', taxes: 'false', taxrate: '9.27', taxfree: '2602.69', taxtime: 'true'};
      data[12]= {principal: '214879.93', debtinterest: '1.41', selection: '4', term: '6667', initrepay: '3.75', repay: '5039.11', interval: '4', saveinterest: '0.7', taxes: 'false', taxrate: '5.13', taxfree: '3367.27', taxtime: 'false'};
      data[13]= {principal: '407249.68', debtinterest: '3.86', selection: '3', term: '8.08', initrepay: '5.68', repay: '5820.39', interval: '4', saveinterest: '4.3', taxes: 'false', taxrate: '38.23', taxfree: '1740.04', taxtime: 'true'};
      data[14]= {principal: '660696.1', debtinterest: '7.68', selection: '4', term: '7.42', initrepay: '2.77', repay: '7014', interval: '2', saveinterest: '0.36', taxes: 'false', taxrate: '9.21', taxfree: '476.14', taxtime: 'false'};
      data[15]= {principal: '354722.39', debtinterest: '6.03', selection: '2', term: '9.25', initrepay: '2.84', repay: '228.35', interval: '4', saveinterest: '0.98', taxes: 'true', taxrate: '23.39', taxfree: '350.56', taxtime: 'false'};
      data[16]= {principal: '311231.54', debtinterest: '3.19', selection: '4', term: '8.25', initrepay: '6.03', repay: '27427.36', interval: '1', saveinterest: '5.7', taxes: 'true', taxrate: '19.37', taxfree: '3494.56', taxtime: 'false'};
      data[17]= {principal: '693824.91', debtinterest: '9.6', selection: '2', term: '1.58', initrepay: '4.81', repay: '10379.79', interval: '2', saveinterest: '1.58', taxes: 'true', taxrate: '38.58', taxfree: '597.23', taxtime: 'true'};
      data[18]= {principal: '695905.27', debtinterest: '6.37', selection: '3', term: '6.5', initrepay: '3.07', repay: '48865.67', interval: '1', saveinterest: '1.69', taxes: 'true', taxrate: '47.67', taxfree: '356.58', taxtime: 'false'};
      data[19]= {principal: '109944.02', debtinterest: '6.42', selection: '3', term: '5.17', initrepay: '4.37', repay: '9732.32', interval: '4', saveinterest: '0.83', taxes: 'true', taxrate: '34.48', taxfree: '4041.17', taxtime: 'true'};

      expectations[0] = {totalcost: 121494.00, debtinterest: 40000.00, repaysubstitute: 81494.00, interestgain: 28875.50, terminalvalue: 110369.50, pnl: 10369.50, annuity: 1012.45, repayrate: 8.15, term: 10};
      expectations[1] = {totalcost: 208171.98, debtinterest: 45113.22,  repaysubstitute: 163058.76, interestgain: 21209.14,     terminalvalue: 184267.89,   pnl: -6042.16,    annuity: 3652.14, repayrate: 18.87, term: 4.75};
      expectations[2] = {totalcost: 469469.40, debtinterest: 97902.23,  repaysubstitute: 371567.17, interestgain: 73055.88,     terminalvalue: 444623.06,   pnl: 4691.34,     annuity: 15648.98,repayrate: 6.07,  term: 15};
      expectations[3] = {totalcost: 34962.20,  debtinterest: 6040.42,   repaysubstitute: 28921.78,  interestgain: 1502.28,      terminalvalue: 30424.06,    pnl: 668.31,      annuity: 6992.44, repayrate: 38.88, term: 2.5};
      expectations[4] = {totalcost: 1229527.38,debtinterest: 1045263.84,repaysubstitute: 184263.54, interestgain: 566439.69,    terminalvalue: 750703.23,   pnl: 155262.84,   annuity: 1681.98, repayrate: 0.55,  term: 60.92};
      expectations[5] = {totalcost: 55228.72,  debtinterest: 19461.55,  repaysubstitute: 35767.17,  interestgain: 159697.86,    terminalvalue: 169414.45,   pnl: 124839.20,   annuity: 234.02,  repayrate: 1.36,  term: 59.00};
      expectations[6] = {totalcost: 0,         debtinterest: 0,         repaysubstitute: 0,         interestgain: 0,            terminalvalue: 0,           pnl: -434681.74,  annuity: 0,       repayrate: 0,     term: 0};
      expectations[7] = {totalcost: 212579.10, debtinterest: 53756.07,  repaysubstitute: 158823.03, interestgain: 5840.68,      terminalvalue: 163779.10,   pnl: -18831.77,   annuity: 14171.94,repayrate: 23.19, term: 3.75};
      expectations[8] = {totalcost: 541941.00, debtinterest: 375464.42, repaysubstitute: 166476.58, interestgain: 12932.86,     terminalvalue: 179409.44,   pnl: -127844.59,  annuity: 27097.05,repayrate: 2.71,  term: 20};
      expectations[9] = {totalcost: 996550.95, debtinterest: 482758.32, repaysubstitute: 513792.63, interestgain: 270742.76,    terminalvalue: 784535.39,   pnl: 58583.03,    annuity: 3496.67, repayrate: 2.98,  term: 23.75};
      expectations[10] ={totalcost: 1692845.44,debtinterest: 1294436.35,repaysubstitute: 398409.09, interestgain: 219656.95,    terminalvalue: 618066.05,   pnl: -273296.26,  annuity: 7985.12, repayrate: 2.53,  term: 17.67};
      expectations[11] ={totalcost: 42762.44,  debtinterest: 9561.17,   repaysubstitute: 33201.27,  interestgain: 2555.18,      terminalvalue: 35756.46,    pnl: -1767.74,    annuity: 1527.23, repayrate: 6.32,  term: 14};
      expectations[12] ={totalcost: 236838.17, debtinterest: 35600.23,  repaysubstitute: 201237.94, interestgain: 8295.97,      terminalvalue: 209533.91,   pnl: -5346.02,    annuity: 5039.11, repayrate: 7.97,  term: 11.75};
      expectations[13] ={totalcost: 477475.35, debtinterest: 129688.66, repaysubstitute: 347786.69, interestgain: 65983.13,     terminalvalue: 413769.82,   pnl: 6520.14,     annuity: 14468.95,repayrate: 10.35, term: 8.25};
      expectations[14] ={totalcost: 0,         debtinterest: 0,         repaysubstitute: 0,         interestgain: 0,            terminalvalue: 0,           pnl: -660696.10,  annuity: 0,       repayrate: 0,     term: 0};
      expectations[15] ={totalcost: 605679.69, debtinterest: 411752.88, repaysubstitute: 193926.81, interestgain: 18998.49,     terminalvalue: 209968.10,   pnl: -144754.29,  annuity: 7865.97, repayrate: 2.84,  term: 19.25};
      expectations[16] ={totalcost: 411410.40, debtinterest: 148924.29, repaysubstitute: 262486.11, interestgain: 132252.25,    terminalvalue: 377770.87,   pnl: 66539.33,    annuity: 27427.36,repayrate: 5.62,  term: 15};
      expectations[17] ={totalcost: 1199761.92,debtinterest: 799286.30, repaysubstitute: 400475.62, interestgain: 38427.89,     terminalvalue: 438903.51,   pnl: -269516.47,  annuity: 49990.08,repayrate: 4.81,  term: 12};
      expectations[18] ={totalcost: 884137.17, debtinterest: 310304.16, repaysubstitute: 573833.01, interestgain: 29569.57,     terminalvalue: 590326.66,   pnl: -105578.61,  annuity: 126305.31,repayrate: 11.78, term: 7};
      expectations[19] ={totalcost: 130382.91, debtinterest: 37056.63,  repaysubstitute: 93326.28,  interestgain: 1957.12,      terminalvalue: 95283.40,    pnl: -14660.62,   annuity: 6208.71, repayrate: 16.17, term: 5.25};

    });


    it('Passes 1st test set', function(done){
      debt.repaysurrogat(data[0]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[0]));
        done();
      }).onReject(done);
    });


    it('Passes 2nd test set', function(done){
      debt.repaysurrogat(data[1]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[1]));
        done();
      }).onReject(done);
    });


    it('Passes 3rd test set', function(done){
      debt.repaysurrogat(data[2]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[2]));
        done();
      }).onReject(done);
    });

    it('Passes 4th test set', function(done){
      debt.repaysurrogat(data[3]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[3]));
        done();
      }).onReject(done);
    });

    it('Passes 5th test set', function(done){
      debt.repaysurrogat(data[4]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[4]));
        done();
      }).onReject(done);
    });

    it('Passes 6th test set', function(done){
      debt.repaysurrogat(data[5]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[5]));
        done();
      }).onReject(done);
    });

    it('Passes 7th test set', function(done){
      debt.repaysurrogat(data[6]).then(function(results){
        assert(Array.isArray(results));  // result is error array*/
        done();
      }).onReject(done);
    });

    it('Passes 8th test set', function(done){
      debt.repaysurrogat(data[7]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[7]));
        done();
      }).onReject(done);
    });

    it('Passes 9th test set', function(done){
      debt.repaysurrogat(data[8]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[8]));
        done();
      }).onReject(done);
    });

    it('Passes 10th test set', function(done){
      debt.repaysurrogat(data[9]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[9]));
        done();
      }).onReject(done);
    });

    it('Passes 11th test set', function(done){
      debt.repaysurrogat(data[10]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[10]));
        done();
      }).onReject(done);
    });

    it('Passes 12th test set', function(done){
      debt.repaysurrogat(data[11]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[11]));
        done();
      }).onReject(done);
    });

    it('Passes 13th test set', function(done){
      debt.repaysurrogat(data[12]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[12]));
        done();
      }).onReject(done);
    });

    it('Passes 14th test set', function(done){
      debt.repaysurrogat(data[13]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[13]));
        done();
      }).onReject(done);
    });

    it('Passes 15th test set', function(done){
      debt.repaysurrogat(data[14]).then(function(results){
        assert(Array.isArray(results));  // result is error array*/
        done();
      }).onReject(done);
    });

    it('Passes 16th test set', function(done){
      debt.repaysurrogat(data[15]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[15]));
        done();
      }).onReject(done);
    });

    it('Passes 17th test set', function(done){
      debt.repaysurrogat(data[16]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[16]));
        done();
      }).onReject(done);
    });

    it('Passes 18th test set', function(done){
      debt.repaysurrogat(data[17]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[17]));
        done();
      }).onReject(done);
    });

    it('Passes 19th test set', function(done){
      debt.repaysurrogat(data[18]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[18]));
        done();
      }).onReject(done);
    });

    it('Passes 20th test set', function(done){
      debt.repaysurrogat(data[19]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[19]));
        done();
      }).onReject(done);
    });

  });






  describe("debt-dispo correct", function() {
    var data = [],
        expectations = [];
    before(function () {

      data[0]  = {principal: '500', limit: '1000', dispointerest: '10.5', otherinterest: '15.5', periodchoice: 'days', days: '100', startdate: '', enddate: '', daycount: 'a30E360'};
      data[1]  = {principal: '159.74', limit: '839.45', dispointerest: '0.06', otherinterest: '1.69', periodchoice: 'days', days: '175', startdate: '', enddate: '', daycount: 'act360'};
      data[2]  = {principal: '29.15', limit: '155.63', dispointerest: '5.4', otherinterest: '14.69', periodchoice: 'days', days: '91', startdate: '', enddate: '', daycount: 'act365'};
      data[3]  = {principal: '711.81', limit: '887.81', dispointerest: '0.7', otherinterest: '2.73', periodchoice: 'days', days: '153', startdate: '', enddate: '', daycount: 'actact'};
      data[4]  = {principal: '196.07', limit: '680.79', dispointerest: '3.69', otherinterest: '10.35', periodchoice: 'days', days: '117', startdate: '', enddate: '', daycount: 'a30E360'};
      data[5]  = {principal: '660.28', limit: '325.13', dispointerest: '8.4', otherinterest: '17.61', periodchoice: 'days', days: '118', startdate: '', enddate: '', daycount: 'act360'};
      data[6]  = {principal: '173.56', limit: '582.02', dispointerest: '4.55', otherinterest: '9.19', periodchoice: 'days', days: '84', startdate: '', enddate: '', daycount: 'act365'};
      data[7]  = {principal: '155.97', limit: '745.15', dispointerest: '4.64', otherinterest: '8.52', periodchoice: 'days', days: '45', startdate: '', enddate: '', daycount: 'actact'};
      data[8]  = {principal: '837.78', limit: '958.19', dispointerest: '1.71', otherinterest: '7.42', periodchoice: 'days', days: '142', startdate: '', enddate: '', daycount: 'a30E360'};
      data[9]  = {principal: '170.27', limit: '866.52', dispointerest: '9', otherinterest: '11.56', periodchoice: 'days', days: '141', startdate: '', enddate: '', daycount: 'act360'};
      data[10] = {principal: '263.66', limit: '289.46', dispointerest: '5.33', otherinterest: '5.76', periodchoice: 'dates', days: '', startdate: '31.12.2006', enddate: '24.06.2015', daycount: 'act365'};
      data[11] = {principal: '91.63', limit: '658.32', dispointerest: '4.41', otherinterest: '11.71', periodchoice: 'dates', days: '', startdate: '03.01.2008', enddate: '29.01.2011', daycount: 'actact'};
      data[12] = {principal: '691.63', limit: '973.5', dispointerest: '4.39', otherinterest: '8.05', periodchoice: 'dates', days: '', startdate: '06.01.2008',  enddate: '07.03.2011', daycount: 'a30E360'};
      data[13] = {principal: '630.64', limit: '783.57', dispointerest: '2.76', otherinterest: '12.41', periodchoice: 'dates', days: '', startdate: '18.01.2008',enddate: '27.03.2011', daycount: 'act360'};
      data[14] = {principal: '529.12', limit: '700.12', dispointerest: '6.59', otherinterest: '14.56', periodchoice: 'dates', days: '', startdate: '17.02.2008',enddate: '16.05.2011', daycount: 'act365'};
      data[15] = {principal: '866.6', limit: '265.57', dispointerest: '1.99', otherinterest: '10.21', periodchoice: 'dates', days: '', startdate: '06.03.2008', enddate: '30.06.2011', daycount: 'actact'};
      data[16] = {principal: '770.42', limit: '966.78', dispointerest: '4.98', otherinterest: '12.43', periodchoice: 'dates', days: '', startdate: '13.03.2008',enddate: '06.07.2011', daycount: 'a30E360'};
      data[17] = {principal: '187.15', limit: '432.86', dispointerest: '5.5', otherinterest: '12.04', periodchoice: 'dates', days: '', startdate: '20.03.2008', enddate: '14.07.2011', daycount: 'act360'};
      data[18] = {principal: '973.66', limit: '689.89', dispointerest: '8.83', otherinterest: '9.36', periodchoice: 'dates', days: '', startdate: '04.04.2008', enddate: '15.07.2011', daycount: 'act365'};
      data[19] = {principal: '868.55', limit: '870.55', dispointerest: '4.66', otherinterest: '5.54', periodchoice: 'dates', days: '', startdate: '11.04.2008', enddate: '27.09.2011', daycount: 'actact'};


      expectations[0] = {interestamount: 14.58, averageinterest: 10.5};
      expectations[1] = {interestamount: 0.05, averageinterest: 0.06};
      expectations[2] = {interestamount: 0.39, averageinterest: 5.4};
      expectations[3] = {interestamount: 2.09, averageinterest: 0.7};
      expectations[4] = {interestamount: 2.35, averageinterest: 3.69};
      expectations[5] = {interestamount: 28.30, averageinterest: 13.07};
      expectations[6] = {interestamount: 1.82, averageinterest: 4.55};
      expectations[7] = {interestamount: 0.89, averageinterest: 4.64};
      expectations[8] = {interestamount: 5.65, averageinterest: 1.71};
      expectations[9] = {interestamount: 6.00, averageinterest: 9};
      expectations[10] = {interestamount: 119.24, averageinterest: 5.33};
      expectations[11] = {interestamount: 12.41, averageinterest: 4.41};
      expectations[12] = {interestamount: 96.23, averageinterest: 4.39};
      expectations[13] = {interestamount: 56.28, averageinterest: 2.76};
      expectations[14] = {interestamount: 113.11, averageinterest: 6.59};
      expectations[15] = {interestamount: 220.98, averageinterest: 7.69};
      expectations[16] = {interestamount: 127.14, averageinterest: 4.98};
      expectations[17] = {interestamount: 34.63, averageinterest: 5.5};
      expectations[18] = {interestamount: 286.88, averageinterest: 8.98};
      expectations[19] = {interestamount: 140.07, averageinterest: 4.66};

    });


    it('Passes 1st test set', function(done){
      debt.dispo(data[0]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[0]));
        done();
      }).onReject(done);
    });


    it('Passes 2nd test set', function(done){
      debt.dispo(data[1]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[1]));
        done();
      }).onReject(done);
    });


    it('Passes 3rd test set', function(done){
      debt.dispo(data[2]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[2]));
        done();
      }).onReject(done);
    });

    it('Passes 4th test set', function(done){
      debt.dispo(data[3]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[3]));
        done();
      }).onReject(done);
    });

    it('Passes 5th test set', function(done){
      debt.dispo(data[4]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[4]));
        done();
      }).onReject(done);
    });

    it('Passes 6th test set', function(done){
      debt.dispo(data[5]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[5]));
        done();
      }).onReject(done);
    });

    it('Passes 7th test set', function(done){
      debt.dispo(data[6]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[6]));
        done();
      }).onReject(done);
    });

    it('Passes 8th test set', function(done){
      debt.dispo(data[7]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[7]));
        done();
      }).onReject(done);
    });

    it('Passes 9th test set', function(done){
      debt.dispo(data[8]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[8]));
        done();
      }).onReject(done);
    });

    it('Passes 10th test set', function(done){
      debt.dispo(data[9]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[9]));
        done();
      }).onReject(done);
    });

    it('Passes 11th test set', function(done){
      debt.dispo(data[10]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[10]));
        done();
      }).onReject(done);
    });

    it('Passes 12th test set', function(done){
      debt.dispo(data[11]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[11]));
        done();
      }).onReject(done);
    });

    it('Passes 13th test set', function(done){
      debt.dispo(data[12]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[12]));
        done();
      }).onReject(done);
    });

    it('Passes 14th test set', function(done){
      debt.dispo(data[13]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[13]));
        done();
      }).onReject(done);
    });

    it('Passes 15th test set', function(done){
      debt.dispo(data[14]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[14]));
        done();
      }).onReject(done);
    });

    it('Passes 16th test set', function(done){
      debt.dispo(data[15]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[15]));
        done();
      }).onReject(done);
    });

    it('Passes 17th test set', function(done){
      debt.dispo(data[16]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[16]));
        done();
      }).onReject(done);
    });

    it('Passes 18th test set', function(done){
      debt.dispo(data[17]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[17]));
        done();
      }).onReject(done);
    });

    it('Passes 19th test set', function(done){
      debt.dispo(data[18]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[18]));
        done();
      }).onReject(done);
    });

    it('Passes 20th test set', function(done){
      debt.dispo(data[19]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[19]));
        done();
      }).onReject(done);
    });

  });


});