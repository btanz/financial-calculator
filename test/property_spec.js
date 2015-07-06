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

    it('Passes 1st test set', function(){
      var results = property.buyrent(data[0]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(!_.isEmpty(values) && _.isMatch(values, expectations[0]));
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

