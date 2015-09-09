var express = require('express');
var router = express.Router();


/**
 * BOERSE ROUTES
 */
var boerse = require('../controllers/calc.boerse.controller');

router.get('/optionspreisrechner',              boerse.options.render);
router.get('/optionspreisrechner/inputs',       boerse.options.calculate);
router.get('/optionspreisrechner/guide',        boerse.options.guide);

router.get('/waehrungsrechner',                 boerse.fx.render);
router.get('/waehrungsrechner/inputs',          boerse.fx.calculate);
router.get('/waehrungsrechner/guide',           boerse.fx.guide);

router.get('/aktienrenditerechner',             boerse.equityreturn.render);
router.get('/aktienrenditerechner/inputs',      boerse.equityreturn.calculate);
router.get('/aktienrenditerechner/guide',       boerse.equityreturn.guide);

router.get('/portfoliorechner',                 boerse.portfolio.render);
router.get('/portfoliorechner/inputs',          boerse.portfolio.calculate);
router.get('/portfoliorechner/guide',           boerse.portfolio.guide);



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
router.get('/immobilienrenditerechner/guide',   property.propertyreturn.guide);

router.get('/kaufen-oder-mieten',               property.buyrent.render);
router.get('/kaufen-oder-mieten/inputs',        property.buyrent.calculate);
router.get('/kaufen-oder-mieten/guide',         property.buyrent.guide);

router.get('/mietrechner',                      property.rent.render);
router.get('/mietrechner/inputs',               property.rent.calculate);
router.get('/mietrechner/guide',                property.rent.guide);

router.get('/grunderwerbssteuerrechner',        property.transfertax.render);
router.get('/grunderwerbssteuerrechner/inputs', property.transfertax.calculate);
router.get('/grunderwerbssteuerrechner/guide',  property.transfertax.guide);

router.get('/bausparrechner',                   property.homesave.render);
router.get('/bausparrechner/inputs',            property.homesave.calculate);
router.get('/bausparrechner/guide',             property.homesave.guide);

router.get('/immobilienpreisrechner',           property.propertyprice.render);
router.get('/immobilienpreisrechner/inputs',    property.propertyprice.calculate);
router.get('/immobilienpreisrechner/guide',     property.propertyprice.guide);

router.get('/hypothekenrechner',                property.mortgage.render);
router.get('/hypothekenrechner/inputs',         property.mortgage.calculate);
router.get('/hypothekenrechner/guide',          property.mortgage.guide);


/**
 * DEPOSITS ROUTES
 */
var deposits = require('../controllers/calc.deposits.controller');

router.get('/zinsrechner',                      deposits.depinterest.render);
router.get('/zinsrechner/inputs',               deposits.depinterest.calculate);
router.get('/zinsrechner/guide',                deposits.depinterest.guide);

router.get('/sparrechner',                      deposits.depsaving.render);
router.get('/sparrechner/inputs',               deposits.depsaving.calculate);
router.get('/sparrechner/guide',                deposits.depsaving.guide);

router.get('/festgeldrechner',                  deposits.timedeposit.render);
router.get('/festgeldrechner/inputs',           deposits.timedeposit.calculate);
router.get('/festgeldrechner/guide',            deposits.timedeposit.guide);

router.get('/zuwachssparrechner',               deposits.savingscheme.render);
router.get('/zuwachssparrechner/inputs',        deposits.savingscheme.calculate);
router.get('/zuwachssparrechner/guide',         deposits.savingscheme.guide);

router.get('/vorschusszinsrechner',             deposits.interestpenalty.render);
router.get('/vorschusszinsrechner/inputs',      deposits.interestpenalty.calculate);
router.get('/vorschusszinsrechner/guide',       deposits.interestpenalty.guide);

router.get('/tagesgeldrechner',                 deposits.overnightdeposit.render);
router.get('/tagesgeldrechner/inputs',          deposits.overnightdeposit.calculate);
router.get('/tagesgeldrechner/guide',           deposits.overnightdeposit.guide);


/**
 * DEBT ROUTES
 */
var debt = require('../controllers/calc.debt.controller');

router.get('/annuitaetenrechner',               debt.annuity.render);
router.get('/annuitaetenrechner/inputs',        debt.annuity.calculate);
router.get('/annuitaetenrechner/guide',         debt.annuity.guide);

router.get('/dispozinsrechner',                 debt.dispo.render);
router.get('/dispozinsrechner/inputs',          debt.dispo.calculate);
router.get('/dispozinsrechner/guide',           debt.dispo.guide);

router.get('/tilgungssurrogatrechner',          debt.repaysurrogat.render);
router.get('/tilgungssurrogatrechner/inputs',   debt.repaysurrogat.calculate);
router.get('/tilgungssurrogatrechner/guide',    debt.repaysurrogat.guide);


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