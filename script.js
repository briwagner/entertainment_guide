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

}]);

myApp.directive('movieTile', function() {
  return {
    templateUrl: 'movieTile.html'
  }
});

myApp.controller('sportsCtrl', ['$scope', 'api', function($scope, api) {
  $scope.sports = stripDupes(rawSports);
  $scope.apiUrl = api.url;
  $scope.apiKey = '?api_key=' + api.key;

  $scope.sportTypes = getAllEventTypes(rawSports);

  // sports IDs
  var golf = '117';
  var baseball = '17';
  var basketball = '59';
  var football = '111';
  var soccer = '199';
  var intSoccer = '140';
  var mma = '231';

  function arrayContains(arr, prop, val) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].program.hasOwnProperty(prop) && arr[i].program[prop] === val) {
        return true
      }
    }
    return false
  };

  // strip duplicates
  function stripDupes(arr) {
    var uniqueEvents = [];

    arr.forEach(function(el) {
      if (arrayContains(uniqueEvents, 'rootId', el.program.rootId )) {
      } else {
        uniqueEvents.push(el);
      }
    });
    return uniqueEvents;
  };

  $scope.getEventTime = function(dateObj) {
    var eventDT = new Date(dateObj);
    return eventDT.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
  }

  $scope.getEventType = function(spEvent) {
    var genreArr = [];
    var genres = spEvent.program.genres;
    if (genres && genres.length > 0 ) {
      spEvent.program.genres.forEach(function(el) {
        genreArr.push( scrubEventType(el) );
      });
      return genreArr.join(" ");
    } else {
      return "";
    }
  };

  function scrubEventType(el) {
    el = el.replace(/ /g, "-").replace(/\//g, "-").toLowerCase();
    return el;
  }

  $scope.scrubEventType = scrubEventType;

  function getAllEventTypes(arr) {
    var arrTypes = [];
    arr.forEach(function(el) {
      if (el.program.genres) {
        el.program.genres.forEach(function(e) {
          if (arrTypes.indexOf(e) === -1) {
            arrTypes.push(e);
          }
        })
      }
    });
    return arrTypes;
  }

}]);

myApp.directive('sportsTile', function() {
  return {
    templateUrl: 'sportsTile.html'
  }
});