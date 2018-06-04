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
	//simulateData();
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
		$('#firstYearSavings').html("Rp " + Math.floor(parseFloat(resultArray['firstYearSavings'])).toLocaleString( "en-US" ));
		$('#annualSavings').html("Rp " + Math.floor(parseFloat(resultArray['annualSavings'])).toLocaleString( "en-US" ));
		$('#paybackPeriod').html(parseFloat(resultArray['paybackPeriod']).toLocaleString( "en-US" ) + " years");
		$('#solarSystemCost').html("Rp " + Math.floor(parseFloat(resultArray['solarSystemCost'])).toLocaleString( "en-US" ));
		$('#returnOnInvestment').html(parseFloat(resultArray['returnOnInvestment']).toLocaleString( "en-US" , {minimumFractionDigits:2} ) + " &#37;");

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
		$('#solarSystemCostTable').html("Rp " + Math.floor(parseFloat(resultArray['solarSystemCost'])).toLocaleString( "en-US" ));
		$('#costOfSolarPerWatt').html("Rp " + Math.floor(parseFloat(resultArray['costOfSolarPerWatt'])).toLocaleString( "en-US" ));
		$('#lifetimeCostOfElectricity').html("Rp " + Math.floor(parseFloat(resultArray['lifetimeCostOfElectricity'])).toLocaleString( "en-US" ));

		//Savings & Financials (20 years Average)
		$('#annualSavingsTable').html("Rp " + Math.floor(parseFloat(resultArray['annualSavings'])).toLocaleString( "en-US" ));
		$('#lifetimeSavings').html("Rp " + Math.floor(parseFloat(resultArray['lifetimeSavings'])).toLocaleString( "en-US" ));
		$('#paybackPeriodTable').html(parseFloat(resultArray['paybackPeriod']).toLocaleString( "en-US" ) + " years");
		$('#returnOnInvestmentTable').html(parseFloat(resultArray['returnOnInvestment']).toLocaleString( "en-US" ) + " &#37;");
	} else {

		//STILL GENERATE EMPTY CHART FOR ELECTRICITY BILL
		for (var i = 0; i < 25; i++) {
			yeCostWithSolar.push(100000+i*i*1000);
			yeCostWithoutSolar.push(200000+i*i*1000);
		}

		generateChart(yeCostWithSolar,yeCostWithoutSolar);
	}

	// FILL CHART
	function generateChart (dataset1, dataset2) {
		var ctx = document.getElementById("myChart").getContext('2d');
		var myChart = new Chart(ctx, {
		    type: 'line',
		    data: {
		        labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12",
		        	"13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25"
		        	],
		        datasets: [{
		            label: 'Yearly Electricity Cost With Solar',
		            data: dataset1,
		            backgroundColor: '#4a8ac2',
		            borderColor: '#4a8ac2',
		            borderWidth: 1,
		            fill: false
		        },{
		            label: 'Yearly Electricity Cost Without Solar',
		            data: dataset2,
		            backgroundColor: '#8ac24a',
		            borderColor: '#8ac24a',
		            borderWidth: 1,
		            fill: false
		        }]
		    },
		    options: {
		    	responsive: true,
		    	maintainAspectRatio: false,
		    	layout: {
		            padding: {
		                left: 0,
		                right: 0,
		                top: 0,
		                bottom: 0
		            }
		        },
		        legend: {
		            display: true,
		            labels: {
		                usePointStyle: true,
		                position: 'right'
		            }
		        },
		        scales: {
		            xAxes: [{
		            	scaleLabel: {
		            		display: true,
		            		labelString: 'Years',
		            	},
		            	ticks: {
		                    autoSkip : true,
		                    autoSkipPadding: 50
		                },
		                gridLines: {
		                	display: false,
		                	zeroLineWidth : 0
		                }
		            }],
		            yAxes: [{
		            	scaleLabel: {
		            		display: true,
		            		labelString: 'Cost (IDR)',
		            	},
		            	ticks: {
		                    beginAtZero: true,
		                    autoSkip : true,
		                    autoSkipPadding: 50,
		                    padding: 10
		                },
		                gridLines: {
		                	display: true,
		                	drawTicks : false
		                }
		            }]
		        }
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
			url: "https://api.soorya.energy/api/Calculator/Recalculate",
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



	function simulateData() {
		//JUST SIMULATING RECEIVED DATA FROM SERVER SIDE
		var simulatedData = {
			"address"					: "Indonesia",
			"annualSavings"				: "33464329",
			"areaRequired"				: "33",
			"buildingType"				: "Residential",
			"city"						: "Jakarta",
			"costOfSolarPerWatt"		: "18000",
			"electricityBillComparison"	: ([
			{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "1",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",

			},{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "2",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",

			},{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "3",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",

			},{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "4",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",

			},{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "5",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",

			},{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "6",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",

			},{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "7",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",

			},{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "8",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",

			},{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "9",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",

			},{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "10",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",

			},{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "11",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",

			},{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "12",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",

			},{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "13",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",

			},{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "14",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",

			},{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "15",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",

			},{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "16",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",

			},{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "17",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",

			},{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "18",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",

			},{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "19",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",

			},{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "20",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",

			},{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "21",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",

			},{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "22",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",

			},{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "23",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",

			},{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "24",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",

			},{
				"accumulatedSavings"				: "16739578.77",
				"costOfGridElectricity"				: "1467.28",
				"electricityCanBeCoveredBySolar"	: "17277.96",
				"energyConsumedYearly"				: "20445.96",
				"savingsValue"						: "16739578.77",
				"year"								: "25",
				"yearlyElectricityCostWithSolar"	: "13260369.42",
				"yearlyElectricityCostWithoutSolar"	: "29999948.19",
				"yearlyMinimumFromPLN"				: "4648343.04",
			}]),
			"email"						: "a@yahoo.com",
			"firstYearSavings"			: "16739578.77",
			"latitude"					: "-0.7",
			"lifetimeCO2Reduction"		: "371020.29",
			"lifetimeCostOfElectricity"	: "498.44",
			"lifetimeSavings"			: "371020.29",
			"longitude"					: "114.360",
			"monthlyElectricityBill"	: "2500000",
			"monthlyElectricityUse"		: "1703.83",
			"monthlySolarProduction"	: "1405",
			"name"						: "jiang",
			"numberOfPanels"			: "24.75",
			"paybackPeriod"				: "5.9",
			"phone"						: "123456789",
			"power"						: "6600",
			"province"					: null,
			"regency"					: null,
			"returnOnInvestment"		: "12.9",
			"solarSystemCost"			: "198000000",
			"systemSize"				: "11",
			"zipcode"					: "12345"
		};
		console.log(simulatedData);

		//SIMULATE DATA
		var simulatedSuccess = true;
		if (simulatedSuccess) {
			//STORING TO LOCALSTORAGE -- BEGIN
			
			localStorage.setItem('solar-results', JSON.stringify(simulatedData));
			
			
			//STORING TO LOCALSTORAGE -- END
		}
	}
});

