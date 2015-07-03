var assert = require("assert");
var f = require("../finance");

describe("Annuity submodule correct",function(){
  describe("Annual value aggregator functions correct",function(){

    var data = [];
    before(function() {
      data[0] = [100000, 4, 0.08, 3000];
      data[1] = [95640,  4, 0.08, 3000];
      data[2] = [4000,   4, 0.08, 3000];
      data[3] = [2500,   4, 0.08, 1000];
      data[4] = [4000,   4, 1,    1500];
      data[5] = [3500,   4, 1,    1500];
    });


    describe("annualInterestLinear correct",function(){
      it("Passes 1st test set", function(){
        assert(f.annuity.annualInterestLinear(data[0][0],data[0][1],data[0][2],data[0][3]) === 7878.392000000001);
      });
      it("Passes 2nd test set", function(){
        assert(f.annuity.annualInterestLinear(data[1][0],data[1][1],data[1][2],data[1][3]) === 7518.9877824);
      });
      it("Passes 3rd test set", function(){
        assert(f.annuity.annualInterestLinear(data[2][0],data[2][1],data[2][2],data[2][3]) === 101.6);
      });
      it("Passes 4th test set", function(){
        assert(f.annuity.annualInterestLinear(data[3][0],data[3][1],data[3][2],data[3][3]) === 92.62);
      });
      it("Passes 5th test set", function(){
        assert(f.annuity.annualInterestLinear(data[4][0],data[4][1],data[4][2],data[4][3]) === 3117.1875);
      });
      it("Passes 6th test set", function(){
        assert(f.annuity.annualInterestLinear(data[5][0],data[5][1],data[5][2],data[5][3]) === 2396.484375);
      });
    });

    describe("annualAmortizationLinear correct",function(){
      it("Passes 1st test set", function(){
        assert(f.annuity.annualAmortizationLinear(data[0][0],data[0][1],data[0][2],data[0][3]) === 4121.607999999999);
      });
      it("Passes 2nd test set", function(){
        assert(f.annuity.annualAmortizationLinear(data[1][0],data[1][1],data[1][2],data[1][3]) === 4481.0122176);
      });
      it("Passes 3rd test set", function(){
        assert(f.annuity.annualAmortizationLinear(data[2][0],data[2][1],data[2][2],data[2][3]) === 4000);
      });
      it("Passes 4th test set", function(){
        assert(f.annuity.annualAmortizationLinear(data[3][0],data[3][1],data[3][2],data[3][3]) === 2500);
      });
      it("Passes 5th test set", function(){
        assert(f.annuity.annualAmortizationLinear(data[4][0],data[4][1],data[4][2],data[4][3]) === 2882.8125);
      });
      it("Passes 6th test set", function(){
        assert(f.annuity.annualAmortizationLinear(data[5][0],data[5][1],data[5][2],data[5][3]) === 3500);
      });
    });

    describe("annualResidualLinear correct",function(){
      it("Passes 1st test set", function(){
        assert(f.annuity.annualResidualLinear(data[0][0],data[0][1],data[0][2],data[0][3]) === 95878.392);
      });
      it("Passes 2nd test set", function(){
        assert(f.annuity.annualResidualLinear(data[1][0],data[1][1],data[1][2],data[1][3]) === 91158.9877824);
      });
      it("Passes 3rd test set", function(){
        assert(f.annuity.annualResidualLinear(data[2][0],data[2][1],data[2][2],data[2][3]) === 0);
      });
      it("Passes 4th test set", function(){
        assert(f.annuity.annualResidualLinear(data[3][0],data[3][1],data[3][2],data[3][3]) === 0);
      });
      it("Passes 5th test set", function(){
        assert(f.annuity.annualResidualLinear(data[4][0],data[4][1],data[4][2],data[4][3]) === 1117.1875);
      });
      it("Passes 6th test set", function(){
        assert(f.annuity.annualResidualLinear(data[5][0],data[5][1],data[5][2],data[5][3]) === 0);
      });
    });

    describe("annualInterestPAngV correct",function(){
      it("Passes 1st test set", function(){
        assert(f.annuity.annualInterestPAngV(data[0][0],data[0][1],data[0][2],data[0][3]) === 7640);
      });
      it("Passes 2nd test set", function(){
        assert(f.annuity.annualInterestPAngV(data[1][0],data[1][1],data[1][2],data[1][3]) === 7291.20);
      });
      it("Passes 3rd test set", function(){
        assert(f.annuity.annualInterestPAngV(data[2][0],data[2][1],data[2][2],data[2][3]) === 100);
      });
      it("Passes 4th test set", function(){
        assert(f.annuity.annualInterestPAngV(data[3][0],data[3][1],data[3][2],data[3][3]) === 90);
      });
      it("Passes 5th test set", function(){
        assert(f.annuity.annualInterestPAngV(data[4][0],data[4][1],data[4][2],data[4][3]) === 1875);
      });
      it("Passes 6th test set", function(){
        assert(f.annuity.annualInterestPAngV(data[5][0],data[5][1],data[5][2],data[5][3]) === 1500);
      });
    });

    describe("annualAmortizationPAngV correct",function(){
      it("Passes 1st test set", function(){
        assert(f.annuity.annualAmortizationPAngV(data[0][0],data[0][1],data[0][2],data[0][3]) === 4360);
      });
      it("Passes 2nd test set", function(){
        assert(f.annuity.annualAmortizationPAngV(data[1][0],data[1][1],data[1][2],data[1][3]) === 4708.80);
      });
      it("Passes 3rd test set", function(){
        assert(f.annuity.annualAmortizationPAngV(data[2][0],data[2][1],data[2][2],data[2][3]) === 4000);
      });
      it("Passes 4th test set", function(){
        assert(f.annuity.annualAmortizationPAngV(data[3][0],data[3][1],data[3][2],data[3][3]) === 2500);
      });
      it("Passes 5th test set", function(){
        assert(f.annuity.annualAmortizationPAngV(data[4][0],data[4][1],data[4][2],data[4][3]) === 4000);
      });
      it("Passes 6th test set", function(){
        assert(f.annuity.annualAmortizationPAngV(data[5][0],data[5][1],data[5][2],data[5][3]) === 3500);
      });
    });

    describe("annualResidualPAngV correct",function(){
      it("Passes 1st test set", function(){
        assert(f.annuity.annualResidualPAngV(data[0][0],data[0][1],data[0][2],data[0][3]) === 95640.00);
      });
      it("Passes 2nd test set", function(){
        assert(f.annuity.annualResidualPAngV(data[1][0],data[1][1],data[1][2],data[1][3]) === 90931.20);
      });
      it("Passes 3rd test set", function(){
        assert(f.annuity.annualResidualPAngV(data[2][0],data[2][1],data[2][2],data[2][3]) === 0);
      });
      it("Passes 4th test set", function(){
        assert(f.annuity.annualResidualPAngV(data[3][0],data[3][1],data[3][2],data[3][3]) === 0);
      });
      it("Passes 5th test set", function(){
        assert(f.annuity.annualResidualPAngV(data[4][0],data[4][1],data[4][2],data[4][3]) === 0);
      });
      it("Passes 6th test set", function(){
        assert(f.annuity.annualResidualPAngV(data[5][0],data[5][1],data[5][2],data[5][3]) === 0);
      });
    });




  });
});