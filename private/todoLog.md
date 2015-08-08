The purpose of this file is to collect todos mainly based on feedback and experiences with the app 

***** GLOBAL APP TASKS ******
* testing sheet for each calculator
* improved rootfinding algorithm (use rserve?)
* graphs
* pdf generator (create pdf an the server an d serve back as a static file)
* useful print previews
* excel file generator
* frontend validation
* animationen
* feeback-field
* search for calculators / tasks on the landing page
* landing-page animations
* modals for zoom -> popups for results etc
* establish grunt tasks for minification (uglifyjs) and removing DEBUG codegit
* css classes for output tables
* mocha testing for finance library
* efficient procedure for init and assign taks at the head of each function
* effective interest calculator for property-homesave
* functionality that tells user that server is currently unavailable (instead of throwing a calc error)
* more effient frontent-code for showing and hiding inputs
* function for initializing calculators (i.e. outsource 'init and assign')
* customizable HTML emails that can be sent to clients (use app.render insted of res.render on the server to create emails)
* pro and basic versions for calculators
* make sure that results are also invalidated if newly added fields are changed (such as 'Tilgungsmonat' in Sindertilgungen in Hypothekenrechner')


***** LOCAL APP TASKS ******
* create favicon from logo
* see also the todo-log
* Bildschirmausgaben Annuitätenrechner
* Funktionality to let users switch from month to year in tables
* Annutätenrechner: add text if tilgung is negative
* check grammar and style


***** NICE-TO-HAVE TASKS ******
* yuidoc-conform documentation
* single var per function style


***** CALCULATORS TO BE ADDED ******
* union-investment rechner auf www.geld-anlegen-klargemacht.de
* Implement calculators from DWS homepage


***** ONGOING TASKS ******
* monitor database entries for error messages (given db error reporting is established)
* monitor quandl API rate limits 