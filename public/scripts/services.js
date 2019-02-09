angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])
.factory('getData', function($http, $log, $q) {
  //debugger;
  return {
   getValue: function(tag,token,dataB) {
     var deferred = $q.defer();
     $http({
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Predix-Zone-Id' : '53a57c0e-1e1e-451c-af19-bfc1d3d40796',
            'authorization' : 'Bearer ' + token
        },
        data:dataB,
        method: 'POST',

        url: 'https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/datapoints'
     }).success(function(res) {
      // debugger;
          deferred.resolve({
             res
             });
       }).error(function(msg) {
        // debugger;
          deferred.reject(msg);
          $log.error(msg);
       });
     return deferred.promise;
   }
  }
 })


.service('sensorObjService', [function(){
this.sensorObj={};
  this.setSensor=function(sensor){
    this.sensorObj = sensor;
    console.log(this.sensorObj );
  };

  this.getSensor=function(){
    return this.sensorObj;
  };


}]);
