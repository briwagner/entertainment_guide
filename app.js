var myApp = angular.module('myApp', []);

http://data.tmsapi.com/v1.1/movies/showings?startDate=2016-04-12&zip=20002&api_key=7fbqc3huhn75gvd3wkg7hsaz

myApp.constant('api', {
  url: 'http://data.tmsapi.com/',
  key: '7fbqc3huhn75gvd3wkg7hsaz',
  imageUrl: 'http://developer.tmsimg.com/'
});

myApp.controller('movieCtrl', ['$scope', '$http', 'api', function($scope, $http, api) {
  $scope.apiUrl = api.url + "v1.1/movies/showings?";
  $scope.imageUrl = api.imageUrl;
  $scope.apiKey = '&api_key=' + api.key;

  $scope.queryDate = new Date();
  $scope.today = "startDate=" + getTodayDate($scope.queryDate);

  $scope.movies = []; //movieRaw;

  $scope.getMovieData = function(zip) {
    if (zip == undefined) {
      alert("Please enter a zip code");
    } else {
      var zipCode = "&zip=" + zip;
      var movieUrl = $scope.apiUrl + $scope.today + zipCode + $scope.apiKey;
      var movieRequest = $http.get(movieUrl);
      movieRequest.then(function(response) {
        $scope.movies = response.data;
      })
    }
  };

  $scope.getGenres = function(movie) {
    var genreList = [];
    if (movie.genres && movie.genres.length > 0) {
      movie.genres.forEach(function(e) {
        genreList.push(e.toLowerCase().replace(" ", "-"));
      })
    }
    if (genreList.length > 0){
      return genreList.join(" ");
    }
  };

  $scope.getShowings = function(movie) {
    var showings = [];
    var matchIndex;

    movie.showtimes.forEach(function(el) {
      var screening = {scrName: el.theatre.name, scrTime: [el.theatre.dateTime]};
// test if name is present in showings array
      for (var i = 0; i < showings.length; i++) {
        if (showings[i].scrName == el.theatre.name) {
          matchIndex = i;
        }
      }
// if present add time only; else add new obj
      if (matchIndex >= 0) {
        showings[matchIndex].scrTime.push(screening.scrTime[0])
      } else {
        showings.push(screening);
      }
    });

    return showings;
  };

  $scope.theatreList = function(movie) {
    var theatres = [];
    if (movie.showtimes) {
      movie.showtimes.forEach(function(el) {
        theatres.push(el.theatre.name);
      });
      if (theatres && theatres.length > 0) {
        var uniqueTheatres = [];
        theatres.forEach(function(e) {
          if (uniqueTheatres.indexOf(e) < 0) {
            uniqueTheatres.push(e)
          }
        });
        theatres = uniqueTheatres;
        return theatres;
      }
    }
  };

  $scope.hasShowings = function(obj) {
    if (obj.showtimes) {
      return true
    } else {
      return false
    }
  };

  function getTodayDate(d) {
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

}]);

myApp.directive('headerNav', function() {
  return {
    templateUrl: 'headerNav.html'
  }
});

myApp.directive('movieTile', function() {
  return {
    templateUrl: 'movieTile.html'
  }
});