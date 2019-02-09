'use strict';
var express = require('express');
var router = express.Router();
const request = require('request');


router.post("/v1/gpio/", function (req, res) {
	
console.log(JSON.stringify(req.body));
        const options = {
                url: "https://7pmdb1vyic.execute-api.ca-central-1.amazonaws.com/dev",
                headers: {
                    'cache-control': 'no-cache',
                    'content-type': 'application/json'
                },
                body:JSON.stringify(req.body)
            };
    
    request.post(options, (err, resp, resBody) => {
       // console.log("Calling MQTT post API with body");
		if(err!=null){
			res.send(resp);
		}
		else{
			res.send(err);
		}
        
    });
		  
});

module.exports = router;
