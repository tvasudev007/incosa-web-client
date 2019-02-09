'use strict';
var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;

/* GET home page. */

router.get('/authenticate', function (req, res) {
	
	
		console.log("Recieved request for login : "); 
        res.send(JSON.stringify(data));    

});

router.post('/latest', function (req, res) {
  console.log("Recieved request for latest data : ",req.body);
  console.log(req.body.sensor.sensor_type);
  var type = req.body.sensor.sensor_type;
  var id =req.body.sensor.sensor_id

    db.queryLatest(db.get(),type,id,function (err,data) {
      console.log(data)
       res.send(JSON.stringify(data));
    })

});

router.post('/tmb', function (req, res) {
  console.log("reuest recieved for sensor",req.body);
  var typeName = req.body.params.type;
  var startDate = req.body.params.startDate;
  var endDate = req.body.params.endDate;
  var id =req.body.params.id;

  db.queryTimebound(db.get(),typeName,id,startDate,endDate,function (err,data) {

      res.send(JSON.stringify(data));
  })

});


module.exports = router;