var myApp = angular.module('myApp', ['ngRoute']);

myApp.controller('mainCrl', function($scope, $route, $routeParams, $location) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
});

myApp.config(function($routeProvider, $locationProvider) {
    $routeProvider.when("/", {
      templateUrl: "/html/landing.html"
    })
    .when('/movies', {
        templateUrl: "/html/movies.html",
        controller: "movieCtrl"
    })
    .when('/sports', {
        templateUrl: "/html/sports.html",
        controller: "sportsCtrl"
    })
    .when('/moviesOnTv', {
      templateUrl: '/html/moviesTv.html',
      controller: 'moviesTvCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
});

myApp.directive('headerNav', function() {
  return {
    templateUrl: '/html/headerNav.html'
  }
});

myApp.directive('movieTile', function() {
  return {
    templateUrl: '/html/movieTile.html'
  }
});