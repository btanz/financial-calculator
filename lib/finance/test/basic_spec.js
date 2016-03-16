/**
 * Created by benjamintanz on 31.08.15.
 *
 * Methods for testing the basic modules
 *
 */


var assert = require("assert");
var f = require("../finance");


describe("Basic finance requirements",function(){
  describe("basic finance module works",function(){
    it("it adds numbers correctly", function(){
      assert(f.basic.add(2,3) === 5);
    });
  });
});