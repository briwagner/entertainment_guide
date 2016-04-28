$(document).ready(function() {

  prepSportsBox();

});

function prepSportsBox() {
    var sportsDOM = document.querySelector('body .sports-grid');
    var sportsBox;

    if(sportsDOM) {
      sportsBox = new Isotope(sportsDOM, {
        itemSelector: '.sports-tile',
        layoutMode: 'fitRows'
      });
    };

  // data binding on filter buttons
    $('body .event-filter').on('click', function(event) {
      event.preventDefault();
      var filter;
      if(this.getAttribute('data-filter-name').length > 0) {
        filter = "." + this.getAttribute('data-filter-name');
      } else {
        filter = "*"
      }
      setFilter(filter);
    });
}

// apply filter
var setFilter = function(filterName) {
  $('body .sports-grid').isotope({filter: ""});
  $('body .sports-grid').isotope({filter: filterName});
};


