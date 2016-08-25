myApp.controller('moviesTvCtrl', ['$scope', '$http', 'api', function($scope, $http, api) {

  // $scope.moviesOnTv = rawMoviesOnTv;
  // $scope.uniqueMovies = removeDuplicates($scope.moviesOnTv);
  $scope.moviesOnTv = [];
  $scope.uniqueMovies = [];
  $scope.genres = [];
  $scope.uniqueGenres = [];

  $scope.urlPrefix = "http://data.tmsapi.com/v1.1/movies/airings?";
  $scope.lineupId = "lineupId=USA-VA65087-X";
  $scope.today = dateURL(new Date());
  
  $scope.loading = false;
  $scope.moviesSet = false;

// api call for movie listing
  $scope.getMovieUrl = getMovieListingUrl();

  function getMovieListingUrl() {
    var url = $scope.urlPrefix + $scope.lineupId + "&" + $scope.today + "&" + "api_key=" + api.key;
    return url;
  };

  $scope.fetchMovies = function() {
    $scope.loading = true;
    $http.get($scope.getMovieUrl)
    .then(function(response) {
        $scope.uniqueMovies = removeDuplicates(response.data);
        $scope.uniqueGenres = getGenres($scope.uniqueMovies);
        $scope.loading = false;
        $scope.moviesSet = true;
      }
    );
  };

// remove dupes from raw listing
  function removeDuplicates(arr) {
    unique = [];
    arr.forEach(function(el) {
      if (!arrayContains(unique, 'rootId', el.program.rootId)) {
        unique.push(el);
      }
    })
    return unique;
  };

  function arrayContains(arr, prop, val) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].program.hasOwnProperty(prop) && arr[i].program[prop] === val) {
        return true
      }
    }
    return false
  };

// get only unique genres for Select Filter
  function getGenres(arr) {
    var unique = [];

    arr.forEach(function(el) {
      if(el.program.genres && el.program.genres.length > 0) {
        el.program.genres.forEach(function(e) {
          if (unique.indexOf(e) === -1) {
            unique.push(e);
          }
        })
      }
    });
    return unique;
  }

// format date for URL
  function dateURL(d) {
    var dateString = "startDateTime=" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    return dateString;
  }

// formate date for display
  $scope.getEventTime = function(dateObj) {
    var eventDT = new Date(dateObj);
    return eventDT.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
  }

}]);

myApp.directive('moviesTvTile', function() {
  return {
    templateUrl: '/guide/html/moviesTv.tile.html'
  }
});