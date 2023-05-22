(function($) {

	$('.onoff').lc_switch();
	$('.m-segment').hover(function() {
		i = $(this).attr('id');
		i = parseInt(i.substring(2));
		for(j = 0; j < donut.segments.length; j++) {
			if (j == i) {
				donut.select(j);
				$('#m-' + i).addClass('active');
			} else {
				$('#m-' + j).removeClass('active');
			}
	   		
	   	}
	});
	var donut = new Morris.Donut({
		data: [
			{label: '', value:355},
			{label: '', value:210},
			{label: '', value:310},
			{label: '', value:310}
		],
		colors: [
			'#41a8cf',
			'#f97159',
			'#bfa389',
			'#456990'
		],
		element: 'mortgagechart',
		formatter: function (x, data) { return 'Total Mortgage Payment'},
	});
	//$('.calc-col').hide();
	$('.prefix').focus(function(){
		$(this).val($(this).val().replace(',','').replace(',','').replace('$',''));
	});
	$('.prefix').blur(function(){
		$(this).val('$ ' + formatThousands($(this).val()));
	});
	$('#advanced-options').on('click', function(e) {
		e.preventDefault();
		$('.primary-row').fadeOut('fast', function() {
			$('#primary-options').removeClass('active');
			$('#advanced-options').addClass('active');
			$('.advanced-row').fadeIn();
		});
	});
	$('#primary-options').on('click', function(e) {
		e.preventDefault();
		$('.advanced-row').fadeOut('fast', function() {
			$('#advanced-options').removeClass('active');
			$('#primary-options').addClass('active');
			$('.primary-row').fadeIn();
		});
	});
	var handle = $('#custom-handle');
	$('#dti-slider').slider({
		range: 'max',
		value: 50,
		min: 20,
		max: 50,
		step: 1,
		create: function() {
			handle.html($(this).slider('value') + '<span>%</span>');
		},
		slide: function(event, el) {
			handle.html(el.value + '<span>%</span>');
		}
	});

	$('#calculate-house-assets').on('click', function() {
		currentValue = getVal('current-value');
		existingLoan1 = getVal('existing-loan-1');
		existingLoan2 = getVal('existing-loan-2');
		annualPropertyTax = getVal('property-tax');
		saleMonth = getVal('sale-month');				
		propertyTax = annualPropertyTax / 12 * saleMonth;
		profitFromSale = currentValue - existingLoan1 - existingLoan2 - propertyTax;

		if ($('#realtor').is(':checked')) {
			profitFromSale = profitFromSale - currentValue * 0.018;
		}

		if (!$('#realtor').is(':checked')) {
			profitFromSale = profitFromSale - currentValue * 0.068;
		}

		$('#assets2').val('$ ' + formatThousands(Math.round(profitFromSale)));

		$('.sale-col').fadeOut(function() {
			$('.calc-col').fadeIn();
		});
	});

	$('#skip-link').on('click', function(e) {
		e.preventDefault();
		$('.sale-col').fadeOut(function() {
			$('.calc-col').fadeIn();
		});
	});

	$('#sale-link').on('click', function(e) {
		e.preventDefault();
		$('.initial-col').fadeOut(function() {
			$('.sale-col').fadeIn();
		});
	});

	$('#calc-link').on('click', function(e) {
		e.preventDefault();
		$('.initial-col').fadeOut(function() {
			$('.calc-col').fadeIn();
		});
	});

	$('#type').on('change', function() {
		if ($(this).val() == 'conventional') {
			$('#period').html('<option value="30">30-years fixed</option><option value="20">20-years fixed</option><option value="15">15-years fixed</option><option value="10">10-years fixed</option>');
		}
		if ($(this).val() == 'FHA') {
			$('#period').html('<option value="30">30-years fixed</option><option value="15">15-years fixed</option>');
		}
		if ($(this).val() == 'VA') {
			$('#period').html('<option value="30">30-years fixed</option><option value="15">15-years fixed</option>');
		}
	});

	// Calculations
	$('#calculate').on('click', function(e) {
		e.preventDefault;
		Calculations();
	});

	function getVal(id) {
		return parseFloat($('#' + id).val().replace(",","").replace(",","").replace(",","").replace("$","").replace("%",""));
	}

	var superObject;

	function Calculations() {
		var assets = getVal('assets');
		var assets2 = getVal('assets2');
		var income = getVal('income');
		var score = getVal('score');
		var county = $('#county').val();
		var zip = getVal('zip');
		var address =  $('#address').val();

		var debt = getVal('debt');
		var type = $('#type').val();
		var period = $('#period').val();
		var usage = $('#usage').val();
		var property = $('#property').val();
		var history = $('#history').val();

		var data = {
			action: 'gv_mortgage_calc',
			assets: assets,
			assets2: assets2,
			income: income,
			score: score,
			county: county,
			zip: zip,
			debt: debt,
			type: type,
			period: period,
			usage: usage,
			property: property,
			history: history,
			address: address
		}

		$.ajax({				
			type: "GET",
			url: gvMortgageCalcPlugin.ajaxurl,
			data: data,
			cache: false,
			beforeSend: function() {
				$('.results-col').fadeOut(function() {
					$('.loading-col').fadeIn();
				});
				$('#calculate').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
				$('#calculate').prop('disabled', true);
				$('input, select').prop('disabled', true);
			},
			success: function( respond, textStatus, jqXHR ) {
				superObject = JSON.parse(respond);
				$('#dti-slider').slider('option', 'min', superObject.min);
				$('#dti-slider').slider('option', 'max', superObject.max);
				$('#dti-slider').slider('option', 'value', superObject.best);						
				$('.loading-col').fadeOut(function() {
					$('.results-col').fadeIn(function() {
						$('#calculate').html('Calculate');
						$('#calculate').prop('disabled', false);
						$('input, select').prop('disabled', false);
						newData = [
							{label: '$'+formatThousands(Math.round(superObject.DTIs[superObject.best].totalMortgagePayment)), value:Math.round(superObject.DTIs[superObject.best].mortgagePayment)},
							{label: '$'+formatThousands(Math.round(superObject.DTIs[superObject.best].totalMortgagePayment)), value:Math.round(superObject.DTIs[superObject.best].monthlyPropertyTax)},
							{label: '$'+formatThousands(Math.round(superObject.DTIs[superObject.best].totalMortgagePayment)), value:Math.round(superObject.DTIs[superObject.best].mortgageInsurance)},
							{label: '$'+formatThousands(Math.round(superObject.DTIs[superObject.best].totalMortgagePayment)), value:Math.round(superObject.DTIs[superObject.best].hazardInsurance)}
						];
						donut.setData(newData);
						donut.select(0);
						for(j = 0; j < donut.segments.length; j++) {
							$('#m-' + j).removeClass('active');			   		
						}
						for(i = 0; i < donut.segments.length; i++) {
							donut.segments[i].handlers['hover'].push( function(i){
								for(j = 0; j < donut.segments.length; j++) {
									if (j == i) {
										$('#m-' + i).addClass('active');
									} else {
										$('#m-' + j).removeClass('active');
									}
									
								}
							});
						}
						handle.html(superObject.best + '<span>%</span>');
						$('#maximumHousePrice').text('$' + formatThousands(Math.round(superObject.DTIs[superObject.best].maximumHousePrice)));
						$('#calprice').text(formatThousands(Math.round(superObject.DTIs[superObject.best].maximumHousePrice)));
						$("<div class='mt-4'><a class='btn fancybox-iframe' style='font-size:25px;' target='_blank' href='http://agentamplification.idxbroker.com/idx/results/listings?ccz=zipcode&srt=prd&idxID=d025&pt=1&zipcode%5B%5D=" +zip+ "&hp="+ Math.round(superObject.DTIs[superObject.best].maximumHousePrice) +"' >SEE ALL AVAILABLE HOMES</a></div>").insertAfter(".mt-4.tip");
						$('#maximumLoanAmount').text('$' + formatThousands(Math.round(superObject.DTIs[superObject.best].maximumLoanAmount)));

						$('#downPayment').text('$' + formatThousands(Math.round(superObject.DTIs[superObject.best].downPayment)));
						$('#downPaymentPercent').text(Math.floor(superObject.DTIs[superObject.best].downPaymentPercent) + '%');
						$('#closingCosts').text('$' + formatThousands(Math.round(superObject.DTIs[superObject.best].closingCosts)));

						$('#interestRate').text(superObject.DTIs[superObject.best].interestRate + '%');

						$('#monthlyPropertyTax').text('$' + formatThousands(Math.round(superObject.DTIs[superObject.best].monthlyPropertyTax)));
						$('#hazardInsurance').text('$' + formatThousands(Math.round(superObject.DTIs[superObject.best].hazardInsurance)));
						$('#mortgageInsurance').text('$' + formatThousands(Math.round(superObject.DTIs[superObject.best].mortgageInsurance)));

						$('#mortgagePayment').text('$' + formatThousands(Math.round(superObject.DTIs[superObject.best].mortgagePayment)));
						$('#totalMortgagePayment').text('$' + formatThousands(Math.round(superObject.DTIs[superObject.best].totalMortgagePayment)));
						$('#totalPayments').text('$' + formatThousands(Math.round(superObject.DTIs[superObject.best].totalPayments)));
						$('#debtToIncome').text(Math.ceil(superObject.DTIs[superObject.best].debtToIncome)  + '%');
						
						$('#dti-slider').slider({
							value: superObject.best,
							min: superObject.min,
							max: superObject.max,
							step: 1,
							create: function() {
								handle.html(superObject.best + '<span>%</span>');
							},	
							slide: function(event, el) {
								handle.html(el.value + '<span>%</span>');
								$('#maximumHousePrice').text('$' + formatThousands(Math.round(superObject.DTIs[el.value].maximumHousePrice)));
								$('#maximumLoanAmount').text('$' + formatThousands(Math.round(superObject.DTIs[el.value].maximumLoanAmount)));

								$('#downPayment').text('$' + formatThousands(Math.round(superObject.DTIs[el.value].downPayment)));
								$('#downPaymentPercent').text(Math.floor(superObject.DTIs[el.value].downPaymentPercent) + '%');
								$('#closingCosts').text('$' + formatThousands(Math.round(superObject.DTIs[el.value].closingCosts)));

								$('#interestRate').text(superObject.DTIs[el.value].interestRate + '%');

								$('#monthlyPropertyTax').text('$' + formatThousands(Math.round(superObject.DTIs[el.value].monthlyPropertyTax)));
								$('#hazardInsurance').text('$' + formatThousands(Math.round(superObject.DTIs[el.value].hazardInsurance)));
								$('#mortgageInsurance').text('$' + formatThousands(Math.round(superObject.DTIs[el.value].mortgageInsurance)));

								$('#mortgagePayment').text('$' + formatThousands(Math.round(superObject.DTIs[el.value].mortgagePayment)));
								$('#totalMortgagePayment').text('$' + formatThousands(Math.round(superObject.DTIs[el.value].totalMortgagePayment)));
								$('#totalPayments').text('$' + formatThousands(Math.round(superObject.DTIs[el.value].totalPayments)));
								$('#debtToIncome').text(Math.ceil(superObject.DTIs[el.value].debtToIncome)  + '%');
								newData = [
									{label: '$'+formatThousands(Math.round(superObject.DTIs[el.value].totalMortgagePayment)), value:Math.round(superObject.DTIs[el.value].mortgagePayment)},
									{label: '$'+formatThousands(Math.round(superObject.DTIs[el.value].totalMortgagePayment)), value:Math.round(superObject.DTIs[el.value].monthlyPropertyTax)},
									{label: '$'+formatThousands(Math.round(superObject.DTIs[el.value].totalMortgagePayment)), value:Math.round(superObject.DTIs[el.value].mortgageInsurance)},
									{label: '$'+formatThousands(Math.round(superObject.DTIs[el.value].totalMortgagePayment)), value:Math.round(superObject.DTIs[el.value].hazardInsurance)}
								];
								donut.setData(newData);
								donut.select(0);
								for(j = 0; j < donut.segments.length; j++) {
									$('#m-' + j).removeClass('active');			   		
								}
								for(i = 0; i < donut.segments.length; i++) {
									donut.segments[i].handlers['hover'].push( function(i){
										for(j = 0; j < donut.segments.length; j++) {
											if (j == i) {
												$('#m-' + i).addClass('active');
											} else {
												$('#m-' + j).removeClass('active');
											}
											
										}
									});
								}
							},	
						});						
					});
				});
				
				/* Zillow properties */
				if ( typeof(superObject.zillow.totalPages) !== 'undefined' && superObject.zillow.totalPages != 0 ) {
					
					$(".container.calc-container #zillow > div").empty();
					
					$.each( superObject.zillow.props, function( key, val ) {
    
						var areaValue = ( parseFloat(val.lotAreaValue) > 1000 ) ? numberWithCommas(val.lotAreaValue) : roundNumber(val.lotAreaValue,4);
		
						$(".container.calc-container #zillow > div").append('<div class="col-sm-12 col-md-6 mb-4 property"><div class = "p-4 shadow bg-white rounded" ><img class = "property_img" src="' + val.imgSrc + '"  /><p><b>$' + numberWithCommas(val.price) +'</b> - ' + val.propertyType + '</p><div class="row"><div class="col-6 col-xl-3"><b>' + val.bedrooms + '</b> bed</div><div class="col-6 col-xl-3"><b>' + val.bathrooms + '</b> bath</div><div class="col-6 col-xl-3"><b>' + numberWithCommas(val.livingArea) + '</b> sqrt</div><div class="col-6 col-xl-3"><b>' + areaValue + '</b> ' + val.lotAreaUnit + '</div></div><p>' + val.address + '</p></div></div>');
  
					});
					
					$('html, body').animate({
						scrollTop: $(".container.calc-container #zillow").offset().top
					}, 2000);
					
				} else if ( typeof(superObject.zillow.zestimate) !== 'undefined' ) {
					
					$(".container.calc-container #zillow > div").empty();
					$(".container.calc-container #zillow > div").append('<div class="col-sm-12 col-md-6 mb-4 property"><div class = "p-4 shadow bg-white rounded" ><img class = "property_img" src="' + superObject.zillow.imgSrc + '"  /><p><b>$' + numberWithCommas(superObject.zillow.price) +'</b> - ' + superObject.zillow.propertyTypeDimension + '</p><p>' + superObject.zillow.description + '</p></div></div>');
					
					$('html, body').animate({
						scrollTop: $(".container.calc-container #zillow").offset().top
					}, 2000);
					
				} else {
					
					$(".container.calc-container #zillow > div").empty();
					
				}
							
			},
			error: function( jqXHR, textStatus, errorThrown ){
				
			}
		});
	}
	
	// 
	$('#get-property-value').on('click', function(e) {
		
		var street = $("#street").val();
		var city = $("#city").val();
		var state = $("#state option:selected").val();
		var zip_code = $("#zip_code").val();
		
		if ( street == "" || city == "" || state == "" ||zip_code == ""  ) {
			
			alert("Please enter a street, city, state and zip code.");
			
		} else {
		
			var address = "";
			
			if ( street != "" ) {
				
				address += street + ", ";
				
			}
			
			if ( city != "" ) {
				
				address += city + ", ";
				
			}
			
			if ( state != "" ) {
				
				address += state + ", ";
				
			}
			
			if ( zip_code != "" ) {
				
				address += zip_code;
				
			}
			
			//console.log(address);
			
			$.ajax({
				type: 'POST',
				dataType: 'json', 
				cache: false,
				data : { "action" : "get_price", "address" : address },
				url: gvMortgageCalcPlugin.ajaxurl,
				success: function( respond, textStatus, jqXHR ) {
									
					if ( typeof( respond.price ) !== 'undefined' ) {
						
						$("#current-value").val( "$ " + numberWithCommas(respond.price) );
						
					}
					
				},
				error: function( jqXHR, textStatus, errorThrown ){

					alert("Please try a different Street address");	
				
				}
			});
			
		}	
			
		e.preventDefault;
			
	});

	$('#zip_code').on('keyup blur', function(e) {
		
		$("#zip").val( $(this).val() );
		
		e.preventDefault;
			
	});
	
	
	
	
	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	
	function roundNumber(num, dec) {
		return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
	}

	function formatThousands(num, showcents) {

		num = num.toString().replace(/\$|\,/g,'');

		if (isNaN(num)) {
			num = "0";
		}

		sign = (num == (num = Math.abs(num)));

		num = Math.floor(num * 100 + 0.50000000001);

		cents = num % 100;

		num = Math.floor(num / 100).toString();

		if (cents < 10) {
			cents = "0" + cents;
		}

		for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++) {
			num = num.substring(0,num.length-(4*i+3))+','+num.substring(num.length-(4*i+3));
		}

		if (showcents) {
			return (((sign)?'':'-') + num + '.' + cents);
		}

		return (((sign)?'':'-') + num);
	}

	
})( jQuery );