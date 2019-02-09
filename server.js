var app = require('./app');
var constants = require('./constants');
var ip = require("ip");


const ipAddress = ip.address();
const assert = require('assert');
const uuid = require('uuid');
const uid = uuid.v1();

//logs
const winston = require('winston');
//winston.level =  'debug';

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: constants.logDirPath + 'server.log' })
    ]
});


logger.level = 'debug';

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
    //console.log("Calling app.listen's callback function.");
    var host = server.address().address;
    var port = server.address().port;
    logger.log('debug', uid + " Connected Things App started & listening at" + ipAddress + ":" + port);
});

