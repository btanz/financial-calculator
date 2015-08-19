/**
 * Created by benjamintanz on 19.08.15.
 *
 * routes for /data/equity
 *
 */
var express = require('express');
var router = express.Router();



router.get('/',function(req, res){
  res.json({hello: 'Welcome'});
});


/** route that exposes indicators in a defined database; example: /data/equity/ind?db=FSE
 * exposes all indicators for FSE (Frankfurt stock exchange)
 */
router.get('/ind',function(req, res){
  var Data = require('mongoose').model('Data.Equity.Ind');
  var query = req.query;


  Data.findByDB(query.db)
      .then(function(data){
        res.json(data);
      })
      .onReject(function(){
        console.log("An error occurred while rendering the deposits-depsaving calculator.");
      });

});






module.exports = router;