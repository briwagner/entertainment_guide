var myApp = angular.module('myApp', ['ngRoute']);

myApp.controller('mainCrl', ['$scope', '$route', '$routeParams', '$location', 'zipCtrl', function($scope, $route, $routeParams, $location, zipCtrl) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.zip = zipCtrl;
    $scope.zipSet = false;

    $scope.setZipCode = function() {
      if( $scope.zipCode === undefined) {
        alert("Please type some numbers");
      } else if( isValid() ) {
        $scope.zipSet = true;
      } else {
        alert("Please enter a valid zip");
      }
    };

    function isValid() {
      if ( $scope.zipCode.toString().length == 5 ) {
        return true;
      } else {
        return false;
      }
    }
}]);

myApp.config(function($routeProvider, $locationProvider) {
    $routeProvider.when("/", {
      templateUrl: "/guide/html/landing.html"
    })
    .when('/movies', {
        templateUrl: "/guide/html/movies.html",
        controller: "movieCtrl"
    })
    .when('/sports', {
        templateUrl: "/guide/html/sports.html",
        controller: "sportsCtrl"
    })
    .when('/moviesOnTv', {
      templateUrl: '/guide/html/moviesTv.html',
      controller: 'moviesTvCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
});

myApp.directive('headerNav', function() {
  return {
    templateUrl: '/guide/html/headerNav.html'
  }
});

myApp.directive('movieTile', function() {
  return {
    templateUrl: '/guide/html/movieTile.html'
  }
});

myApp.factory('zipCtrl', function() {
  return function() {
  this.userZipcode = 12345;

    userZipcode
  }
});