// My Model
var map;
var markers = [];
var Infowindow;
var locations = [{
        title: 'Sukhna Lake',
        location: {
            lat: 30.7421,
            lng: 76.8188
        }
    },
    {
        title: 'Home',
        location: {
            lat: 30.7026,
            lng: 76.7639
        }
    },
    {
        title: 'Rock Garden',
        location: {
            lat: 30.7525,
            lng: 76.8101
        }
    },
    {
        title: 'Sector 17',
        location: {
            lat: 30.7398,
            lng: 76.7827
        }
    },
    {
        title: 'Elante Mall',
        location: {
            lat: 30.7056,
            lng: 76.8013
        }
    },
    {
        title: 'Aroma Hotel',
        location: {
            lat: 30.7301452,
            lng: 76.7712277
        }
    },
    {
        title: 'Punjab University',
        location: {
            lat: 30.7600747,
            lng: 76.7641141
        }
    }
];

//Function used to initiate the map inspired by Udacity course
function initMap() {
    var styles = [{
            "elementType": "geometry",
            "stylers": [{
                "color": "#212121"
            }]
        },
        {
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#757575"
            }]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [{
                "color": "#212121"
            }]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [{
                "color": "#757575"
            }]
        },
        {
            "featureType": "administrative.country",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#9e9e9e"
            }]
        },
        {
            "featureType": "administrative.land_parcel",
            "stylers": [{
                "visibility": "off"
            }]
        },
        {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#bdbdbd"
            }]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#757575"
            }]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{
                "color": "#181818"
            }]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#616161"
            }]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.stroke",
            "stylers": [{
                "color": "#1b1b1b"
            }]
        },
        {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#2c2c2c"
            }]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#8a8a8a"
            }]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{
                "color": "#373737"
            }]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{
                "color": "#3c3c3c"
            }]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [{
                "color": "#4e4e4e"
            }]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#616161"
            }]
        },
        {
            "featureType": "transit",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#757575"
            }]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#3d3d3d"
            }]
        }
    ]
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 30.7333,
            lng: 76.7794
        },
        zoom: 14,
        styles: styles,
        mapTypeControl: false
    });

    Infowindow = new google.maps.InfoWindow();

    var defaultIcon = makeMarkerIcon('FFFF24');
    var highlightedIcon = makeMarkerIcon('CA3B2B');
    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        var title = locations[i].title;
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
        });
        markers.push(marker);
        show();
        marker.addListener('click', function() {
            this.setAnimation(google.maps.Animation.DROP);


            populateInfoWindow(this, Infowindow);

        });
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
    }
}
// Fetches data through zomato API asynchronously
function getZomato(marker) {
    var data;
    $.ajax({
        url: 'https://developers.zomato.com/api/v2.1/geocode',
        headers: {
            'Accept': 'application/json',
            'user-key': 'e7bc74685590d7fa91c5d4445b874ec5'
        },
        data: 'lat=' + marker.position.lat() + '&lon=' + marker.position.lng(),
        async: true,
    }).done(function(response) {
        var metadata = "";
        metadata += "<h2>" + response.location.title + "</h2>";
        metadata += '<br><div id="restaurants">Nearby Restaurants<sup>Zomato</sup></div><br>';
        var nearby = response.nearby_restaurants;
        //metadata += "<ul>";
        for (var i = 0; i < 4; i++) {
            var restaurant = nearby[i].restaurant;
            metadata += '<div class="template">';
            metadata += "<br>";
            metadata += '<center><a href = ' + '"' + restaurant.url + '" id = "res-name">' + restaurant.name + '</a><br><br>';
            metadata += '</center>';
            metadata += '<center><img src = ' + '"' + restaurant.thumb + '" id = "thumb-image"></img></center>';
            metadata += "</div><br>";
        }
        Infowindow.setContent(metadata);
    }).fail(function(response, status, error) {
        Infowindow.setContent("Sorry! Unable to fetch nearby Restaurants");
    });

}

function populateInfoWindow(marker, infowindow) {


    if (infowindow.marker != marker) {

        infowindow.setContent('');
        infowindow.marker = marker;
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
            marker.setAnimation(null);
        });
        // Fetch data from Zomato Api
        getZomato(marker);
        if (infowindow) {
            infowindow.close();
        }
        infowindow.open(map, marker);
    }

}

mapErrorHandling = () => {
    VM.showError(true);
    VM.error('Sorry! Maps not available');

};
// function to show markers and set bound
function show() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

// funtion to hide listing
function hide() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

//function to highlight Marker
function hmarker(data) {

    if (Infowindow.marker != data.location) {
        for (var i = 0; i < markers.length; i++) {
            if (markers[i].title == data.title) {
                markers[i].setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    markers[i].setAnimation(null);
                }, 700);
                populateInfoWindow(markers[i], Infowindow);
                break;
            }
        }
    }
}

// function for customizing marker
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;

}

function showAllMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setVisible(true);
    }
}

function hideAllMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setVisible(false);
    }
}



// My View Model
var VM = {
    error: ko.observable(''),
    showError: ko.observable(false),
    showMyList: ko.observable(true),
    list: ko.observableArray([]),
    // Live search using knockout JS inspired by "http://opensoul.org/2011/06/23/live-search-with-knockoutjs/"
    query: ko.observable(''),
    search: function(value) {
        VM.showMyList(false);
        VM.list.removeAll();
        if (value == '') {
            VM.showMyList(true);
            showAllMarkers();
            return;
        }
        hideAllMarkers();
        for (var loc in locations) {
            if (locations[loc].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                VM.list.push(locations[loc]);
                var key = locations[loc].title;
                for (var j = 0; j < markers.length; j++) {
                    if (markers[j].title == key) {
                        markers[j].setVisible(true);

                    }

                }
            }

        }
    },
};
VM.query.subscribe(VM.search);
ko.applyBindings(VM);