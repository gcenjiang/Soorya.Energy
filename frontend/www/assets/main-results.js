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

	// Change Navbar Color on Scroll and Active Menu On Scroll
	var doc = $(document);
	$("html,body").animate({scrollTop: 0}, 100);
	doc.scroll(function() {
		// Change Menu BG On Scroll
		if (doc.scrollTop() < $('#section4-works').offset().top - 550) {
			$('.navbar-fixed nav').removeClass('dark-nav');
		} else {
			$('.navbar-fixed nav').addClass('dark-nav');
		}
	});

	//LOAD VALUES FROM STORAGE
	var yeCostWithSolar = [], yeCostWithoutSolar = [];
	var resultArray = JSON.parse(localStorage.getItem('solar-results'));
	console.log(resultArray);

	if (resultArray != null) {
		console.log('test');
		// Consider if item not set ?
		// for (var i=0; i<resultArray.length; i++) {
		// 	if (localStorage.getItem(localStorage.key(i)) === null) {

		// 	}
		// }

		// Client request to remove #firstYearSavings
		//HIGHLIGHTS 1
		$('#firstYearSavings').html("Rp " + parseFloat(resultArray['firstYearSavings']).toLocaleString( "en-US" ));
		$('#annualSavings').html("Rp " + parseFloat(resultArray['annualSavings']).toLocaleString( "en-US" ));
		$('#paybackPeriod').html(parseFloat(resultArray['paybackPeriod']).toLocaleString( "en-US" ) + " years");
		$('#solarSystemCost').html("Rp " + parseFloat(resultArray['solarSystemCost']).toLocaleString( "en-US" ));
		$('#returnOnInvestment').html(parseFloat(resultArray['returnOnInvestment']).toLocaleString( "en-US" ) + " &#37;");

		//HIGHLIGHTS 2
		$('#systemSize').html(parseFloat(resultArray['systemSize']).toLocaleString( "en-US" ));
		$('#monthlyElectricityUse').html(Math.floor(parseFloat(resultArray['monthlyElectricityUse'])).toLocaleString( "en-US" ));
		$('#monthlySolarProduction').html(parseFloat(resultArray['monthlySolarProduction']).toLocaleString( "en-US" ));
		$('#lifetimeCO2Reduction').html(parseFloat(resultArray['lifetimeCO2Reduction']).toLocaleString( "en-US" ));

		//Electricity Bill Comparison
		for (var i = 0; i < 25; i++) {
			yeCostWithSolar.push(resultArray['electricityBillComparison'][i]['yearlyElectricityCostWithSolar']);
			yeCostWithoutSolar.push(resultArray['electricityBillComparison'][i]['yearlyElectricityCostWithoutSolar']);
		}
		// console.log(yeCostWithSolar);
		// console.log(yeCostWithoutSolar);

		generateChart(yeCostWithSolar,yeCostWithoutSolar);
		

		//SOLAR SYSTEM DETAILS
		$('#systemSizeTable').html(parseFloat(resultArray['systemSize']).toLocaleString( "en-US" ) + " kW");
		$('#numberOfPanels').html(parseFloat(resultArray['numberOfPanels']).toLocaleString( "en-US" ) + " units");
		$('#areaRequired').html(parseFloat(resultArray['areaRequired']).toLocaleString( "en-US" ) + " m<sup>2</sup>");
		$('#monthlySolarProductionTable').html(parseFloat(resultArray['monthlySolarProduction']).toLocaleString( "en-US" ) + " kWh");

		//SYSTEM COSTS
		$('#solarSystemCostTable').html("Rp " + parseFloat(resultArray['solarSystemCost']).toLocaleString( "en-US" ));
		$('#costOfSolarPerWatt').html("Rp " + parseFloat(resultArray['costOfSolarPerWatt']).toLocaleString( "en-US" ));
		$('#lifetimeCostOfElectricity').html("Rp " + parseFloat(resultArray['lifetimeCostOfElectricity']).toLocaleString( "en-US" ));

		//Savings & Financials (20 years Average)
		$('#annualSavingsTable').html("Rp " + parseFloat(resultArray['annualSavings']).toLocaleString( "en-US" ));
		$('#lifetimeSavings').html("Rp " + parseFloat(resultArray['lifetimeSavings']).toLocaleString( "en-US" ));
		$('#paybackPeriodTable').html(parseFloat(resultArray['paybackPeriod']).toLocaleString( "en-US" ) + " years");
		$('#returnOnInvestmentTable').html(parseFloat(resultArray['returnOnInvestment']).toLocaleString( "en-US" ) + " &#37;");
	} else {
		//STILL GENERATE EMPTY CHART FOR ELECTRICITY BILL
		for (var i = 0; i < 25; i++) {
			yeCostWithSolar.push(100000+i*i*1000);
			yeCostWithoutSolar.push(200000+i*i*1000);
		}
		// console.log(yeCostWithSolar);
		// console.log(yeCostWithoutSolar);

		generateChart(yeCostWithSolar,yeCostWithoutSolar);
	}

	// FILL CHART
	function generateChart (dataset1, dataset2) {
		Highcharts.chart('comp-chart', {

		    title: {
		        text: 'Cost of electricity with and without solar'
		    },

		    subtitle: {
		        text: ''
		    },

		    xAxis: {
		        title: {
		            text: 'Year'
		        }
		    },

		    yAxis: {
		        title: {
		            text: 'Cost'
		        }
		    },

		    legend: {
		        layout: 'vertical',
		        align: 'right',
		        verticalAlign: 'middle'
		    },

		    plotOptions: {
		        series: {
		            label: {
		                connectorAllowed: false
		            },
		            pointStart: 1
		        }
		    },

		    series: [{
		        name: 'Yearly Electricity Cost With Solar',
		        data: dataset1,
		        color: '#4a8ac2'
		    }, {
		        name: 'Yearly Electricity Cost Without Solar',
		        data: dataset2,
		        color: '#8ac24a'
		    }],

		    responsive: {
		        rules: [{
		            condition: {
		                maxWidth: 500
		            },
		            chartOptions: {
		                legend: {
		                    layout: 'horizontal',
		                    align: 'center',
		                    verticalAlign: 'bottom'
		                }
		            }
		        }]
		    }

		});
	}


	// PREPARE CLASSES OF COVERAGE
	$(".cus-range.cover .thumb .value").removeClass();
	$(".cus-range.cover .thumb span").addClass("coverage-value");

	// PREPARE VALUE OF COVERAGE
	if (localStorage.getItem('coverage') === null) {
		$(".cus-range.cover .thumb .coverage-value").html("100&#37;");
		$(".calc-input #coverage").val(100);
	} else {
		console.log("coverage" + localStorage.getItem('coverage'));
		$(".cus-range.cover .thumb .coverage-value").html(localStorage.getItem('coverage') + "&#37;");
		$(".calc-input #coverage").val(localStorage.getItem('coverage'));
	}

	// UPDATE VALUE OF COVERAGE
	$(document).on('input', '#coverage', function() {
		// Update Value
    	$('.cus-range.cover .thumb .coverage-value').html($(this).val() + "&#37;");
	});

	console.log(localStorage.getItem('building'));

	// RECALCULATE BUTTON AJAX
	$( "form" ).submit(function( event ) {
		event.preventDefault();
		localStorage.setItem('coverage', $(".calc-input #coverage").val().trim());

		var JSONinput= {
			"building": localStorage.getItem('building'),
			"bill": localStorage.getItem('bill'),
			"power": localStorage.getItem('power'),
			"city": localStorage.getItem('city'),
			"coverage" : localStorage.getItem('coverage'),
		};
		
		//JSONinput = $( this ).serializeArray();
		console.log(JSONinput);

		$.ajax({
			type: "POST",
			url: "http://api.soorya.energy/api/Calculator/Recalculate",
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
				$(location).attr('href','/solar-calculator-results.html');
				//
				// STORING TO LOCALSTORAGE -- END
	        },
	        failure: function(errMsg) {
	            console.log(errMsg);
	        }
		});
	});
});

