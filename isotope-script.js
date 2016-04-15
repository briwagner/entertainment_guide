$(document).ready(function() {

  var sportsDOM = document.querySelector('.sports-grid');
  var sportsBox;

  if(sportsDOM) {
    sportsBox = new Isotope(sportsDOM, {
      itemSelector: '.sports-tile',
      layoutMode: 'fitRows'
    });
  };

// data binding on sports filter buttons
  $('.event-filter').on('click', function(event) {
    event.preventDefault();
    var filter;
    if(this.getAttribute('data-filter-name').length > 0) {
      filter = "." + this.getAttribute('data-filter-name');
    } else {
      var filter = "*"
    }
    setFilter(filter);
  })

});

// set filter in sports box
var setFilter = function(filterName) {
  $('.sports-grid').isotope({filter: ""});
  $('.sports-grid').isotope({filter: filterName});
};

// scrub filter names as provided by API


