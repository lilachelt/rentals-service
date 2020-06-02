// =======================
// get the packages
// =======================
const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const mysql = require('mysql');
var cors = require('cors');
const db = require('./utils/db');
// =======================
// configuration =========
// =======================

const port= process.env.PORT || 3090;

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));
const routerApartments = require('./routes/routerApartments');
// =======================
// routes ================
// ======================= 
app.use('/apartments', cors(), routerApartments);


app.listen(port);
console.log(`Magic happens at http://localhost:${port}`);