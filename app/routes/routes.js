var express = require('express');
var router = express.Router();



/**
 * BOERSE ROUTES
 */
var boerse = require('../controllers/calc.boerse.controller');

router.get('/optionspreisrechner',              boerse.options.render);
router.get('/optionspreisrechner/inputs',       boerse.options.calculate);
router.get('/optionspreisrechner/guide',        boerse.options.guide);
router.get('/optionspreisrechner/pdf',          boerse.options.generatepdf);

router.get('/waehrungsrechner',                 boerse.fx.render);
router.get('/waehrungsrechner/inputs',          boerse.fx.calculate);
router.get('/waehrungsrechner/guide',           boerse.fx.guide);
router.get('/waehrungsrechner/pdf',             boerse.fx.generatepdf);

router.get('/aktienrenditerechner',             boerse.equityreturn.render);
router.get('/aktienrenditerechner/inputs',      boerse.equityreturn.calculate);
router.get('/aktienrenditerechner/guide',       boerse.equityreturn.guide);
router.get('/aktienrenditerechner/pdf',         boerse.equityreturn.generatepdf);

router.get('/portfoliorechner',                 boerse.portfolio.render);
router.get('/portfoliorechner/inputs',          boerse.portfolio.calculate);
router.get('/portfoliorechner/guide',           boerse.portfolio.guide);
router.get('/portfoliorechner/pdf',             boerse.portfolio.generatepdf);



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
router.get('/immobilienrenditerechner/pdf',     property.propertyreturn.generatepdf);

router.get('/kaufen-oder-mieten',               property.buyrent.render);
router.get('/kaufen-oder-mieten/inputs',        property.buyrent.calculate);
router.get('/kaufen-oder-mieten/guide',         property.buyrent.guide);
router.get('/kaufen-oder-mieten/pdf',           property.buyrent.generatepdf);

router.get('/mietrechner',                      property.rent.render);
router.get('/mietrechner/inputs',               property.rent.calculate);
router.get('/mietrechner/guide',                property.rent.guide);
router.get('/mietrechner/pdf',                  property.rent.generatepdf);

router.get('/grunderwerbssteuerrechner',        property.transfertax.render);
router.get('/grunderwerbssteuerrechner/inputs', property.transfertax.calculate);
router.get('/grunderwerbssteuerrechner/guide',  property.transfertax.guide);
router.get('/grunderwerbssteuerrechner/pdf',    property.transfertax.generatepdf);

router.get('/bausparrechner',                   property.homesave.render);
router.get('/bausparrechner/inputs',            property.homesave.calculate);
router.get('/bausparrechner/guide',             property.homesave.guide);
router.get('/bausparrechner/pdf',               property.homesave.generatepdf);

router.get('/immobilienpreisrechner',           property.propertyprice.render);
router.get('/immobilienpreisrechner/inputs',    property.propertyprice.calculate);
router.get('/immobilienpreisrechner/guide',     property.propertyprice.guide);
router.get('/immobilienpreisrechner/pdf',       property.propertyprice.generatepdf);

router.get('/hypothekenrechner',                property.mortgage.render);
router.get('/hypothekenrechner/inputs',         property.mortgage.calculate);
router.get('/hypothekenrechner/guide',          property.mortgage.guide);
router.get('/hypothekenrechner/pdf',            property.mortgage.generatepdf);


/**
 * DEPOSITS ROUTES
 */
var deposits = require('../controllers/calc.deposits.controller');

router.get('/zinsrechner',                      deposits.depinterest.render);
router.get('/zinsrechner/inputs',               deposits.depinterest.calculate);
router.get('/zinsrechner/guide',                deposits.depinterest.guide);
router.get('/zinsrechner/pdf',                  deposits.depinterest.generatepdf);


router.get('/sparrechner',                      deposits.depsaving.render);
router.get('/sparrechner/inputs',               deposits.depsaving.calculate);
router.get('/sparrechner/guide',                deposits.depsaving.guide);
router.get('/sparrechner/pdf',                  deposits.depsaving.generatepdf);

router.get('/festgeldrechner',                  deposits.timedeposit.render);
router.get('/festgeldrechner/inputs',           deposits.timedeposit.calculate);
router.get('/festgeldrechner/guide',            deposits.timedeposit.guide);
router.get('/festgeldrechner/pdf',              deposits.timedeposit.generatepdf);

router.get('/zuwachssparrechner',               deposits.savingscheme.render);
router.get('/zuwachssparrechner/inputs',        deposits.savingscheme.calculate);
router.get('/zuwachssparrechner/guide',         deposits.savingscheme.guide);
router.get('/zuwachssparrechner/pdf',           deposits.savingscheme.generatepdf);

router.get('/vorschusszinsrechner',             deposits.interestpenalty.render);
router.get('/vorschusszinsrechner/inputs',      deposits.interestpenalty.calculate);
router.get('/vorschusszinsrechner/guide',       deposits.interestpenalty.guide);
router.get('/vorschusszinsrechner/pdf',         deposits.interestpenalty.generatepdf);

router.get('/tagesgeldrechner',                 deposits.overnightdeposit.render);
router.get('/tagesgeldrechner/inputs',          deposits.overnightdeposit.calculate);
router.get('/tagesgeldrechner/guide',           deposits.overnightdeposit.guide);
router.get('/tagesgeldrechner/pdf',             deposits.overnightdeposit.generatepdf);


/**
 * DEBT ROUTES
 */
var debt = require('../controllers/calc.debt.controller');

router.get('/annuitaetenrechner',               debt.annuity.render);
router.get('/annuitaetenrechner/inputs',        debt.annuity.calculate);
router.get('/annuitaetenrechner/guide',         debt.annuity.guide);
router.get('/annuitaetenrechner/pdf',           debt.annuity.generatepdf);


router.get('/dispozinsrechner',                 debt.dispo.render);
router.get('/dispozinsrechner/inputs',          debt.dispo.calculate);
router.get('/dispozinsrechner/guide',           debt.dispo.guide);
router.get('/dispozinsrechner/pdf',             debt.dispo.generatepdf);

router.get('/tilgungssurrogatrechner',          debt.repaysurrogat.render);
router.get('/tilgungssurrogatrechner/inputs',   debt.repaysurrogat.calculate);
router.get('/tilgungssurrogatrechner/guide',    debt.repaysurrogat.guide);
router.get('/tilgungssurrogatrechner/pdf',      debt.repaysurrogat.generatepdf);


/**
 * MISC ROUTES
 */
var misc = require('../controllers/calc.misc.controller');

router.get('/zinstagerechner',                  misc.daycount.render);
router.get('/zinstagerechner/inputs',           misc.daycount.calculate);
router.get('/zinstagerechner/guide',            misc.daycount.guide);
router.get('/zinstagerechner/pdf',              misc.daycount.generatepdf);


/**
 * EXPOSE ROUTES
 */
module.exports = router;