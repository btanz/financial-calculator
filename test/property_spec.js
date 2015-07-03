var assert = require("assert");
var _ = require("underscore");
var property = require('../modules/property')
//var f = require("../finance");
var ROUND_PRECISION = 100;   // 1/100 rounding precision

describe("Property calculators correct", function() {

  describe("Property-homesave correct", function() {
    var data = [],
        expectations = [];
    before(function () {
      data[0] = {principal: '50000.00', interestsave: '0.50', saving: '250.00', termsave: '10', initialfee: '0.00', initialpay: '0.00', income: '30000.00', interestdebt: '2.50', repay: '300', paypercent: '100', bonus: 'true', marriage: 'false'};
      expectations[0] = {finalsavingswohnungsbau: 30754.396906030467, totalpays: 30000, totalinterest: 754.3969060304662, wohnungsbau: 0, numberpays: 120, savingratio: 61.50879381206094, totalloanpay: 50000, totalloanwinterest: 20680.681357957463, totalloan: 19245.603093969534, interestloan: 1435.0782639879276, totalloanpays: 68.93554179484084, termloan: 5.744628482903403};
    });

    it('Passes 1st test set', function(){
      var results = property.homesave(data[0]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= el.value});
      assert(_.isMatch(values, expectations[0]));

    });

    // todo: add more test cases
  });


  describe("Property-buyrent correct", function() {
    var data = [],
        expectations = [];
    before(function () {
      data[0] = {price: '200000.00',priceaddon: '20000.00',maintenance: '250',rent: '800',equity: '80000',income: '1500',equityinterest: '1.00',debtinterest: '3.00',debtpay: '1000',period: '20',incomedynamic: '0.00', rentdynamic: '0.00', valuedynamic: '0.00', costdynamic: '0.00', dynamics: 'false' }
      data[1] = {price: '434298.64',priceaddon: '20782.72',maintenance: '640.14',rent: '1542.83',equity: '128580.07',income: '219.72',equityinterest: '3.81',debtinterest: '2.30',debtpay: '191.55',period: '10',incomedynamic: '0.00', rentdynamic: '4.66', valuedynamic: '0.99', costdynamic: '3.06', dynamics: 'true'};
      data[2] = {price: '183141.41',priceaddon: '8560.27',maintenance: '564.75',rent: '1650.05',equity: '87709.08',income: '2181.59',equityinterest: '0.27',debtinterest: '8.89',debtpay: '676.41',period: '10',incomedynamic: '2.74', rentdynamic: '0.00', valuedynamic: '4.59', costdynamic: '1.72', dynamics: 'true'};


      expectations[0] = {rentFinalWealth: 283576.70, rentEquity: 80000,    rentFinalIncome: 360000,    rentFinalCost: -192000,    rentFinalInterest: 35576.70, buyFinalWealth: 336001.24 ,buyEquity: 80000,    buyPrice: -220000,    buyLoan: 140000,    buyFinalIncome: 360000,    buyInterestSave: 8530.02, buyInterestLoan: -32528.78, buyMaintenance: -60000,    buyRepay: -140000,  buyResidual: 0, buyPropValue: 200000};
      expectations[1] = {rentFinalWealth: -53326.39};
      expectations[2] = {rentFinalWealth: 189816.48, rentEquity: 87709.08, rentFinalIncome: 296545.01, rentFinalCost: -198006.00, rentFinalInterest: 3568.40,  buyFinalWealth: 308729.50 ,buyEquity: 87709.08, buyPrice: -191701.68, buyLoan: 103992.60, buyFinalIncome: 296545.01, buyInterestSave: 1815.67, buyInterestLoan: -99247.21, buyMaintenance: -73263.38, buyRepay: 18078.01, buyResidual: -122070.61, buyPropValue: 286872.01};

    });

    it('Passes 1st test set', function(){
      var results = property.buyrent(data[0]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[0]));
    });

    it('Passes 2nd test set', function(){
      var results = property.buyrent(data[1]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      //console.log(values);
      assert(_.isMatch(values, expectations[1]));
    });

    it('Passes 3rd test set', function(){
      var results = property.buyrent(data[2]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      //console.log(values);
      assert(_.isMatch(values, expectations[2]));
    });


    // todo: add more test cases
  });








});

