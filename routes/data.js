'use strict';
var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;

var client = new Client();

let timeseriesURL = "https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/datapoints";

let query = {
  cache_time: 0,
  tags: [
    {
      name: "Compressor-2017:CompressionRatio",
      order: "desc"
    }
  ],
  start: 1452112200000,
  end: 1453458897222
}

router.get('/datapoints/timebound', function (req, res) {
  let body = req.body;
  console.log("Recieved request for datapoints : ",body);

  let request = {
    headers :
      {
      "Content-Type": "application/json" ,
      "predix-zone-id" : req.headers["predix-zone-id"],
	    "authorization": req.headers.authorization
     }

  }

  query.tags[0].name = body.tagName;
  query.tags[0].start = body.start;
  query.tags[0].end = body.end;
  reuest.data = query;

  console.log("QUERY:" + request);

  client.post(timeseriesURL, request, function (data, response) {

  				res.send(JSON.stringify(data));
  		});
});






module.exports = router;
