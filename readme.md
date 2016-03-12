# Financial Calculator

## Overview
Financial Calculator is a web application prototype that can be used to perform various financial calculations on different datasources. 

![alt tag](https://github.com/btanz/financial-calculator/blob/master/public/images/app_pics/app01.jpg)
*************
![alt tag](https://github.com/btanz/financial-calculator/blob/master/public/images/app_pics/app02.jpg)

The application is hosted at http://www.simplyfi.de and has around 600 organic visitors per month (January 2016).

## Purpose
Setting up excel sheets to perform financial calculations can be a daunting task. For example, a simple stock portfolio optimization requires an analyst to perform a whole range of steps, including loading stock data into Excel, calculating statistics of the stock time series and solving an optimization problem. This web application performs all these steps for stock portfolio optimization and other financial calculations. The application also provides visualizations of the results and a pdf-download feature that can be used to generate documents based on the calculations performed.
 
## Technology
The application is written entirely in JavaScript/Node.js and uses MongoDB as a backend-datastore. It is deployed to an EC2 instance via Github. 

## Application Structure
* app/ - the main server side files, including Jade view templates, routes, controllers, modules for financial calculations and database models (Mongoose)
* config/ - files that set environment and production configurations for the databases, the data api's and the node.js server
* data/ - database seeds for application content and metadata
* lib/ - application libraries developed for performing financial calculations, for generating pdf outputs and for retrieving data from the Quandl financial data api (the Quandl module uses JS Promises to handle latency)
* node_modules/ - external modules (logger, parser, helper)
* public/ - static css, images and js files
* public/js/app - the modularized front-end part of the application (doesn't use a framework, but is organized and modularized like a framework)
* test/ - contains unit tests (using mocha.js)





