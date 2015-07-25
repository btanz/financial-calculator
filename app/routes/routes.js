var express = require('express');
var router = express.Router();


/**
 * BOERSE ROUTES
 */
var boerse = require('../controllers/calc.boerse.controller');

router.get('/optionspreisrechner',              boerse.options.render);
router.get('/optionspreisrechner/inputs',       boerse.options.calculate);

router.get('/waehrungsrechner',                 boerse.fx.render);
router.get('/waehrungsrechner/inputs',          boerse.fx.calculate);

router.get('/aktienrenditerechner',             boerse.equityreturn.render);
router.get('/aktienrenditerechner/inputs',      boerse.equityreturn.calculate);



/**
 * PLANNING ROUTES
 */
var planning = require('../controllers/calc.planning.controller');

router.get('/altersvorsorgerechner',            planning.retire.render);
router.get('/altersvorsorgerechner/inputs',     planning.retire.calculate);



/**
 * PROPERTY ROUTES
 */
var property = require('../controllers/calc.property.controller');

router.get('/immobilienrenditerechner',         property.propertyreturn.render);
router.get('/immobilienrenditerechner/inputs',  property.propertyreturn.calculate);

router.get('/kaufen-oder-mieten',               property.buyrent.render);
router.get('/kaufen-oder-mieten/inputs',        property.buyrent.calculate);

router.get('/mietrechner',                      property.rent.render);
router.get('/mietrechner/inputs',               property.rent.calculate);

router.get('/grunderwerbssteuerrechner',        property.transfertax.render);
router.get('/grunderwerbssteuerrechner/inputs', property.transfertax.calculate);

router.get('/bausparrechner',                   property.homesave.render);
router.get('/bausparrechner/inputs',            property.homesave.calculate);

router.get('/immobilienpreisrechner',           property.propertyprice.render);
router.get('/immobilienpreisrechner/inputs',    property.propertyprice.calculate);

router.get('/hypothekenrechner',                property.mortgage.render);
router.get('/hypothekenrechner/inputs',         property.mortgage.calculate);


/**
 * DEPOSITS ROUTES
 */
var deposits = require('../controllers/calc.deposits.controller');

router.get('/zinsrechner',                      deposits.depinterest.render);
router.get('/zinsrechner/inputs',               deposits.depinterest.calculate);

router.get('/sparrechner',                      deposits.depsaving.render);
router.get('/sparrechner/inputs',               deposits.depsaving.calculate);

router.get('/festgeldrechner',                  deposits.timedeposit.render);
router.get('/festgeldrechner/inputs',           deposits.timedeposit.calculate);

router.get('/zuwachssparrechner',               deposits.savingscheme.render);
router.get('/zuwachssparrechner/inputs',        deposits.savingscheme.calculate);

router.get('/vorschusszinsrechner',             deposits.interestpenalty.render);
router.get('/vorschusszinsrechner/inputs',      deposits.interestpenalty.calculate);

router.get('/tagesgeldrechner',                 deposits.overnightdeposit.render);
router.get('/tagesgeldrechner/inputs',          deposits.overnightdeposit.calculate);


/**
 * DEBT ROUTES
 */
var debt = require('../controllers/calc.debt.controller');

router.get('/annuitaetenrechner',               debt.annuity.render);
router.get('/annuitaetenrechner/inputs',        debt.annuity.calculate);

router.get('/dispozinsrechner',                 debt.dispo.render);
router.get('/dispozinsrechner/inputs',          debt.dispo.calculate);

router.get('/tilgungssurrogatrechner',          debt.repaysurrogat.render);
router.get('/tilgungssurrogatrechner/inputs',   debt.repaysurrogat.calculate);


/**
 * MISC ROUTES
 */
var misc = require('../controllers/calc.misc.controller');

router.get('/zinstagerechner',                  misc.daycount.render);
router.get('/zinstagerechner/inputs',           misc.daycount.calculate);


/**
 * EXPOSE ROUTES
 */
module.exports = router;