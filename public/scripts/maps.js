var Flightsee = {};
    //set some variables
var geocoder;
var map;
var flightPlanCoordinates = new Array();
var mapCenter;

var setMarker = function(address, callback){
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {

      // wipe flightPlanCoordinates so it doesn't append more coordinates on more submits
      if (flightPlanCoordinates.length >= 2){
        flightPlanCoordinates = [];
      }


      flightPlanCoordinates.push(new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng())); // coordinates to start from

      console.log(flightPlanCoordinates + " these are  the flightPlanCoordinates");
      
      var marker = new google.maps.Marker({ // Set the gmaps marker
          map: map,
          position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
    callback();
  });
};

var setFlightPath = function(){ //
  mapCenter = calcCenter(flightPlanCoordinates);
  map.setCenter(new google.maps.LatLng(mapCenter[0], mapCenter[1]));
  map.setZoom(4);
  console.log(mapCenter[0] + ", " + mapCenter[1] + " map center returned");

  // a little middle school algebra
  var m = slope(flightPlanCoordinates[0].lat(), flightPlanCoordinates[1].lat(), flightPlanCoordinates[0].lng(), flightPlanCoordinates[1].lng()); 
  console.log("the slope is " + m);

  var lineConst = findConst(m, flightPlanCoordinates[0].lat(), flightPlanCoordinates[0].lng());
  console.log(lineConst + " is lineConst");

  //time for some old school y = mx + b
  
  // let's setup the flight path
  var flightPath = new google.maps.Polyline({
    center: new google.maps.LatLng(mapCenter[0], mapCenter[1]),
    path: flightPlanCoordinates,
    geodesic: false,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  flightPath.setMap(map);
  console.log("set map done");
};

// geocoding example code from API docs. Expanded to include flightpath info
function codeAddress() {
  var address1 = document.getElementById('address1').value; // first aiport
  var address2 = document.getElementById('address2').value; // second airport

  setMarker(address1, function(){
      console.log("address1 marker done");
      setMarker(address2, function(){
          console.log("address 2 marker done");
          setFlightPath();
      });
  });

}


// showLandmarks would setup the nearby landmarks

// var showLandmarks = function(map){
//   var Landmarks = db.Landmarks.findAll();
//   geocoder.geocode( { 'address': address}, function(results, status) {
//     if (status == google.maps.GeocoderStatus.OK) {

//       flightPlanCoordinates.push(new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng())); // coordinates to start from

//       console.log(flightPlanCoordinates + " these are  the flightPlanCoordinates");
      
//       var marker = new google.maps.Marker({ // Set the gmaps marker
//           map: map,
//           position: results[0].geometry.location
//       });
//     } else {
//       alert('Geocode was not successful for the following reason: ' + status);
//     }
//     callback();
//   }); 
// };

google.maps.event.addDomListener(window, 'load', initialize);

var calcCenter = function(coords){
  // takes a latitude-longitude array and spits back the center point. returns a latitude-longitude array
  // Used for  centering the google map between the two endpoints
  // returns array contain
  var arr = [];
  arr.push( (coords[0].lat() + coords[1].lat()) / 2);
  arr.push( (coords[0].lng() + coords[1].lng()) / 2);
  return arr;
};

var slope = function(x1, x2, y1, y2){
  return ( (y2 - y1) / (x2 - x1) );
};

var findConst = function(slope, x, y){
  return (y - (slope * x));
};