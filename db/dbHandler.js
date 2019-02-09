// database source code

var mysql = require('mysql');
var constants = require('.././constants');
var moment = require('moment');
//logs
const winston = require('winston');
//winston.level =  'debug';

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: constants.logDirPath + 'db.log' })
    ]
});


logger.level = 'debug';

const assert = require('assert');
const uuid = require('uuid');
const uid = uuid.v1();


var mysqlCon = mysql.createConnection({
  host: constants.databaseHost,
  user: constants.userName,
  password: constants.password,
  database: constants.databaseName
});

var state = {
    db: null,
}

mysqlCon.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  state.db=mysqlCon;
});

var handleDisconnect = function(){
  mysqlCon.connect( function (err) {
          if (err) {
            throw err;
          }else{
            state.db = mysqlCon;
          }

  })
}

mysqlCon.on('error', function(err) {
   console.log('db error', err);
   if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
     handleDisconnect();                         // lost due to either server restart, or a
   } else {                                      // connnection idle timeout (the wait_timeout
     throw err;                                  // server variable configures this)
   }
 });

 mysqlCon.on('end', function(err) {
    console.log('db conn end', err);
      handleDisconnect();                         // lost due to either server restart, or a

  });



exports.connect = function (done) {
    if (state.db) return done(null,state.db)

    mysqlCon.connect( function (err, db) {
            if (err) return done(err,null)
        state.db = db
        done(err,state.db)
    })
}

exports.get = function () {
    return state.db
}

exports.queryTimebound = function (db,tableName,id,startdate,enddate,done) {
//  var startDate = startdate;//"2008-11-11 13:23:44" //moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
//  var endtDate = enddate;//moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
console.log(tableName,id,startdate,enddate)
console.log("db query")
var queryStr="SELECT * FROM "+ tableName+" WHERE Sensor_Id = "+id+ "  AND `sensorDate` BETWEEN FROM_UNIXTIME("+startdate+") AND FROM_UNIXTIME("+enddate+");";
//AND DATE(sensorDate) <= '"+enddate+"' AND DATE(sensorDate) >= '"+startdate+"'";
console.log(queryStr);
  db.query(queryStr, function (err, result) {
  if (err){
     done(err,null);
  }
  console.log("sensor Date: "+result.length);
  done(err,result);

})
}

exports.queryLatest = function (db,tableName,id,done) {

  var queryStr ="SELECT * FROM "+ tableName+" WHERE Sensor_Id = "+id+ " Order By sensorDate DESC LIMIT 1";
  console.log(queryStr);
  db.query(queryStr, function (err, result) {
  if (err){
     done(err,null);
  }
  console.log("Latest sensor Date: "+result.length);
  done(err,result);

})
}

exports.queryAll = function (db,tableName,done) {
  var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
  db.query("SELECT * FROM "+ tableName, function (err, result) {
  if (err){
     done(err,null);
  }
  console.log("sending data to client "+result.length);
  done(err,result);

})
}


exports.close = function (done) {
    if (state.db) {
        state.db.close(function (err, result) {
            state.db = null
            state.mode = null
            done(err)
        })
    }
}
