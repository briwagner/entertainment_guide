var myApp = angular.module('myApp', ['ngRoute']);

myApp.controller('mainCrl', function($scope, $route, $routeParams, $location) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
});

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