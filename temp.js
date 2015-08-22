var debt = require("./app/modules/debt");
var mongoose = require('./config/mongoose');
var db = mongoose();


debt.repaysurrogat({principal: '100000.00', debtinterest: '4.00', selection: '3', term: '10', initrepay: '0', repay: '0', interval: '12', saveinterest: '6.00', taxes: 'FALSE', taxrate: '0', taxfree: '0', taxtime: 'false'}).then(function(data){
  console.log(data);
});

console.log("test");