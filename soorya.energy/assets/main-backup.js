//Intialisation codes for Google Map Picker
var markers = [];
	
function initMap() {
	var mapProp = {
		center:new google.maps.LatLng(-1.8635446229910766, 119.59024531249997),
		zoom:4,
	};
	
	var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
	var geocoder = new google.maps.Geocoder;
	var infowindow = new google.maps.InfoWindow;
	
	google.maps.event.addListener(map, 'click', function(event) {
		deleteMarkers();
		geocodeLatLng(geocoder, map, infowindow, event.latLng)
		
		// placeMarker(map, event.latLng);
	});
}

function geocodeLatLng(geocoder, map, infowindow, location) {
	// var input = document.getElementById('latlng').value;
	// var latlngStr = input.split(',', 2);
	console.log(parseFloat(location.lat()) + " " + parseFloat(location.lng()));
	var latlng = {lat: parseFloat(location.lat()), lng: parseFloat(location.lng())};
	geocoder.geocode({'location': latlng}, function(results, status) {
		if (status === 'OK') {
			if (results[0]) {
				//map.setZoom(11);
				var marker = new google.maps.Marker({
					position: latlng,
					map: map
				});
				markers.push(marker);
				
				console.log(results[0]);
				infowindow.setContent(results[0].formatted_address);
				infowindow.open(map, marker);
				$('.calc-input #address').val(results[0].formatted_address);
				$('.calc-input #latitude').val(parseFloat(location.lat()));
				$('.calc-input #longitude').val(parseFloat(location.lng()));
				$('.calc-input #formatted').val(results[0].formatted_address);
			} else {
				window.alert('No results found');
			}
		} else {
			window.alert('Geocoder failed due to: ' + status);
		}
	});
}

function placeMarker(map, location) {
	var marker = new google.maps.Marker({
		position: location,
		map: map
	});
	
	markers.push(marker);
	
	var infowindow = new google.maps.InfoWindow({
		content: 'Latitude: ' + location.lat() +
		'<br>Longitude: ' + location.lng()
	});
	
	infowindow.open(map,marker);
}

function deleteMarkers() {
	clearMarkers();
	markers = [];
}

function clearMarkers() {
	setMapOnAll(null);
}

function setMapOnAll(map) {
	for (var i = 0; i < markers.length; i++) {
		  markers[i].setMap(map);
	}
}
// End Of Google Map Picker Functions

	// Load Header and Footer
	$("#cus-header").load("header.html", function() {
		//console.log( "Load header was performed." );
	}); 
	$("#cus-footer").load("footer.html", function() {
		//console.log( "Load footer was performed." );
	}); 

// DOM Ready
$(document).ready(function(){




	//Functions
	var formElements = document.querySelectorAll('input,select,textarea');

	// Required Field Invalid scroll
	for (var i = formElements.length; i--;) {
	    formElements[i].addEventListener('invalid', function () {
	    	console.log("invalid form");
	        this.scrollIntoView(false);
	  //       var scrolledY = window.scrollY;

			// if(scrolledY){
			// window.scroll(0, scrolledY - 64);
			// }
	    });
	}
	
	function clearActiveNav() {
		$('nav ul#nav-desktop li a').each(function() {
			$(this).removeClass('active');
		});

		$('nav ul#nav-mobile li a').each(function() {
			$(this).removeClass('active');
		});
	}

	// MaterializeCSS' Dropdown Menu
	$(".dropdown-trigger").dropdown({hover:true, constrain_width:false});
	//.each(function() {
	// 	$(this).dropdown();
	// });

	// MaterializeCSS' Sidebar
	$(".button-collapse").sideNav();

	// MaterializeCSS' Fullwidth Slider
	$('.slider').slider({full_width: true});

	// MaterializeCSS' Form Select Dropdown
    //$('select').material_select();


	// Smooth Scrolling
	// $('a[href*=#]:not([href=#])').click(function() {
	// 	if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	// 		var target = $(this.hash);
	// 		target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	// 		if (target.length) {
	// 			$('html,body').animate({
	// 				scrollTop: target.offset().top
	// 			}, 1000);
	// 			return false;
	// 		}
	// 	}
	// });

	// Change Navbar Color on Scroll and Active Menu On Scroll
	var doc = $(document);
	$("html,body").animate({scrollTop: 0}, 100);
	doc.scroll(function() {
		// Change Menu BG On Scroll
		if (doc.scrollTop() < $('#section2-about').offset().top - 550) {
			$('.navbar-fixed nav').removeClass('dark-nav');
		} else {
			$('.navbar-fixed nav').addClass('dark-nav');
		}

		// // Change Active Menus
		// if (doc.scrollTop() < $('#section2-about').offset().top - 250) {
		// 	//Landing Section - Clear active only
		// 	clearActiveNav();

		// } else if (doc.scrollTop() < $('#section3-services').offset().top - 250) {
		// 	//About Section - Clear active and set About section to active
		// 	clearActiveNav();
		// 	$('nav ul#nav-desktop li a[href=#about]').addClass('active');
		// 	$('nav ul#nav-mobile li a[href=#about]').addClass('active');

		// } else if (doc.scrollTop() < $('#section4-works').offset().top - 250) {
		// 	//Services Section - Clear active and set About section to active
		// 	clearActiveNav();
		// 	$('nav ul#nav-desktop li a[href=#services]').addClass('active');
		// 	$('nav ul#nav-mobile li a[href=#services]').addClass('active');

		// } else if (doc.scrollTop() < $('#section5-contact').offset().top - 250) {
		// 	//Works Section - Clear active and set About section to active
		// 	clearActiveNav();
		// 	$('nav ul#nav-desktop li a[href=#works]').addClass('active');
		// 	$('nav ul#nav-mobile li a[href=#works]').addClass('active');

		// } else {
		// 	//Contact Section - Clear active and set About section to active
		// 	clearActiveNav();
		// 	$('nav ul#nav-desktop li a[href=#contact]').addClass('active');
		// 	$('nav ul#nav-mobile li a[href=#contact]').addClass('active');

		// }
	});


	// RUPIAH VALUE WITH COMMA ON DISPLAY
	var $form = $( "#calc-form" );
	var $input = $form.find( "#bill" );
	console.log($input);
	$input.on( "keyup", function(event) {
	
		// Prevent these scenarios of keyboard
	    // 1. Makes a selection within the input
	    var selection = window.getSelection().toString();
	    if ( selection !== '' ) {
	        return;
	    }
	 
	    // 2. or presses the arrow keys on the keyboard.
	    if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
	        return;
	    }

	    // Main function
	    // 1. Retrieve the value from the input.
		var $this = $( this );
		var input = $this.val();
		 
		// 2. Sanitize the value using RegEx by removing unnecessary characters such as spaces, underscores, dashes, and letters.
		var input = input.replace(/[\D\s\._\-]+/g, "");
		 
		// 3. Deploy parseInt() function to make sure the value is an integer (a round number).
		input = input ? parseInt( input, 10 ) : 0;
		 
		// 4. Add the thousand separator with the toLocaleString() function, then pass the sanitised value back to the input element.
		$this.val( function() {
		    return ( input === 0 ) ? "" : input.toLocaleString( "en-US" );
		});
	});

	// SLIDER FOR ROOF
			// var sheet = document.createElement('style'),  
			//   $rangeInput = $('.range input'),
			//   prefs = ['webkit-slider-runnable-track', 'moz-range-track', 'ms-track'];

			// document.body.appendChild(sheet);

			// var getTrackStyle = function (el) {  
			//   var curVal = el.value,
			//       val = (curVal - 1) * 16.666666667,
			//       style = '';
			  
			//   // Set active label
			//   $('.range-labels li').removeClass('active selected');
			  
			//   var curLabel = $('.range-labels').find('li:nth-child(' + curVal + ')');
			  
			//   curLabel.addClass('active selected');
			//   curLabel.prevAll().addClass('selected');
			  
			//   // Change background gradient
			//   for (var i = 0; i < prefs.length; i++) {
			//     style += '.range {background: linear-gradient(to right, #37adbf 0%, #37adbf ' + val + '%, #fff ' + val + '%, #fff 100%)}';
			//     style += '.range input::-' + prefs[i] + '{background: linear-gradient(to right, #37adbf 0%, #37adbf ' + val + '%, #b2b2b2 ' + val + '%, #b2b2b2 100%)}';
			//   }

			//   return style;
			// }

			// $rangeInput.on('input', function () {
			//   sheet.textContent = getTrackStyle(this);
			// });

			// // Change input value on label click
			// $('.range-labels li').on('click', function () {
			//   var index = $(this).index();
			  
			//   $rangeInput.val(index + 1).trigger('input');
			  
			// });

	// SLIDER FOR ROOF
	$(".cus-range.rpit .thumb .value").removeClass();
	$(".cus-range.rpit .thumb span").addClass("rpit-value");
	$(".cus-range.rori .thumb .value").removeClass();
	$(".cus-range.rori .thumb span").addClass("rori-value");

	$(".cus-range.rpit .thumb .rpit-value").html("0&deg;");
	$(".cus-range.rori .thumb .rori-value").html("N");

	$(document).on('input', '#rpit', function() {
		// Update Value
    	$('.cus-range.rpit .thumb .rpit-value').html($(this).val() + "&deg;");

    	//Show rotation
    	$('#roof-pit-rotation').css({
		    '-webkit-transform':"rotate(" + (-1 * $(this).val()) + "deg)",
		    '-moz-transform': "rotate(" + (-1 * $(this).val()) + "deg)",
		    '-o-transform': "rotate(" + (-1 * $(this).val()) + "deg)",
		    '-ms-transform': "rotate(" + (-1 * $(this).val()) + "deg)"
		});
	});

	var orientation = "N";
	$(document).on('input', '#rori', function() {

		// Update Value
		if ($(this).val() == '0') {
			orientation = "N";
		} else if ($(this).val() == '1') {
			orientation = "NNE";
		} else if ($(this).val() == '2') {
			orientation = "NE";
		} else if ($(this).val() == '3') {
			orientation = "ENE";
		} else if ($(this).val() == '4') {
			orientation = "E";
		} else if ($(this).val() == '5') {
			orientation = "ESE";
		} else if ($(this).val() == '6') {
			orientation = "SE";
		} else if ($(this).val() == '7') {
			orientation = "SSE";
		} else if ($(this).val() == '8') {
			orientation = "S";
		} else if ($(this).val() == '9') {
			orientation = "SSW";
		} else if ($(this).val() == '10') {
			orientation = "SW";
		} else if ($(this).val() == '11') {
			orientation = "WSW";
		} else if ($(this).val() == '12') {
			orientation = "W";
		} else if ($(this).val() == '13') {
			orientation = "WNW";
		} else if ($(this).val() == '14') {
			orientation = "NW";
		} else if ($(this).val() == '15') {
			orientation = "NNW";
		} else if ($(this).val() == '16') {
			orientation = "N";
		}
    	$('.cus-range.rori .thumb .rori-value').html(orientation);
    	$('.calc-input #rori-text').val(orientation);


    	//Show rotation
    	$('#roof-ori-rotation').css({
		    '-webkit-transform':"rotate(" + (22.5 * $(this).val()) + "deg)",
		    '-moz-transform': "rotate(" + (22.5 * $(this).val()) + "deg)",
		    '-o-transform': "rotate(" + (22.5 * $(this).val()) + "deg)",
		    '-ms-transform': "rotate(" + (22.5 * $(this).val()) + "deg)"
		});
	});


	$( "form" ).submit(function( event ) {
		event.preventDefault();

		//Hide Form
		$('#calc-form').hide();

		// Check Value Bill
		$(".calc-input #bill").val(parseInt($(".calc-input #bill").val().replace(/[^0-9]/g, '')));

		// Check Value Power
		if (!$(".calc-input #power").val()) {
			$(".calc-input #power").val('0');
		}

		// Check Value Rori
		console.log($(".calc-input #rori").val());
		$(".calc-input #rori").val([ "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N" ]);

		var JSONinput;
		console.log($(this).serializeArray());
		JSONinput = JSON.parse(JSON.stringify($(this).serializeArray()));
		console.log(JSONinput);

		// $.ajax({
	 //        type: "POST",
	 //        url: "/api/Calculator",
	 //        data: JSONinput,
	 //        contentType: "application/json; charset=utf-8",
	 //        dataType: "json",
	 //        success: function(data) {
	 //        	console.log(data);
	 //        	//Showing Results Below


	 //        },
	 //        failure: function(errMsg) {
	 //            console.log(errMsg);
	 //        }
		// });
	});
});

