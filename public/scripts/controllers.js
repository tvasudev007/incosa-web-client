
 angular.module('app.controllers', ['ui.router'])
.controller('loginCtrl',  function($http,$scope,$rootScope,$interval,$state,blockUI) {

$interval.cancel($rootScope.dashboardInterval);
  $rootScope.img ='images.jpg';
  localStorage.setItem("username","");
  $scope.userError="";
  $rootScope.loginHide =  true;
  $scope.userName='';
  $scope.userPassword='';
  $rootScope.UAAURL='https://57b93619-4f14-4e56-b215-b985c4b8b245.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token?';
  $rootScope.TMSURL='https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/datapoints';
  $rootScope.ASSET= 'https://dofasco-microservice.run.aws-usw02-pr.ice.predix.io/api/allassets';
  $rootScope.flag=true;
  $rootScope.token='';
  var urlEncode = function(data) {
    var  pairs = [];
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if(typeof data[key] === 'undefined')
                continue;
            pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
        }
    }
    return pairs.join("&");
};
  $scope.clientCreds = function(){
  var Clientdata = {
      'client_id':'ic4c-client',
      'grant_type':'client_credentials'
  };

  $http.get($rootScope.UAAURL+urlEncode(Clientdata), {
      headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'authorization' : 'Basic aWM0Yy1jbGllbnQ6aWM0Yy1jbGllbnRzZWNyZXQ='
          },
          data:{
            'client_id':'ic4c-client',
            'grant_type':'client_credentials'
          }
      })
  .then(function(response) {
      token = response.data.access_token;
      $rootScope.token=token;
      //console.log(token);
      localStorage.setItem("token", token);
      //$state.go('dashboard');
    //  $scope.getTrain(token);
  }, function(response) {
      console.log( response);
  });
}
$scope.clientCreds();
  $scope.loginValidator = function (name,password) {
    blockUI.start();
    localStorage.setItem("username",name);
        var userdata = {
            'username': name,
            'password' : password,
            'grant_type' : 'password'
        };
        $http.get($rootScope.UAAURL+urlEncode(userdata), {
            headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'authorization' : 'Basic aWM0Yy1jbGllbnQ6aWM0Yy1jbGllbnRzZWNyZXQ='
                }
            })
        .then(function(response) {

          blockUI.stop();

          $scope.userError="";

          $state.go('dashboard');
        }, function(err) {
            blockUI.stop();
            console.log('Responce ' + err);
            $scope.userError="Unauthorized";
        });
  };
})
.controller('dashboardCtrl',['$http','$scope','$rootScope','$interval','$state','$window','getData' ,  function($http,$scope,$rootScope,$interval,$state,$window,getData) {

  $rootScope.flag==true;

  if($rootScope.flag==true)
  {
    $window.location.reload();
    //$route.reload();
    $rootScope.flag=false;
    $state.go('assetList');
  }
  $state.go('assetList');

}])
.controller('navCtrl',  function($http,$scope,$rootScope,$interval,$state,$location) {
  //  debugger;
  if($location.path()!='/asset' && $rootScope.Timer!=null || $rootScope.Timer!=undefined){
    $interval.cancel($rootScope.Timer);
  //  debugger;
  }

$rootScope.username=localStorage.getItem("username");

})
.controller('bodyCtrl',  function($http,$scope,$rootScope,$interval,$state,$location) {

  if($location.path()==='/sensor'){
    $rootScope.img ='';// use some background image
  }
  else{
    $rootScope.img ='';
  }

  $(function() {
      $('#side-menu').metisMenu();
  });

  //Loads the correct sidebar on window load,
  //collapses the sidebar on window resize.
  // Sets the min-height of #page-wrapper to window size
  $(function() {
      $(window).bind("load resize", function() {
          var topOffset = 50;
          var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
          if (width < 768) {
              $('div.navbar-collapse').addClass('collapse');
              topOffset = 100; // 2-row-menu
          } else {
              $('div.navbar-collapse').removeClass('collapse');
          }

          var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
          height = height - topOffset;
          if (height < 1) height = 1;
          if (height > topOffset) {
              $("#page-wrapper").css("min-height", (height) + "px");
          }
      });

      var url = window.location;
      // var element = $('ul.nav a').filter(function() {
      //     return this.href == url;
      // }).addClass('active').parent().parent().addClass('in').parent();
      var element = $('ul.nav a').filter(function() {
          return this.href == url;
      }).addClass('').parent();

      while (true) {
          if (element.is('li')) {
              element = element.parent().addClass('in').parent();
          } else {
              break;
          }
      }
  });
})
.controller('assetListCtrl',  function($http,$scope,$rootScope,$interval,$state,getData,sensorObjService,blockUI ) {
  $rootScope.flag==true;
  if($rootScope.flag==true)
  {
    $window.location.reload();
    //$route.reload();
    $rootScope.flag=false;
    $state.go('assetList');
  }
  $scope.asset_url = 'https://ic4c-microservice.run.aws-usw02-pr.ice.predix.io/api/allassets';
  //var token = localStorage.getItem("token");
  blockUI.start();
  $http.get($scope.asset_url,{
      headers: {'Authorization': localStorage.getItem("token")}
  }).then(function(res){
    blockUI.stop();
    $rootScope.sensorList = res.data;
    localStorage["assetList"] = JSON.stringify(res.data);
  },function(err){
    blockUI.stop();
  });

$scope.sensorDisplay= function(sensor){
  localStorage["sensorObj"] = JSON.stringify(sensor);
	$rootScope.sensorObj =sensor;
  getLatestSensorData(JSON.parse(localStorage["sensorObj"]));
  }

  var getLatestSensorData = function(sensor){
    blockUI.start();
    var uri = "https://ic4c-microservice.run.aws-usw02-pr.ice.predix.io/api/assets/"+sensor.id;
    $http.get(uri, {
        headers: {'Authorization': localStorage.getItem("token")}
    }).then(function(res){
          //console.log("LATEST VALUES: "+res.data);
          $rootScope.sensorValue =res.data;
	         localStorage["sensorLatestValue"]=JSON.stringify(res.data);
           blockUI.stop();
          $state.go('asset');
        },function(err){
          console.log(err);
          blockUI.stop();
        })
  }

})
.controller('assetCtrl',  function($http,$scope,$rootScope,$interval,$state,$window,$filter,blockUI ) {
  var TIME_INT = 4000;
  $scope.TIMESERIES = "https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/datapoints";
  $scope.predix_zone_id = 'efff9b19-1bad-416f-ab3a-1682a3b4cb6b';



  var assetSnapshotDetails = JSON.parse(localStorage["sensorLatestValue"]);
  $scope.ioControls =  assetSnapshotDetails[0].ioControls;
  if(assetSnapshotDetails.length<1){
    $state.go("sensorList");
  }
  $scope.assetId = JSON.parse(localStorage["sensorObj"]).id;
  $scope.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  $scope.gaugewidth = Math.round($scope.width*0.148)+'';
  $scope.gaugeThickness = Math.round($scope.width*0.015625)+'';
  $scope.parameters = assetSnapshotDetails[0].parameters;
  $scope.parametersGauge = [];
  $scope.statusTags =[];

  for(var tag of Object.keys(assetSnapshotDetails[0].parameters)){
      if($scope.parameters[tag].tileType=="gauge"){
        $scope.parametersGauge.push($scope.parameters[tag]);
      }
    else{
        $scope.statusTags.push($scope.parameters[tag]);
    }
  }

  $scope.showHistory = function(parameter,end,start){
    $rootScope.parameter = parameter;
    $state.go('history');
  }

  $scope.getActivityInfo = function(){
    $scope.currentStatus = "OFF";
    $scope.currentStatusColor = "color:red";
    $scope.currentStatusPanel = "panel panel-danger";
    var tagName = $scope.assetId + "_ESTOP";
    var endDate = new Date();

    var startTime = new Date(endDate.getFullYear(),0,1).getTime();
    var query = {"cache_time": 0,"tags": [{"name": tagName,"order":"asc"}],"start":startTime,"end":endDate.getTime()};

    $http({
      method: 'POST',
      url: $scope.TIMESERIES,
      data: query,
      headers: {
        'Authorization': "Bearer "+ localStorage.getItem("token"),
        'predix-zone-id': $scope.predix_zone_id,
        'content-type': 'application/json',
        'Access-Control-Allow-Origin':"*"
      }
    }).then(function(res){
        var estopData = res.data.tags[0].results[0].values;
        var onTime=0;
        var monthlyOnTime=0;
        var dailyOnTime =0;
        var cur = new Date();
        var monthDate = new Date(cur.getFullYear(),cur.getMonth(),1).getTime();
        var todayDate = new Date(cur.getFullYear(),cur.getMonth(),cur.getDate()).getTime();
        for(var i=0; i<estopData.length-1;i++){

          var prevValue = estopData[i][1];
          var curValue = estopData[i+1][1];

          if((prevValue==1 && curValue==0 ) || (prevValue==1 && curValue==1) ){
            diff = estopData[i+1][0] - estopData[i][0];
            if(estopData[i][0]>monthDate){
              monthlyOnTime+=diff;
            }
            if(estopData[i][0]>todayDate){
                dailyOnTime+=diff;
            }
            onTime+= diff;
          }

        }
        if(curValue==1){
          $scope.currentStatus = "ON";
          $scope.currentStatusColor = "color:green";
          $scope.currentStatusPanel = "panel panel-success";
          diff =  cur.getTime() - estopData[estopData.length-1][0];
          if(estopData[i][0]>monthDate){
            monthlyOnTime+=diff;
          }
          if(todayDate >estopData[i][0]){
            dailyOnTime = cur.getTime()-todayDate;
          }
          onTime+= diff;
        }
        else {
          $scope.currentStatus = "OFF";
          $scope.currentStatusColor = "color:red";
          $scope.currentStatusPanel = "panel panel-danger";
        }
        $scope.yearlyOnTimeInHours = Math.round(onTime/(1000*60*60*24));
        $scope.monthlyOnTime = Math.round(monthlyOnTime/(1000*60*60*24));
        $scope.dailyOnTime = Math.floor(dailyOnTime/(1000*60*60));

        },function(err){
          console.log(err);
        })
  }


  $scope.getActivityInfo();

  $scope.ioController = function(IO){

    if (confirm("Are you sure you want to toggle GPIO: " +IO.name +" ?")) {
      blockUI.start();
      var gpioControlURL =   "/control/v1/gpio";
      var req= {topic:$scope.assetId, message: {gpio: IO.topic, value: 1}};
        $http({
          method: 'POST',
          url: gpioControlURL,
          data:req,
          headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'Access-Control-Allow-Origin':"*"
          }
        }).then(function(res){
             blockUI.stop();
             alert("Switched ON GPIO: "+ IO.name);
          },function(err){
            console.log(err);
            blockUI.stop();
          });
      }
    }





  var getLatestData = function(assetId){
    var uri = "https://ic4c-microservice.run.aws-usw02-pr.ice.predix.io/api/assets/"+assetId;
    $http.get(uri, {
        headers: {'Authorization': localStorage.getItem("token")}
    }).then(function(res){
      localStorage["sensorLatestValue"]=JSON.stringify(res.data);
      var localassetSnapshotDetails = res.data;
      //$scope.parametersGauge=[];
      //$scope.statusTags=[];
      for(var tag of Object.keys(localassetSnapshotDetails[0].parameters)){
              if(localassetSnapshotDetails[0].parameters[tag].tileType=="gauge" ){

                for(var parameter of $scope.parametersGauge){
                  if((parameter.tag==localassetSnapshotDetails[0].parameters[tag].tag)
                  && parameter.value!=localassetSnapshotDetails[0].parameters[tag].value){
                    parameter.value=localassetSnapshotDetails[0].parameters[tag].value;
                  }
                }
                  //$scope.parametersGauge.push(localassetSnapshotDetails[0].parameters[tag]);
                }
              else{

                for(var parameter of $scope.statusTags){
                  if((parameter.tag==localassetSnapshotDetails[0].parameters[tag].tag)
                  && parameter.value!=localassetSnapshotDetails[0].parameters[tag].value){
                    parameter.value=localassetSnapshotDetails[0].parameters[tag].value;
                  }
                }

              }
            }
        },function(err){
          console.log(err);
        })
  }
  //Initialize the Timer to run every 1000 milliseconds i.e. one second.
    $rootScope.Timer = $interval(function () {
      var assetSnapshotDetails =JSON.parse(localStorage["sensorLatestValue"]);
      if(assetSnapshotDetails==null || assetSnapshotDetails==undefined || assetSnapshotDetails.length<1){
        $interval.cancel($rootScope.Timer);
        $state.go("sensorList");
      }
      getLatestData(assetSnapshotDetails[0].id);
    }, TIME_INT);

  $scope.sort = function(keyname){
    $scope.sortKey = keyname;   //set the sortKey to the param passed
    $scope.reverse = !$scope.reverse; //if true make it false and vice versa
  }

})
.controller('historyCtrl',  function($http,$scope,$rootScope,$interval,$state,$filter,blockUI ) {

  var parameter = $rootScope.parameter;
  if(parameter==null){
    $state.go('asset');
  }
  $scope.assetId = JSON.parse(localStorage["sensorObj"]).id;
  $scope.TIMESERIES = "https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/datapoints";
  $scope.predix_zone_id = 'efff9b19-1bad-416f-ab3a-1682a3b4cb6b';
  var start;
  var end;
  var d = new Date();
  var currTimestamp = Math.round(d.getTime()/1000);
  var defaultEndDate = Math.round(d.getTime()/1000);
  var timeStampDiff = 30*60*1000;

  var defaultStartDate =defaultEndDate-timeStampDiff;
  $scope.start=new Date(defaultStartDate*1000).toLocaleString();
  $scope.end=new Date(defaultEndDate*1000).toLocaleString();

  if(end==undefined || end==null){
    end = parameter.timestamp;
  }

  if(start==undefined || start==null){
    start = end-timeStampDiff;
  }

  $scope.dpForSingleTag=function(start,end){
     console.log("in DP"+ start+" : "+end);
     var startInepoch = new Date(start);
     var endInepoch = new Date(end);
     var stdate=startInepoch.getTime();
     var endate=endInepoch.getTime();

     $scope.getTimeBoundValues($scope.tagNameForHistoryTable,stdate,endate);
   }

   $scope.showDataInTable = function(data){
   $scope.datapointsForHistoryTable = data.tags[0].results[0].values;
     Highcharts.chart('container', {
         chart: {
             zoomType: 'x'
         },
         title: {
             text: $scope.tagNameForHistoryTable + ' vs time'
         },
         subtitle: {
             text: document.ontouchstart === undefined ?
                     'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
         },
         xAxis: {
             type: 'datetime'
         },
         yAxis: {
             title: {
                 text: 'Values'
             }
         },
         legend: {
             enabled: false
         },
         plotOptions: {
             area: {
                 fillColor: {
                     linearGradient: {
                         x1: 0,
                         y1: 0,
                         x2: 0,
                         y2: 1
                     }
                 },
                 marker: {
                     radius: 2
                 },
                 lineWidth: 1,
                 states: {
                     hover: {
                         lineWidth: 1
                     }
                 },
                 threshold: null
             }
         },

         series: [{
             type: 'line',
             name: 'Trendline',
             data: $scope.datapointsForHistoryTable
         }]
     });
   }

   $scope.getTimeBoundValues = function (tagName,startTime,endTime){
     blockUI.start();
     var query= {"cache_time": 0,"tags": [{"name": tagName,"order":"asc"}],"start":startTime,"end":endTime};
     $scope.tagNameForHistoryTable = tagName;
       $http({
         method: 'POST',
         url: $scope.TIMESERIES,
         data: query,
         headers: {
           'Authorization': "Bearer "+ localStorage.getItem("token"),
           'predix-zone-id': $scope.predix_zone_id,
           'content-type': 'application/x-www-form-urlencoded'
         }
       }).then(function(res){
            blockUI.stop();
            //console.log(res.data);
           $scope.showDataInTable(res.data);
            //window.scrollBy(0, document.documentElement.scrollHeight);
         },function(err){
           console.log(err);
           blockUI.stop();
         });
   }

   $scope.getTimeBoundValues(parameter.tag,start,end);

})
.controller('alertCtrl',  function($http,$scope,$rootScope,$interval,$state,$filter,blockUI ) {

  $scope.alerts_url = 'https://dofasco-microservice.run.aws-usw02-pr.ice.predix.io/api/alerts';

  blockUI.start();
  $http.get($scope.alerts_url,{
      headers: {'Authorization': localStorage.getItem("token")}
  }).then(function(res){
    blockUI.stop();
    $scope.alertList = res.data;
    $scope.showHistory(  $scope.alertList[0]);
  },function(err){
    blockUI.stop();
  });

  $scope.showHistory = function(alertObj){
    var alertHistoryList = [];
    $scope.tagSnapshotList = alertObj.snapshotValueList;

    for(alertHistory of alertObj.alertHistory){
      alertHistoryList.push([alertHistory.Timestamp,alertHistory.Value]);
    }

    Highcharts.chart('alertHistory', {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: alertObj.assetId + "_" + alertObj.tagName + ' vs time'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Values'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    }
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },

        series: [{
            type: 'line',
            name: 'Trendline',
            data: alertHistoryList
        }]
    });
  }

})
.controller('reportCtrl',  function($http,$scope,$rootScope,$interval,$state,$filter,blockUI ) {

  //blockUI.start();

  $scope.selectedTagList = [];
    $scope.selectedAssetList = [];
      $scope.assetList = [];
  //$scope.tagList = [ {id:  "David"}, {id:  "Jhon"}, {id: "Danny"} ];
   $scope.tagListSettings = {  displayProp: 'id', enableSearch: true, showSelectAll: true, keyboardControls: true,checkBoxes: true,
     styleActive: true,scrollableHeight: '500px', scrollable: true, selectionLimit: 4};

  $scope.assetListSettings = {  displayProp: 'id', enableSearch: true, showSelectAll: true, keyboardControls: true,checkBoxes: true,
    styleActive: true,scrollableHeight: '300px', scrollable: true};

  $scope.TIMESERIES = "https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io";
  $scope.predix_zone_id = 'efff9b19-1bad-416f-ab3a-1682a3b4cb6b';

  var assetListLocal = JSON.parse(localStorage["assetList"]);

  for(asset of assetListLocal){
    $scope.assetList.push({id: asset.id});
  }


$scope.$watchCollection('selectedAssetList', function(){
  blockUI.start();
  $http({
    method: 'GET',
    url: $scope.TIMESERIES+"/v1/tags",
    headers: {
      'Authorization': "Bearer "+ localStorage.getItem("token"),
      'predix-zone-id': $scope.predix_zone_id,
      'content-type': 'application/json'
    }
  }).then(function(res){
       blockUI.stop();
      var tagList = res.data.results;
      $scope.tagList=[];
      for(let tag of tagList){
        for(let asset of $scope.selectedAssetList){
          if(tag.includes(asset.id)){
            $scope.tagList.push({id: tag});
         }
        }
      }

    },function(err){
      console.log(err);
      blockUI.stop();
    });
}, true);

   $scope.getDataForTags = function(startDate, endDate){

     var seriesOptions = [], tagList = [];

     for(tag of $scope.selectedTagList ){
       tagList.push(tag.id);
     }

     var query = {
        "cache_time": 0,
        "tags": [
          {
            "name": tagList,
            "order": "asc"
          }
        ],
        "start": new Date(startDate).getTime(),
        "end": new Date(endDate).getTime()
      }

      blockUI.start();
      $http({
        method: 'POST',
        url: $scope.TIMESERIES+"/v1/datapoints",
        data: JSON.stringify(query),
        headers: {
          'Authorization': "Bearer "+ localStorage.getItem("token"),
          'predix-zone-id': $scope.predix_zone_id,
          'content-type': 'application/x-www-form-urlencoded'
        }
      }).then(function(res){
           blockUI.stop();
          $scope.seriesOptions=[];
          $scope.tableContent=[];
          $scope.tableHeaders=[];
          var counter=0;
          var responseObj = res.data.tags;
          responseObj.sort(function(a, b) {

              return b.stats.rawCount - a.stats.rawCount;
            });

           for(tagValues of responseObj){

             var valueArray = tagValues.results[0].values;

             $scope.seriesOptions.push({name:tagValues.name,data:valueArray});
             $scope.tableHeaders.push(tagValues.name);
             $scope.tableHeaders.push("Timestamp");

             for(let arrElements of valueArray){
                //  debugger;
                  if($scope.tableContent[counter]==undefined){
                    $scope.tableContent[counter] =[];
                  }
                $scope.tableContent[counter].push(arrElements[1]);
                $scope.tableContent[counter].push($filter('date')( arrElements[0] , "yyyy-MM-dd HH:mm"));
              counter++;
             }
             counter =0;
           }
           displaydataOnChart($scope.seriesOptions);
        },function(err){
          console.log(err);
          blockUI.stop();
        });

  }


    var displaydataOnChart = function (seriesOptions) {

       Highcharts.stockChart('reportChart', {

         rangeSelector: {
           selected: 4
         },

         yAxis: {
           labels: {
             formatter: function () {
               return (this.value > 0 ? ' + ' : '') + this.value;
             }
           },
           plotLines: [{
             value: 0,
             width: 2,
             color: 'silver'
           }]
         },

         plotOptions: {
           series: {
             compare: 'values',
             showInNavigator: true
           }
         },

         tooltip: {
           pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> <br/>',
           valueDecimals: 2,
           split: true
         },

         series: seriesOptions
       });
   }

   $scope.displayDataInTable = function(timeSeriesData){


     $scope.tableHeaders = [];
   }

});
