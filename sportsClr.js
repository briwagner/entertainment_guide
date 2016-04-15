myApp.controller('sportsCtrl', ['$scope', '$http', 'api', function($scope, $http, api) {

// working url request
  // -- http://data.tmsapi.com/v1.1/sports/all/events/airings?lineupId=USA-DFLTE&startDateTime=2016-04-14T16%3A30Z&api_key=7fbqc3huhn75gvd3wkg7hsaz

  $scope.sports = [];

  // init w/ preloaded array --> must remove for production
  // $scope.sports = stripDupes(rawSports);
  // process listings array for event types
  // $scope.sportTypes = getAllEventTypes(rawSports);

  // api properties
  $scope.apiUrl = api.url;
  $scope.apiKey = '&api_key=' + api.key;

  $scope.sportsPrefix = 'v1.1/sports/all/events/airings?';
  $scope.lineupId = 'lineupId=USA-DFLTE';
  $scope.dateURL = '&startDateTime=' + getTodayDate();
  $scope.zipCode;

  // form processing
  $scope.getSportListings = function(zipCode) {
    $scope.zipCode = angular.copy(zipCode);
    // build request URL
    var requestURL = $scope.apiUrl + $scope.sportsPrefix + $scope.lineupId + $scope.dateURL + $scope.apiKey;
    // make request
    var getSports = $http.get(requestURL).then(function(response) {
      $scope.sports = stripDupes(response.data);
      $scope.sportTypes = getAllEventTypes(response.data);
      prepSportsBox();
    });
  }

  // sports IDs
  var golf = '117';
  var baseball = '17';
  var basketball = '59';
  var football = '111';
  var soccer = '199';
  var intSoccer = '140';
  var mma = '231';

  // format date for URL query
  function getTodayDate() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  // test for duplicates in array of elems
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

  // convert time for display
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