The purpose of this file is to collect todos mainly based on feedback and experiences with the app 

**** ACTION PLAN LAUNCH DATE 14.09.2015 ****
\ generally, need to work through each calculator, complete it, and test it; there is about 2 days of time for each calculator

- complete portfolio calculator and test it by comparing with excel
    * add feature that allows for entering own portfolio
    * write explanation text




***** I. GLOBAL APP TASKS ******

****  I.A) BEFORE NEXT LAUNCH ****
* IP anonymisierung (anonymizeIp)
* impressum, inhaltlich verantwortlich etc
* icons navbar
* navbar persistent
* functionality that tells user that server is currently unavailable (instead of throwing a calc error)
* make sure that results are also invalidated if newly added fields are changed (such as 'Tilgungsmonat' in Sindertilgungen in Hypothekenrechner')
* mobile umbruch
* colors


****  I.B) AFTER NEXT LAUNCH ****
* feeback-field
* establish grunt tasks for minification (uglifyjs) and removing DEBUG codegit
* css classes for output tables
* rechtschreibprüfung
* add debt-annuity
* error handling and logging around math.roots
* database table for error reporting/logging
* mocha testing for finance library
* graphs
* animationen
* improved rootfinding algorithm (use rserve?)
* verlinkungen auf andere Rechner
* Aktienrenditerechner sollte dividendenrendite können wegen SEO
* deposits-savings option zur Berechnung der Laufzeit
* comparison page with financeadds-data
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
* add to menu  "1": {
      "name": "Finanzplanung",
      "values": {
        "1": {
          "name": "Risikopräferenzen",
          "url": "/"
        },
        "2": {
          "name": "Asset-Mix",
          "url": "/"
        },
        "3": {
          "name": "Sparziele",
          "url": "/"
        },
        "4": {
          "name": "Budgetierung",
          "url": "/"
        },
        "5": {
          "name": "Altersvorsorge-Rechner",
          "url": "/altersvorsorgerechner"
        }
      }
    },



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