/**
 * Created by benjamintanz on 23.08.15.
 */
var assert = require('assert');
var mongoose = require('../config/mongoose');
var _ = require('underscore');
var boerse = require('../app/modules/boerse');

/** initialize */
var ROUND_PRECISION = 100;   // 1/100 rounding precision
var db = mongoose();

describe("Boerse calculators are correct", function(){

  describe("Boerse-options correct", function(){
    var data = [],
        expectations = [];

    before(function(){
      data[0] = {optiontype: '1', price: '63.92', strike: '49.34', interest: '0.04', maturity: '703', vola: '73'};
      data[1] = {optiontype: '2', price: '72.91', strike: '71.11', interest: '4.91', maturity: '815', vola: '38'};
      data[2] = {optiontype: '1', price: '94.85', strike: '82.64', interest: '1.24', maturity: '200', vola: '69'};
      data[3] = {optiontype: '1', price: '2.07', strike: '95', interest: '1.88', maturity: '166', vola: '5'};
      data[4] = {optiontype: '2', price: '68.83', strike: '74.31', interest: '1.42', maturity: '162', vola: '14'};
      data[5] = {optiontype: '1', price: '82.77', strike: '35.32', interest: '0.59', maturity: '1', vola: '58'};
      data[6] = {optiontype: '2', price: '7.95', strike: '72.18', interest: '3.13', maturity: '259', vola: '26'};
      data[7] = {optiontype: '1', price: '41.41', strike: '85.05', interest: '0.18', maturity: '226', vola: '27'};
      data[8] = {optiontype: '1', price: '88.73', strike: '92.26', interest: '4.82', maturity: '272', vola: '47'};
      data[9] = {optiontype: '2', price: '28.48', strike: '95.81', interest: '1.72', maturity: '944', vola: '32'};
      data[10] = {optiontype: '1', price: '65.51', strike: '9.35', interest: '3.71', maturity: '715', vola: '72'};
      data[11] = {optiontype: '2', price: '56.15', strike: '73.39', interest: '2.04', maturity: '532', vola: '40'};
      data[12] = {optiontype: '2', price: '78.88', strike: '13.28', interest: '1.31', maturity: '955', vola: '69'};
      data[13] = {optiontype: '2', price: '56.99', strike: '52.72', interest: '2.99', maturity: '544', vola: '31'};
      data[14] = {optiontype: '1', price: '73.49', strike: '3.72', interest: '0.71', maturity: '28', vola: '51'};
      data[15] = {optiontype: '2', price: '18.53', strike: '66.76', interest: '4.9', maturity: '993', vola: '22'};
      data[16] = {optiontype: '1', price: '5.94', strike: '50.27', interest: '0.91', maturity: '809', vola: '23'};
      data[17] = {optiontype: '1', price: '77.9', strike: '91.8', interest: '0.87', maturity: '812', vola: '33'};
      data[18] = {optiontype: '1', price: '5.01', strike: '89.86', interest: '4.2', maturity: '519', vola: '58'};
      data[19] = {optiontype: '2', price: '85.61', strike: '42.52', interest: '2.1', maturity: '102', vola: '53'};

      expectations[0]  = {value: 29.9, delta: 0.78};
      expectations[1]  = {value: 11.09, delta: -0.30};
      expectations[2]  = {value: 24.91, delta: 0.70};
      expectations[3]  = {value: 0, delta: 0};
      expectations[4]  = {value: 5.88, delta: -0.76};
      expectations[5]  = {value: 47.45, delta: 1};
      expectations[6]  = {value: 62.64, delta: -1};
      expectations[7]  = {value: 0, delta: 0};
      expectations[8]  = {value: 14.15, delta: 0.58};
      expectations[9]  = {value: 63.26, delta: -0.98};
      expectations[10] = {value: 57.00, delta: 0.99};
      expectations[11] = {value: 21.11, delta: -0.60};
      expectations[12] = {value: 0.69, delta: -0.01};
      expectations[13] = {value: 5.19, delta: -0.3};
      expectations[14] = {value: 69.77, delta: 1};
      expectations[15] = {value: 39.9, delta: -1};
      expectations[16] = {value: 0, delta: 0};
      expectations[17] = {value: 10.94, delta: 0.48};
      expectations[18] = {value: 0.00, delta: 0.00};
      expectations[19] = {value: 0.03, delta: 0.00};

    });

    it('Passes 1st test set', function(done){
      boerse.blackScholes(data[0]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[0]));
        done();
      }).onReject(done);
    });

    it('Passes 2nd test set', function(done){
      boerse.blackScholes(data[1]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[1]));
        done();
      }).onReject(done);
    });

    it('Passes 3rd test set', function(done){
      boerse.blackScholes(data[2]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[2]));
        done();
      }).onReject(done);
    });

    it('Passes 4th test set', function(done){
      boerse.blackScholes(data[3]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[3]));
        done();
      }).onReject(done);
    });

    it('Passes 5th test set', function(done){
      boerse.blackScholes(data[4]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[4]));
        done();
      }).onReject(done);
    });

    it('Passes 6th test set', function(done){
      boerse.blackScholes(data[5]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[5]));
        done();
      }).onReject(done);
    });

    it('Passes 7th test set', function(done){
      boerse.blackScholes(data[6]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[6]));
        done();
      }).onReject(done);
    });

    it('Passes 8th test set', function(done){
      boerse.blackScholes(data[7]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[7]));
        done();
      }).onReject(done);
    });

    it('Passes 9th test set', function(done){
      boerse.blackScholes(data[8]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[8]));
        done();
      }).onReject(done);
    });

    it('Passes 10th test set', function(done){
      boerse.blackScholes(data[9]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[9]));
        done();
      }).onReject(done);
    });

    it('Passes 11th test set', function(done){
      boerse.blackScholes(data[10]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[10]));
        done();
      }).onReject(done);
    });

    it('Passes 12th test set', function(done){
      boerse.blackScholes(data[11]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[11]));
        done();
      }).onReject(done);
    });

    it('Passes 13th test set', function(done){
      boerse.blackScholes(data[12]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[12]));
        done();
      }).onReject(done);
    });

    it('Passes 14th test set', function(done){
      boerse.blackScholes(data[13]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[13]));
        done();
      }).onReject(done);
    });

    it('Passes 15th test set', function(done){
      boerse.blackScholes(data[14]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[14]));
        done();
      }).onReject(done);
    });

    it('Passes 16th test set', function(done){
      boerse.blackScholes(data[15]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[15]));
        done();
      }).onReject(done);
    });

    it('Passes 17th test set', function(done){
      boerse.blackScholes(data[16]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[16]));
        done();
      }).onReject(done);
    });

    it('Passes 18th test set', function(done){
      boerse.blackScholes(data[17]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[17]));
        done();
      }).onReject(done);
    });

    it('Passes 19th test set', function(done){
      boerse.blackScholes(data[18]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[18]));
        done();
      }).onReject(done);
    });

    it('Passes 20th test set', function(done){
      boerse.blackScholes(data[19]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[19]));
        done();
      }).onReject(done);
    });


  });


  describe("Boerse-equityreturn correct", function(){
    var data = [],
        expectations = [];

    before(function(){
      data[0] = {quantity: '99',  buy: '92.27', sell: '28.44', buydate: '30.01.2016', selldate: '05.04.2016', fees: 'false', dividends: '0'};
      data[1] = {quantity: '174', buy: '87.84', sell: '47.59', buydate: '27.06.2015', selldate: '08.09.2016', fees: 'true', feebuy: '4.22', feesell: '2.94', dividends: '2', dividendDate0: '04.07.2015', dividendAmount0: '3.12', dividendDate1: '20.11.2015', dividendAmount1: '10.19'};
      data[2] = {quantity: '8', buy: '33.92', sell: '76.93', buydate: '26.02.2015', selldate: '07.09.2016', fees: 'false', feebuy: '0', feesell: '0', dividends: '3', dividendDate0: '10.05.2015', dividendAmount0: '17.39', dividendDate1: '02.06.2015', dividendAmount1: '9.51', dividendDate2: '16.06.2015', dividendAmount2: '7.72'};
      data[3] = {quantity: '122', buy: '79.93', sell: '96.04', buydate: '16.07.2015', selldate: '10.04.2016', fees: 'false', feebuy: '0', feesell: '0', dividends: '0'};
      data[4] = {quantity: '92', buy: '26.47', sell: '14.97', buydate: '01.02.2015', selldate: '01.11.2015', fees: 'true', feebuy: '1.58', feesell: '4.51', dividends: '1', dividendDate0: '26.04.2015', dividendAmount0: '19.45'};
      data[5] = {quantity: '40', buy: '88.52', sell: '32.43', buydate: '24.02.2017', selldate: '30.01.2018', fees: 'false', feebuy: '0', feesell: '0', dividends: '1', dividendDate0: '03.06.2017', dividendAmount0: '17.22'};
      data[6] = {quantity: '172', buy: '89.42', sell: '69.91', buydate: '02.08.2015', selldate: '28.11.2017', fees: 'true', feebuy: '1.31', feesell: '1.63', dividends: '0'};
      data[7] = {quantity: '1', buy: '27.59', sell: '44.2', buydate: '10.08.2015', selldate: '11.09.2016', fees: 'true', feebuy: '1.61', feesell: '3.99', dividends: '3', dividendDate0: '31.10.2015', dividendAmount0: '7.12', dividendDate1: '01.10.2015', dividendAmount1: '14.73', dividendDate2: '25.09.2015', dividendAmount2: '11.08'};
      data[8] = {quantity: '175', buy: '93.83', sell: '18.83', buydate: '14.08.2017', selldate: '09.02.2020', fees: 'true', feebuy: '3.83', feesell: '2.33', dividends: '3', dividendDate0: '02.09.2017', dividendAmount0: '8.21', dividendDate1: '14.10.2017', dividendAmount1: '10.79', dividendDate2: '18.10.2017', dividendAmount2: '2.98'};
      data[9] = {quantity: '68', buy: '49.43', sell: '65.26', buydate: '02.11.2016', selldate: '21.10.2017', fees: 'false', feebuy: '0', feesell: '0', dividends: '2', dividendDate0: '30.11.2016', dividendAmount0: '7.52', dividendDate1: '07.01.2017', dividendAmount1: '17.09'};
      data[10]= {quantity: '74', buy: '5.81', sell: '73.85', buydate: '06.08.2015', selldate: '02.08.2017', fees: 'true', feebuy: '0.15', feesell: '0.29', dividends: '1', dividendDate0: '19.10.2015', dividendAmount0: '2.24'};
      data[11]= {quantity: '199', buy: '93.7', sell: '58.73', buydate: '15.04.2017', selldate: '19.02.2019', fees: 'true', feebuy: '0.69', feesell: '2.56', dividends: '2', dividendDate0: '04.05.2017', dividendAmount0: '0.44', dividendDate1: '16.10.2017', dividendAmount1: '15.94'};
      data[12]= {quantity: '57', buy: '84.92', sell: '18.76', buydate: '07.03.2016', selldate: '04.06.2017', fees: 'false', feebuy: '0', feesell: '0', dividends: '1', dividendDate0: '21.03.2016', dividendAmount0: '13.03'};
      data[13]= {quantity: '192', buy: '49.52', sell: '26.37', buydate: '05.03.2015', selldate: '09.02.2017', fees: 'false', feebuy: '0', feesell: '0', dividends: '2', dividendDate0: '02.05.2015', dividendAmount0: '11.52', dividendDate1: '22.05.2015', dividendAmount1: '4.54'};
      data[14]= {quantity: '14', buy: '62.83', sell: '16.29', buydate: '23.08.2016', selldate: '11.03.2019', fees: 'true', feebuy: '4.48', feesell: '2.33', dividends: '2', dividendDate0: '28.08.2016', dividendAmount0: '0.25', dividendDate1: '12.10.2016', dividendAmount1: '4.83'};
      data[15]= {quantity: '33', buy: '64.58', sell: '8.46', buydate: '15.06.2016', selldate: '04.08.2016', fees: 'false', feebuy: '0', feesell: '0', dividends: '2', dividendDate0: '26.07.2016', dividendAmount0: '3.65', dividendDate1: '15.10.2016', dividendAmount1: '19.39'};
      data[16]= {quantity: '170', buy: '83.1', sell: '90.11', buydate: '15.09.2017', selldate: '04.10.2019', fees: 'true', feebuy: '3.39', feesell: '0.41', dividends: '2', dividendDate0: '14.10.2017', dividendAmount0: '4.83', dividendDate1: '27.10.2017', dividendAmount1: '13.74'};
      data[17]= {quantity: '172', buy: '17.67', sell: '18.65', buydate: '15.01.2017', selldate: '03.02.2019', fees: 'true', feebuy: '2.08', feesell: '3.9', dividends: '1', dividendDate0: '21.04.2017', dividendAmount0: '14.07'};
      data[18]= {quantity: '150', buy: '29.38', sell: '20.33', buydate: '21.08.2017', selldate: '10.04.2018', fees: 'false', feebuy: '0', feesell: '0', dividends: '0'}
      data[19]= {quantity: '67', buy: '26.86', sell: '54.61', buydate: '22.06.2015', selldate: '17.12.2016', fees: 'false', feebuy: '0', feesell: '0', dividends: '2', dividendDate0: '12.07.2015', dividendAmount0: '14.8', dividendDate1: '26.06.2015', dividendAmount1: '6.09'};


      expectations[0] = {irr: -0.9985096404, holding: 66};
      expectations[1] = {irr: -36.24, holding: 439};
      expectations[2] = {irr: 303.18, holding: 558.96};
      expectations[3] = {irr: 28.29, holding: 269};
      expectations[4] = {irr: 17.12, holding: 273};
      expectations[5] = {irr: -54.27871953, holding: 340};
      expectations[6] = {irr: -11.50, holding: 849.04};
      expectations[7] = {irr: 603.85, holding: 398};
      expectations[8] = {irr: -45.24271854, holding: 909};
      expectations[9] = {irr: 141.42, holding: 352.96};
      expectations[10]= {irr: 316.87, holding: 727};
      expectations[11]= {irr: -15.44, holding: 675.04};
      expectations[12]= {irr: -65.83, holding: 454};
      expectations[13]= {irr: -11.11, holding: 707};
      expectations[14]= {irr: -44.2363614, holding: 930};
      expectations[15]= {irr: -93.12255219, holding: 50};
      expectations[16]= {irr: 14.30, holding: 749};
      expectations[17]= {irr: 44.11, holding: 749};
      expectations[18]= {irr: -43.97, holding: 232};
      expectations[19]= {irr: 292, holding: 544.04};


    });


    it('Passes 1st test set', function(done){
      boerse.equityReturn(data[0]).then(function(results){
        assert(Array.isArray(results));
        done();
      }).onReject(done);
    });

    it('Passes 2nd test set', function(done){
      boerse.equityReturn(data[1]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[1]));
        done();
      }).onReject(done);
    });

    it('Passes 3rd test set', function(done){
      boerse.equityReturn(data[2]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[2]));
        done();
      }).onReject(done);
    });

    it('Passes 4th test set', function(done){
      boerse.equityReturn(data[3]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[3]));
        done();
      }).onReject(done);
    });

    it('Passes 5th test set', function(done){
      boerse.equityReturn(data[4]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[4]));
        done();
      }).onReject(done);
    });

    it('Passes 6th test set', function(done){
      boerse.equityReturn(data[5]).then(function(results){
        assert(Array.isArray(results));
        done();
      }).onReject(done);
    });

    it('Passes 7th test set', function(done){
      boerse.equityReturn(data[6]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[6]));
        done();
      }).onReject(done);
    });

    it('Passes 8th test set', function(done){
      boerse.equityReturn(data[7]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[7]));
        done();
      }).onReject(done);
    });

    it('Passes 9th test set', function(done){
      boerse.equityReturn(data[8]).then(function(results){
        assert(Array.isArray(results));
        done();
      }).onReject(done);
    });

    it('Passes 10th test set', function(done){
      boerse.equityReturn(data[9]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[9]));
        done();
      }).onReject(done);
    });

    it('Passes 11th test set', function(done){
      boerse.equityReturn(data[10]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[10]));
        done();
      }).onReject(done);
    });

    it('Passes 12th test set', function(done){
      boerse.equityReturn(data[11]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[11]));
        done();
      }).onReject(done);
    });

    it('Passes 13th test set', function(done){
      boerse.equityReturn(data[12]).then(function(results){
        assert(Array.isArray(results));
        done();
      }).onReject(done);
    });

    it('Passes 14th test set', function(done){
      boerse.equityReturn(data[13]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[13]));
        done();
      }).onReject(done);
    });

    it('Passes 15th test set', function(done){
      boerse.equityReturn(data[14]).then(function(results){
        assert(Array.isArray(results));
        done();
      }).onReject(done);
    });

    it('Passes 16th test set', function(done){
      boerse.equityReturn(data[15]).then(function(results){
        assert(Array.isArray(results));
        done();
      }).onReject(done);
    });

    it('Passes 17th test set', function(done){
      boerse.equityReturn(data[16]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[16]));
        done();
      }).onReject(done);
    });

    it('Passes 18th test set', function(done){
      boerse.equityReturn(data[17]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[17]));
        done();
      }).onReject(done);
    });

    it('Passes 19th test set', function(done){
      boerse.equityReturn(data[18]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[18]));
        done();
      }).onReject(done);
    });

    it('Passes 20th test set', function(done){
      boerse.equityReturn(data[19]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[19]));
        done();
      }).onReject(done);
    });


  });


});