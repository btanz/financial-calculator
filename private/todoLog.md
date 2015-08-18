The purpose of this file is to collect todos mainly based on feedback and experiences with the app 

**** ACTION PLAN LAUNCH DATE 14.09.2015 ****
\ generally, need to work through each calculator, complete it, and test it; there is about 2 days of time for each calculator
\ create a nice landing page with animations

- complete portfolio calculator and test it by comparing with excel
    * add more assets and a better method to select assets
    * add feature that allows for adding the shortselling restriction
    * add feature that allows for entering own portfolio
    * write explanation text

- add tests and graphics to option calculator





***** I. GLOBAL APP TASKS ******

****  I.A) BEFORE NEXT LAUNCH ****
* testing sheet for each calculator
* improved rootfinding algorithm (use rserve?)
* graphs
* animationen
* feeback-field
* landing-page animations
* establish grunt tasks for minification (uglifyjs) and removing DEBUG codegit
* css classes for output tables
* mocha testing for finance library
* functionality that tells user that server is currently unavailable (instead of throwing a calc error)
* make sure that results are also invalidated if newly added fields are changed (such as 'Tilgungsmonat' in Sindertilgungen in Hypothekenrechner')
* database table for error reporting
* comparison page with financeadds-data

****  I.B) AFTER NEXT LAUNCH ****
* pdf generator (create pdf an the server an d serve back as a static file)
* useful print previews
* excel file generator
* frontend validation
* search for calculators / tasks on the landing page
* modals for zoom -> popups for results etc
* more effient frontent-code for showing and hiding inputs
* function for initializing calculators (i.e. outsource 'init and assign')
* customizable HTML emails that can be sent to clients (use app.render insted of res.render on the server to create emails)
* pro and basic versions for calculators



***** II. LOCAL APP TASKS ******
* create favicon from logo
* see also the todo-log
* Bildschirmausgaben Annuitätenrechner
* Funktionality to let users switch from month to year in tables
* Annutätenrechner: add text if tilgung is negative
* check grammar and style


***** III. NICE-TO-HAVE TASKS ******
* yuidoc-conform documentation
* single var per function style


***** IV. CALCULATORS TO BE ADDED ******
* union-investment rechner auf www.geld-anlegen-klargemacht.de
* Implement calculators from DWS homepage



***** V. ONGOING PRODUCTION TASKS ******
* monitor database entries for error messages (given db error reporting is established)
* monitor quandl API rate limits 