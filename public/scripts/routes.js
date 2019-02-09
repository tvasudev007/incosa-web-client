angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

$stateProvider
.state('dashboard', {
    url: '/assetList',
    views: {
		'menu': {
		templateUrl: 'templates/nav.html',
		 controller: 'navCtrl'
		},
    'page': {
		templateUrl: 'templates/dashboard.html',
		 controller: 'dashboardCtrl'
		},
	}
  })
.state('login', {
  url: '/login',
  views: {
  'noMenu': {
  templateUrl: 'templates/login.html',
   controller: 'loginCtrl'
  },
}
})
.state('assetList', {
  url: '/assetList',
  views: {
  'menu': {
  templateUrl: 'templates/nav.html',
   controller: 'navCtrl'
  },
  'page': {
  templateUrl: 'templates/assets.html',
   controller: 'assetListCtrl'
  },

}
})
.state('asset', {
  url: '/asset',
  views: {
  'menu': {
  templateUrl: 'templates/nav.html',
   controller: 'navCtrl'
  },
  'page': {
  templateUrl: 'templates/asset.html',
   controller: 'assetCtrl'
  },
}
})
.state('history', {
  url: '/assetHistory',
  views: {
  'menu': {
  templateUrl: 'templates/nav.html',
   controller: 'navCtrl'
  },
  'page': {
  templateUrl: 'templates/history.html',
   controller: 'historyCtrl'
  },

}
})
.state('alerts', {
  url: '/alerts',
  views: {
  'menu': {
  templateUrl: 'templates/nav.html',
   controller: 'navCtrl'
  },
  'page': {
  templateUrl: 'templates/alerts.html',
   controller: 'alertCtrl'
  },

}
})
.state('reports', {
  url: '/reports',
  views: {
  'menu': {
  templateUrl: 'templates/nav.html',
   controller: 'navCtrl'
  },
  'page': {
  templateUrl: 'templates/reports.html',
   controller: 'reportCtrl'
  },

}
})

$urlRouterProvider.otherwise('/login')

});
