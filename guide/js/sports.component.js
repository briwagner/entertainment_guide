myApp.controller('sportsCtrl', ['$scope', '$http', 'api', function($scope, $http, api) {

  // init empty array to hold response data
  $scope.sports = [];
  $scope.sportTypes = [];
  $scope.sportTitles = [];

  $scope.loading = false;

  // api properties
  $scope.apiUrl = api.url;
  $scope.apiKey = '&api_key=' + api.key;
  $scope.sportsPrefix = 'v1.1/sports/all/events/airings?';

  // only lineup available?
  $scope.lineupId = 'lineupId=USA-VA65087-X';

  // today's date for query
  $scope.queryDate = new Date();
  $scope.dateURL = '&startDateTime=' + getTodayDate($scope.queryDate);

  // custom function to clean event type
  $scope.scrubEventType = scrubEventType;

  // form processing
  $scope.getSportListings = function() {
    $scope.loading = true;

    var requestURL = $scope.apiUrl
                   + $scope.sportsPrefix
                   + $scope.lineupId
                   + $scope.dateURL
                   + $scope.apiKey;

    var getSports = $http.get(requestURL);

    getSports.then(function(response) {
      $scope.sports = stripDupes(response.data);
      $scope.sportTitles = getAllTitles($scope.sports);
      $scope.loading = false;
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
  function getTodayDate(d) {
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  // format date for final display in header
  $scope.prettyDate = function(d) {
    return d.toLocaleDateString();
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

  // iterate over genres for individual event
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

  // iterate over all events to get types for select filter
  function getAllEventTypes(arr) {
    var arrTypes = [];

    arr.forEach(function(el) {
      if (el.program.genres) {
        el.program.genres.forEach(function(e) {
          // e = scrubEventType(e);
          if (arrTypes.indexOf(e) === -1) {
            arrTypes.push(e);
          }
        })
      }
    });
    return arrTypes;
  }

  function getAllTitles(dataArr) {
    titles = [];

    dataArr.forEach(function(el) {
      if (el.program.title) {
        var newTitle = el.program.title;
        if (!titles.includes(newTitle)) {
          titles.push(newTitle);
        }
      }
    });
    return titles;
  }

  // remove spaces, dashes from event type names
  function scrubEventType(el) {
    el = el.replace(/ /g, "-").replace(/\//g, "-").toLowerCase();
    return el;
  }

}]);

myApp.directive('sportsTile', function() {
  return {
    templateUrl: 'html/sportsTile.html'
  }
});

var Sport = function(data) {
  this.data = data;
  this.sportId = data.program.sportsId;
  this.startTime = new Date(data.startTime);
  this.endTime = new Date(data.endTime);
  this.title = data.program.eventTitle;
  this.genres = data.program.genres;
  this.station = data.station.callSign;
  this.stationNum = data.station.channel;

  this.duration = function() {
    return this.endTime - this.startTime;
  };
};