'use strict';
var express = require('express');
var constants = require('./constants');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const winston = require('winston');
//winston.level =  'debug';
var control = require('./routes/control');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: constants.logDirPath+'express.log' })
    ]
});
logger.level = 'debug';

const assert = require('assert');
const uuid = require('uuid');
const uid = uuid.v1();

var app = express();


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/control', control);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// development error handler - prints stacktrace
 app.use(function(err, req, res, next) {
    if (!res.headersSent) {
      res.status(err.status || 500);
      res.send({
        message: err.message,
        error: err
      });
    }
 });


module.exports = app;
