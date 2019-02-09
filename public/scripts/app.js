


var myApp = angular.module('app', ['app.controllers', 'app.routes', 'app.services', 'app.directives','blockUI','angularUtils.directives.dirPagination','angularjs-dropdown-multiselect','angularjs-gauge','angularjs-datetime-picker']);

myApp.run(function($rootScope, $timeout,$http) {

  });

myApp.config(configApp);

configApp.$inject = ['ngGaugeProvider','blockUIConfig'];
function configApp(ngGaugeProvider,blockUIConfig) {

  // setting the default parameters for
  // gauge instances globally.
  ngGaugeProvider.setOptions({
      size: 250,
      cap: 'round',
      thick: 15,
      foregroundColor: "#ff8645",   // note the camelCase notation for parameter name
      backgroundColor: "#e4e4e4"
  });

  blockUIConfig.autoBlock = false;

}
