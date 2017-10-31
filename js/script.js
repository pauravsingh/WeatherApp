/**
 * Created by paura on 10/29/2017.
 */
var map, infoWindow, marker, pos = {lat:null, lng:null};
function initMap() {
    map = new google.maps.Map($('#map')[0],{
        center: {lat: 39.9434364619742, lng: -78.85986328125},
        zoom: 6
    });
    infoWindow = new google.maps.InfoWindow;

    marker = new google.maps.Marker({map: map});

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
           pos.lat = position.coords.latitude;
           pos.lng = position.coords.longitude;
           marker.setPosition(pos);
           getWeather(pos.lat,pos.lng);
           map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }

    google.maps.event.addListener(map, "click", function (event) {
        marker.setPosition(null);
        pos.lat = event.latLng.lat();
        pos.lng = event.latLng.lng();
        console.log( pos.lat + ', ' + pos.lng );
        marker.setPosition(pos);
        getWeather(pos.lat,pos.lng);
        //map.panTo(pos);


    });
}

function getWeather(latitude, longitude){
    var url= 'https://dataservice.accuweather.com/locations/v1/cities/geoposition/search';
    var apikey = 'qz5EKKbbICxCE2JAUxKfHKi4RzQYSssV';
    var data= {
        apikey: apikey,
        q: latitude+","+longitude
    }
    var loc;
    $.get(url,data,function(response) {
        var url = 'https://dataservice.accuweather.com/currentconditions/v1/'+response.Key;
        var data= {
            apikey: apikey,
            language: 'en-us',
            details: true
        };
        loc = response.EnglishName;
        $.get(url,data,function(result){
            $('#weather-text').html(result[0].WeatherText);
            $('#location-name').html(response.EnglishName);
            $('#temp').html(result[0].Temperature.Metric.Value+''+result[0].Temperature.Metric.Unit);
            $('#real-feel-temp').html(result[0].RealFeelTemperature.Metric.Value+''+result[0].RealFeelTemperature.Metric.Unit);
        });
    });
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}


