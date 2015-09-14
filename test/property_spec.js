var assert = require("assert");
var mongoose = require('../config/mongoose');
var _ = require("underscore");
var property = require('../app/modules/property');
//var f = require("../finance");
var ROUND_PRECISION = 100;   // 1/100 rounding precision

describe("Property calculators correct", function() {

  describe("Property-homesave correct", function() {
    var data = [],
        expectations = [];
    before(function () {

      data[0] = {principal: '50000.00', interestsave: '0.50', saving: '250.00', termsave: '10',    initialfee: '0.00',    initialpay: '0.00', income: '30000.00', interestdebt: '2.50', repay: '300', paypercent: '100', bonus: 'true', marriage: 'false'};
      data[1] = {principal: '15135.31', interestsave: '0.74', saving: '71.72',  termsave: '13.05', initialfee: '0',       initialpay: '0', bonus: 'true', marriage: 'true',  income: '14775.34', interestdebt: '2.71', paypercent: '100', repay: '1430.29'};
      data[2] = {principal: '27452.79', interestsave: '2.67', saving: '430.89', termsave: '13.14', initialfee: '1601.08', initialpay: '0', bonus: 'true', marriage: 'false', income: '26329.92', interestdebt: '1.13', paypercent: '100', repay: '188.21'};
      data[3] = {principal: '66450.57', interestsave: '3.22', saving: '517.57', termsave: '10.37', initialfee: '904.59',  initialpay: '0', bonus: 'true', marriage: 'false', income: '27719.64', interestdebt: '5.28', paypercent: '100', repay: '175.57'};
      data[4] = {principal: '64286.94', interestsave: '0.35', saving: '8.11',   termsave: '11.91', initialfee: '914.41',  initialpay: '0', bonus: 'true', marriage: 'false', income: '14880.8',  interestdebt: '0.62', paypercent: '100', repay: '807.87'};
      data[5] = {principal: '21335.94', interestsave: '1.2',  saving: '809.67', termsave: '11.99', initialfee: '1916.02', initialpay: '0', bonus: 'true', marriage: 'false', income: '26878.59', interestdebt: '3.77', paypercent: '100', repay: '505.01'};
      data[6] = {principal: '80528.26', interestsave: '1.24', saving: '964.09', termsave: '7.31',  initialfee: '985.46',  initialpay: '0', bonus: 'true', marriage: 'false', income: '36602.27', interestdebt: '4.08', paypercent: '100', repay: '841.83'};
      data[7] = {principal: '3831.61',  interestsave: '2.82', saving: '366.1',  termsave: '16.87', initialfee: '1259.29', initialpay: '0', bonus: 'true', marriage: 'true',  income: '21691.5',  interestdebt: '5.88', paypercent: '100', repay: '1038.32'}
      data[8] = {principal: '7144.21',  interestsave: '2.45', saving: '720.68', termsave: '5.6',   initialfee: '1244.85', initialpay: '0', bonus: 'true', marriage: 'true',  income: '26287.28', interestdebt: '4.97', paypercent: '100', repay: '1055.79'}
      data[9]= {principal: '124028.2', interestsave: '0.33', saving: '741.25', termsave: '4.2',   initialfee: '788.42',  initialpay: '0', bonus: 'true', marriage: 'true',  income: '39929',    interestdebt: '3.67', paypercent: '100', repay: '244.32'}
      data[10]= {principal: '162580.39',interestsave: '0.5',  saving: '281.85', termsave: '18.39', initialfee: '972.97',  initialpay: '0', bonus: 'true', marriage: 'true',  income: '37417.58', interestdebt: '0.54', paypercent: '100', repay: '1473.16'}
      data[11]= {principal: '166903.55',interestsave: '1.4',  saving: '269.38', termsave: '18.65', initialfee: '723.35',  initialpay: '0', bonus: 'true', marriage: 'false', income: '9137.33',  interestdebt: '2.72', paypercent: '100', repay: '538.33'}
      data[12]= {principal: '157400.22',interestsave: '3.06', saving: '493.02', termsave: '2.7',   initialfee: '1109.28', initialpay: '0', bonus: 'true', marriage: 'false', income: '33367.34', interestdebt: '3.22', paypercent: '100', repay: '34.6'}
      data[13]= {principal: '25576.3',  interestsave: '3.82', saving: '374.96', termsave: '6.64',  initialfee: '832.25',  initialpay: '0', bonus: 'true', marriage: 'false', income: '27788.45', interestdebt: '0.54', paypercent: '100', repay: '654.53'}
      data[14]= {principal: '113483.93',interestsave: '0.46', saving: '756.01', termsave: '14.94', initialfee: '1540.94', initialpay: '0', bonus: 'true', marriage: 'false', income: '5148.43',  interestdebt: '1.82', paypercent: '100', repay: '1084.85'}
      data[15]= {principal: '212973.96',interestsave: '0.49', saving: '100.16', termsave: '2.73',  initialfee: '1170.23', initialpay: '0', bonus: 'true', marriage: 'true',  income: '23444.63', interestdebt: '4.44', paypercent: '100', repay: '1427.4'}
      data[16]= {principal: '209145.78',interestsave: '2.4',  saving: '762.95', termsave: '6.3',   initialfee: '645.22',  initialpay: '0', bonus: 'true', marriage: 'false', income: '26635.23', interestdebt: '4.48', paypercent: '100', repay: '485.5'}
      data[17]= {principal: '98515.38', interestsave: '1.77', saving: '338.94', termsave: '16.69', initialfee: '386.22',  initialpay: '0', bonus: 'true', marriage: 'true',  income: '7823.83',  interestdebt: '1.42', paypercent: '100', repay: '1412.51'}
      data[18]= {principal: '136736.85',interestsave: '0.63', saving: '597.67', termsave: '11.94', initialfee: '1052.85', initialpay: '0', bonus: 'true', marriage: 'false', income: '13936.06', interestdebt: '4.12', paypercent: '100', repay: '1486.05'}
      data[19]= {principal: '36470.85', interestsave: '1.49', saving: '450.97', termsave: '19.03', initialfee: '1770.02', initialpay: '0', bonus: 'true', marriage: 'false', income: '36203.33', interestdebt: '5.84', paypercent: '100', repay: '298.61'}

      expectations[0] = {finalsavingswohnungsbau: 30754.40, totalpays: 30000, totalinterest: 754.40, wohnungsbau: 0, numberpays: 120, savingratio: 61.51, totalloanpay: 50000, totalloanwinterest: 20680.68, totalloan: 19245.60, interestloan: 1435.08, totalloanpays: 68.94, termloan: 5.74};
      expectations[1] = {finalsavingswohnungsbau: 12857.39, totalpays: 11260.04, totalinterest: 557.41, wohnungsbau: 1039.94,  savingratio: 84.95,  irrSave: 2.02, totalloanwinterest: 2284.99, totalloan: 2277.92, termloan: 0.13, irrLoan: 2.74};
      expectations[2] = {finalsavingswohnungsbau: 79037.49, totalpays: 68080.62, totalinterest: 12557.95, wohnungsbau: 0,      savingratio: 287.9,  irrSave: 2.25};
      expectations[3] = {finalsavingswohnungsbau: 75309.86, totalpays: 64696.25, totalinterest: 11518.2,  wohnungsbau: 0,      savingratio: 113.33, irrSave: 2.91};
      expectations[4] = {finalsavingswohnungsbau: 331.51,   totalpays: 1159.73,  totalinterest: -14.57,   wohnungsbau: 100.76, savingratio: 0.52, totalloanwinterest: 65317.07, totalloan: 63955.43, termloan: 6.74, irrLoan: 0.62};
      expectations[5] = {finalsavingswohnungsbau: 123078.3, totalpays: 116592.48, totalinterest: 8401.84, wohnungsbau: 0, savingratio: 576.86, irrSave: 0.9};
      expectations[6] = {finalsavingswohnungsbau: 87669.99, totalpays: 84839.92, totalinterest: 3815.53, wohnungsbau: 0, savingratio: 108.87, irrSave: 0.9};
      expectations[7] = {finalsavingswohnungsbau: 94311.27, totalpays: 74318.3, totalinterest: 19720.39, wohnungsbau: 1531.87, savingratio: 2461.4, irrSave: 2.76};
      expectations[8] = {finalsavingswohnungsbau: 51591.5,  totalpays: 49006.24, totalinterest: 3289.45, wohnungsbau: 540.66, savingratio: 722.14, irrSave: 1.84};
      expectations[9] = {finalsavingswohnungsbau: 37715.51, totalpays: 37803.75, totalinterest: 249.63, wohnungsbau: 450.55, savingratio: 30.41, irrSave: -0.11, totalloanwinterest: 86312.69, totalloan: 86312.69, termloan: 0, irrLoan: 0};
      expectations[10]= {finalsavingswohnungsbau: 65871.51, totalpays: 62288.85, totalinterest: 2843.54, wohnungsbau: 1712.09, savingratio: 40.52, irrSave: 0.61, totalloanwinterest: 98188.26, totalloan: 96708.88, termloan: 5.55, irrLoan: 0.54};
      expectations[11]= {finalsavingswohnungsbau: 68775.75, totalpays: 60341.12, totalinterest: 8301.84, wohnungsbau: 856.14, savingratio: 41.21, irrSave: 1.39, totalloanwinterest: 126735.97, totalloan: 98127.8, termloan: 19.62, irrLoan: 2.75};
      expectations[12]= {};
      expectations[13]= {finalsavingswohnungsbau: 32964.93, totalpays: 29996.8, totalinterest: 3800.38, wohnungsbau: 0, savingratio: 128.89, irrSave: 2.86};
      expectations[14]= {finalsavingswohnungsbau: 139873.67,totalpays: 136081.8, totalinterest: 4656.91, wohnungsbau: 675.9, savingratio: 123.25, irrSave: 0.37};
      expectations[15]= {finalsavingswohnungsbau: 2400.94,  totalpays: 3305.28, totalinterest: 5.81, wohnungsbau: 260.08, savingratio: 1.13, irrSave: -22.51, totalloanwinterest: 305057.8, totalloan: 210573.02, termloan: 17.81, irrLoan: 4.53};
      expectations[16]= {};
      expectations[17]= {finalsavingswohnungsbau: 80154.74, totalpays: 68126.94, totalinterest: 10882.15, wohnungsbau: 1531.87, savingratio: 81.36, irrSave: 1.92, totalloanwinterest: 18514.34, totalloan: 18360.64, termloan: 1.09, irrLoan: 1.43, };
      expectations[18]= {finalsavingswohnungsbau: 88772.9,  totalpays: 86064.48, totalinterest: 3220.55, wohnungsbau: 540.72, savingratio: 64.92, irrSave: 0.52, totalloanwinterest: 50923.47, totalloan: 47963.95, termloan: 2.86, irrLoan: 4.2};
      expectations[19]= {finalsavingswohnungsbau: 116902.11,totalpays: 103272.13, totalinterest: 15400, wohnungsbau: 0, savingratio: 320.54, irrSave: 1.29};

    });

    it('Passes 1st test set', function(done){
      property.homesave(data[0]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[0]));
        done();
      }).onReject(done);
    });


    it('Passes 2nd test set', function(done){
      property.homesave(data[0]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[0]));
        done();
      }).onReject(done);

    });

    it('Passes 3rd test set', function(done){
      property.homesave(data[2]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[2]));
        done();
      }).onReject(done);
    });

    it('Passes 4th test set', function(done){
      property.homesave(data[3]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[3]));
        done();
      }).onReject(done);
    });

    it('Passes 5th test set', function(done){
      property.homesave(data[4]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[4]));
        done();
      }).onReject(done);
    });

    it('Passes 6th test set', function(done){
      property.homesave(data[5]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[5]));
        done();
      }).onReject(done);
    });

    it('Passes 7th test set', function(done){
      property.homesave(data[6]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[6]));
        done();
      }).onReject(done);
    });

    it('Passes 8th test set', function(done){
      property.homesave(data[7]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[7]));
        done();
      }).onReject(done);
    });

    it('Passes 9th test set', function(done){
      property.homesave(data[8]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[8]));
        done();
      }).onReject(done);
    });

    it('Passes 10th test set', function(done){
      property.homesave(data[9]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[9]));
        done();
      }).onReject(done);
    });

    it('Passes 11th test set', function(done){
      property.homesave(data[10]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[10]));
        done();
      }).onReject(done);
    });

    it('Passes 12th test set', function(done){
      property.homesave(data[11]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[11]));
        done();
      }).onReject(done);
    });

    it('Passes 13th test set', function(done){
      property.homesave(data[12]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[12]));
        done();
      }).onReject(done);
    });

    it('Passes 14th test set', function(done){
      property.homesave(data[13]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[13]));
        done();
      }).onReject(done);
    });

    it('Passes 15th test set', function(done){
      property.homesave(data[14]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[14]));
        done();
      }).onReject(done);
    });

    it('Passes 16th test set', function(done){
      property.homesave(data[15]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[15]));
        done();
      }).onReject(done);
    });

    it('Passes 17th test set', function(done){
      property.homesave(data[16]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[16]));
        done();
      }).onReject(done);
    });

    it('Passes 18th test set', function(done){
      property.homesave(data[17]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[17]));
        done();
      }).onReject(done);
    });

    it('Passes 19th test set', function(done){
      property.homesave(data[18]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[18]));
        done();
      }).onReject(done);
    });

    it('Passes 20th test set', function(done){
      property.homesave(data[19]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[19]));
        done();
      }).onReject(done);
    });

  });




  describe("Property-propertyprice correct", function() {
    var data = [],
        expectations = [];
    before(function () {
      data[0] = { rent: 800, income: 200, maintenance: 120, interest: 2.5, initrepay: 1.5, term: 20, equity: 40000, notar: 1.5, makler: 4.5, proptax: 5.5, selection: 2 };
      data[1] =  {rent: '800', income: '450', maintenance: '250', interest: '5',           initrepay: '1.5', term: '',      equity: '50000',    makler: '4', proptax: '5', selection: '2', notar: '1.5'};
      data[2] =  {rent: '800', income: '450', maintenance: '250', interest: '5',           initrepay: '',    term: '29.39', equity: '50000',    makler: '4', proptax: '5', selection: '3', notar: '1.5'};
      data[3] =  {rent: '1805.19', income: '516.85', maintenance: '157.75', interest: '20',initrepay: '1',   term: '',      equity: '20825.91', makler: '8', proptax: '6', selection: '2', notar: '8'};
      data[4] =  {rent: '538.54', income: '867.57', maintenance: '325.99', interest: '12', initrepay: '',    term: '40.91', equity: '41252.44', makler: '2', proptax: '0', selection: '3', notar: '1'};
      data[5] =  {rent: '729.58', income: '70.86', maintenance: '90.16', interest: '16',   initrepay: '4',   term: '',      equity: '98583.16', makler: '4', proptax: '8', selection: '2', notar: '8'};
      data[6] =  {rent: '1846.70', income: '913.16', maintenance: '307.37', interest: '5', initrepay: '0',   term: '',      equity: '15480.22', makler: '3', proptax: '3', selection: '2', notar: '3'};
      data[7] =  {rent: '1933.51', income: '550.52', maintenance: '172.29', interest: '7', initrepay: '',    term: '23.17', equity: '59870.08', makler: '6', proptax: '5', selection: '3', notar: '8'};
      data[8] =  {rent: '623.04', income: '244.05', maintenance: '223.04', interest: '20', initrepay: '1',   term: '',      equity: '91440.9',  makler: '5', proptax: '3', selection: '2', notar: '0'};
      data[9] =  {rent: '1309.51', income: '792.33', maintenance: '43.97', interest: '3',  initrepay: '',    term: '23.62', equity: '53265.06', makler: '10', proptax: '0', selection: '3', notar: '0'};
      data[10] = {rent: '456.65', income: '724.83', maintenance: '340.72', interest: '11', initrepay: '0',   term: '',      equity: '69769.83', makler: '6', proptax: '10',selection: '2', notar: '4'};
      data[11] = {rent: '1102.07', income: '871.13', maintenance: '145.69', interest: '19',initrepay: '0',   term: '',      equity: '84462.51', makler: '8', proptax: '1', selection: '2', notar: '10'};
      data[12] = {rent: '817.39', income: '553.19', maintenance: '143.91', interest: '0',  initrepay: '',    term: '10.2',  equity: '30724.67', makler: '9', proptax: '7', selection: '3', notar: '6'};
      data[13] = {rent: '1991.20', income: '52.26', maintenance: '131.67', interest: '1',  initrepay: '',    term: '22.56', equity: '68497.75', makler: '1', proptax: '3', selection: '3', notar: '8'};
      data[14] = {rent: '780.88', income: '236.00', maintenance: '212.60', interest: '0',  initrepay: '2',   term: '',      equity: '67206.07', makler: '1', proptax: '9', selection: '2', notar: '4'};
      data[15] = {rent: '654.36', income: '926.12', maintenance: '193.71', interest: '17', initrepay: '',    term: '44.55', equity: '878.16',   makler: '2', proptax: '7', selection: '3', notar: '9'};
      data[16] = {rent: '1088.26', income: '59.31', maintenance: '104.70', interest: '7',  initrepay: '',    term: '27.26', equity: '93423.1',  makler: '3', proptax: '2', selection: '3', notar: '7'};
      data[17] = {rent: '576.21', income: '487.20', maintenance: '99.95', interest: '2',   initrepay: '',    term: '11.71', equity: '6207.42',  makler: '8', proptax: '3', selection: '3', notar: '2'};
      data[18] = {rent: '405.38', income: '560.28', maintenance: '24.81', interest: '7',   initrepay: '2',   term: '',      equity: '32227.53', makler: '6', proptax: '3', selection: '2', notar: '5'};
      data[19] = {rent: '1350.85', income: '94.69', maintenance: '370.78', interest: '9',  initrepay: '',    term: '47.14', equity: '73596.3',  makler: '4', proptax: '7', selection: '3', notar: '3'};
      data[20] = {rent: '257.11', income: '854.70', maintenance: '115.82', interest: '13', initrepay: '1',   term: '',      equity: '97999.41', makler: '6', proptax: '5', selection: '2', notar: '4'};

      expectations[0] = {maxprice: 272645.74,notar: 4089.69,  makler: 12269.06, proptax: 14995.52, totalpropcost: 304000, loan: 264000, rate: 880, term: 39.27, initrepay: 1.5, interest: 150691.20, totalcost: 454691.20};
      expectations[1] = {makler: 8492.86,   notar: 3184.82,   proptax: 10616.08,    totalpropcost: 234615.38,  loan: 184615.38, rate: 1000.00, term: 29.39,  interest: 168064.62,   totalcost: 402680.0000, initrepay: 1.50,  maxprice: 212321.62};
      expectations[2] = {makler: 8493.09,   notar: 3184.91,   proptax: 10616.36,    totalpropcost: 234621.47,  loan: 184621.47, rate: 1000.00, term: 29.39,  interest: 168058.53,   totalcost: 402680.0000, initrepay: 1.50,  maxprice: 212327.13};
      expectations[3] = {makler: 9475.39,   notar: 9475.39,   proptax: 7106.54,     totalpropcost: 144499.62,  loan: 123673.71, rate: 2164.29, term: 15.35,  interest: 274988.50,   totalcost: 419488.13,   initrepay: 1.00,  maxprice: 118442.31};
      expectations[4] = {makler: 2882.48,   notar: 1441.24,   proptax: 0.00,        totalpropcost: 148447.81,  loan: 107195.37, rate: 1080.12, term: 40.91,  interest: 423057.14,   totalcost: 571504.95,   initrepay: 0.09,  maxprice: 144124.09};
      expectations[5] = {makler: 4706.67,   notar: 9413.33,   proptax: 9413.33,     totalpropcost: 141199.96,  loan: 42616.80,  rate: 710.28,  term: 10.13,  interest: 43724.84,    totalcost: 184924.80,   initrepay: 4.00,  maxprice: 117666.63};
      expectations[6] = {makler: 16626.00,  notar: 16626.00,  proptax: 16626.00,    totalpropcost: 604077.82,  loan: 588597.60, rate: 2452.49, term: Infinity,interest: Infinity,   totalcost: Infinity,    initrepay: 0,     maxprice: 554199.83};
      //expectations[7] = {makler: 19034.65,  notar: 25379.54,  proptax: 15862.21,    totalpropcost: 377520.59,  loan: 317650.51, rate: 2311.74, term: 23.17,  interest: 325105.68,   totalcost: 702626.27,   initrepay: 1.73,  maxprice: 317244.19};
      expectations[8] = {makler: 5937.21,   notar: 0.00,      proptax: 3562.33,     totalpropcost: 128243.76,  loan: 36802.86,  rate: 644.05,  term: 15.35,  interest: 81831.15,    totalcost: 210074.91,   initrepay: 1.00,  maxprice: 118744.22};
      expectations[9] = {makler: 42799.24,  notar: 0.00,      proptax: 0.00,        totalpropcost: 470791.63,  loan: 417526.57, rate: 2057.87, term: 23.62,  interest: 165756.10,   totalcost: 636547.73,   initrepay: 2.91,  maxprice: 427992.39};
      expectations[10]= {makler: 8074.46,   notar: 5382.97,   proptax: 13457.43,    totalpropcost: 161489.10,  loan: 91719.27,  rate: 840.76,  term: Infinity,interest: Infinity,   totalcost: Infinity,    initrepay: 0.0000,maxprice: 134574.25};
      expectations[11]= {makler: 13437.59,  notar: 16796.99,  proptax: 1679.70,     totalpropcost: 199884.19,  loan: 115421.68, rate: 1827.51, term: Infinity,interest: Infinity,   totalcost: Infinity,    initrepay: 0.0000,maxprice: 167969.91};
      expectations[12]= {makler: 13342.80,  notar: 8895.20,   proptax: 10377.73,    totalpropcost: 180869.08,  loan: 150144.41, rate: 1226.67, term: 10.20,  interest: 0.00,        totalcost: 180869.08,   initrepay: 9.80,  maxprice: 148253.34};
      expectations[13]= {makler: 4746.95,   notar: 37975.58,  proptax: 14240.84,    totalpropcost: 531658.17,  loan: 463160.42, rate: 1911.79, term: 22.56,  interest: 54399.37,    totalcost: 586057.54,   initrepay: 3.95,  maxprice: 474694.80};
      expectations[14]= {makler: 4822.58,   notar: 19290.32,  proptax: 43403.22,    totalpropcost: 549774.07,  loan: 482568.00, rate: 804.28,  term: 50.00,  interest: 0.00,        totalcost: 549774.07,   initrepay: 2.00,  maxprice: 482257.96};
      expectations[15]= {makler: 1673.13,   notar: 7529.09,   proptax: 5855.96,     totalpropcost: 98714.76,   loan: 97836.60,  rate: 1386.77, term: 44.55,  interest: 643530.65,   totalcost: 742245.40,   initrepay: 0.01,  maxprice: 83656.57};
      expectations[16]= {makler: 6576.76,   notar: 15345.76,  proptax: 4384.50,     totalpropcost: 245532.20,  loan: 152109.10, rate: 1042.87, term: 27.26,  interest: 189034.53,   totalcost: 434566.73,   initrepay: 1.23,  maxprice: 219225.18};
      expectations[17]= {makler: 8978.30,   notar: 2244.57,   proptax: 3366.86,     totalpropcost: 126818.46,  loan: 120611.04, rate: 963.46,  term: 11.71,  interest: 14774.36,    totalcost: 141592.82,   initrepay: 7.59,  maxprice: 112228.72};
      expectations[18]= {makler: 8298.64,   notar: 6915.53,   proptax: 4149.32,     totalpropcost: 157674.20,  loan: 125446.67, rate: 940.85,  term: 21.55,  interest: 117857.14,   totalcost: 275531.34,   initrepay: 2.00,  maxprice: 138310.70};
      expectations[19]= {makler: 7537.04,   notar: 5652.78,   proptax: 13189.81,    totalpropcost: 214805.51,  loan: 141209.21, rate: 1074.76, term: 47.14,  interest: 466761.03,   totalcost: 681566.54,   initrepay: 0.13,  maxprice: 188425.88};
      expectations[20]= {makler: 9567.13,   notar: 6378.09,   proptax: 7972.61,     totalpropcost: 183369.98,  loan: 85370.57,  rate: 995.99,  term: 20.41,  interest: 158567.30,   totalcost: 341937.28,   initrepay: 1.00,  maxprice: 159452.16};


    });

    it('Passes 1st test set', function(done){
      property.propertyprice(data[0]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[0]));
        done();
      }).onReject(done);
    });

    it('Passes 2nd test set', function(done){
      property.propertyprice(data[1]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[1]));
        done();
      }).onReject(done);
    });

    it('Passes 3rd test set', function(done){
      property.propertyprice(data[2]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[2]));
        done();
      }).onReject(done);
    });

    it('Passes 4th test set', function(done){
      property.propertyprice(data[3]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[3]));
        done();
      }).onReject(done);
    });

    it('Passes 5th test set', function(done){
      property.propertyprice(data[4]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[4]));
        done();
      }).onReject(done);
    });

    it('Passes 6th test set', function(done){
      property.propertyprice(data[5]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[5]));
        done();
      }).onReject(done);
    });

    it('Passes 7th test set', function(done){
      property.propertyprice(data[6]).then(function(results){
        assert(Array.isArray(results));
        done();
      }).onReject(done);
    });

    it('Passes 8th test set', function(done){
      property.propertyprice(data[7]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[7]));
        done();
      }).onReject(done);
    });

    it('Passes 9th test set', function(done){
      property.propertyprice(data[8]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[8]));
        done();
      }).onReject(done);
    });

    it('Passes 10th test set', function(done){
      property.propertyprice(data[9]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[9]));
        done();
      }).onReject(done);
    });

    it('Passes 11th test set', function(done){
      property.propertyprice(data[10]).then(function(results){
        assert(Array.isArray(results));
        done();
      }).onReject(done);
    });

    it('Passes 12th test set', function(done){
      property.propertyprice(data[11]).then(function(results){
        assert(Array.isArray(results));
        done();
      }).onReject(done);
    });

    it('Passes 13th test set', function(done){
      property.propertyprice(data[12]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[12]));
        done();
      }).onReject(done);
    });

    it('Passes 14th test set', function(done){
      property.propertyprice(data[13]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[13]));
        done();
      }).onReject(done);
    });

    it('Passes 15th test set', function(done){
      property.propertyprice(data[14]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[14]));
        done();
      }).onReject(done);
    });

    it('Passes 16th test set', function(done){
      property.propertyprice(data[15]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[15]));
        done();
      }).onReject(done);
    });

    it('Passes 17th test set', function(done){
      property.propertyprice(data[16]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[16]));
        done();
      }).onReject(done);
    });

    it('Passes 18th test set', function(done){
      property.propertyprice(data[17]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[17]));
        done();
      }).onReject(done);
    });

    it('Passes 19th test set', function(done){
      property.propertyprice(data[18]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[18]));
        done();
      }).onReject(done);
    });

    it('Passes 20th test set', function(done){
      property.propertyprice(data[19]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[19]));
        done();
      }).onReject(done);
    });

  });








  describe("Property-buyrent correct", function() {
    var data = [],
        expectations = [];
    before(function () {
      data[0] = {price: '200000.00', priceaddon: '20000.00', maintenance: '250',    rent: '800',     equity: '80000',income: '1500',equityinterest: '1.00',debtinterest: '3.00',debtpay: '1000',period: '20',incomedynamic: '0.00', rentdynamic: '0.00', valuedynamic: '0.00', costdynamic: '0.00', dynamics: 'false' };
      data[1] = {price: '434298.64', priceaddon: '20782.72', maintenance: '640.14', rent: '1542.83', equity: '128580.07',income: '219.72',equityinterest: '3.81',debtinterest: '2.30',debtpay: '191.55',period: '10',incomedynamic: '0.00', rentdynamic: '4.66', valuedynamic: '0.99', costdynamic: '3.06', dynamics: 'true'};
      data[2] = {price: '183141.41', priceaddon: '8560.27',  maintenance: '564.75', rent: '1650.05', equity: '87709.08',income: '2181.59',equityinterest: '0.27',debtinterest: '8.89',debtpay: '676.41',period: '10',incomedynamic: '2.74', rentdynamic: '0.00', valuedynamic: '4.59', costdynamic: '1.72', dynamics: 'true'};
      data[3] = {price: '272895.85', priceaddon: '2150.47',  maintenance: '678.68', rent: '123.58',  equity: '173879.34',income: '2821.37',equityinterest: '2.07',debtinterest: '0.21',debtpay: '1535.28',period: '1',incomedynamic: '0.00', rentdynamic: '0.00', valuedynamic: '1.32', costdynamic: '0.00', dynamics: 'true' };
      data[4] = {price: '424010.44', priceaddon: '12708.46', maintenance: '264.73', rent: '1724.88', equity: '112756.63',income: '703.01',equityinterest: '1.51',debtinterest: '9.01',debtpay: '446.20',period: '8',incomedynamic: '4.02', rentdynamic: '0.00', valuedynamic: '0.65', costdynamic: '0.00', dynamics: 'true' };
      data[5] = {price: '546704.27', priceaddon: '3857.84',  maintenance: '433.26', rent: '2315.18', incomedynamic: '1.77',  valuedynamic: '4.80',  costdynamic: '0',     rentdynamic: '1.70',  equity: '219032.27', debtinterest: '3.90', debtpay: '3786.14', income: '5653.76', period: '28', equityinterest: '3.96',  dynamics: 'true'};
      data[6] = {price: '281118.86', priceaddon: '8993.02',  maintenance: '466.63', rent: '1120.27', incomedynamic: '2.67',  valuedynamic: '0.76',  costdynamic: '2.85',  rentdynamic: '0',     equity: '195240.39', debtinterest: '3.48', debtpay: '2840.32', income: '4048.65', period: '25', equityinterest: '1.33',  dynamics: 'true'};
      data[7] = {price: '152064.59', priceaddon: '2679.83',  maintenance: '573.18', rent: '796.26',  incomedynamic: '0.5',   valuedynamic: '3.15',  costdynamic: '3.51',  rentdynamic: '0',     equity: '652.72',    debtinterest: '4.93', debtpay: '2801.53', income: '3872.84', period: '11', equityinterest: '0.42',  dynamics: 'true'};
      data[8] = {price: '160721.4',  priceaddon: '7181.58',  maintenance: '760.72', rent: '2488.12', incomedynamic: '0',     valuedynamic: '0.04',  costdynamic: '4.88',  rentdynamic: '2.77',  equity: '134882.66', debtinterest: '9.39', debtpay: '2156.47', income: '2245.48', period: '4',  equityinterest: '0.1',   dynamics: 'true'};
      data[9] = {price: '565338.1',  priceaddon: '2763.53',  maintenance: '236.96', rent: '1161.77', incomedynamic: '4.18',  valuedynamic: '4.62',  costdynamic: '0.85',  rentdynamic: '4.52',  equity: '117327.16', debtinterest: '3.69', debtpay: '337.99',  income: '2311.18', period: '26', equityinterest: '1.64',  dynamics: 'true'};
      data[10] ={price: '474858.05', priceaddon: '15075.99', maintenance: '183.84', rent: '2918.99', incomedynamic: '0.74',  valuedynamic: '0',     costdynamic: '0',     rentdynamic: '1.04',  equity: '388136.93', debtinterest: '9.37', debtpay: '212.15',  income: '832.96',  period: '23', equityinterest: '4.43',  dynamics: 'true'};
      data[11] ={price: '227557.56', priceaddon: '4212.06',  maintenance: '723.78', rent: '2058.85', incomedynamic: '1.27',  valuedynamic: '4.98',  costdynamic: '2.54',  rentdynamic: '0',     equity: '90108.02',  debtinterest: '7.82', debtpay: '1675.22', income: '2044.07', period: '38', equityinterest: '4.49',  dynamics: 'true'};
      data[12] ={price: '113165.74', priceaddon: '230.27',   maintenance: '467.36', rent: '1260.51', incomedynamic: '0',     valuedynamic: '0',     costdynamic: '0.3',   rentdynamic: '1.95',  equity: '89528.5',   debtinterest: '0.43', debtpay: '348.24',  income: '2153.31', period: '35', equityinterest: '1.85',  dynamics: 'true'};
      data[13] ={price: '268904.02', priceaddon: '7610.3',   maintenance: '297.39', rent: '2013.39', incomedynamic: '0',     valuedynamic: '0',     costdynamic: '0.16',  rentdynamic: '0',     equity: '6327.92',   debtinterest: '4.24', debtpay: '2717.03', income: '4157.73', period: '11', equityinterest: '2.11',  dynamics: 'true'};
      data[14] ={price: '571427.67', priceaddon: '11734.95', maintenance: '712.61', rent: '483.21',  incomedynamic: '0.14',  valuedynamic: '0.38',  costdynamic: '4.19',  rentdynamic: '4.34',  equity: '71523.95',  debtinterest: '2.59', debtpay: '931.8',   income: '2418.71', period: '30', equityinterest: '2.14',  dynamics: 'true'};
      data[15] ={price: '183133.18', priceaddon: '8964.56',  maintenance: '781.27', rent: '2515.02', incomedynamic: '0',     valuedynamic: '1.99',  costdynamic: '0',     rentdynamic: '0',     equity: '47294.62',  debtinterest: '1.76', debtpay: '1433.91', income: '2288.99', period: '34', equityinterest: '3.78',  dynamics: 'true'};
      data[16] ={price: '561667.58', priceaddon: '21076.26', maintenance: '913.99', rent: '2415.7',  incomedynamic: '2.71',  valuedynamic: '3.36',  costdynamic: '1.78',  rentdynamic: '0',     equity: '224089.51', debtinterest: '0',    debtpay: '3133.39', income: '4318.58', period: '40', equityinterest: '0',  dynamics: 'true'};
      data[17] ={price: '254589.13', priceaddon: '6650.68',  maintenance: '239.34', rent: '2532.79', incomedynamic: '0',     valuedynamic: '0',     costdynamic: '0',     rentdynamic: '0',     equity: '21907.9',   debtinterest: '0',    debtpay: '2277.03', income: '3672.03', period: '15', equityinterest: '0',     dynamics: 'true'};
      data[18] ={price: '373742.81', priceaddon: '2856.4',   maintenance: '981.09', rent: '1348.9',  incomedynamic: '4.13',  valuedynamic: '1.56',  costdynamic: '1.85',  rentdynamic: '0',     equity: '342928.24', debtinterest: '8.36', debtpay: '1839.17', income: '3783.6',  period: '8',  equityinterest: '3.42',  dynamics: 'true'};
      data[19] ={price: '503715.76', priceaddon: '18316.18', maintenance: '527.89', rent: '2607.74', incomedynamic: '0',     valuedynamic: '0',     costdynamic: '3.99',  rentdynamic: '0',     equity: '398826.38', debtinterest: '7.93', debtpay: '981.43',  income: '2509.59', period: '25', equityinterest: '3.63',  dynamics: 'true'};

      expectations[0] = {rentFinalWealth: 283576.70, rentEquity: 80000,    rentFinalIncome: 360000,    rentFinalCost: -192000,    rentFinalInterest: 35576.70, buyFinalWealth: 336001.24 ,buyEquity: 80000,    buyPrice: -220000,    buyLoan: 140000,    buyFinalIncome: 360000,    buyInterestSave: 8530.02, buyInterestLoan: -32528.78, buyMaintenance: -60000,    buyRepay: -140000,  buyResidual: 0, buyPropValue: 200000};
      expectations[1] = {buyEquity: 128580.07,buyLoan: 326501.29,buyPrice: -455081.36,buyFinalIncome: 26366.4,buyInterestSave: 0,buyMaintenance: -88305.57,buyInterestLoan: -81512.21,buyRepay: 58526.21,buyResidual: -385027.5,buyPropValue: 479261.11,buyFinalWealth: 9308.44,rentEquity: 128580.07,rentFinalIncome: 26366.4,rentFinalInterest: 20931.33,rentFinalCost: -229204.19,rentFinalWealth: -53326.39};
      expectations[2] = {buyEquity: 87709.08,buyLoan: 103992.6,buyPrice: -191701.68,buyFinalIncome: 296545.01,buyInterestSave: 1815.67,buyMaintenance: -73263.38,buyInterestLoan: -99247.21,buyRepay: 18078.01,buyResidual: -122070.61,buyPropValue: 286872.01,buyFinalWealth: 308729.5,rentEquity: 87709.08,rentFinalIncome: 296545.01,rentFinalInterest: 3568.4,rentFinalCost: -198006,rentFinalWealth: 189816.48};
      expectations[3] = {buyEquity: 173879.34,buyLoan: 101166.98,buyPrice: -275046.32,buyFinalIncome: 33856.44,buyInterestSave: 113.51,buyMaintenance: -8144.16,buyInterestLoan: -194.91,buyRepay: -18228.45,buyResidual: -82938.53,buyPropValue: 276498.08,buyFinalWealth: 200961.97,rentEquity: 173879.34,rentFinalIncome: 33856.44,rentFinalInterest: 3962.29,rentFinalCost: -1482.96,rentFinalWealth: 210215.11};
      expectations[4] = {buyEquity: 112756.63,buyLoan: 323962.27,buyPrice: -436718.9,buyFinalIncome: 77787.73,buyInterestSave: 402.92,buyMaintenance: -25414.08,buyInterestLoan: -320742.09,buyRepay: 277906.89,buyResidual: -601869.16,buyPropValue: 446567.16,buyFinalWealth: -145360.63,rentEquity: 112756.63,rentFinalIncome: 77787.73,rentFinalInterest: 8566.88,rentFinalCost: -165588.48,rentFinalWealth: 33522.76};
      expectations[5] = {buyEquity: 219032.27,buyLoan: 331529.84,buyPrice: -550562.11,buyFinalIncome: 2431624.43,buyInterestSave: 1072547.53,buyMaintenance: -145575.36,buyInterestLoan: -59240.35,buyRepay: -331529.84,buyResidual: 0,buyPropValue: 2031741.17,buyFinalWealth: 4999567.58,rentEquity: 219032.27,rentFinalIncome: 2431624.43,rentFinalInterest: 1488534.76,rentFinalCost: -985770.24,rentFinalWealth: 3153421.22};
      expectations[6] = {buyEquity: 195240.39,buyLoan: 94871.49,buyPrice: -290111.88,buyFinalIncome: 1696547.21,buyInterestSave: 209926.97,buyMaintenance: -200182.42,buyInterestLoan: -5060.19,buyRepay: -94871.49,buyResidual: 0,buyPropValue: 339698.75,buyFinalWealth: 1946058.83,rentEquity: 195240.39,rentFinalIncome: 1696547.21,rentFinalInterest: 292980.3,rentFinalCost: -336081,rentFinalWealth: 1848686.9};
      expectations[7] = {buyEquity: 652.72,buyLoan: 154091.7,buyPrice: -154744.42,buyFinalIncome: 524188.89,buyInterestSave: 4012.1,buyMaintenance: -90439.4,buyInterestLoan: -20936.38,buyRepay: -154091.70,buyResidual: 0,buyPropValue: 213889.59,buyFinalWealth: 476623.10,rentEquity: 652.72,rentFinalIncome: 524188.89,rentFinalInterest: 9804.90,rentFinalCost: -105106.32,rentFinalWealth: 429540.19};
      expectations[8] = {buyEquity: 134882.66,buyLoan: 33020.32,buyPrice: -167902.98,buyFinalIncome: 107783.04,buyInterestSave: 34.92,buyMaintenance: -39275.44,buyInterestLoan: -2291.35,buyRepay: -33020.32,buyResidual: 0,buyPropValue: 160978.71,buyFinalWealth: 194209.56,rentEquity: 134882.66,rentFinalIncome: 107783.04,rentFinalInterest: 510.47,rentFinalCost: -124484.34,rentFinalWealth: 118691.83};
      expectations[9] = {buyEquity: 117327.16,buyLoan: 450774.47,buyPrice: -568101.63,buyFinalIncome: 1260622.29,buyInterestSave: 207290.33,buyMaintenance: -82348.01,buyInterestLoan: -652971.48,buyRepay: 547518.6,buyResidual: -998293.07,buyPropValue: 1829324.97,buyFinalWealth: 2111143.63,rentEquity: 117327.16,rentFinalIncome: 1260622.29,rentFinalInterest: 183306.46,rentFinalCost: -665091.13,rentFinalWealth: 896164.78};
      expectations[10]= {buyEquity: 388136.93,buyLoan: 101797.11,buyPrice: -489934.04,buyFinalIncome: 249616.84,buyInterestSave: 95287.91,buyMaintenance: -50739.84,buyInterestLoan: -622500.05,buyRepay: 563946.65,buyResidual: -665743.76,buyPropValue: 474858.05,buyFinalWealth: 44725.8,rentEquity: 388136.93,rentFinalIncome: 249616.84,rentFinalInterest: 218699.51,rentFinalCost: -904879.37,rentFinalWealth: -48426.09};
      expectations[11]= {buyEquity: 90108.02,buyLoan: 141661.6,buyPrice: -231769.62,buyFinalIncome: 1188519.66,buyInterestSave: 365431.39,buyMaintenance: -545008.46,buyInterestLoan: -64890.9,buyRepay: -141661.6,buyResidual: 0,buyPropValue: 1442583.2,buyFinalWealth: 2244973.28,rentEquity: 90108.02,rentFinalIncome: 1188519.66,rentFinalInterest: 591366.01,rentFinalCost: -938835.6,rentFinalWealth: 931158.09};
      expectations[12]= {buyEquity: 89528.5,buyLoan: 23867.51,buyPrice: -113396.01,buyFinalIncome: 904390.2,buyInterestSave: 263507.44,buyMaintenance: -206640.49,buyInterestLoan: -302.32,buyRepay: -23867.51,buyResidual: 0,buyPropValue: 113165.74,buyFinalWealth: 1050253.07,rentEquity: 89528.5,rentFinalIncome: 904390.2,rentFinalInterest: 180227.34,rentFinalCost: -749217.76,rentFinalWealth: 424928.28};
      expectations[13]= {buyEquity: 6327.92,buyLoan: 270186.4,buyPrice: -276514.32,buyFinalIncome: 548820.36,buyInterestSave: 19752.75,buyMaintenance: -39571.04,buyInterestLoan: -63273.63,buyRepay: -270186.4,buyResidual: 0,buyPropValue: 268904.02,buyFinalWealth: 464446.06,rentEquity: 6327.92,rentFinalIncome: 548820.36,rentFinalInterest: 37067.32,rentFinalCost: -265767.48,rentFinalWealth: 326448.12};
      expectations[14]= {buyEquity: 71523.95,buyLoan: 511638.67,buyPrice: -583162.62,buyFinalIncome: 888644.7,buyInterestSave: 64356.15,buyMaintenance: -495109.38,buyInterestLoan: -429199.62,buyRepay: 93751.62,buyResidual: -605390.29,buyPropValue: 640290.42,buyFinalWealth: 157343.6,rentEquity: 71523.95,rentFinalIncome: 888644.7,rentFinalInterest: 308545.67,rentFinalCost: -344310.46,rentFinalWealth: 924403.85};
      expectations[15]= {buyEquity: 47294.62,buyLoan: 144803.12,buyPrice: -192097.74,buyFinalIncome: 933907.92,buyInterestSave: 308645.39,buyMaintenance: -318758.16,buyInterestLoan: -12030.99,buyRepay: -144803.12,buyResidual: 0,buyPropValue: 357869.89,buyFinalWealth: 1124830.93,rentEquity: 47294.62,rentFinalIncome: 933907.92,rentFinalInterest: 28596.2,rentFinalCost: -1026128.16,rentFinalWealth: -16329.42};
      expectations[16]= {buyEquity: 224089.51,buyLoan: 358654.33,buyPrice: -582743.84,buyFinalIncome: 3660367.83,buyInterestSave: 0,buyMaintenance: -631786.63,buyInterestLoan: 0,buyRepay: -358654.33,buyResidual: 0,buyPropValue: 2106586.92,buyFinalWealth: 4776513.79,rentEquity: 224089.51,rentFinalIncome: 3660367.83,rentFinalInterest: 0,rentFinalCost: -1159536,rentFinalWealth: 2724921.34};
      expectations[17]= {buyEquity: 21907.9,buyLoan: 239331.91,buyPrice: -261239.81,buyFinalIncome: 660965.4,buyInterestSave: 0,buyMaintenance: -43081.2,buyInterestLoan: 0,buyRepay: -239331.91,buyResidual: 0,buyPropValue: 254589.13,buyFinalWealth: 633141.42,rentEquity: 21907.9,rentFinalIncome: 660965.4,rentFinalInterest: 0,rentFinalCost: -455902.2,rentFinalWealth: 226971.1};
      expectations[18]= {buyEquity: 342928.24,buyLoan: 33670.97,buyPrice: -376599.21,buyFinalIncome: 420298.15,buyInterestSave: 34813.81,buyMaintenance: -100514.03,buyInterestLoan: -2476.07,buyRepay: -33670.97,buyResidual: 0,buyPropValue: 423013.65,buyFinalWealth: 741464.54,rentEquity: 342928.24,rentFinalIncome: 420298.15,rentFinalInterest: 145794.91,rentFinalCost: -129494.4,rentFinalWealth: 779526.91};
      expectations[19]= {buyEquity: 398826.38,buyLoan: 123205.56,buyPrice: -522031.94,buyFinalIncome: 752877,buyInterestSave: 152622.6,buyMaintenance: -263458.46,buyInterestLoan: -140464.22,buyRepay: -123205.56,buyResidual: 0,buyPropValue: 503715.76,buyFinalWealth: 882087.12,rentEquity: 398826.38,rentFinalIncome: 752877,rentFinalInterest: 555595.22,rentFinalCost: -782322,rentFinalWealth: 924976.6};
    });

    it('Passes 1st test set', function(done){
      property.buyrent(data[0]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[0]));
        done();
      }).onReject(done);
    });

    it('Passes 2nd test set', function(done){
      property.buyrent(data[1]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[1]));
        done();
      }).onReject(done);

    });

    it('Passes 3rd test set', function(done){
      property.buyrent(data[2]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[2]));
        done();
      }).onReject(done);
    });

    it('Passes 4th test set', function(done){
      property.buyrent(data[3]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[3]));
        done();
      }).onReject(done);
    });

    it('Passes 5th test set', function(done){
      property.buyrent(data[4]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[4]));
        done();
      }).onReject(done);
    });

    it('Passes 6th test set', function(done){
      property.buyrent(data[5]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[5]));
        done();
      }).onReject(done);
    });

    it('Passes 7th test set', function(done){
      property.buyrent(data[6]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[6]));
        done();
      }).onReject(done);
    });

    it('Passes 8th test set', function(done){
      property.buyrent(data[7]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[7]));
        done();
      }).onReject(done);
    });

    it('Passes 9th test set', function(done){
      property.buyrent(data[8]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        console.log(values);
        console.log(expectations[8]);
        assert(_.isMatch(values, expectations[8]));
        done();
      }).onReject(done);
    });

    it('Passes 10th test set', function(done){
      property.buyrent(data[9]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[9]));
        done();
      }).onReject(done);
    });

    it('Passes 11th test set', function(done){
      property.buyrent(data[10]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[10]));
        done();
      }).onReject(done);
    });

    it('Passes 12th test set', function(done){
      property.buyrent(data[11]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[11]));
        done();
      }).onReject(done);
    });

    it('Passes 13th test set', function(done){
      property.buyrent(data[12]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[12]));
        done();
      }).onReject(done);
    });

    it('Passes 14th test set', function(done){
      property.buyrent(data[13]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[13]));
        done();
      }).onReject(done);
    });

    it('Passes 15th test set', function(done){
      property.buyrent(data[14]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[14]));
        done();
      }).onReject(done);
    });

    it('Passes 16th test set', function(done){
      property.buyrent(data[15]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[15]));
        done();
      }).onReject(done);
    });

    it('Passes 17th test set', function(done){
      property.buyrent(data[16]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[16]));
        done();
      }).onReject(done);
    });

    it('Passes 18th test set', function(done){
      property.buyrent(data[17]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[17]));
        done();
      }).onReject(done);
    });

    it('Passes 19th test set', function(done){
      property.buyrent(data[18]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[18]));
        done();
      }).onReject(done);
    });

    it('Passes 20th test set', function(done){
      property.buyrent(data[19]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[19]));
        done();
      }).onReject(done);
    });


  });






  describe("Property-transfertax correct", function() {
    var data = [],
        expectations = [];
    before(function () {
      data[0] = {price: '852513.44', state: 'HES'};
      data[1] = {price: '650487.06', state: 'HES'};
      data[2] = {price: '492940', state: 'BER'};
      data[3] = {price: '138588.52', state: 'BRE'};
      data[4] = {price: '827068.88', state: 'BRE'};
      data[5] = {price: '359205.96', state: 'SAA'};
      data[6] = {price: '535076.96', state: 'HES'};
      data[7] = {price: '138702.5', state: 'SCH'};
      data[8] = {price: '844758.65', state: 'MEC'};
      data[9] = {price: '826050.57', state: 'BRA'};
      data[10]= {price: '729868.19', state: 'BAD'};
      data[11]= {price: '607617.44', state: 'SAA'};
      data[12]= {price: '717655.08', state: 'THU'};
      data[13]= {price: '540157.35', state: 'BAY'};
      data[14]= {price: '686054.46', state: 'BRA'};
      data[15]= {price: '733057.09', state: 'SAR'};
      data[16]= {price: '890052.71', state: 'MEC'};
      data[17]= {price: '501464.89', state: 'BRE'};
      data[18]= {price: '360545.88', state: 'SAR'};
      data[19]= {price: '931336.03', state: 'SCH'};

      expectations[0] = {total: 903664.25, tax: 51150.81, rate: 6};
      expectations[1] = {total: 689516.28, tax: 39029.22, rate: 6};
      expectations[2] = {total: 522516.4, tax: 29576.4, rate: 6};
      expectations[3] = {total: 145517.95, tax: 6929.43, rate: 5};
      expectations[4] = {total: 868422.32, tax: 41353.44, rate: 5};
      expectations[5] = {total: 377166.26, tax: 17960.30, rate: 5};
      expectations[6] = {total: 567181.58, tax: 32104.62, rate: 6};
      expectations[7] = {total: 147718.16, tax: 9015.66, rate: 6.5};
      expectations[8] = {total: 886996.58, tax: 42237.93, rate: 5};
      expectations[9] = {total: 879743.86, tax: 53693.29, rate: 6.5};
      expectations[10] = {total: 766361.6, tax: 36493.41, rate: 5};
      expectations[11] = {total: 637998.31, tax: 30380.87, rate: 5};
      expectations[12] = {total: 753537.83, tax: 35882.75, rate: 5};
      expectations[13] = {total: 559062.86, tax: 18905.51, rate: 3.5};
      expectations[14] = {total: 730648.00, tax: 44593.54, rate: 6.5};
      expectations[15] = {total: 780705.80, tax: 47648.71, rate: 6.5};
      expectations[16] = {total: 934555.35, tax: 44502.64, rate: 5};
      expectations[17] = {total: 526538.13, tax: 25073.24, rate: 5};
      expectations[18] = {total: 383981.36, tax: 23435.48, rate: 6.5};
      expectations[19] = {total: 991872.87, tax: 60536.84, rate: 6.5};

    });

    it('Passes 1st test set', function(done){
      property.transfertax(data[0]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[0]));
        done();
      }).onReject(done);
    });

    it('Passes 2nd test set', function(done){
      property.transfertax(data[1]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[1]));
        done();
      }).onReject(done);
    });

    it('Passes 3rd test set', function(done){
      property.transfertax(data[2]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[2]));
        done();
      }).onReject(done);
    });

    it('Passes 4th test set', function(done){
      property.transfertax(data[3]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[3]));
        done();
      }).onReject(done);
    });

    it('Passes 5th test set', function(done){
      property.transfertax(data[4]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[4]));
        done();
      }).onReject(done);
    });

    it('Passes 6th test set', function(done){
      property.transfertax(data[5]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[5]));
        done();
      }).onReject(done);
    });

    it('Passes 7th test set', function(done){
      property.transfertax(data[6]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[6]));
        done();
      }).onReject(done);
    });

    it('Passes 8th test set', function(done){
      property.transfertax(data[7]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[7]));
        done();
      }).onReject(done);
    });

    it('Passes 9th test set', function(done){
      property.transfertax(data[8]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[8]));
        done();
      }).onReject(done);
    });

    it('Passes 10th test set', function(done){
      property.transfertax(data[9]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[9]));
        done();
      }).onReject(done);
    });

    it('Passes 11th test set', function(done){
      property.transfertax(data[10]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[10]));
        done();
      }).onReject(done);
    });

    it('Passes 12th test set', function(done){
      property.transfertax(data[11]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[11]));
        done();
      }).onReject(done);
    });

    it('Passes 13th test set', function(done){
      property.transfertax(data[12]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[12]));
        done();
      }).onReject(done);
    });

    it('Passes 14th test set', function(done){
      property.transfertax(data[13]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[13]));
        done();
      }).onReject(done);
    });

    it('Passes 15th test set', function(done){
      property.transfertax(data[14]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[14]));
        done();
      }).onReject(done);
    });

    it('Passes 16th test set', function(done){
      property.transfertax(data[15]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[15]));
        done();
      }).onReject(done);
    });

    it('Passes 17th test set', function(done){
      property.transfertax(data[16]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[16]));
        done();
      }).onReject(done);
    });

    it('Passes 18th test set', function(done){
      property.transfertax(data[17]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[17]));
        done();
      }).onReject(done);
    });

    it('Passes 19th test set', function(done){
      property.transfertax(data[18]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[18]));
        done();
      }).onReject(done);
    });

    it('Passes 20th test set', function(done){
      property.transfertax(data[19]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[19]));
        done();
      }).onReject(done);
    });


  });



  describe("Property-propertyreturn correct", function() {
    var data = [],
        expectations = [];
    before(function () {

      data[0] = {equity: '180000',    repay: '600',    termLoan: '10',    maintenance: '200',   costDynamic: '0',    revenue: '900',     revDynamic: '1',    term: '30',    terminal: '240000'};
      data[1] = {equity: '421119.8',  repay: '12.79',  termLoan: '12.49', maintenance: '56.28', costDynamic: '3.73', revenue: '1714.4',  revDynamic: '3.25', term: '16.55', terminal: '470781.82'};
      data[2] = {equity: '416620.16', repay: '54.05',  termLoan: '4.29',  maintenance: '174.77',costDynamic: '1.58', revenue: '1409.58', revDynamic: '1.99', term: '16.16', terminal: '425564.46'};
      data[3] = {equity: '430386.93', repay: '858.64', termLoan: '0.92',  maintenance: '131.42',costDynamic: '3.41', revenue: '458.09',  revDynamic: '1.2',  term: '28.79', terminal: '797844.72'};
      data[4] = {equity: '396999.01', repay: '1652.76',termLoan: '17.66', maintenance: '49.63', costDynamic: '0.93', revenue: '714.66',  revDynamic: '3.1',  term: '6.35',  terminal: '150800.46'};
      data[5] = {equity: '239559.39', repay: '378.63', termLoan: '19.53', maintenance: '127.93',costDynamic: '2.44', revenue: '987.59',  revDynamic: '4.77', term: '11.49', terminal: '506667.25'};
      data[6] = {equity: '147826.31', repay: '603.16', termLoan: '0.3',   maintenance: '287.49',costDynamic: '0.57', revenue: '1498.44', revDynamic: '0.01', term: '23.9',  terminal: '349733.83'};
      data[7] = {equity: '253130.78', repay: '545.07', termLoan: '3.9',   maintenance: '66.03', costDynamic: '4.02', revenue: '1085.14', revDynamic: '3.34', term: '1.2',   terminal: '233330.8'};
      data[8] = {equity: '282526.14', repay: '424.85', termLoan: '3.78',  maintenance: '265.18',costDynamic: '4.1',  revenue: '1917.52', revDynamic: '2.79', term: '23.29', terminal: '212670.08'};
      data[9] = {equity: '307217.53', repay: '321.62', termLoan: '19.49', maintenance: '178.27',costDynamic: '0.57', revenue: '1138.28', revDynamic: '2.52', term: '26.68', terminal: '402059.2'};
      data[10]= {equity: '8461.87',   repay: '1460.3', termLoan: '3.88',  maintenance: '233.52',costDynamic: '4.01', revenue: '590.65',  revDynamic: '3.14', term: '16.12', terminal: '335590.47'};
      data[11]= {equity: '263819.95', repay: '795.16', termLoan: '10.65', maintenance: '9.22',  costDynamic: '0.69', revenue: '1861.7',  revDynamic: '1.73', term: '9.37',  terminal: '569134'};
      data[12]= {equity: '350505.12', repay: '271.43', termLoan: '19.36', maintenance: '236.43',costDynamic: '0.47', revenue: '1610.99', revDynamic: '0.35', term: '13.87', terminal: '648822.74'};
      data[13]= {equity: '428506.71', repay: '1438.26',termLoan: '8.04',  maintenance: '51.98', costDynamic: '1.12', revenue: '570.23',  revDynamic: '0.86', term: '2.82',  terminal: '279383.81'};
      data[14]= {equity: '114997.32', repay: '560.12', termLoan: '7.59',  maintenance: '274.48',costDynamic: '2.55', revenue: '1367.23', revDynamic: '0.7',  term: '26.26', terminal: '729397.83'};
      data[15]= {equity: '29676.7',   repay: '1224.35',termLoan: '1.72',  maintenance: '192.85',costDynamic: '1.15', revenue: '1297.19', revDynamic: '1.97', term: '13.67', terminal: '549069.81'};
      data[16]= {equity: '304480.43', repay: '1224.82',termLoan: '12.9',  maintenance: '60.16', costDynamic: '1.33', revenue: '1400.25', revDynamic: '1.61', term: '22.52', terminal: '366568.56'};
      data[17]= {equity: '354938.03', repay: '48.82',  termLoan: '14.52', maintenance: '87.11', costDynamic: '1.38', revenue: '1130.36', revDynamic: '2.56', term: '1.71',  terminal: '627408.73'};
      data[18]= {equity: '372018.97', repay: '1398.04',termLoan: '17.11', maintenance: '290.65',costDynamic: '4.67', revenue: '1259.14', revDynamic: '2.78', term: '5.12',  terminal: '591143.39'};
      data[19]= {equity: '163697.67', repay: '993',    termLoan: '14',    maintenance: '160.01',costDynamic: '0.28', revenue: '1462.97', revDynamic: '0.67', term: '19',    terminal: '33886.56'};

      expectations[0] = {maintenance: 72000,    revenue: 615675.6,  profit: 291675.60, irr: 4.17};
      expectations[1] = {maintenance: 15133.11, revenue: 913761.54, profit: 475590.13, irr: 6.44};
      expectations[2] = {maintenance: 38288.4,  revenue: 744467.14, profit: 286747.98, irr: 4.23};
      expectations[3] = {maintenance: 75369.78, revenue: 985899.86, profit: 469839.47, irr: 2.78};
      expectations[4] = {maintenance: 3919.78,  revenue: 210703.78, profit: -540600.13};
      expectations[5] = {maintenance: 20107.56, revenue: 682918.27, profit: 334273.27,  irr: 9.01};
      expectations[6] = {maintenance: 88133.23, revenue: 780279.46, profit: 541907.28, irr: 11.41};
      expectations[7] = {maintenance: 998.4,    revenue: 249716.62, profit: -30030.85, irr: -10.71};
      expectations[8] = {maintenance: 120630.68,revenue: 955424.96, profit: 532725.04, irr: 8.07};
      expectations[9] = {maintenance: 61632.03, revenue: 914859.46, profit: 470750.82, irr: 4.74};
      expectations[10]= {maintenance: 62083.94, revenue: 481987.05, profit: 342807.14, irr: 15.89};
      expectations[11]= {maintenance: 1071.93,  revenue: 795549.61, profit: 428877.25, irr: 12.53};
      expectations[12]= {maintenance: 40705.55, revenue: 924029.43, profit: 469575.57,    irr: 7.51};
      expectations[13]= {maintenance: 1785.98,  revenue: 298928.93, profit: -270874.98};
      expectations[14]= {maintenance: 121533.4, revenue: 1202033.31,profit: 913971.55, irr: 11.93};
      expectations[15]= {maintenance: 34265.37, revenue: 792209.88, profit: 702556.46, irr: 38.27};
      expectations[16]= {maintenance: 18871.67, revenue: 819908.43, profit: 306709.23, irr: 3.61};
      expectations[17]= {maintenance: 1840.11,  revenue: 651406.75, profit: 286085.11, irr: 41.95};
      expectations[18]= {maintenance: 19875.96, revenue: 673899.05, profit: -5992.12,  irr: -0.85};
      expectations[19]= {maintenance: 37416.24, revenue: 388340.4,  profit: 20402.49,  irr: 0.86};

    });


    it('Passes 1st test set', function(done){
      property.propertyreturn(data[0]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(!_.isEmpty(values) && _.isMatch(values, expectations[0]));
        done();
      }).onReject(done);
    });

    it('Passes 2nd test set', function(done){
      property.propertyreturn(data[1]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[1]));
        done();
      }).onReject(done);
    });

    it('Passes 3rd test set', function(done){
      property.propertyreturn(data[2]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[2]));
        done();
      }).onReject(done);
    });

    it('Passes 4th test set', function(done){
      property.propertyreturn(data[3]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[3]));
        done();
      }).onReject(done);
    });

    it('Passes 5th test set', function(done){
      property.propertyreturn(data[4]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[4]));
        done();
      }).onReject(done);
    });

    it('Passes 6th test set', function(done){
      property.propertyreturn(data[5]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[5]));
        done();
      }).onReject(done);
    });

    it('Passes 7th test set', function(done){
      property.propertyreturn(data[6]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[6]));
        done();
      }).onReject(done);
    });

    it('Passes 8th test set', function(done){
      property.propertyreturn(data[7]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[7]));
        done();
      }).onReject(done);
    });

    it('Passes 9th test set', function(done){
      property.propertyreturn(data[8]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[8]));
        done();
      }).onReject(done);
    });

    it('Passes 10th test set', function(done){
      property.propertyreturn(data[9]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[9]));
        done();
      }).onReject(done);
    });

    it('Passes 11th test set', function(done){
      property.propertyreturn(data[10]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[10]));
        done();
      }).onReject(done);
    });

    it('Passes 12th test set', function(done){
      property.propertyreturn(data[11]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[11]));
        done();
      }).onReject(done);
    });

    it('Passes 13th test set', function(done){
      property.propertyreturn(data[12]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[12]));
        done();
      }).onReject(done);
    });

    it('Passes 14th test set', function(done){
      property.propertyreturn(data[13]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[13]));
        done();
      }).onReject(done);
    });

    it('Passes 15th test set', function(done){
      property.propertyreturn(data[14]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[14]));
        done();
      }).onReject(done);
    });

    it('Passes 16th test set', function(done){
      property.propertyreturn(data[15]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[15]));
        done();
      }).onReject(done);
    });

    it('Passes 17th test set', function(done){
      property.propertyreturn(data[16]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[16]));
        done();
      }).onReject(done);
    });

    it('Passes 18th test set', function(done){
      property.propertyreturn(data[17]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[17]));
        done();
      }).onReject(done);
    });

    it('Passes 19th test set', function(done){
      property.propertyreturn(data[18]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[18]));
        done();
      }).onReject(done);
    });

    it('Passes 20th test set', function(done){
      property.propertyreturn(data[19]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[19]));
        done();
      }).onReject(done);
    });


  });



  describe("Property-rent correct", function() {
    var data = [],
        expectations = [];
    before(function () {

      data[0] = {select: '1', rent: '823.52', dynamic: '2.44', term: '16.85', renttotal: '295241.05'};
      data[1] = {select: '2', rent: '991.09', dynamic: '5.3', term: '10.36', renttotal: '1689530.11'};
      data[2] = {select: '1', rent: '1605.46', dynamic: '7.38', term: '2.35', renttotal: '244158.42'};
      data[3] = {select: '3', rent: '4092.95', dynamic: '9.08', term: '5.19', renttotal: '820651.99'};
      data[4] = {select: '1', rent: '554.26', dynamic: '5.17', term: '33.96', renttotal: '193318.52'};
      data[5] = {select: '3', rent: '645.92', dynamic: '2.21', term: '3.78', renttotal: '1633038.28'};
      data[6] = {select: '3', rent: '3671.87', dynamic: '8.55', term: '20.78', renttotal: '732193.75'};
      data[7] = {select: '2', rent: '1848.76', dynamic: '2.99', term: '13.86', renttotal: '1269984.29'};
      data[8] = {select: '2', rent: '4402.37', dynamic: '3.62', term: '10.14', renttotal: '1337667.86'};
      data[9] = {select: '3', rent: '68.35', dynamic: '1.46', term: '26.07', renttotal: '1265540.17'};
      data[10]= {select: '0', rent: '515.94', dynamic: '6.39', term: '0.63', renttotal: '28224.96'};
      data[11]= {select: '0', rent: '4191.67', dynamic: '2.91', term: '38.69', renttotal: '1752116.3'};
      data[12]= {select: '1', rent: '4088.1', dynamic: '0.81', term: '19.33', renttotal: '708578.81'};
      data[13]= {select: '1', rent: '3983.28', dynamic: '6.9', term: '38.27', renttotal: '1748777.08'};
      data[14]= {select: '3', rent: '767.57', dynamic: '10', term: '32.8', renttotal: '1520771.89'};
      data[15]= {select: '0', rent: '577.06', dynamic: '9.32', term: '4.26', renttotal: '6785.76'};
      data[16]= {select: '0', rent: '3586.7', dynamic: '3.19', term: '25.02', renttotal: '1928306.53'};
      data[17]= {select: '2', rent: '1481.24', dynamic: '9.43', term: '16.07', renttotal: '1388962.79'};
      data[18]= {select: '1', rent: '2818.29', dynamic: '7.65', term: '25.62', renttotal: '759871.07'};
      data[19]= {select: '0', rent: '4725.57', dynamic: '5.05', term: '30.82', renttotal: '259420.05'};

      expectations[0] = {value: 6.81};
      expectations[1] = {value: 41.51};
      expectations[2] = {value: 476.74};
      expectations[3] = {value: 10894.2};
      expectations[4] = {value: -0.97};
      expectations[5] = {value: 34915.05};
      expectations[6] = {value: 1159.22};
      expectations[7] = {value: 33.86};
      expectations[8] = {value: 18.29};
      expectations[9] = {value: 3353.29};
      expectations[10] ={value: 3855.69};
      expectations[11] ={value: 3515432.32};
      expectations[12] ={value: -3.31};
      expectations[13] ={value: -0.24};
      expectations[14] ={value: 581.69};
      expectations[15] ={value: 34304.65};
      expectations[16] ={value: 1610818.65};
      expectations[17] ={value: 23.58};
      expectations[18] ={value: -1.09};
      expectations[19] ={value: 4002997.09};

    });


    it('Passes 1st test set', function(done){
      property.rent(data[0]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[0]));
        done();
      }).onReject(done);
    });

    it('Passes 2nd test set', function(done){
      property.rent(data[1]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[1]));
        done();
      }).onReject(done);
    });

    it('Passes 3rd test set', function(done){
      property.rent(data[2]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[2]));
        done();
      }).onReject(done);
    });

    it('Passes 4th test set', function(done){
      property.rent(data[3]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[3]));
        done();
      }).onReject(done);
    });

    it('Passes 5th test set', function(done){
      property.rent(data[4]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[4]));
        done();
      }).onReject(done);
    });

    it('Passes 6th test set', function(done){
      property.rent(data[5]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[5]));
        done();
      }).onReject(done);
    });

    it('Passes 7th test set', function(done){
      property.rent(data[6]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[6]));
        done();
      }).onReject(done);
    });

    it('Passes 8th test set', function(done){
      property.rent(data[7]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[7]));
        done();
      }).onReject(done);
    });

    it('Passes 9th test set', function(done){
      property.rent(data[8]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[8]));
        done();
      }).onReject(done);
    });

    it('Passes 10th test set', function(done){
      property.rent(data[9]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[9]));
        done();
      }).onReject(done);
    });

    it('Passes 11th test set', function(done){
      property.rent(data[10]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[10]));
        done();
      }).onReject(done);
    });

    it('Passes 12th test set', function(done){
      property.rent(data[11]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[11]));
        done();
      }).onReject(done);
    });

    it('Passes 13th test set', function(done){
      property.rent(data[12]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[12]));
        done();
      }).onReject(done);
    });

    it('Passes 14th test set', function(done){
      property.rent(data[13]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[13]));
        done();
      }).onReject(done);
    });

    it('Passes 15th test set', function(done){
      property.rent(data[14]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[14]));
        done();
      }).onReject(done);
    });

    it('Passes 16th test set', function(done){
      property.rent(data[15]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[15]));
        done();
      }).onReject(done);
    });

    it('Passes 17th test set', function(done){
      property.rent(data[16]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[16]));
        done();
      }).onReject(done);
    });

    it('Passes 18th test set', function(done){
      property.rent(data[17]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[17]));
        done();
      }).onReject(done);
    });

    it('Passes 19th test set', function(done){
      property.rent(data[18]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[18]));
        done();
      }).onReject(done);
    });

    it('Passes 20th test set', function(done){
      property.rent(data[19]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[19]));
        done();
      }).onReject(done);
    });


  });





  describe("Property-mortgage correct", function() {
    var data = [],
        expectations = [];
    before(function () {
      /** second choice residual ("Restschuld") */
      data[0] = {select1: '3', select2: '1', principal: '127438.69', fees: 'false', feeamount: '0',      feetype: '2', disagio: 'true',  disagioamount: '8.45', interest: '',     initialinterest: '3.13', repay: '11.62',  repayfreq: '4', term: '62',  termperiods: '12', repaymentfree: 'true', repaymentfreeterm: '19', repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '', annualrepay: '0',      followup: 'false', followupinterest: '0', specialrepay: 'false', specialrepaypositions: '0'};
      data[1] = {select1: '4', select2: '1', principal: '50302.61',  fees: 'true',  feeamount: '288.7',  feetype: '2', disagio: 'false', disagioamount: '0',    interest: '2.65', initialinterest: '',     repay: '212.88', repayfreq: '4', term: '200', termperiods: '12', repaymentfree: 'true', repaymentfreeterm: '19', repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '', annualrepay: '839.94', followup: 'false', followupinterest: '0', specialrepay: 'false', specialrepaypositions: '0'};
      data[2] = {select1: '4', select2: '1', principal: '126588.64', fees: 'true',  feeamount: '2667.76',feetype: '3', disagio: 'true',  disagioamount: '8.03', interest: '2.41', initialinterest: '',     repay: '563.05', repayfreq: '4', term: '140', termperiods: '12', repaymentfree: 'true', repaymentfreeterm: '14', repaymentfreetype: '3', repaymentfreetermperiods: '12', residual: '', annualrepay: '0',      followup: 'false', followupinterest: '0', specialrepay: 'true', specialrepaypositions: '2', specialrepaymonths0: '103', specialrepayamount0: '922.81', specialrepaymonths1: '183', specialrepayamount1: '697.68'};
      data[3] = {select1: '1', select2: '1', principal: '58226.47',  fees: 'false', feeamount: '0',      feetype: '2', disagio: 'false', disagioamount: '0',    interest: '3.75', initialinterest: '1.37', repay: '',       repayfreq: '4', term: '2',   termperiods: '12', repaymentfree: 'false',repaymentfreeterm: '19', repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '', annualrepay: '0',      followup: 'false', followupinterest: '0', specialrepay: 'false', specialrepaypositions: '0'};
      data[4] = {select1: '1', select2: '1', principal: '83016.44',  fees: 'false', feeamount: '0',      feetype: '3', disagio: 'false', disagioamount: '0',    interest: '1.84', initialinterest: '3.22', repay: '',       repayfreq: '12', term: '8',  termperiods: '12', repaymentfree: 'true', repaymentfreeterm: '9',  repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '', annualrepay: '1099.58', followup: 'false', followupinterest: '0', specialrepay: 'false', specialrepaypositions: '0'};
      data[5] = {select1: '2', select2: '1', principal: '',          fees: 'true',  feeamount: '1246.54',feetype: '3', disagio: 'false', disagioamount: '0',    interest: '0.88', initialinterest: '1.34', repay: '745.24', repayfreq: '4', term: '13',  termperiods: '12', repaymentfree: 'false',repaymentfreeterm: '20', repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '', annualrepay: '0', followup: 'false', followupinterest: '0', specialrepay: 'false', specialrepaypositions: '0'};
      data[6] = {select1: '3', select2: '1', principal: '80376.26',  fees: 'false', feeamount: '0',      feetype: '3', disagio: 'true',  disagioamount: '0.33', interest: '',     initialinterest: '2.48', repay: '51.44',  repayfreq: '4', term: '37',  termperiods: '12', repaymentfree: 'true', repaymentfreeterm: '31', repaymentfreetype: '3', repaymentfreetermperiods: '12', residual: '', annualrepay: '0', followup: 'false', followupinterest: '0', specialrepay: 'false', specialrepaypositions: '0'};
      data[7] = {select1: '2', select2: '1', principal: '',          fees: 'true',  feeamount: '2140.83',feetype: '2', disagio: 'true',  disagioamount: '1.39', interest: '3.53', initialinterest: '2.62', repay: '498.22', repayfreq: '4', term: '99',  termperiods: '12', repaymentfree: 'true', repaymentfreeterm: '7',  repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '', annualrepay: '523.89', followup: 'false', followupinterest: '0', specialrepay: 'false', specialrepaypositions: '0'};
      data[8] = {select1: '4', select2: '1', principal: '99774.43',  fees: 'true',  feeamount: '760.04', feetype: '2', disagio: 'false', disagioamount: '0',    interest: '2.36', initialinterest: '',     repay: '523.57', repayfreq: '1', term: '15',  termperiods: '12', repaymentfree: 'true', repaymentfreeterm: '35', repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '', annualrepay: '1374.04', followup: 'false', followupinterest: '0', specialrepay: 'false', specialrepaypositions: '0'};
      data[9] = {select1: '2', select2: '1', principal: '',          fees: 'false', feeamount: '0',      feetype: '3', disagio: 'true',  disagioamount: '8.17', interest: '1.16', initialinterest: '0.01', repay: '57.3',   repayfreq: '2', term: '141', termperiods: '12', repaymentfree: 'true', repaymentfreeterm: '35', repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '', annualrepay: '0', followup: 'false', followupinterest: '0', specialrepay: 'false', specialrepaypositions: '0'};
      data[10]= {select1: '1', select2: '1', principal: '9216.85',   fees: 'true',  feeamount: '1017.41',feetype: '3', disagio: 'false', disagioamount: '0',    interest: '2.93', initialinterest: '1.8',  repay: '',       repayfreq: '4', term: '136', termperiods: '12', repaymentfree: 'true', repaymentfreeterm: '11', repaymentfreetype: '3', repaymentfreetermperiods: '12', residual: '', annualrepay: '0', followup: 'false', followupinterest: '0', specialrepay: 'true', specialrepaypositions: '1', specialrepaymonths0: '26', specialrepayamount0: '894.44'};
      data[11]= {select1: '4', select2: '1', principal: '142095.3',  fees: 'true',  feeamount: '2154',   feetype: '2', disagio: 'true',  disagioamount: '1.42', interest: '1.38', initialinterest: '',     repay: '452.1',  repayfreq: '4', term: '32',  termperiods: '12', repaymentfree: 'true', repaymentfreeterm: '0',  repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '', annualrepay: '0', followup: 'false', followupinterest: '0', specialrepay: 'false', specialrepaypositions: '0'};
      data[12]= {select1: '2', select2: '1', principal: '',          fees: 'false', feeamount: '0',      feetype: '3', disagio: 'true',  disagioamount: '2.92', interest: '3.59', initialinterest: '2.5',  repay: '180.54', repayfreq: '12', term: '79', termperiods: '12', repaymentfree: 'false', repaymentfreeterm: '4', repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '', annualrepay: '0', followup: 'false', followupinterest: '0', specialrepay: 'true', specialrepaypositions: '6', specialrepaymonths0: '68', specialrepayamount0: '516.55', specialrepaymonths1: '130', specialrepayamount1: '640.7', specialrepaymonths2: '15', specialrepayamount2: '122.12', specialrepaymonths3: '8', specialrepayamount3: '406.64', specialrepaymonths4: '384', specialrepayamount4: '711.86', specialrepaymonths5: '9', specialrepayamount5: '162.24'};
      data[13]= {select1: '1', select2: '1', principal: '118067.09', fees: 'true',  feeamount: '748.98', feetype: '2', disagio: 'false', disagioamount: '0',    interest: '1.75', initialinterest: '4.72', repay: '',       repayfreq: '4', term: '48',  termperiods: '12', repaymentfree: 'false', repaymentfreeterm: '2', repaymentfreetype: '3', repaymentfreetermperiods: '12', residual: '', annualrepay: '0', followup: 'false', followupinterest: '0', specialrepay: 'true', specialrepaypositions: '5', specialrepaymonths0: '10', specialrepayamount0: '724.37', specialrepaymonths1: '7', specialrepayamount1: '163.57', specialrepaymonths2: '6', specialrepayamount2: '532.94', specialrepaymonths3: '6', specialrepayamount3: '112.98', specialrepaymonths4: '7', specialrepayamount4: '944.29'};
      data[14]= {select1: '4', select2: '1', principal: '188456.12', fees: 'false', feeamount: '0',      feetype: '2', disagio: 'true',  disagioamount: '3.44', interest: '4.26', initialinterest: '',     repay: '427.83', repayfreq: '2', term: '67',  termperiods: '12', repaymentfree: 'false', repaymentfreeterm: '10',repaymentfreetype: '3', repaymentfreetermperiods: '12', residual: '', annualrepay: '1809.79', followup: 'false', followupinterest: '0', specialrepay: 'true', specialrepaypositions: '1', specialrepaymonths0: '12', specialrepayamount0: '707.15'};

      /** second choice term ("Laufzeit") */
      data[15]= {select1: '1', select2: '2', principal: '2916.05', fees: 'false', feeamount: '0', feetype: '2', disagio: 'true', disagioamount: '1.07', interest: '1.03', initialinterest: '2.36', repay: '544.44', repayfreq: '2', term: '2', termperiods: '12', repaymentfree: 'false', repaymentfreeterm: '30', repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '15025.95', annualrepay: '0', followup: 'false', followupinterest: '0', specialrepay: 'false', specialrepaypositions: '0'};
      data[16]= {select1: '2', select2: '2', principal: '82282.44', fees: 'false', feeamount: '0', feetype: '2', disagio: 'true', disagioamount: '2.97', interest: '1.49', initialinterest: '1.74', repay: '293.89', repayfreq: '2', term: '140', termperiods: '12', repaymentfree: 'true', repaymentfreeterm: '1', repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '25082.24', annualrepay: '1705.88', followup: 'false', followupinterest: '0', specialrepay: 'true', specialrepaypositions: '4', specialrepaymonths0: '28', specialrepayamount0: '754.38', specialrepaymonths1: '329', specialrepayamount1: '899.83', specialrepaymonths2: '16', specialrepayamount2: '263.1', specialrepaymonths3: '27', specialrepayamount3: '966.84'};
      data[17]= {select1: '4', select2: '2', principal: '69927.3', fees: 'true', feeamount: '233.16', feetype: '2', disagio: 'true', disagioamount: '2.9', interest: '0.63', initialinterest: '4.13', repay: '78.21', repayfreq: '4', term: '182', termperiods: '12', repaymentfree: 'true', repaymentfreeterm: '36', repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '3065.99', annualrepay: '835.57', followup: 'false', followupinterest: '0', specialrepay: 'false', specialrepaypositions: '0'};
      data[18]= {select1: '4', select2: '2', principal: '22534.36', fees: 'false', feeamount: '0', feetype: '3', disagio: 'false', disagioamount: '0', interest: '0.75', initialinterest: '4.38', repay: '474.63', repayfreq: '4', term: '19', termperiods: '12', repaymentfree: 'false', repaymentfreeterm: '18', repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '10488.14', annualrepay: '0', followup: 'false', followupinterest: '0', specialrepay: 'true', specialrepaypositions: '2', specialrepaymonths0: '2', specialrepayamount0: '331.01', specialrepaymonths1: '18', specialrepayamount1: '861.77'};
      data[19]= {select1: '4', select2: '2', principal: '89450.82', fees: 'true', feeamount: '1500.55', feetype: '3', disagio: 'true', disagioamount: '7.72', interest: '4.75', initialinterest: '2.46', repay: '530.48', repayfreq: '1', term: '138', termperiods: '12', repaymentfree: 'false', repaymentfreeterm: '12', repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '5907.4', annualrepay: '0', followup: 'false', followupinterest: '0', specialrepay: 'true', specialrepaypositions: '5', specialrepaymonths0: '682', specialrepayamount0: '325.88', specialrepaymonths1: '14', specialrepayamount1: '946.36', specialrepaymonths2: '28', specialrepayamount2: '577.12', specialrepaymonths3: '18', specialrepayamount3: '582.49', specialrepaymonths4: '22', specialrepayamount4: '711.25', specialrepaymonths5: '0', specialrepayamount5: '0'};
      data[20]= {select1: '1', select2: '2', principal: '19611.71', fees: 'false', feeamount: '0', feetype: '3', disagio: 'false', disagioamount: '0', interest: '2.2', initialinterest: '2.13', repay: '72.57', repayfreq: '4', term: '71', termperiods: '12', repaymentfree: 'true', repaymentfreeterm: '11', repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '15102.75', annualrepay: '0', followup: 'false', followupinterest: '0', specialrepay: 'false', specialrepaypositions: '0'};
      data[21]= {select1: '1', select2: '2', principal: '7652.82', fees: 'true', feeamount: '968.01', feetype: '2', disagio: 'true', disagioamount: '4.68', interest: '4.46', initialinterest: '4.42', repay: '175.39', repayfreq: '4', term: '71', termperiods: '12', repaymentfree: 'true', repaymentfreeterm: '25', repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '22724.3', annualrepay: '0', followup: 'false', followupinterest: '0', specialrepay: 'false', specialrepaypositions: '0', specialrepaymonths0: '0', specialrepayamount0: '0', specialrepaymonths1: '0', specialrepayamount1: '0', specialrepaymonths2: '0', specialrepayamount2: '0', specialrepaymonths3: '0', specialrepayamount3: '0', specialrepaymonths4: '0', specialrepayamount4: '0', specialrepaymonths5: '0', specialrepayamount5: '0'};
      data[22]= {select1: '3', select2: '2', principal: '155145.5', fees: 'false', feeamount: '0', feetype: '3', disagio: 'false', disagioamount: '0', interest: '4.36', initialinterest: '3.74', repay: '235.42', repayfreq: '2', term: '193', termperiods: '12', repaymentfree: 'true', repaymentfreeterm: '4', repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '700.64', annualrepay: '0', followup: 'false', followupinterest: '0', specialrepay: 'false', specialrepaypositions: '0'};
      data[23]= {select1: '3', select2: '2', principal: '111684.33', fees: 'false', feeamount: '0', feetype: '2', disagio: 'true', disagioamount: '9.78', interest: '0.92', initialinterest: '1.54', repay: '272.22', repayfreq: '4', term: '59', termperiods: '12', repaymentfree: 'false', repaymentfreeterm: '15', repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '32566.14', annualrepay: '975.55', followup: 'false', followupinterest: '0', specialrepay: 'false', specialrepaypositions: '0'};
      data[24]= {select1: '2', select2: '2', principal: '171659.07', fees: 'false', feeamount: '0', feetype: '2', disagio: 'false', disagioamount: '0', interest: '4.55', initialinterest: '4.22', repay: '572.83', repayfreq: '4', term: '187', termperiods: '12', repaymentfree: 'false', repaymentfreeterm: '18', repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '27657.29', annualrepay: '0', followup: 'false', followupinterest: '0', specialrepay: 'false', specialrepaypositions: '0', specialrepaymonths0: '0', specialrepayamount0: '0', specialrepaymonths1: '0', specialrepayamount1: '0', specialrepaymonths2: '0', specialrepayamount2: '0', specialrepaymonths3: '0', specialrepayamount3: '0', specialrepaymonths4: '0', specialrepayamount4: '0', specialrepaymonths5: '0', specialrepayamount5: '0'};
      data[25]= {select1: '2', select2: '2', principal: '54532.39', fees: 'true', feeamount: '855.75', feetype: '2', disagio: 'false', disagioamount: '0', interest: '2.47', initialinterest: '0.81', repay: '590.02', repayfreq: '2', term: '45', termperiods: '12', repaymentfree: 'false', repaymentfreeterm: '11', repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '16984.86', annualrepay: '1490.28', followup: 'false', followupinterest: '0', specialrepay: 'false', specialrepaypositions: '0'};
      data[26]= {select1: '2', select2: '2', principal: '67875.77', fees: 'false', feeamount: '0', feetype: '2', disagio: 'true', disagioamount: '4.77', interest: '1.08', initialinterest: '2.76', repay: '423.24', repayfreq: '2', term: '41', termperiods: '12', repaymentfree: 'false', repaymentfreeterm: '36', repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '17122.1', annualrepay: '0', followup: 'false', followupinterest: '0', specialrepay: 'true', specialrepaypositions: '5', specialrepaymonths0: '7', specialrepayamount0: '60.12', specialrepaymonths1: '6', specialrepayamount1: '889.99', specialrepaymonths2: '8', specialrepayamount2: '56.91', specialrepaymonths3: '8', specialrepayamount3: '692.07', specialrepaymonths4: '5', specialrepayamount4: '251.34'};
      data[27]= {select1: '3', select2: '2', principal: '85533.26', fees: 'true', feeamount: '321.98', feetype: '2', disagio: 'true', disagioamount: '7.65', interest: '4.07', initialinterest: '2.47', repay: '202.06', repayfreq: '2', term: '144', termperiods: '12', repaymentfree: 'true', repaymentfreeterm: '21', repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '33128.19', annualrepay: '0', followup: 'false', followupinterest: '0', specialrepay: 'false', specialrepaypositions: '0'};
      data[28]= {select1: '1', select2: '2', principal: '48740.36', fees: 'false', feeamount: '0', feetype: '3', disagio: 'true', disagioamount: '4.89', interest: '2.91', initialinterest: '4.66', repay: '191.76', repayfreq: '4', term: '115', termperiods: '12', repaymentfree: 'true', repaymentfreeterm: '33', repaymentfreetype: '3', repaymentfreetermperiods: '12', residual: '6040.6', annualrepay: '0', followup: 'false', followupinterest: '0', specialrepay: 'false', specialrepaypositions: '0'};
      data[29]= {select1: '3', select2: '2', principal: '61659.85', fees: 'true', feeamount: '1168.78', feetype: '2', disagio: 'false', disagioamount: '0', interest: '0.96', initialinterest: '3.43', repay: '771.7', repayfreq: '4', term: '54', termperiods: '12', repaymentfree: 'false', repaymentfreeterm: '24', repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '23733.62', annualrepay: '245.83', followup: 'false', followupinterest: '0', specialrepay: 'false', specialrepaypositions: '0'};


      expectations[0] = { value1: -3.09, value2: 102846.12};
      expectations[1] = { value1: -0.96, value2: 47390.74};
      expectations[2] = { value1: -0.63, value2: 136402.29};
      expectations[3] = { value1: 745.3, value2: 58027.04};
      expectations[4] = { value1: 350.05, value2: 82391.65};
      expectations[5] = { value1: 134277.48, value2: 132018.41};
      expectations[6] = { value1: -2.22, value2: 74109.71};
      expectations[7] = { value1: 32404.55, value2: 23335.31};
      expectations[8] = { value1: -1.84, value2: 108913.79};
      expectations[9] = { value1: 9794.87, value2: 10168.44};
      expectations[10]= { value1: 108.99, value2: 5783.32};
      expectations[11]= { value1: -0.11, value2: 144759.20};
      expectations[12]= { value1: 35574.38, value2: 27596.39};
      expectations[13]= { value1: 1909.74, value2: 93204.46};
      expectations[14]= { value1: -3.81, value2: 223938.98};

      expectations[15]= {value1: 49.43};
      expectations[16]= {value1: 18197.52, value1: 0, totalinterest: 563.06, irr: 45.75};
      expectations[17]= {value1: -0.18, value2: 924, totalinterest: 19521.53, irr: 0.71};
      expectations[18]= {value1: 7.68, value2: 75, totalinterest: 762.89, irr: 0.75};
      expectations[19]= {};
      expectations[20]= {value1: 212.3, value2: 129, totalinterest: 4184.27, irr: 2.22};
      expectations[21]= {};
      expectations[22]= {value1: -3.44, value2: 852, totalinterest: -119382.33, irr: -3.41};
      expectations[23]= {value1: -0.57, value2: 387, totalinterest: -13002.99, irr: -0.1};
      expectations[24]= {};
      expectations[25]= {value1: 35976.83, value2: 126, totalinterest: 7184.91, irr: 2.83};
      expectations[26]= {value1: 22043.75, value2: 60, totalinterest: 1019.73, irr: 2.27};
      expectations[27]= {value1: -2, value2: 396, totalinterest: -36620.94, irr: -1.73};
      expectations[28]= {value1: 922.41, value2: 183, totalinterest: 12864.33, irr: 3.47};
      expectations[29]= {value1: 1.58, value2: 180, totalinterest: 10465.17, irr: 1.78};

    });

    it('Passes 1st test set', function(done){
      property.mortgage(data[0]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[0]));
        done();
      }).onReject(done);
    });

    it('Passes 2nd test set', function(done){
      property.mortgage(data[1]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[1]));
        done();
      }).onReject(done);
    });

    it('Passes 3rd test set', function(done){
      property.mortgage(data[2]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[2]));
        done();
      }).onReject(done);
    });

    it('Passes 4th test set', function(done){
      property.mortgage(data[3]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[3]));
        done();
      }).onReject(done);
    });

    it('Passes 5th test set', function(done){
      property.mortgage(data[4]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[4]));
        done();
      }).onReject(done);
    });

    it('Passes 6th test set', function(done){
      property.mortgage(data[5]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[5]));
        done();
      }).onReject(done);
    });

    it('Passes 7th test set', function(done){
      property.mortgage(data[6]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[6]));
        done();
      }).onReject(done);
    });

    it('Passes 8th test set', function(done){
      property.mortgage(data[7]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[7]));
        done();
      }).onReject(done);
    });

    it('Passes 9th test set', function(done){
      property.mortgage(data[8]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[8]));
        done();
      }).onReject(done);
    });

    it('Passes 10th test set', function(done){
      property.mortgage(data[9]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[9]));
        done();
      }).onReject(done);
    });

    it('Passes 11th test set', function(done){
      property.mortgage(data[10]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[10]));
        done();
      }).onReject(done);
    });

    it('Passes 12th test set', function(done){
      property.mortgage(data[11]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[11]));
        done();
      }).onReject(done);
    });

    it('Passes 13th test set', function(done){
      property.mortgage(data[12]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[12]));
        done();
      }).onReject(done);
    });

    it('Passes 14th test set', function(done){
      property.mortgage(data[13]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[13]));
        done();
      }).onReject(done);
    });

    it('Passes 15th test set', function(done){
      property.mortgage(data[14]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[14]));
        done();
      }).onReject(done);
    });

    it('Passes 16th test set', function(done){
      property.mortgage(data[15]).then(function(results){
        assert(Array.isArray(results));
        done();
      }).onReject(done);
    });

    it('Passes 17th test set', function(done){
      property.mortgage(data[16]).then(function(results){
        assert(Array.isArray(results));
        done();
      }).onReject(done);
    });

    it('Passes 18th test set', function(done){
      property.mortgage(data[17]).then(function(results){
        assert(Array.isArray(results));
        done();
      }).onReject(done);
      /*
      property.mortgage(data[17]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[17]));
        done();
      }).onReject(done);*/
    });

    it('Passes 19th test set', function(done){
      property.mortgage(data[18]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[18]));
        done();
      }).onReject(done);
    });

    it('Passes 20th test set', function(done){
      property.mortgage(data[19]).then(function(results){
        assert(Array.isArray(results));
        done();
      }).onReject(done);
    });

    it('Passes 21th test set', function(done){
      property.mortgage(data[20]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[20]));
        done();
      }).onReject(done);
    });

    it('Passes 22th test set', function(done){
      property.mortgage(data[21]).then(function(results){
        assert(Array.isArray(results));
        done();
      }).onReject(done);
    });

    it('Passes 23th test set', function(done){
      property.mortgage(data[22]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[22]));
        done();
      }).onReject(done);
    });

    it('Passes 24th test set', function(done){
      property.mortgage(data[23]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[23]));
        done();
      }).onReject(done);
    });

    it('Passes 25th test set', function(done){
      property.mortgage(data[24]).then(function(results){
        assert(Array.isArray(results));
        done();
      }).onReject(done);
    });

    it('Passes 26th test set', function(done){
      property.mortgage(data[25]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[25]));
        done();
      }).onReject(done);
    });

    it('Passes 27th test set', function(done){
      property.mortgage(data[26]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[26]));
        done();
      }).onReject(done);
    });

    it('Passes 28th test set', function(done){
      property.mortgage(data[27]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[27]));
        done();
      }).onReject(done);
    });

    it('Passes 29th test set', function(done){
      property.mortgage(data[28]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[28]));
        done();
      }).onReject(done);
    });

    it('Passes 30th test set', function(done){
      property.mortgage(data[29]).then(function(results){
        var values = {};
        _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
        assert(_.isMatch(values, expectations[29]));
        done();
      }).onReject(done);
    });






  });




});

