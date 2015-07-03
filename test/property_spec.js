var assert = require("assert");
var _ = require("underscore");
var property = require('../modules/property')
//var f = require("../finance");


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
});

