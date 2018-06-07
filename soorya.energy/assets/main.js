//Intialisation codes for Google Map Picker
var markers = [];
//var secMarkers = [];
	
function initMap() {
	var mapProp = {
		// center:new google.maps.LatLng(-1.8635446229910766, 119.59024531249997),
		center:new google.maps.LatLng(-6.17511, 106.86503949999997),
		zoom:9,
	};
	
	var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
	var geocoder = new google.maps.Geocoder;
	var infowindow = new google.maps.InfoWindow;

	// Create the search box and link it to the UI element.
    var addressInput = document.getElementById('address');
    var autoComplete = new google.maps.places.Autocomplete(addressInput);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(addressInput);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      autoComplete.setBounds(map.getBounds());
    });

        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        autoComplete.addListener('place_changed', function() {
          var place = autoComplete.getPlace();

          if (place.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          	console.log(place.geometry.location.lat());
          	console.log(place.geometry.location.lng());
          	console.log(place.address_components);

          		var city = "", zipcode = 0;
				for (var i=0; i<place.address_components.length; i++) {
					if (place.address_components[i].types[0] == "administrative_area_level_2") {
						console.log(place.address_components[i].long_name);
						city = place.address_components[i].long_name;
					}

					if (place.address_components[i].types[0] == "postal_code") {
						console.log(place.address_components[i].long_name);
						zipcode = place.address_components[i].long_name;
						$('.calc-input #zipcode').val(zipcode);
					}
				}

				//$('.calc-input #address').val(place.formatted_address);
				$('.calc-input #latitude').val(parseFloat(place.geometry.location.lat()));
				$('.calc-input #longitude').val(parseFloat(place.geometry.location.lng()));
				//No longer needed as user select city from dropdown
				//$('.calc-input #city').val(city);
				$('.calc-input #formatted').val(place.formatted_address);

            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              //icon: icon,
              //title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          map.fitBounds(bounds);
        });






	// Click on the Map Event Listener
	google.maps.event.addListener(map, 'click', function(event) {
		deleteMarkers();
		geocodeLatLng(geocoder, map, infowindow, event.latLng)
		
		// placeMarker(map, event.latLng);
	});
}

function geocodeLatLng(geocoder, map, infowindow, location) {
	// var input = document.getElementById('latlng').value;
	// var latlngStr = input.split(',', 2);
	console.log(location);
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
				
				var city = "", zipcode = 0;
				for (var i=0; i<results[0].address_components.length; i++) {
					if (results[0].address_components[i].types[0] == "administrative_area_level_2") {
						console.log(results[0].address_components[i].long_name);
						city = results[0].address_components[i].long_name;
					}
					if (results[0].address_components[i].types[0] == "postal_code") {
						console.log(results[0].address_components[i].long_name);
						zipcode = results[0].address_components[i].long_name;
					}
				}
				infowindow.setContent(results[0].formatted_address);
				infowindow.open(map, marker);
				$('.calc-input #address').val(results[0].formatted_address);
				$('.calc-input #latitude').val(parseFloat(location.lat()));
				$('.calc-input #longitude').val(parseFloat(location.lng()));
				//No longer needed as user select city from dropdown
				//$('.calc-input #city').val(city);
				$('.calc-input #formatted').val(results[0].formatted_address);
				$('.calc-input #zipcode').val(zipcode);
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

	// Smooth Scrolling
	$('a[href*=\\#]:not([href=\\#])').click(function() { 
		console.log($(this).attr('href'));
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				$('html,body').animate({
					scrollTop: target.offset().top
				}, 1000);
				return false;
			}
		}
	});


	//Functions
	var formElements = document.querySelectorAll('input,select,textarea');

	// Required Field Invalid scroll
	for (var i = formElements.length; i--;) {
	    formElements[i].addEventListener('invalid', function () {
	    	console.log("invalid form");
	        this.scrollIntoView(false);
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
	// var $input = $form.find( "#bill" );
	//var valueInputs = $('.value-input');
	//console.log($input);
	$('.value-input').each(function() {
		console.log($(this).attr('id'));
		$(this).on( "keyup", function(event) {
		
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
			var valInp = $(this);
			var texInp = valInp.val();
			 
			// 2. Sanitize the value using RegEx by removing unnecessary characters such as spaces, underscores, dashes, and letters.
			var texInp = texInp.replace(/[\D\s\._\-]+/g, "");
			 
			// 3. Deploy parseInt() function to make sure the value is an integer (a round number).
			texInp = texInp ? parseInt( texInp, 10 ) : 0;
			if (valInp.attr('id') == "bill" && texInp > 9999999999) {
				//console.log("Bill ori : " + texInp);
				texInp = Math.floor(texInp / 10);
				//console.log("Bill edi : " + texInp);
			} else if (valInp.attr('id') == "power"&& texInp > 999999) {
				//console.log("Power ori : " + texInp);
				texInp = Math.floor(texInp / 10);
				//console.log("Power edi : " + texInp);
			}
			 
			// 4. Add the thousand separator with the toLocaleString() function, then pass the sanitised value back to the input element.
			valInp.val( function() {
			    return ( texInp === 0 ) ? "" : texInp.toLocaleString( "en-US" );
			});
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

	// PREPARE CLASSES OF SLIDER FOR COVERAGE
	// $(".cus-range.cover .thumb .value").removeClass();
	// $(".cus-range.cover .thumb span").addClass("coverage-value");
	// PREPARE CLASSES OF SLIDER FOR ROOF
	$(".cus-range.rpit .thumb .value").removeClass();
	$(".cus-range.rpit .thumb span").addClass("rpit-value");
	$(".cus-range.rori .thumb .value").removeClass();
	$(".cus-range.rori .thumb span").addClass("rori-value");


	// PREPARE VALUE OF COVERAGE		
	// $(".cus-range.cover .thumb .coverage-value").html("80&#37;");
	// $(".calc-input #coverage").val(80);
	// PREPARE VALUE OF ROOF	
	$(".cus-range.rpit .thumb .rpit-value").html("0&deg;");
	$(".cus-range.rori .thumb .rori-value").html("N");


	// UPDATE VALUE OF COVERAGE
	// $(document).on('input', '#coverage', function() {
	// 	// Update Value
 	//  $('.cus-range.cover .thumb .coverage-value').html($(this).val() + "&#37;");
	// });
	//UPDATE VALUE OF ROOFPIT
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
	//UPDATE VALUE OF ROOFORI
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
    	$('.calc-input #rori_text').val(orientation);


    	//Show rotation
    	$('#roof-ori-rotation').css({
		    '-webkit-transform':"rotate(" + (22.5 * $(this).val()) + "deg)",
		    '-moz-transform': "rotate(" + (22.5 * $(this).val()) + "deg)",
		    '-o-transform': "rotate(" + (22.5 * $(this).val()) + "deg)",
		    '-ms-transform': "rotate(" + (22.5 * $(this).val()) + "deg)"
		});
	});

	// PREPARE CITY OPTIONS
	if ($('#city').get(0) != null) {
		var oldSel = $('#city').get(0);

	    while (oldSel.options.length > 0) {
	        oldSel.remove(oldSel.options.length - 1);
	    }

	    var newSel = ["Ambon","Atambua","Balikpapan","Banda Aceh","Bandar Lampung","Bandung","Banjar","Banjarbaru","Banjarmasin","Batam","Batu","Bau-Bau","Bekasi","Bengkulu","Bima","Binjai","Bitung","Blitar","Bogor","Bontang","Bukittinggi","Cianjur","Cilegon","Cimahi","Cirebon","Denpasar","Depok","Dumai","Gorontalo","Gunungsitoli","Jakarta","Jambi","Jayapura","Kediri","Kendari","Kota Sorong","Kotamobagu","Kupang","Langsa","Lhokseumawe","Lubuklinggau","Madiun","Magelang","Makassar","Malang","Manado","Manokwari","Mataram","Medan","Merauke","Metro","Mojokerto","Padang","Padang Panjang","Padang Sidempuan","Pagar Alam","Palangkaraya","Palembang","Palopo","Palu","Pangkal Pinang","Pare-Pare","Pariaman","Pasuruan","Payakumbuh","Pekalongan","Pekanbaru","Pematang Siantar","Pontianak","Prabumulih","Probolinggo","Purwokerto","Sabang","Salatiga","Samarinda","Sawah Lunto","Semarang","Serang","Sibolga","Singkawang","Solok","Tangerang Selatan","Sukabumi","Sungai Penuh","Surabaya","Surakarta","Tangerang","Tanjung Balai","Tanjung Pinang","Tarakan","Tasikmalaya","Tebing Tinggi","Tegal","Tenggarong","Ternate","Tidore","Tomohon","Tual","Yogyakarta",];
	    
	    for (i = 0; i < newSel.length; i++)
	    {
	        var opt = document.createElement('option');

	        opt.text = newSel[i];
	        opt.value = newSel[i];

	        oldSel.add(opt, null);
	    }
	}


	// FORM ON CLICK
	$( "form#calc-form" ).submit(function( event ) {
		event.preventDefault();

		//Hide Form
		// $('#calc-title').hide();
		// $('#calc-desc').hide();
		// $('#calc-form').hide();

		// Check Value Bill
		$(".calc-input #bill").val(parseInt($(".calc-input #bill").val().replace(/[^0-9]/g, '')));

		// Check Value Power
		if (!$(".calc-input #power").val() || $(".calc-input #power").val() == "") {
			$(".calc-input #power").val('0');
		} else {
			$(".calc-input #power").val(parseInt($(".calc-input #power").val().replace(/[^0-9]/g, '')));
		}

		// Not needed anymore as per user-city-dropdown
		// // Check Value City
		// if ($(".calc-input #city").val().indexOf("Jakarta") != -1) {
		// 	$(".calc-input #city").val("Kota Jakarta");
		// }

		// Check Value Rori
		// console.log($(".calc-input #rori").val());
		// $(".calc-input #rori").val([ "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N" ]);

		var JSONinput= {
			"zipcode": $(".calc-input #zipcode").val().trim(),
			"building": $(".calc-input #building").val().trim(),
			"bill": $(".calc-input #bill").val().trim(),
			"power": $(".calc-input #power").val().trim(),
			"name": $(".calc-input #name").val().trim(),
			"phone": $(".calc-input #phone").val().trim(),
			"email": $(".calc-input #email").val().trim(),
			"address": $(".calc-input #address").val().trim(),
			"notes": $(".calc-input #notes").val().trim(),
			"latitude": $(".calc-input #latitude").val().trim(),
			"longitude": $(".calc-input #longitude").val().trim(),
			"city": $(".calc-input #city").val().trim(),
			"formatted": $(".calc-input #formatted").val().trim(),
			"coverage" : 100,
			"rpit": $(".calc-input #rpit").val().trim(),
			"rori": $(".calc-input #rori").val().trim(),
			"rori_text": $(".calc-input #rori_text").val().trim(),
		};
		
		//JSONinput = $( this ).serializeArray();
		console.log(JSONinput);

		$.ajax({
			type: "POST",
			url: "https://api.soorya.energy/api/Calculator",
	        data: JSON.stringify(JSONinput),
	        contentType: "application/json; charset=utf-8",
	        dataType: "json",
			xhrFields: {
				withCredentials: true
			},
	        success: function(data) {
	        	console.log(data);
	        	//Showing Results Below	
				// STORING TO LOCALSTORAGE -- BEGIN
				//
				localStorage.setItem('solar-results', JSON.stringify(data));
				localStorage.setItem('building', $(".calc-input #building").val().trim());
				localStorage.setItem('city', $(".calc-input #city").val().trim());
				localStorage.setItem('bill', $(".calc-input #bill").val().trim());
				localStorage.setItem('power', $(".calc-input #power").val().trim());
				$(location).attr('href','/solar-calculator-results.html');
				//
				// STORING TO LOCALSTORAGE -- END
	        },
	        failure: function(errMsg) {
	            console.log(errMsg);
	        }
		});

		// var simulatedSuccess = true;
		// if (simulatedSuccess) {
			// STORING TO LOCALSTORAGE -- BEGIN
			//
			// localStorage.setItem('solar-results', JSON.stringify(simulatedData));
			// $(location).attr('href','/solar-calculator-results.html');
			//
			// STORING TO LOCALSTORAGE -- END
		//}
	});

	//JUST SIMULATING RECEIVED DATA FROM SERVER SIDE
	// var simulatedData = {
		// "address"					: "Indonesia",
		// "annualSavings"				: "33464329",
		// "areaRequired"				: "33",
		// "buildingType"				: "Residential",
		// "city"						: "Jakarta",
		// "costOfSolarPerWatt"			: "18000",
		// "electricityBillComparison"	: ([
		// {
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "1",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",

		// },{
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "2",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",

		// },{
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "3",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",

		// },{
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "4",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",

		// },{
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "5",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",

		// },{
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "6",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",

		// },{
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "7",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",

		// },{
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "8",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",

		// },{
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "9",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",

		// },{
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "10",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",

		// },{
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "11",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",

		// },{
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "12",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",

		// },{
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "13",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",

		// },{
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "14",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",

		// },{
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "15",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",

		// },{
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "16",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",

		// },{
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "17",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",

		// },{
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "18",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",

		// },{
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "19",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",

		// },{
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "20",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",

		// },{
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "21",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",

		// },{
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "22",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",

		// },{
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "23",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",

		// },{
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "24",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",

		// },{
			// "accumulatedSavings"				: "16739578.77",
			// "costOfGridElectricity"				: "1467.28",
			// "electricityCanBeCoveredBySolar"	: "17277.96",
			// "energyConsumedYearly"				: "20445.96",
			// "savingsValue"						: "16739578.77",
			// "year"								: "25",
			// "yearlyElectricityCostWithSolar"	: "13260369.42",
			// "yearlyElectricityCostWithoutSolar"	: "29999948.19",
			// "yearlyMinimumFromPLN"				: "4648343.04",
		// }]),
		// "email"						: "a@yahoo.com",
		// "firstYearSavings"			: "16739578.77",
		// "latitude"					: "-0.7",
		// "lifetimeCO2Reduction"		: "371020.29",
		// "lifetimeCostOfElectricity"	: "498.44",
		// "lifetimeSavings"			: "371020.29",
		// "longitude"					: "114.360",
		// "monthlyElectricityBill"	: "2500000",
		// "monthlyElectricityUse"		: "1703.83",
		// "monthlySolarProduction"	: "1405",
		// "name"						: "jiang",
		// "numberOfPanels"			: "24.75",
		// "paybackPeriod"				: "5.9",
		// "phone"						: "123456789",
		// "power"						: "6600",
		// "province"					: null,
		// "regency"					: null,
		// "returnOnInvestment"		: "12.9",
		// "solarSystemCost"			: "198000000",
		// "systemSize"				: "11",
		// "zipcode"					: "12345"
	// };
	// console.log(simulatedData);


	$( "form#con-form" ).submit(function( event ) {
		event.preventDefault();

		var JSONinput= {
			"name": $(".calc-input #name").val().trim(),
			"emailaddress": $(".calc-input #emailaddress").val().trim(),
			"subject": $(".calc-input #subject").val().trim(),
			"message": $(".calc-input #message").val().trim(),
		};

		$(".calc-input #name").val("");
		$(".calc-input #emailaddress").val("");
		$(".calc-input #subject").val("");
		$(".calc-input #message").val("");
		
		//JSONinput = $( this ).serializeArray();
		console.log(JSONinput);

		$.ajax({
			type: "POST",
			url: "https://api.soorya.energy/api/Contact",
	        data: JSON.stringify(JSONinput),
	        contentType: "application/json; charset=utf-8",
	        dataType: "text",
			xhrFields: {
				withCredentials: true
			},
	        success: function(data) {
	        	console.log("Form submitted! Return : " + data);
	        	$(".success-message").show();

	        },
	        failure: function(errMsg) {
	            console.log(errMsg);
	        	$(".error-message").show();
	        }
		});
	});
});

