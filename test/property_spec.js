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
      data[16] ={price: '561667.58', priceaddon: '21076.26', maintenance: '913.99', rent: '2415.7',  incomedynamic: '2.71',  valuedynamic: '3.36',  costdynamic: '1.78',  rentdynamic: '0',     equity: '224089.51', debtinterest: '1.12', debtpay: '3133.39', income: '4318.58', period: '40', equityinterest: '0.07',  dynamics: 'true'};
      data[17] ={price: '254589.13', priceaddon: '6650.68',  maintenance: '239.34', rent: '2532.79', incomedynamic: '0',     valuedynamic: '0.07',  costdynamic: '0',     rentdynamic: '0',     equity: '21907.9',   debtinterest: '5.04', debtpay: '2277.03', income: '3672.03', period: '15', equityinterest: '3.43',  dynamics: 'true'};
      data[18] ={price: '373742.81', priceaddon: '2856.4',   maintenance: '981.09', rent: '1348.9',  incomedynamic: '4.13',  valuedynamic: '1.56',  costdynamic: '1.85',  rentdynamic: '0',     equity: '342928.24', debtinterest: '8.36', debtpay: '1839.17', income: '3783.6',  period: '8',  equityinterest: '3.42',  dynamics: 'true'};
      data[19] ={price: '503715.76', priceaddon: '18316.18', maintenance: '527.89', rent: '2607.74', incomedynamic: '0',     valuedynamic: '0',     costdynamic: '3.99',  rentdynamic: '0',     equity: '398826.38', debtinterest: '7.93', debtpay: '981.43',  income: '2509.59', period: '25', equityinterest: '3.63',  dynamics: 'true'};




      expectations[0] = {rentFinalWealth: 283576.70, rentEquity: 80000,    rentFinalIncome: 360000,    rentFinalCost: -192000,    rentFinalInterest: 35576.70, buyFinalWealth: 336001.24 ,buyEquity: 80000,    buyPrice: -220000,    buyLoan: 140000,    buyFinalIncome: 360000,    buyInterestSave: 8530.02, buyInterestLoan: -32528.78, buyMaintenance: -60000,    buyRepay: -140000,  buyResidual: 0, buyPropValue: 200000};
      expectations[1] = {rentFinalWealth: -53326.39};
      expectations[2] = {buyEquity: 87709.08,buyLoan: 103992.6,buyPrice: -191701.68,buyFinalIncome: 296545.01,buyInterestSave: 1815.67,buyMaintenance: -73263.38,buyInterestLoan: -99247.21,buyRepay: 18078.01,buyResidual: -122070.61,buyPropValue: 286872.01,buyFinalWealth: 308729.5,rentEquity: 87709.08,rentFinalIncome: 296545.01,rentFinalInterest: 3568.4,rentFinalCost: -198006,rentFinalWealth: 189816.48};
      expectations[3] = {buyEquity: 173879.34,buyLoan: 101166.98,buyPrice: -275046.32,buyFinalIncome: 33856.44,buyInterestSave: 113.51,buyMaintenance: -8144.16,buyInterestLoan: -194.91,buyRepay: -18228.45,buyResidual: -82938.53,buyPropValue: 276498.08,buyFinalWealth: 200961.97,rentEquity: 173879.34,rentFinalIncome: 33856.44,rentFinalInterest: 3962.29,rentFinalCost: -1482.96,rentFinalWealth: 210215.11};
      expectations[4] = {buyEquity: 112756.63,buyLoan: 323962.27,buyPrice: -436718.9,buyFinalIncome: 77787.73,buyInterestSave: 402.92,buyMaintenance: -25414.08,buyInterestLoan: -320742.09,buyRepay: 277906.89,buyResidual: -601869.16,buyPropValue: 446567.16,buyFinalWealth: -145360.63,rentEquity: 112756.63,rentFinalIncome: 77787.73,rentFinalInterest: 8566.88,rentFinalCost: -165588.48,rentFinalWealth: 33522.76};
      expectations[5] = {buyEquity: 219032.27,buyLoan: 331529.84,buyPrice: -550562.11,buyFinalIncome: 2431624.43,buyInterestSave: 1072547.53,buyMaintenance: -145575.36,buyInterestLoan: -59240.35,buyRepay: -331529.84,buyResidual: 0,buyPropValue: 2031741.17,buyFinalWealth: 4999567.58,rentEquity: 219032.27,rentFinalIncome: 2431624.43,rentFinalInterest: 1488534.76,rentFinalCost: -985770.24,rentFinalWealth: 3153421.22};
      expectations[6] = {buyEquity: 195240.39,buyLoan: 94871.49,buyPrice: -290111.88,buyFinalIncome: 1696547.21,buyInterestSave: 209926.97,buyMaintenance: -200182.42,buyInterestLoan: -5060.19,buyRepay: -94871.49,buyResidual: 0,buyPropValue: 339698.75,buyFinalWealth: 1946058.83,rentEquity: 195240.39,rentFinalIncome: 1696547.21,rentFinalInterest: 292980.3,rentFinalCost: -336081,rentFinalWealth: 1848686.9};
      expectations[7] = {buyEquity: 652.72,buyLoan: 154091.7,buyPrice: -154744.42,buyFinalIncome: 524188.89,buyInterestSave: 4012.1,buyMaintenance: -90439.4,buyInterestLoan: -20936.38,buyRepay: -154091.70,buyResidual: 0,buyPropValue: 213889.59,buyFinalWealth: 476623.10,rentEquity: 652.72,rentFinalIncome: 524188.89,rentFinalInterest: 9804.90,rentFinalCost: -105106.32,rentFinalWealth: 429540.19};
      expectations[8] = {buyEquity: 134882.66,buyLoan: 33020.32,buyPrice: -167902.98,buyFinalIncome: 107783.04,buyInterestSave: 34.92,buyMaintenance: -39275.44,buyInterestLoan: -2291.35,buyRepay: -33020.32,buyResidual: 0,buyPropValue: 160978.71,buyFinalWealth: 194209.56,rentEquity: 134882.66,rentFinalIncome: 107783.04,rentFinalInterest: 510.47,rentFinalCost: -124484.34,rentFinalWealth: 118691.83};
      expectations[9] = {buyEquity: 117327.16,buyLoan: 450774.47,buyPrice: -568101.63,buyFinalIncome: 1260622.29,buyInterestSave: 207290.33,buyMaintenance: -82348.01,buyInterestLoan: -652971.48,buyRepay: 547518.6,buyResidual: -998293.07,buyPropValue: 1829324.97,buyFinalWealth: 2111143.63,rentEquity: 117327.16,rentFinalIncome: 1260622.29,rentFinalInterest: 183306.46,rentFinalCost: -665091.13,rentFinalWealth: 896164.78};
      expectations[10]= {};
      expectations[11]= {};
      expectations[12]= {};
      expectations[13]= {};
      expectations[14]= {};
      expectations[15]= {};
      expectations[16]= {};
      expectations[17]= {};
      expectations[18]= {};
      expectations[19]= {};



      // todo: add remaining expectations
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
      assert(_.isMatch(values, expectations[1]));
    });

    it('Passes 3rd test set', function(){
      var results = property.buyrent(data[2]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[2]));
    });

    it('Passes 4th test set', function(){
      var results = property.buyrent(data[3]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[3]));
    });

    it('Passes 5th test set', function(){
      var results = property.buyrent(data[4]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[4]));
    });

    it('Passes 6th test set', function(){
      var results = property.buyrent(data[5]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[5]));
    });

    it('Passes 7th test set', function(){
      var results = property.buyrent(data[6]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[6]));
    });

    it('Passes 8th test set', function(){
      var results = property.buyrent(data[7]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[7]));
    });

    it('Passes 9th test set', function(){
      var results = property.buyrent(data[8]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});

      assert(_.isMatch(values, expectations[8]));
    });

    it('Passes 10th test set', function(){
      var results = property.buyrent(data[9]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[9]));
    });

    it('Passes 11th test set', function(){
      var results = property.buyrent(data[10]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[10]));
    });

    it('Passes 12th test set', function(){
      var results = property.buyrent(data[11]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[11]));
    });

    it('Passes 13th test set', function(){
      var results = property.buyrent(data[12]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[12]));
    });

    it('Passes 14th test set', function(){
      var results = property.buyrent(data[13]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[13]));
    });

    it('Passes 15th test set', function(){
      var results = property.buyrent(data[14]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[14]));
    });

    it('Passes 16th test set', function(){
      var results = property.buyrent(data[15]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[15]));
    });

    it('Passes 17th test set', function(){
      var results = property.buyrent(data[16]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[16]));
    });

    it('Passes 18th test set', function(){
      var results = property.buyrent(data[17]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[17]));
    });

    it('Passes 19th test set', function(){
      var results = property.buyrent(data[18]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[18]));
    });

    it('Passes 20th test set', function(){
      var results = property.buyrent(data[19]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[19]));
    });


  });








});

