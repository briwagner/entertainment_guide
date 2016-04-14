var myApp = angular.module('myApp', []);

http://data.tmsapi.com/v1.1/movies/showings?startDate=2016-04-12&zip=20002&api_key=7fbqc3huhn75gvd3wkg7hsaz

myApp.constant('api', {
  url: 'http://data.tmsapi.com/',
  key: '7fbqc3huhn75gvd3wkg7hsaz',
  imageUrl: 'http://developer.tmsimg.com/'
});

myApp.directive('headerNav', function() {
  return {
    templateUrl: 'headerNav.html'
  }
});

myApp.controller('movieCtrl', ['$scope', 'api', function($scope, api) {
  $scope.movies = movieRaw;
  $scope.apiUrl = api.url;
  $scope.imageUrl = api.imageUrl;
  $scope.apiKey = '?api_key=' + api.key;
  $scope.getGenres = function(movie) {

    // consider create empty array; then push into array instead of mapping?
    var genreList = [];
    if (movie.genres && movie.genres.length > 0) {
      genreList.forEach(function(e) {
        genreList.push(e.toLowerCase().replace(" ", "-"));
      })
    }
    if (genreList.length > 0){
      genreList = genreList.join(" ");
    }
    return genreList;
  };

  $scope.theatreList = function(theatreArray) {
    var theatres = [];
    theatreArray.forEach(function(el) {
      theatres.push(el.theatre.name);
    });
    if (theatres.length > 0) {
      var uniqueTheatres = [];
      theatres.forEach(function(e) {
        if (uniqueTheatres.indexOf(e) < 0) {
          uniqueTheatres.push(e)
        }
      });
      theatres = uniqueTheatres;
    }
    return theatres;
  };
}]);

myApp.directive('movieTile', function() {
  return {
    templateUrl: 'movieTile.html'
  }
})