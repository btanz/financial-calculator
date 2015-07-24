var assert = require("assert");
var _ = require("underscore");
var property = require('../app/modules/property')
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

    it('Passes 1st test set', function(){
      var results = property.propertyprice(data[0]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[0]));
    });

    it('Passes 2nd test set', function(){
      var results = property.propertyprice(data[1]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[1]));
    });

    it('Passes 3rd test set', function(){
      var results = property.propertyprice(data[2]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[2]));
    });

    it('Passes 4th test set', function(){
      var results = property.propertyprice(data[3]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[3]));
    });

    it('Passes 5th test set', function(){
      var results = property.propertyprice(data[4]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[4]));
    });

    it('Passes 6th test set', function(){
      var results = property.propertyprice(data[5]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[5]));
    });

    it('Passes 7th test set', function(){
      var results = property.propertyprice(data[6]),
          values = {};
      assert(Array.isArray(results));
    });

    it('Passes 8th test set', function(){
      var results = property.propertyprice(data[7]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[7]));
    });

    it('Passes 9th test set', function(){
      var results = property.propertyprice(data[8]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[8]));
    });

    it('Passes 10th test set', function(){
      var results = property.propertyprice(data[9]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[9]));
    });

    it('Passes 11th test set', function(){
      var results = property.propertyprice(data[10]),
          values = {};
      assert(Array.isArray(results));
    });

    it('Passes 12th test set', function(){
      var results = property.propertyprice(data[11]),
          values = {};
      assert(Array.isArray(results));
    });

    it('Passes 13th test set', function(){
      var results = property.propertyprice(data[12]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[12]));
    });

    it('Passes 14th test set', function(){
      var results = property.propertyprice(data[13]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[13]));
    });

    it('Passes 15th test set', function(){
      var results = property.propertyprice(data[14]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[14]));
    });

    it('Passes 16th test set', function(){
      var results = property.propertyprice(data[15]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[15]));
    });

    it('Passes 17th test set', function(){
      var results = property.propertyprice(data[16]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[16]));
    });

    it('Passes 18th test set', function(){
      var results = property.propertyprice(data[17]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[17]));
    });

    it('Passes 19th test set', function(){
      var results = property.propertyprice(data[18]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[18]));
    });

    it('Passes 20th test set', function(){
      var results = property.propertyprice(data[19]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[19]));
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

    it('Passes 1st test set', function(){
      var results = property.transfertax(data[0]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[0]));
    });

    it('Passes 2nd test set', function(){
      var results = property.transfertax(data[1]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[1]));

    });

    it('Passes 3rd test set', function(){
      var results = property.transfertax(data[2]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[2]));
    });

    it('Passes 4th test set', function(){
      var results = property.transfertax(data[3]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[3]));
    });

    it('Passes 5th test set', function(){
      var results = property.transfertax(data[4]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[4]));
    });

    it('Passes 6th test set', function(){
      var results = property.transfertax(data[5]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[5]));
    });

    it('Passes 7th test set', function(){
      var results = property.transfertax(data[6]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[6]));
    });

    it('Passes 8th test set', function(){
      var results = property.transfertax(data[7]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[7]));
    });

    it('Passes 9th test set', function(){
      var results = property.transfertax(data[8]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[8]));
    });

    it('Passes 10th test set', function(){
      var results = property.transfertax(data[9]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[9]));
    });

    it('Passes 11th test set', function(){
      var results = property.transfertax(data[10]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[10]));
    });

    it('Passes 12th test set', function(){
      var results = property.transfertax(data[11]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[11]));
    });

    it('Passes 13th test set', function(){
      var results = property.transfertax(data[12]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[12]));
    });

    it('Passes 14th test set', function(){
      var results = property.transfertax(data[13]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[13]));
    });

    it('Passes 15th test set', function(){
      var results = property.transfertax(data[14]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[14]));
    });

    it('Passes 16th test set', function(){
      var results = property.transfertax(data[15]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[15]));
    });

    it('Passes 17th test set', function(){
      var results = property.transfertax(data[16]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[16]));
    });

    it('Passes 18th test set', function(){
      var results = property.transfertax(data[17]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[17]));
    });

    it('Passes 19th test set', function(){
      var results = property.transfertax(data[18]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[18]));
    });

    it('Passes 20th test set', function(){
      var results = property.transfertax(data[19]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[19]));
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


    it('Passes 1st test set', function(){
      var results = property.propertyreturn(data[0]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(!_.isEmpty(values) && _.isMatch(values, expectations[0]));
    });

    it('Passes 2nd test set', function(){
      var results = property.propertyreturn(data[1]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[1]));

    });

    it('Passes 3rd test set', function(){
      var results = property.propertyreturn(data[2]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[2]));
    });

    it('Passes 4th test set', function(){
      var results = property.propertyreturn(data[3]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[3]));
    });

    it('Passes 5th test set', function(){
      var results = property.propertyreturn(data[4]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[4]));
    });

    it('Passes 6th test set', function(){
      var results = property.propertyreturn(data[5]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[5]));
    });

    it('Passes 7th test set', function(){
      var results = property.propertyreturn(data[6]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[6]));
    });

    it('Passes 8th test set', function(){
      var results = property.propertyreturn(data[7]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[7]));
    });

    it('Passes 9th test set', function(){
      var results = property.propertyreturn(data[8]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[8]));
    });

    it('Passes 10th test set', function(){
      var results = property.propertyreturn(data[9]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[9]));
    });

    it('Passes 11th test set', function(){
      var results = property.propertyreturn(data[10]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[10]));
    });

    it('Passes 12th test set', function(){
      var results = property.propertyreturn(data[11]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[11]));
    });

    it('Passes 13th test set', function(){
      var results = property.propertyreturn(data[12]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[12]));
    });

    it('Passes 14th test set', function(){
      var results = property.propertyreturn(data[13]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[13]));
    });

    it('Passes 15th test set', function(){
      var results = property.propertyreturn(data[14]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[14]));
    });

    it('Passes 16th test set', function(){
      var results = property.propertyreturn(data[15]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[15]));
    });

    it('Passes 17th test set', function(){
      var results = property.propertyreturn(data[16]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[16]));
    });

    it('Passes 18th test set', function(){
      var results = property.propertyreturn(data[17]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[17]));
    });

    it('Passes 19th test set', function(){
      var results = property.propertyreturn(data[18]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[18]));
    });

    it('Passes 20th test set', function(){
      var results = property.propertyreturn(data[19]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[19]));
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


    it('Passes 1st test set', function(){
      var results = property.rent(data[0]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(!_.isEmpty(values) && _.isMatch(values, expectations[0]));
    });

    it('Passes 2nd test set', function(){
      var results = property.rent(data[1]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[1]));

    });

    it('Passes 3rd test set', function(){
      var results = property.rent(data[2]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[2]));
    });

    it('Passes 4th test set', function(){
      var results = property.rent(data[3]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[3]));
    });

    it('Passes 5th test set', function(){
      var results = property.rent(data[4]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[4]));
    });

    it('Passes 6th test set', function(){
      var results = property.rent(data[5]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[5]));
    });

    it('Passes 7th test set', function(){
      var results = property.rent(data[6]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[6]));
    });

    it('Passes 8th test set', function(){
      var results = property.rent(data[7]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[7]));
    });

    it('Passes 9th test set', function(){
      var results = property.rent(data[8]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[8]));
    });

    it('Passes 10th test set', function(){
      var results = property.rent(data[9]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[9]));
    });

    it('Passes 11th test set', function(){
      var results = property.rent(data[10]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[10]));
    });

    it('Passes 12th test set', function(){
      var results = property.rent(data[11]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[11]));
    });

    it('Passes 13th test set', function(){
      var results = property.rent(data[12]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[12]));
    });

    it('Passes 14th test set', function(){
      var results = property.rent(data[13]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[13]));
    });

    it('Passes 15th test set', function(){
      var results = property.rent(data[14]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[14]));
    });

    it('Passes 16th test set', function(){
      var results = property.rent(data[15]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[15]));
    });

    it('Passes 17th test set', function(){
      var results = property.rent(data[16]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[16]));
    });

    it('Passes 18th test set', function(){
      var results = property.rent(data[17]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[17]));
    });

    it('Passes 19th test set', function(){
      var results = property.rent(data[18]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[18]));
    });

    it('Passes 20th test set', function(){
      var results = property.rent(data[19]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[19]));
    });


  });





  describe("Property-mortgage correct", function() {
    var data = [],
        expectations = [];
    before(function () {

      data[0] =  {select1: '3', select2: '1', principal: '127438.69', fees: 'false', feeamount: '0',     feetype: '2', disagio: 'true',  disagioamount: '8.45', interest: '',     initialinterest: '3.13', repay: '11.62', repayfreq: '4', term: '62', termperiods: '12',  repaymentfree: 'true', repaymentfreeterm: '19', repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '', annualrepay: '0',      followup: 'false', followupinterest: '0', specialrepay: 'false', specialrepaypositions: '0'};
      data[1] =  {select1: '4', select2: '1', principal: '50302.61',  fees: 'true',  feeamount: '288.7', feetype: '2', disagio: 'false', disagioamount: '0',    interest: '2.65', initialinterest: '',     repay: '212.88', repayfreq: '4',term: '200', termperiods: '12', repaymentfree: 'true', repaymentfreeterm: '19', repaymentfreetype: '2', repaymentfreetermperiods: '12', residual: '', annualrepay: '839.94', followup: 'false', followupinterest: '0', specialrepay: 'false', specialrepaypositions: '0'};


      expectations[0] = { value1: -3.09, value2: 102846.12};
      expectations[1] = { value1: -0.96, value2: 47390.74, };



    });

    it('Passes 1st test set', function(){
      var results = property.mortgage(data[0]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[0]));
    });

    it('Passes 2nd test set', function(){
      var results = property.mortgage(data[1]),
          values = {};
      _.each(results._1, function(el, ind, list){ values[ind]= Math.round(el.value * ROUND_PRECISION) / ROUND_PRECISION;});
      assert(_.isMatch(values, expectations[1]));
    });


  });




});

