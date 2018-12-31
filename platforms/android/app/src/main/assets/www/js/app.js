// Initialize your app
var $$ = Dom7;
var app = new Framework7({  
  root: '#app', // App root element
  pushState: true,
  //popupCloseByOutside:true,
  name: 'Your Collector',// App Name
  id: 'com.phonegap.newgeo',       // App id
  panel: {
    //swipe: 'left', // Enable swipe panel
    closeByBackdropClick : true,
    
  },  
  //theme:'material',
  //material: true, //enable Material theme
  //routes: routes, 
  clicks: { 
    externalLinks: '.external',
  },
  navbar: {
    hideOnPageScroll: false,
    iosCenterTitle: false,
    closeByBackdropClick: true,
  },
  picker: {
    rotateEffect: true,
    openIn: 'popover', 
  },
  popover: {
    closeByBackdropClick: true,
  },
});


//document.addEventListener("deviceready", checkStorage, false); 
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown() {
  if(app.views.main.router.history.length==2 || app.views.main.router.url=='/'){
    app.dialog.confirm('Do you want to Exit ?', function () {
      navigator.app.clearHistory(); navigator.app.exitApp();
    });
  }else{ 
    $$(".back").click();
  } 
}
function onDeviceReady(){
	alert("onDeviceReady");
	openLOC();
}

function openLOC(){
	alert("openLOC");
    cordova.plugins.diagnostic.isLocationEnabled(function(enabled){ //isLocationEnabled
	console.log("GPS location is " + (enabled ? "enabled" : "disabled"));
      if(!enabled){
        alert("Enabled GPS manually");
        cordova.plugins.diagnostic.switchToLocationSettings(onRequestSuccess,onRequestFailure);
         //mainView.loadPage("current-location.html");
      }else{
        alert("Location service is ON");
        app.router.navigate("/current-location/");
      }
	}, function(error){
    console.error("The following error occurred: "+error);
	});   
}
function onRequestSuccess(success){
    if(success){
      app.router.navigate("/current-location/");
    }
}  
function onRequestFailure(error){
   if(error){
     alert(error.message);
   }
}

$$(document).on('page:init', '.page[data-name="current-location"]', function (e) { 
	navigator.geolocation.getCurrentPosition(onSuccess, onError,{ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
});


function onSuccess(position){
    alert("in function");
    alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
    var longitude = position.coords.longitude;
    var latitude = position.coords.latitude;
    var LatLong = new google.maps.LatLng(latitude,longitude);
    alert(LatLong);
    var mapOptions = {
        center : LatLong,
        zoom : 17,
        mapTypeId : google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}

function onError(error){
  alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
}
