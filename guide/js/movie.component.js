myApp.controller('movieCtrl', ['$scope', '$http', 'api', function($scope, $http, api) {
  $scope.apiUrl = api.url + "v1.1/movies/showings?";
  $scope.imageUrl = api.imageUrl;
  $scope.apiKey = '&api_key=' + api.key;

  $scope.queryDate = new Date();
  $scope.today = "startDate=" + getTodayDate($scope.queryDate);

  $scope.movies = []; //movieRaw;
  $scope.uniqueGenres = [];
  
  $scope.loading = false;
  $scope.moviesSet = false;

  $scope.getMovieData = function() {
    var zip = $scope.zipCode;
    if (zip == undefined || zip.toString().length !== 5) {
      alert("Please enter a valid zip code");
    } else {
      $scope.loading = true;
      var zipCode = "&zip=" + zip;
      var movieUrl = $scope.apiUrl + $scope.today + zipCode + $scope.apiKey;
      var movieRequest = $http.get(movieUrl);
      movieRequest.then(function(response) {
        $scope.movies = response.data;
        $scope.loading = false;
        $scope.moviesSet = true;
      })
    }
  };

  $scope.getGenres = function(movie) {
    var genreList = [];

    if (movie.genres && movie.genres.length > 0) {
      movie.genres.forEach(function(e) {
        var gen = e.replace(" ", "-");
        genreList.push(gen);

      // push to master genre list
        if ($scope.uniqueGenres.indexOf(e) === -1) {
          $scope.uniqueGenres.push(e);
        }
      })
    }
    // format for html display
    if (genreList.length > 0){
      return genreList.join(", ");
    }
  };

  $scope.showingTimes = function(m, t) {
    var showtimes = [];
    if (m.showtimes.length > 0) {
      m.showtimes.forEach(function(item) {
        if(item.theatre.name) {
          if(item.theatre.name === t) {
            if (showtimes.indexOf(item.dateTime) === -1) {
              showtimes.push(item.dateTime);
            }
          }
        }
      });
      // showtimes = showtimes.map(function(d) {return new Date(d);})
      showtimes = showtimes.map(d => d.slice(-5));
      return showtimes;
    }
  }

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

myApp.filter('showingTimesList', function() {
  return function(obj) {
    return obj.join(", ");
  }
});