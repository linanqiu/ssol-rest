// you know what these are
var express = require('express');
var bodyParser = require('body-parser');

// let's set up our app to throw jsons around
var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// logic methods
var logic = require('./logic.js')

// router
app.post('/auth/login', logic.authLogin);
app.get('/academic/schedule', logic.academicSchedule);
app.get('/academic/search_class', logic.academicSearchClass);

// initialize the server
var port = Number(process.env.PORT || 5000);
console.log("Server running on port " + port);
app.listen(port);
