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




});