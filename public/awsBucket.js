var aws_access_key_id = 'AKIAIGIEK4WW2EZGZSVA';

var aws_secret_access_key = 'xOu5ks/ywdEQRGLExkYHnVxeBWIAdNhp6Re5urFH';

var params ={accessKeyId :aws_access_key_id,secretAccessKey :aws_secret_access_key};

//Create a new Client object with your broker's hostname, port and your own clientId
var client = new Messaging.Client("broker.mqttdashboard.com", 8000,
"myclientid_" + parseInt(Math.random() * 100, 10));

//Gets  called if the websocket/mqtt connection gets disconnected for any reason
client.onConnectionLost = function (responseObject) {
    //Depending on your scenario you could implement a reconnect logic here
    alert("connection lost: " + responseObject.errorMessage);
};

//Gets called whenever you receive a message for your subscriptions
client.onMessageArrived = function (message) {
    //Do something with the push message you received
  
};


var s3 = new AWS.S3(params);
var params = {
    Bucket: 'droneImageBucket007_mnm',

};

s3.listObjects(params, function (err, data) {
    if (err) {
        console.log(err, err.stack);
    } else {
        console.log(data.Contents);
    }
});


 s3.getObject({
    Bucket: 'droneImageBucket007_mnm', /* required */
  	Key: 'drone1478945069030vegTest.jpg',
}, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
});
