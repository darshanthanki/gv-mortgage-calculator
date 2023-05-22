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
			'#15AAFE',
			'#FF9E80',
			'#d7e5e5',
			'#ddf472'
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
		step: .5,
		create: function() {
			handle.html($(this).slider('value') + '<span>%</span>');
		},
		slide: function(event, el) {
			handle.html(el.value + '<span>%</span>');
		}
	});
	$("#back-from-calc").hide();
	$('#calculate-house-assets').on('click', function() {
		currentValue = getVal('current-value');
		existingLoan1 = getVal('existing-loan-1');
		existingLoan2 = getVal('existing-loan-2');
		annualPropertyTax = getVal('property-tax');
		saleMonth = getVal('sale-month');	
		$.cookie('estimated_home_value', currentValue);
		$.cookie('current_mortgage_balance', existingLoan1);
		$.cookie('repairs_andor_credits', existingLoan2);
		$.cookie('annual_property_tax_amount', annualPropertyTax);
		
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
			$(".calc-container").addClass("cal-bottom-bg");
			$("#back-from-calc").show();
		});
	});

	$('#skip-link').on('click', function(e) {
		e.preventDefault();
		$("#back-from-calc").show();
		$('html, body').animate({
			scrollTop: $(".calc-container").offset().top
		}, 10);
		$('.salingform').animate({left: '-600px'}, 1000);
		setTimeout(function(){
		$('.sale-col').hide();
		$('.calc-col').fadeIn();
		$(".calc-container").addClass("cal-bottom-bg");
		$('.salingform').removeAttr("style");
		},1100);
		/*
		$('.sale-col').fadeOut(function() {
			$('.calc-col').fadeIn();
			$(".calc-container").addClass("cal-bottom-bg");
		});	
		*/
	});

	$('#sale-link').on('click', function(e) {
		e.preventDefault();
		$("#back-from-calc").show();
		$('.initial-col').fadeOut(function() {
			$('.sale-col').show();
		});
	});

	$('#calc-link').on('click', function(e) {
		e.preventDefault();
		$("#back-from-calc").show();
		$('.initial-col').fadeOut(function() {
			$('.calc-col').fadeIn();
			$(".calc-container").addClass("cal-bottom-bg");
		});
	});
	
	$('.sale-open').on('click', function(e) {
		e.preventDefault();
		$("#back-from-calc").show();
		$('.initial-col').fadeOut(function() {
			$('.sale-col').fadeIn();
		});
		return false;
	});
	$('.calc-open').on('click', function(e) {
		e.preventDefault();
		$("#back-from-calc").show();
		$('.initial-col').fadeOut(function() {
			$('.calc-col').fadeIn();
			$(".calc-container").addClass("cal-bottom-bg");
		});
		return false;
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
		const body = document.querySelector("body");
		const pp_modal = document.querySelector(".pp_modal");
		if(myAjax.user_id > 0){
			Calculations();
		}else{
			$(".propCount").text("Loading...");
			$(".propCity").text($("#county_city option:selected").text());
			/* new data */
			var assets = getVal('assets');
			var assets2 = getVal('assets2');
			var income = getVal('income');
			var score = getVal('score');
			var county = $('#county').val();
			var county_city = $('#county_city').val();
			var county_city_text = $("#county_city option:selected").text();
			var zip = getVal('zip');
			var address =  $('#address').val();

			var debt = getVal('debt');
			var type = $('#type').val();
			var period = $('#period').val();
			var usage = $('#usage').val();
			var property = $('#property').val();
			var history = $('#history').val();
			/* new data end */
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
				$('#calculate').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
			},
			success: function( respond, textStatus, jqXHR ) {
				superObject = JSON.parse(respond);
				var maxprice = Math.round(superObject.DTIs[superObject.best].maximumHousePrice);
				$.ajax({
					type : "POST",
					dataType : "json",
					url : "https://agentamplification.com/staging/wp-json/properties/v1/get_properties_by",
					data : {action: "get_properties_by_action",zip:zip,county:county,county_city:county_city,maxprice:maxprice},
					success: function(response) {
						if(response.type == "success") {
							if(response.count > 5){
								$(".morethenfive").show();
								$(".lessthenfive").hide();
								$(".propCount").text(response.count);
							}else{
								$(".morethenfive").hide();
								$(".lessthenfive").show();
							}
						}else if(response.type == "error"){
							
						}else {
						   alert("Error Occoured");
						}
					}
				});
				$('#modalDialogCalc').show();
				$('#calculate').html('Update Pre-Qualification');
			}
			});
			
			//body.style.overflow = "hidden";
		}
	});
	/*
	$(document).on('submit','#RegistrationForm', function (e) {
		e.preventDefault;
		$.ajax({
			type : "POST",
			dataType : "json",
			url : myAjax.ajaxurl,
			data : {action: "add_user_for_calculator",first_name:$("#FormControlFirstName").val(),last_name:$("#FormControlLastName").val(),email:$("#FormControlEmail").val(),phone:$("#FormControlPhone").val(),message:$("#FormControlMessage").val()},
			success: function(response) {
				if(response.type == "success") {
					document.querySelector('.mdp-snitcher--close').click();
					Calculations();
				}
				else {
				   alert("Your vote could not be added");
				}
			}
		});
		return false;		
	});
	*/
	$("form[name='RegistrationForm']").validate({
		// Specify validation rules
		rules: {
			FormControlFirstName: "required",
			FormControlLastName: "required",
			FormControlEmail: {
				required: true,
				email: true
			},
		},
		messages: {
			firstname: "Please enter your firstname",
			lastname: "Please enter your lastname",
			password: {
			required: "Please provide a password",
			minlength: "Your password must be at least 5 characters long"
			},
			email: "Please enter a valid email address"
		},
		submitHandler: function(form) {
			$(".RegisterMessages ul").html('');
			$("#RegistrationForm .krbutton").addClass("kractive");
			//setTimeout(function(){
			$.ajax({
				type : "POST",
				dataType : "json",
				url : myAjax.ajaxurl,
				data : {action: "add_user_for_calculator",first_name:$("#FormControlFirstName").val(),last_name:$("#FormControlLastName").val(),email:$("#FormControlEmail").val(),phone:'',message:$("#FormControlMessage").val()},
				success: function(response) {
					//$("#RegistrationForm .krbutton").removeClass("kractive").addClass("krfinished");
					loadinstop("#RegistrationForm .krbutton",response.type);
					if(response.type == "success") {
						$(".RegisterMessages ul").append(response.message);
						myAjax.user_id=response.user_id;
						$("form[name='RegistrationForm']")[0]. reset();
						setTimeout(function(){
							$('#modalDialogCalc .modalcalc-content').animate({top: '800px'}, 1000);
							setTimeout(function(){
							$('#modalDialogCalc').hide();
							$('#modalDialogCalc .modalcalc-content').removeAttr("style");
							},1100);
							Calculations();
						},2000);
					}else if(response.type == "error"){
						$(".RegisterMessages ul").html(response.message);
					}else {
					   alert("Your vote could not be added");
					}
				}
			});
			//},3000);
		}
	});
	
	$("form[name='LoginForm']").validate({
		// Specify validation rules 
		rules: {
			gv_email: {
				required: true,
				email: true
			},
			gv_password: "required",
		},
		messages: {
			firstname: "Please enter your firstname",
			lastname: "Please enter your lastname",
			password: {
			required: "Please provide a password",
			minlength: "Your password must be at least 5 characters long"
			},
			email: "Please enter a valid email address"
		},
		submitHandler: function(form) {
			$(".LoginMessages ul").html('');
			//setTimeout(function(){
			$("#LoginForm .krbutton").addClass("kractive");
			$.ajax({
				type : "POST",
				dataType : "json",
				url : myAjax.ajaxurl,
				data : {action: "login_user_for_calculator_action",gv_email:$("#gv_email").val(),gv_password:$("#gv_password").val()},
				success: function(response) {
					//$("#LoginForm .krbutton").removeClass("kractive").addClass("krfinished");
					loadinstop("#LoginForm .krbutton",response.type);
					if(response.type == "success") {
						$(".LoginMessages ul").append(response.message);
						myAjax.user_id=response.user_id;
						$("form[name='LoginForm']")[0]. reset();
						setTimeout(function(){
							$('#modalDialogCalc .modalcalc-content').animate({top: '800px'}, 1000);
							setTimeout(function(){
							$('#modalDialogCalc').hide();
							$('#modalDialogCalc .modalcalc-content').removeAttr("style");
							},1100);
							Calculations();
						},2000);
					}else if(response.type == "error"){
						$(".LoginMessages ul").append(response.message);
					}else {
					   alert("Your vote could not be added");
					}
				}
			});
			//},3000); 
		}
	});
	$("form[name='ForgotForm']").validate({
		// Specify validation rules 
		rules: {
			gv_email: {
				required: true,
				email: true
			}
		},
		messages: {
			firstname: "Please enter your firstname",
			lastname: "Please enter your lastname",
			password: {
			required: "Please provide a password",
			minlength: "Your password must be at least 5 characters long"
			},
			email: "Please enter a valid email address"
		},
		submitHandler: function(form) {
			$(".forgotMessages ul").html('');
			$.ajax({
				type : "POST",
				dataType : "json",
				url : myAjax.ajaxurl,
				data : {action: "forgot_password_calculator_action",gv_email:$("#gv_forgot_email").val()},
				success: function(response) {
					if(response.type == "success") {
						$(".forgotMessages ul").append(response.message);
						
					}else if(response.type == "error"){
						$(".forgotMessages ul").append(response.message);
					}else {
					   alert("Your vote could not be added");
					}
				}
			});
		}
	});
	$(document).on('submit_success', '#itchy002',(e)=>{
		alert('success');
	});

	function getVal(id) {
		return parseFloat($('#' + id).val().replace(",","").replace(",","").replace(",","").replace("$","").replace("%",""));
	}

	var superObject;
	
    function shortenLargeNumber(num, digits) {
    var units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
			decimal;

		for(var i=units.length-1; i>=0; i--) {
			decimal = Math.pow(1000, i+1);

			if(num <= -decimal || num >= decimal) {
				return +(num / decimal).toFixed(digits) + units[i];
			}
		}

		return num;
	}
	function Calculations() {
		var assets = getVal('assets');
		var assets2 = getVal('assets2');
		var income = getVal('income');
		var score = getVal('score');
		var county = $('#county').val();
		var county_city = $('#county_city').val();
		var county_city_text = $("#county_city option:selected").text();
		var zip = getVal('zip');
		var address =  $('#address').val();

		var debt = getVal('debt');
		var type = $('#type').val();
		var period = $('#period').val();
		var usage = $('#usage').val();
		var property = $('#property').val();
		var history = $('#history').val();
		
		
		var estimated_home_value = $('#current-value').val();
		var street = $('#street').val();
		var city = $('#city').val();
		var state = $('#state').val();
		var zip_code = $('#zip_code').val();
		var current_mortgage_balance = $('#existing-loan-1').val();
		var repairs_andor_credits = $('#existing-loan-2').val();
		var annual_property_tax_amount = $('#property-tax').val();
		var close_the_sale = $('#sale-month').val();
		if($('.lcs_switch.lcs_checkbox_switch').hasClass("lcs_off")){
			var for_sale_by_owner = "No";
		}else{
			var for_sale_by_owner = "Yes";
		} 

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
		var insertdata = {
			action: 'user_calculator_collections_action',
			available_assets: assets,
			assets_from_sale: assets2,
			annual_gross_income: income,
			credit_score: score,
			county: county,
			county_city: county_city,
			zip_code_cal: zip,
			monthly_debt_payment: debt,
			loan_type: type,
			period: period,
			property_usage: usage,
			property_type: property,
			purchase_history: history,
			estimated_home_value: estimated_home_value,
			street: street,
			city: city,
			state: state,
			zip_code: zip_code,
			current_mortgage_balance: current_mortgage_balance,
			repairs_andor_credits: repairs_andor_credits,
			annual_property_tax_amount: annual_property_tax_amount,
			close_the_sale: close_the_sale,
			for_sale_by_owner: for_sale_by_owner,
		}
		
		$.ajax({
			type : "POST",
			dataType : "json",
			url : myAjax.ajaxurl,
			data : insertdata,
			success: function(response) {
				if(response.type == "success") {
					
				}else if(response.type == "error"){
					
				}else {
				   alert("Error Occoured");
				}
			}
		});

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
						$('#calculate').html('Update Pre-Qualification');
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
                        
        
         var zpcd =[{90008:"Los Angeles",90009:"Los Angeles",90010:"Los Angeles",90011:"Los Angeles",90012:"Los Angeles",90013:"Los Angeles",90014:"Los Angeles",90015:"Los Angeles",90016:"Los Angeles",90017:"Los Angeles",90018:"Los Angeles",90019:"Los Angeles",90020:"Los Angeles",90021:"Los Angeles",90022:"Los Angeles",90023:"Los Angeles",90024:"Los Angeles",90025:"Los Angeles",90026:"Los Angeles",90027:"Los Angeles",90028:"Los Angeles",90029:"Los Angeles",90030:"Los Angeles",90031:"Los Angeles",90039:"Los Angeles",90040:"Los Angeles",90041:"Los Angeles",90042:"Los Angeles",90043:"Los Angeles",90044:"Los Angeles",90045:"Los Angeles",90046:"Los Angeles",90047:"Los Angeles",90048:"Los Angeles",90049:"Los Angeles",90050:"Los Angeles",90051:"Los Angeles",90052:"Los Angeles",90053:"Los Angeles",90054:"Los Angeles",90055:"Los Angeles",90056:"Los Angeles",90057:"Los Angeles",90058:"Los Angeles",90059:"Los Angeles",90060:"Los Angeles",90061:"Los Angeles",90062:"Los Angeles",90069:"West Hollywood",90070:"Los Angeles",90071:"Los Angeles",90072:"Los Angeles",90073:"Los Angeles",90074:"Los Angeles",90075:"Los Angeles",90076:"Los Angeles",90077:"Los Angeles",90078:"Los Angeles",90079:"Los Angeles",90080:"Los Angeles",90081:"Los Angeles",90082:"Los Angeles",90083:"Los Angeles",90084:"Los Angeles",90086:"Los Angeles",90087:"Los Angeles",90088:"Los Angeles",90089:"Los Angeles",90091:"Los Angeles",90093:"Los Angeles",90094:"Los Angeles",90095:"Los Angeles",90096:"Los Angeles",90201:"Bell",90202:"Bell Gardens",90209:"Beverly Hills",90210:"Beverly Hills",90211:"Beverly Hills",90212:"Beverly Hills",90213:"Beverly Hills",90220:"Compton",90221:"Compton",90222:"Compton",90223:"Compton",90224:"Compton",90230:"Culver City",90231:"Culver City",90232:"Culver City",90233:"Culver City",90239:"Downey",90240:"Downey",90241:"Downey",90242:"Downey",90245:"El Segundo",90247:"Gardena",90248:"Gardena",90249:"Gardena",90250:"Hawthorne",90251:"Hawthorne",90262:"Lynwood",90263:"Malibu",90264:"Malibu",90265:"Malibu",90266:"Manhattan Beach",90267:"Manhattan Beach",90270:"Maywood",90272:"Pacific Palisades",90274:"Palos Verdes Peninsula",90275:"Rancho Palos Verdes",90277:"Redondo Beach",90278:"Redondo Beach",90280:"South Gate",90290:"Topanga",90291:"Venice",90292:"Marina Del Rey",90293:"Playa Del Rey",90294:"Venice",90295:"Marina Del Rey",90296:"Playa Del Rey",90301:"Inglewood",90302:"Inglewood",90303:"Inglewood",90304:"Inglewood",90305:"Inglewood",90306:"Inglewood",90307:"Inglewood",90311:"Inglewood",90312:"Inglewood",90313:"Inglewood",90397:"Inglewood",90398:"Inglewood",90401:"Santa Monica",90402:"Santa Monica",90403:"Santa Monica",90404:"Santa Monica",90405:"Santa Monica",90406:"Santa Monica",90407:"Santa Monica",90408:"Santa Monica",90409:"Santa Monica",90410:"Santa Monica",90411:"Santa Monica",90501:"Torrance",90502:"Torrance",90503:"Torrance",90504:"Torrance",90505:"Torrance",90506:"Torrance",90507:"Torrance",90508:"Torrance",90509:"Torrance",90510:"Torrance",90601:"Whittier",90602:"Whittier",90605:"Whittier",90606:"Whittier",90607:"Whittier",90608:"Whittier",90609:"Whittier",90610:"Whittier",90612:"Whittier",90620:"Buena Park",90621:"Buena Park",90622:"Buena Park",90623:"La Palma",90624:"Buena Park",90630:"Cypress",90631:"La Habra",90632:"La Habra",90633:"La Habra",90637:"La Mirada",90638:"La Mirada",90639:"La Mirada",90640:"Montebello",90650:"Norwalk",90651:"Norwalk",90652:"Norwalk",90659:"Norwalk",90660:"Pico Rivera",90661:"Pico Rivera",90662:"Pico Rivera",90670:"Santa Fe Springs",90671:"Santa Fe Springs",90701:"Artesia",90702:"Artesia",90703:"Cerritos",90704:"Avalon",90706:"Bellflower",90707:"Bellflower",90710:"Harbor City",90711:"Lakewood",90712:"Lakewood",90713:"Lakewood",90714:"Lakewood",90715:"Lakewood",90716:"Hawaiian Gardens",90717:"Lomita",90720:"Los Alamitos",90721:"Los Alamitos",90723:"Paramount",90731:"San Pedro",90732:"San Pedro",90733:"San Pedro",90734:"San Pedro",90740:"Seal Beach",90742:"Sunset Beach",90743:"Surfside",90744:"Wilmington",90745:"Carson",90746:"Carson",90747:"Carson",90748:"Wilmington",90749:"Carson",90755:"Signal Hill",90801:"Long Beach",90802:"Long Beach",90803:"Long Beach",90804:"Long Beach",90805:"Long Beach",90806:"Long Beach",90807:"Long Beach",90808:"Long Beach",90809:"Long Beach",90810:"Long Beach",90813:"Long Beach",90814:"Long Beach",90815:"Long Beach",90822:"Long Beach",90831:"Long Beach",90832:"Long Beach",90833:"Long Beach",90834:"Long Beach",90835:"Long Beach",90840:"Long Beach",90842:"Long Beach",90844:"Long Beach",90845:"Long Beach",90846:"Long Beach",90847:"Long Beach",90848:"Long Beach",90853:"Long Beach",90888:"Long Beach",90895:"Carson",90899:"Long Beach",91001:"Altadena",91003:"Altadena",91006:"Arcadia",91007:"Arcadia",91009:"Duarte",91010:"Duarte",91011:"La Canada Flintridge",91012:"La Canada Flintridge",91016:"Monrovia",91017:"Monrovia",91020:"Montrose",91021:"Montrose",91023:"Mount Wilson",91024:"Sierra Madre",91025:"Sierra Madre",91030:"South Pasadena",91031:"South Pasadena",91040:"Sunland",91041:"Sunland",91042:"Tujunga",91043:"Tujunga",91046:"Verdugo City",91066:"Arcadia",91077:"Arcadia",91101:"Pasadena",91102:"Pasadena",91103:"Pasadena",91104:"Pasadena",91105:"Pasadena",91106:"Pasadena",91107:"Pasadena",91108:"San Marino",91109:"Pasadena",91110:"Pasadena",91114:"Pasadena",91115:"Pasadena",91116:"Pasadena",91117:"Pasadena",91118:"San Marino",91121:"Pasadena",91123:"Pasadena",91124:"Pasadena",91125:"Pasadena",91126:"Pasadena",91129:"Pasadena",91131:"Pasadena",91182:"Pasadena",91184:"Pasadena",91185:"Pasadena",91188:"Pasadena",91189:"Pasadena",91191:"Pasadena",91199:"Pasadena",91201:"Glendale",91202:"Glendale",91203:"Glendale",91204:"Glendale",91205:"Glendale",91206:"Glendale",91207:"Glendale",91208:"Glendale",91209:"Glendale",91210:"Glendale",91214:"La Crescenta",91221:"Glendale",91222:"Glendale",91224:"La Crescenta",91225:"Glendale",91226:"Glendale",91301:"Agoura Hills",91302:"Calabasas",91303:"Canoga Park",91304:"Canoga Park",91305:"Canoga Park",91306:"Winnetka",91307:"West Hills",91308:"West Hills",91309:"Canoga Park",91310:"Castaic",91311:"Chatsworth",91313:"Chatsworth",91316:"Encino",91319:"Newbury Park",91320:"Newbury Park",91321:"Newhall",91322:"Newhall",91324:"Northridge",91325:"Northridge",91326:"Porter Ranch",91327:"Northridge",91328:"Northridge",91329:"Northridge",91330:"Northridge",91331:"Pacoima",91333:"Pacoima",91334:"Pacoima",91335:"Reseda",91337:"Reseda",91340:"San Fernando",91341:"San Fernando",91342:"Sylmar",91343:"North Hills",91344:"Granada Hills",91345:"Mission Hills",91346:"Mission Hills",91350:"Santa Clarita",91351:"Canyon Country",91352:"Sun Valley",91353:"Sun Valley",91354:"Valencia",91355:"Valencia",91356:"Tarzana",91357:"Tarzana",91358:"Thousand Oaks",91359:"Westlake Village",91360:"Thousand Oaks",91361:"Westlake Village",91362:"Thousand Oaks",91363:"Westlake Village",91364:"Woodland Hills",91365:"Woodland Hills",91367:"Woodland Hills",91371:"Woodland Hills",91372:"Calabasas",91376:"Agoura Hills",91377:"Oak Park",91380:"Santa Clarita",91381:"Stevenson Ranch",91382:"Santa Clarita",91383:"Santa Clarita",91384:"Castaic",91385:"Valencia",91386:"Canyon Country",91387:"Canyon Country",91388:"Van Nuys",91390:"Santa Clarita",91392:"Sylmar",91393:"North Hills",91394:"Granada Hills",91395:"Mission Hills",91396:"Winnetka",91399:"Woodland Hills",91401:"Van Nuys",91402:"Panorama City",91403:"Sherman Oaks",91404:"Van Nuys",91405:"Van Nuys",91406:"Van Nuys",91407:"Van Nuys",91408:"Van Nuys",91409:"Van Nuys",91410:"Van Nuys",91411:"Van Nuys",91412:"Panorama City",91413:"Sherman Oaks",91416:"Encino",91423:"Sherman Oaks",91426:"Encino",91436:"Encino",91470:"Van Nuys",91482:"Van Nuys",91495:"Sherman Oaks",91496:"Van Nuys",91497:"Van Nuys",91499:"Van Nuys",91501:"Burbank",91502:"Burbank",91503:"Burbank",91504:"Burbank",91505:"Burbank",91506:"Burbank",91507:"Burbank",91508:"Burbank",91510:"Burbank",91521:"Burbank",91522:"Burbank",91523:"Burbank",91526:"Burbank",91601:"North Hollywood",91602:"North Hollywood",91603:"North Hollywood",91604:"Studio City",91605:"North Hollywood",91606:"North Hollywood",91607:"Valley Village",91608:"Universal City",91609:"North Hollywood",91610:"Toluca Lake",91611:"North Hollywood",91612:"North Hollywood",91614:"Studio City",91615:"North Hollywood",91616:"North Hollywood",91617:"Valley Village",91618:"North Hollywood",91701:"Rancho Cucamonga",91702:"Azusa",91706:"Baldwin Park",91708:"Chino",91709:"Chino Hills",91710:"Chino",91711:"Claremont",91714:"City Of Industry",91715:"City Of Industry",91716:"City Of Industry",91722:"Covina",91723:"Covina",91724:"Covina",91729:"Rancho Cucamonga",91730:"Rancho Cucamonga",91731:"El Monte",91732:"El Monte",91733:"South El Monte",91734:"El Monte",91735:"El Monte",91737:"Rancho Cucamonga",91739:"Rancho Cucamonga",91740:"Glendora",91741:"Glendora",91743:"Guasti",91744:"La Puente",91745:"Hacienda Heights",91746:"La Puente",91747:"La Puente",91748:"Rowland Heights",91749:"La Puente",91750:"La Verne",91752:"Mira Loma",91754:"Monterey Park",91755:"Monterey Park",91756:"Monterey Park",91758:"Ontario",91759:"Mt Baldy",91761:"Ontario",91762:"Ontario",91763:"Montclair",91764:"Ontario",91765:"Diamond Bar",91766:"Pomona",91767:"Pomona",91768:"Pomona",91769:"Pomona",91770:"Rosemead",91771:"Rosemead",91772:"Rosemead",91773:"San Dimas",91775:"San Gabriel",91776:"San Gabriel",91778:"San Gabriel",91780:"Temple City",91784:"Upland",91785:"Upland",91786:"Upland",91788:"Walnut",91789:"Walnut",91790:"West Covina",91791:"West Covina",91792:"West Covina",91793:"West Covina",91795:"Walnut",91797:"Pomona",91798:"Ontario",91799:"Pomona",91801:"Alhambra",91802:"Alhambra",91803:"Alhambra",91804:"Alhambra",91841:"Alhambra",91896:"Alhambra",91899:"Alhambra",91901:"Alpine",91902:"Bonita",91903:"Alpine",91905:"Boulevard",91906:"Campo",91908:"Bonita",91909:"Chula Vista",91910:"Chula Vista",91911:"Chula Vista",91912:"Chula Vista",91913:"Chula Vista",91914:"Chula Vista",91915:"Chula Vista",91916:"Descanso",91917:"Dulzura",91921:"Chula Vista",91931:"Guatay",91932:"Imperial Beach",91933:"Imperial Beach",91934:"Jacumba",91935:"Jamul",91941:"La Mesa",91942:"La Mesa",91943:"La Mesa",91944:"La Mesa",91945:"Lemon Grove",91946:"Lemon Grove",91947:"Lincoln Acres",91948:"Mount Laguna",91950:"National City",91951:"National City",91962:"Pine Valley",91963:"Potrero",91976:"Spring Valley",91977:"Spring Valley",91978:"Spring Valley",91979:"Spring Valley",91980:"Tecate",91987:"Tecate",91990:"Potrero",92003:"Bonsall",92004:"Borrego Springs",92007:"Cardiff By The Sea",92008:"Carlsbad",92009:"Carlsbad",92010:"Carlsbad",92011:"Carlsbad",92013:"Carlsbad",92014:"Del Mar",92018:"Carlsbad",92019:"El Cajon",92020:"El Cajon",92021:"El Cajon",92022:"El Cajon",92023:"Encinitas",92024:"Encinitas",92025:"Escondido",92026:"Escondido",92027:"Escondido",92028:"Fallbrook",92029:"Escondido",92030:"Escondido",92033:"Escondido",92036:"Julian",92037:"La Jolla",92038:"La Jolla",92039:"La Jolla",92040:"Lakeside",92046:"Escondido",92049:"Oceanside",92051:"Oceanside",92052:"Oceanside",92054:"Oceanside",92055:"Camp Pendleton",92056:"Oceanside",92057:"Oceanside",92059:"Pala",92060:"Palomar Mountain",92061:"Pauma Valley",92064:"Poway",92065:"Ramona",92066:"Ranchita",92067:"Rancho Santa Fe",92068:"San Luis Rey",92069:"San Marcos",92070:"Santa Ysabel",92071:"Santee",92072:"Santee",92074:"Poway",92075:"Solana Beach",92078:"San Marcos",92079:"San Marcos",92081:"Vista",92082:"Valley Center",92083:"Vista",92084:"Vista",92085:"Vista",92086:"Warner Springs",92088:"Fallbrook",92090:"El Cajon",92091:"Rancho Santa Fe",92092:"La Jolla",92093:"La Jolla",92096:"San Marcos",92101:"San Diego",92102:"San Diego",92103:"San Diego",92104:"San Diego",92105:"San Diego",92106:"San Diego",92107:"San Diego",92108:"San Diego",92109:"San Diego",92110:"San Diego",92111:"San Diego",92112:"San Diego",92113:"San Diego",92114:"San Diego",92115:"San Diego",92116:"San Diego",92117:"San Diego",92118:"Coronado",92119:"San Diego",92120:"San Diego",92121:"San Diego",92122:"San Diego",92123:"San Diego",92124:"San Diego",92126:"San Diego",92127:"San Diego",92128:"San Diego",92129:"San Diego",92130:"San Diego",92135:"San Diego",92136:"San Diego",92137:"San Diego",92138:"San Diego",92139:"San Diego",92140:"San Diego",92142:"San Diego",92143:"San Ysidro",92145:"San Diego",92147:"San Diego",92149:"San Diego",92150:"San Diego",92152:"San Diego",92153:"San Diego",92154:"San Diego",92155:"San Diego",92158:"San Diego",92159:"San Diego",92160:"San Diego",92161:"San Diego",92162:"San Diego",92163:"San Diego",92164:"San Diego",92165:"San Diego",92166:"San Diego",92167:"San Diego",92168:"San Diego",92173:"San Ysidro",92174:"San Diego",92175:"San Diego",92176:"San Diego",92177:"San Diego",92178:"Coronado",92179:"San Diego",92182:"San Diego",92184:"San Diego",92186:"San Diego",92187:"San Diego",92190:"San Diego",92191:"San Diego",92192:"San Diego",92193:"San Diego",92194:"San Diego",92195:"San Diego",92196:"San Diego",92197:"San Diego",92198:"San Diego",92199:"San Diego",92201:"Indio",92202:"Indio",92203:"Indio",92210:"Indian Wells",92211:"Palm Desert",92220:"Banning",92226:"Blythe",92227:"Brawley",92230:"Cabazon",92231:"Calexico",92232:"Calexico",92233:"Calipatria",92234:"Cathedral City",92235:"Cathedral City",92236:"Coachella",92239:"Desert Center",92240:"Desert Hot Springs",92241:"Desert Hot Springs",92242:"Earp",92243:"El Centro",92244:"El Centro",92247:"La Quinta",92248:"La Quinta",92249:"Heber",92250:"Holtville",92251:"Imperial",92252:"Joshua Tree",92253:"La Quinta",92254:"Mecca",92255:"Palm Desert",92256:"Morongo Valley",92257:"Niland",92258:"North Palm Springs",92259:"Ocotillo",92262:"Palm Springs",92263:"Palm Springs",92264:"Palm Springs",92266:"Palo Verde",92267:"Parker Dam",92268:"Pioneertown",92270:"Rancho Mirage",92273:"Seeley",92274:"Thermal",92275:"Salton City",92276:"Thousand Palms",92277:"Twentynine Palms",92278:"Twentynine Palms",92280:"Vidal",92281:"Westmorland",92282:"White Water",92283:"Winterhaven",92284:"Yucca Valley",92285:"Landers",92286:"Yucca Valley",92292:"Palm Springs",92301:"Adelanto",92304:"Amboy",92305:"Angelus Oaks",92307:"Apple Valley",92308:"Apple Valley",92309:"Baker",92310:"Fort Irwin",92311:"Barstow",92313:"Grand Terrace",92314:"Big Bear City",92315:"Big Bear Lake",92316:"Bloomington",92317:"Blue Jay",92318:"Bryn Mawr",92320:"Calimesa",92321:"Cedar Glen",92322:"Cedarpines Park",92323:"Cima",92324:"Colton",92325:"Crestline",92326:"Crest Park",92327:"Daggett",92328:"Death Valley",92329:"Phelan",92331:"Fontana",92332:"Essex",92333:"Fawnskin",92334:"Fontana",92335:"Fontana",92336:"Fontana",92337:"Fontana",92338:"Ludlow",92339:"Forest Falls",92340:"Hesperia",92341:"Green Valley Lake",92342:"Helendale",92344:"Hesperia",92345:"Hesperia",92346:"Highland",92347:"Hinkley",92350:"Loma Linda",92352:"Lake Arrowhead",92354:"Loma Linda",92356:"Lucerne Valley",92357:"Loma Linda",92358:"Lytle Creek",92359:"Mentone",92363:"Needles",92364:"Nipton",92365:"Newberry Springs",92366:"Mountain Pass",92368:"Oro Grande",92369:"Patton",92371:"Phelan",92372:"Pinon Hills",92373:"Redlands",92374:"Redlands",92375:"Redlands",92376:"Rialto",92377:"Rialto",92378:"Rimforest",92382:"Running Springs",92384:"Shoshone",92385:"Skyforest",92386:"Sugarloaf",92389:"Tecopa",92391:"Twin Peaks",92392:"Victorville",92393:"Victorville",92394:"Victorville",92395:"Victorville",92397:"Wrightwood",92398:"Yermo",92399:"Yucaipa",92401:"San Bernardino",92402:"San Bernardino",92403:"San Bernardino",92404:"San Bernardino",92405:"San Bernardino",92406:"San Bernardino",92407:"San Bernardino",92408:"San Bernardino",92410:"San Bernardino",92411:"San Bernardino",92412:"San Bernardino",92413:"San Bernardino",92414:"San Bernardino",92415:"San Bernardino",92418:"San Bernardino",92423:"San Bernardino",92424:"San Bernardino",92427:"San Bernardino",92501:"Riverside",92502:"Riverside",92503:"Riverside",92504:"Riverside",92505:"Riverside",92506:"Riverside",92507:"Riverside",92508:"Riverside",92509:"Riverside",92513:"Riverside",92514:"Riverside",92515:"Riverside",92516:"Riverside",92517:"Riverside",92518:"March Air Reserve Base",92519:"Riverside",92521:"Riverside",92522:"Riverside",92530:"Lake Elsinore",92531:"Lake Elsinore",92532:"Lake Elsinore",92536:"Aguanga",92539:"Anza",92543:"Hemet",92544:"Hemet",92545:"Hemet",92546:"Hemet",92548:"Homeland",92549:"Idyllwild",92551:"Moreno Valley",92552:"Moreno Valley",92553:"Moreno Valley",92554:"Moreno Valley",92555:"Moreno Valley",92556:"Moreno Valley",92557:"Moreno Valley",92561:"Mountain Center",92562:"Murrieta",92563:"Murrieta",92564:"Murrieta",92567:"Nuevo",92570:"Perris",92571:"Perris",92572:"Perris",92581:"San Jacinto",92582:"San Jacinto",92583:"San Jacinto",92584:"Menifee",92585:"Sun City",92586:"Sun City",92587:"Sun City",92589:"Temecula",92590:"Temecula",92591:"Temecula",92592:"Temecula",92593:"Temecula",92595:"Wildomar",92596:"Winchester",92599:"Perris",92602:"Irvine",92603:"Irvine",92604:"Irvine",92605:"Huntington Beach",92606:"Irvine",92607:"Laguna Niguel",92609:"El Toro",92610:"Foothill Ranch",92612:"Irvine",92614:"Irvine",92615:"Huntington Beach",92616:"Irvine",92617:"Irvine",92618:"Irvine",92619:"Irvine",92620:"Irvine",92623:"Irvine",92624:"Capistrano Beach",92625:"Corona Del Mar",92626:"Costa Mesa",92627:"Costa Mesa",92628:"Costa Mesa",92629:"Dana Point",92630:"Lake Forest",92637:"Laguna Woods",92646:"Huntington Beach",92647:"Huntington Beach",92648:"Huntington Beach",92649:"Huntington Beach",92650:"East Irvine",92651:"Laguna Beach",92652:"Laguna Beach",92653:"Laguna Hills",92654:"Laguna Hills",92655:"Midway City",92656:"Aliso Viejo",92657:"Newport Coast",92658:"Newport Beach",92659:"Newport Beach",92660:"Newport Beach",92661:"Newport Beach",92662:"Newport Beach",92663:"Newport Beach",92672:"San Clemente",92673:"San Clemente",92674:"San Clemente",92675:"San Juan Capistrano",92676:"Silverado",92677:"Laguna Niguel",92678:"Trabuco Canyon",92679:"Trabuco Canyon",92683:"Westminster",92684:"Westminster",92685:"Westminster",92688:"Rancho Santa Margarita",92690:"Mission Viejo",92691:"Mission Viejo",92692:"Mission Viejo",92693:"San Juan Capistrano",92694:"Ladera Ranch",92697:"Irvine",92698:"Aliso Viejo",92701:"Santa Ana",92702:"Santa Ana",92703:"Santa Ana",92704:"Santa Ana",92705:"Santa Ana",92706:"Santa Ana",92707:"Santa Ana",92708:"Fountain Valley",92709:"Irvine",92710:"Irvine",92711:"Santa Ana",92712:"Santa Ana",92725:"Santa Ana",92728:"Fountain Valley",92735:"Santa Ana",92780:"Tustin",92781:"Tustin",92782:"Tustin",92799:"Santa Ana",92801:"Anaheim",92802:"Anaheim",92803:"Anaheim",92804:"Anaheim",92805:"Anaheim",92806:"Anaheim",92807:"Anaheim",92808:"Anaheim",92809:"Anaheim",92811:"Atwood",92812:"Anaheim",92814:"Anaheim",92815:"Anaheim",92816:"Anaheim",92817:"Anaheim",92821:"Brea",92822:"Brea",92823:"Brea",92825:"Anaheim",92831:"Fullerton",92832:"Fullerton",92833:"Fullerton",92834:"Fullerton",92835:"Fullerton",92836:"Fullerton",92837:"Fullerton",92838:"Fullerton",92840:"Garden Grove",92841:"Garden Grove",92842:"Garden Grove",92843:"Garden Grove",92844:"Garden Grove",92845:"Garden Grove",92846:"Garden Grove",92850:"Anaheim",92856:"Orange",92857:"Orange",92859:"Orange",92860:"Norco",92861:"Villa Park",92862:"Orange",92863:"Orange",92864:"Orange",92865:"Orange",92866:"Orange",92867:"Orange",92868:"Orange",92869:"Orange",92870:"Placentia",92871:"Placentia",92877:"Corona",92878:"Corona",92879:"Corona",92880:"Corona",92881:"Corona",92882:"Corona",92883:"Corona",92885:"Yorba Linda",92886:"Yorba Linda",92887:"Yorba Linda",92899:"Anaheim",93001:"Ventura",93002:"Ventura",93003:"Ventura",93004:"Ventura",93005:"Ventura",93006:"Ventura",93007:"Ventura",93009:"Ventura",93010:"Camarillo",93011:"Camarillo",93012:"Camarillo",93013:"Carpinteria",93014:"Carpinteria",93015:"Fillmore",93016:"Fillmore",93020:"Moorpark",93021:"Moorpark",93022:"Oak View",93023:"Ojai",93024:"Ojai",93030:"Oxnard",93031:"Oxnard",93032:"Oxnard",93033:"Oxnard",93034:"Oxnard",93035:"Oxnard",93036:"Oxnard",93040:"Piru",93041:"Port Hueneme",93042:"Point Mugu Nawc",93043:"Port Hueneme Cbc Base",93044:"Port Hueneme",93060:"Santa Paula",93061:"Santa Paula",93062:"Simi Valley",93063:"Simi Valley",93064:"Brandeis",93065:"Simi Valley",93066:"Somis",93067:"Summerland",93093:"Simi Valley",93094:"Simi Valley",93099:"Simi Valley",93101:"Santa Barbara",93102:"Santa Barbara",93103:"Santa Barbara",93105:"Santa Barbara",93106:"Santa Barbara",93107:"Santa Barbara",93108:"Santa Barbara",93109:"Santa Barbara",93110:"Santa Barbara",93111:"Santa Barbara",93116:"Goleta",93117:"Goleta",93118:"Goleta",93120:"Santa Barbara",93121:"Santa Barbara",93130:"Santa Barbara",93140:"Santa Barbara",93150:"Santa Barbara",93160:"Santa Barbara",93190:"Santa Barbara",93199:"Goleta",93201:"Alpaugh",93202:"Armona",93203:"Arvin",93204:"Avenal",93205:"Bodfish",93206:"Buttonwillow",93207:"California Hot Springs",93208:"Camp Nelson",93210:"Coalinga",93212:"Corcoran",93215:"Delano",93216:"Delano",93218:"Ducor",93219:"Earlimart",93220:"Edison",93221:"Exeter",93222:"Frazier Park",93223:"Farmersville",93224:"Fellows",93225:"Frazier Park",93226:"Glennville",93227:"Goshen",93230:"Hanford",93232:"Hanford",93234:"Huron",93235:"Ivanhoe",93237:"Kaweah",93238:"Kernville",93239:"Kettleman City",93240:"Lake Isabella",93241:"Lamont",93242:"Laton",93243:"Lebec",93244:"Lemon Cove",93245:"Lemoore",93246:"Lemoore",93247:"Lindsay",93249:"Lost Hills",93250:"Mc Farland",93251:"Mc Kittrick",93252:"Maricopa",93254:"New Cuyama",93255:"Onyx",93256:"Pixley",93257:"Porterville",93258:"Porterville",93260:"Posey",93261:"Richgrove",93262:"Sequoia National Park",93263:"Shafter",93265:"Springville",93266:"Stratford",93267:"Strathmore",93268:"Taft",93270:"Terra Bella",93271:"Three Rivers",93272:"Tipton",93274:"Tulare",93275:"Tulare",93276:"Tupman",93277:"Visalia",93278:"Visalia",93279:"Visalia",93280:"Wasco",93282:"Waukena",93283:"Weldon",93285:"Wofford Heights",93286:"Woodlake",93287:"Woody",93290:"Visalia",93291:"Visalia",93292:"Visalia",93301:"Bakersfield",93302:"Bakersfield",93303:"Bakersfield",93304:"Bakersfield",93305:"Bakersfield",93306:"Bakersfield",93307:"Bakersfield",93308:"Bakersfield",93309:"Bakersfield",93311:"Bakersfield",93312:"Bakersfield",93313:"Bakersfield",93314:"Bakersfield",93380:"Bakersfield",93381:"Bakersfield",93382:"Bakersfield",93383:"Bakersfield",93384:"Bakersfield",93385:"Bakersfield",93386:"Bakersfield",93387:"Bakersfield",93388:"Bakersfield",93389:"Bakersfield",93390:"Bakersfield",93401:"San Luis Obispo",93402:"Los Osos",93403:"San Luis Obispo",93405:"San Luis Obispo",93406:"San Luis Obispo",93407:"San Luis Obispo",93408:"San Luis Obispo",93409:"San Luis Obispo",93410:"San Luis Obispo",93412:"Los Osos",93420:"Arroyo Grande",93421:"Arroyo Grande",93422:"Atascadero",93423:"Atascadero",93424:"Avila Beach",93426:"Bradley",93427:"Buellton",93428:"Cambria",93429:"Casmalia",93430:"Cayucos",93432:"Creston",93433:"Grover Beach",93434:"Guadalupe",93435:"Harmony",93436:"Lompoc",93437:"Lompoc",93438:"Lompoc",93440:"Los Alamos",93441:"Los Olivos",93442:"Morro Bay",93443:"Morro Bay",93444:"Nipomo",93445:"Oceano",93446:"Paso Robles",93447:"Paso Robles",93448:"Pismo Beach",93449:"Pismo Beach",93450:"San Ardo",93451:"San Miguel",93452:"San Simeon",93453:"Santa Margarita",93454:"Santa Maria",93455:"Santa Maria",93456:"Santa Maria",93457:"Santa Maria",93458:"Santa Maria",93460:"Santa Ynez",93461:"Shandon",93463:"Solvang",93464:"Solvang",93465:"Templeton",93475:"Oceano",93483:"Grover Beach",93501:"Mojave",93502:"Mojave",93504:"California City",93505:"California City",93510:"Acton",93512:"Benton",93513:"Big Pine",93514:"Bishop",93515:"Bishop",93516:"Boron",93517:"Bridgeport",93518:"Caliente",93519:"Cantil",93522:"Darwin",93523:"Edwards",93524:"Edwards",93526:"Independence",93527:"Inyokern",93528:"Johannesburg",93529:"June Lake",93530:"Keeler",93531:"Keene",93532:"Lake Hughes",93534:"Lancaster",93535:"Lancaster",93536:"Lancaster",93539:"Lancaster",93541:"Lee Vining",93542:"Little Lake",93543:"Littlerock",93544:"Llano",93545:"Lone Pine",93546:"Mammoth Lakes",93549:"Olancha",93550:"Palmdale",93551:"Palmdale",93552:"Palmdale",93553:"Pearblossom",93554:"Randsburg",93555:"Ridgecrest",93556:"Ridgecrest",93558:"Red Mountain",93560:"Rosamond",93561:"Tehachapi",93562:"Trona",93563:"Valyermo",93581:"Tehachapi",93584:"Lancaster",93586:"Lancaster",93590:"Palmdale",93591:"Palmdale",93592:"Trona",93596:"Boron",93599:"Palmdale",93601:"Ahwahnee",93602:"Auberry",93603:"Badger",93604:"Bass Lake",93605:"Big Creek",93606:"Biola",93607:"Burrel",93608:"Cantua Creek",93609:"Caruthers",93610:"Chowchilla",93611:"Clovis",93612:"Clovis",93613:"Clovis",93614:"Coarsegold",93615:"Cutler",93616:"Del Rey",93618:"Dinuba",93619:"Clovis",93620:"Dos Palos",93621:"Dunlap",93622:"Firebaugh",93623:"Fish Camp",93624:"Five Points",93625:"Fowler",93626:"Friant",93627:"Helm",93628:"Hume",93630:"Kerman",93631:"Kingsburg",93633:"Kings Canyon National Pk",93634:"Lakeshore",93635:"Los Banos",93636:"Madera",93637:"Madera",93638:"Madera",93639:"Madera",93640:"Mendota",93641:"Miramonte",93642:"Mono Hot Springs",93643:"North Fork",93644:"Oakhurst",93645:"O Neals",93646:"Orange Cove",93647:"Orosi",93648:"Parlier",93649:"Piedra",93650:"Fresno",93651:"Prather",93652:"Raisin City",93653:"Raymond",93654:"Reedley",93656:"Riverdale",93657:"Sanger",93660:"San Joaquin",93661:"Santa Rita Park",93662:"Selma",93664:"Shaver Lake",93665:"South Dos Palos",93666:"Sultana",93667:"Tollhouse",93668:"Tranquillity",93669:"Wishon",93670:"Yettem",93673:"Traver",93675:"Squaw Valley",93701:"Fresno",93702:"Fresno",93710:"Fresno",93711:"Fresno",93712:"Fresno",93714:"Fresno",93715:"Fresno",93716:"Fresno",93717:"Fresno",93718:"Fresno",93720:"Fresno",93721:"Fresno",93722:"Fresno",93723:"Fresno",93724:"Fresno",93725:"Fresno",93726:"Fresno",93727:"Fresno",93728:"Fresno",93729:"Fresno",93730:"Fresno",93740:"Fresno",93741:"Fresno",93744:"Fresno",93745:"Fresno",93747:"Fresno",93772:"Fresno",93773:"Fresno",93774:"Fresno",93775:"Fresno",93776:"Fresno",93777:"Fresno",93778:"Fresno",93779:"Fresno",93780:"Fresno",93784:"Fresno",93786:"Fresno",93790:"Fresno",93791:"Fresno",93792:"Fresno",93793:"Fresno",93794:"Fresno",93844:"Fresno",93888:"Fresno",93901:"Salinas",93902:"Salinas",93905:"Salinas",93906:"Salinas",93907:"Salinas",93908:"Salinas",93924:"Carmel Valley",93925:"Chualar",93926:"Gonzales",93927:"Greenfield",93928:"Jolon",93930:"King City",93932:"Lockwood",93933:"Marina",93940:"Monterey",93942:"Monterey",93943:"Monterey",93944:"Monterey",93950:"Pacific Grove",93953:"Pebble Beach",93954:"San Lucas",93955:"Seaside",93960:"Soledad",93962:"Spreckels",94002:"Belmont",94005:"Brisbane",94010:"Burlingame",94011:"Burlingame",94013:"Daly City",94014:"Daly City",94015:"Daly City",94021:"Loma Mar",94022:"Los Altos",94023:"Los Altos",94024:"Los Altos",94025:"Menlo Park",94026:"Menlo Park",94027:"Atherton",94028:"Portola Valley",94030:"Millbrae",94035:"Mountain View",94037:"Montara",94038:"Moss Beach",94039:"Mountain View",94040:"Mountain View",94041:"Mountain View",94042:"Mountain View",94043:"Mountain View",94044:"Pacifica",94060:"Pescadero",94061:"Redwood City",94062:"Redwood City",94063:"Redwood City",94064:"Redwood City",94065:"Redwood City",94066:"San Bruno",94070:"San Carlos",94086:"Sunnyvale",94087:"Sunnyvale",94088:"Sunnyvale",94089:"Sunnyvale",94096:"San Bruno",94098:"San Bruno",94101:"San Francisco",94102:"San Francisco",94103:"San Francisco",94104:"San Francisco",94105:"San Francisco",94106:"San Francisco",94107:"San Francisco",94108:"San Francisco",94109:"San Francisco",94110:"San Francisco",94111:"San Francisco",94112:"San Francisco",94114:"San Francisco",94115:"San Francisco",94116:"San Francisco",94117:"San Francisco",94118:"San Francisco",94119:"San Francisco",94120:"San Francisco",94121:"San Francisco",94122:"San Francisco",94128:"San Francisco",94129:"San Francisco",94130:"San Francisco",94131:"San Francisco",94132:"San Francisco",94133:"San Francisco",94134:"San Francisco",94135:"San Francisco",94136:"San Francisco",94137:"San Francisco",94138:"San Francisco",94139:"San Francisco",94140:"San Francisco",94141:"San Francisco",94142:"San Francisco",94143:"San Francisco",94144:"San Francisco",94145:"San Francisco",94146:"San Francisco",94147:"San Francisco",94150:"San Francisco",94151:"San Francisco",94152:"San Francisco",94153:"San Francisco",94154:"San Francisco",94155:"San Francisco",94161:"San Francisco",94162:"San Francisco",94163:"San Francisco",94164:"San Francisco",94165:"San Francisco",94166:"San Francisco",94167:"San Francisco",94168:"San Francisco",94169:"San Francisco",94170:"San Francisco",94171:"San Francisco",94172:"San Francisco",94175:"San Francisco",94177:"San Francisco",94188:"San Francisco",94199:"San Francisco",94203:"Sacramento",94204:"Sacramento",94205:"Sacramento",94206:"Sacramento",94207:"Sacramento",94208:"Sacramento",94209:"Sacramento",94211:"Sacramento",94229:"Sacramento",94230:"Sacramento",94244:"Sacramento",94245:"Sacramento",94246:"Sacramento",94247:"Sacramento",94248:"Sacramento",94249:"Sacramento",94250:"Sacramento",94252:"Sacramento",94254:"Sacramento",94256:"Sacramento",94257:"Sacramento",94258:"Sacramento",94259:"Sacramento",94261:"Sacramento",94262:"Sacramento",94263:"Sacramento",94267:"Sacramento",94268:"Sacramento",94269:"Sacramento",94271:"Sacramento",94273:"Sacramento",94274:"Sacramento",94277:"Sacramento",94278:"Sacramento",94287:"Sacramento",94288:"Sacramento",94289:"Sacramento",94290:"Sacramento",94291:"Sacramento",94293:"Sacramento",94294:"Sacramento",94295:"Sacramento",94296:"Sacramento",94297:"Sacramento",94298:"Sacramento",94299:"Sacramento",94301:"Palo Alto",94302:"Palo Alto",94303:"Palo Alto",94304:"Palo Alto",94305:"Stanford",94306:"Palo Alto",94309:"Palo Alto",94401:"San Mateo",94402:"San Mateo",94403:"San Mateo",94404:"San Mateo",94497:"San Mateo",94509:"Antioch",94510:"Benicia",94511:"Bethel Island",94512:"Birds Landing",94513:"Brentwood",94514:"Byron",94515:"Calistoga",94516:"Canyon",94517:"Clayton",94518:"Concord",94519:"Concord",94520:"Concord",94521:"Concord",94522:"Concord",94523:"Pleasant Hill",94524:"Concord",94525:"Crockett",94526:"Danville",94527:"Concord",94528:"Diablo",94529:"Concord",94530:"El Cerrito",94531:"Antioch",94533:"Fairfield",94534:"Fairfield",94540:"Hayward",94541:"Hayward",94542:"Hayward",94543:"Hayward",94544:"Hayward",94545:"Hayward",94546:"Castro Valley",94547:"Hercules",94548:"Knightsen",94549:"Lafayette",94550:"Livermore",94551:"Livermore",94552:"Castro Valley",94553:"Martinez",94555:"Fremont",94556:"Moraga",94557:"Hayward",94558:"Napa",94559:"Napa",94560:"Newark",94561:"Oakley",94562:"Oakville",94563:"Orinda",94564:"Pinole",94565:"Pittsburg",94566:"Pleasanton",94571:"Rio Vista",94572:"Rodeo",94573:"Rutherford",94574:"Saint Helena",94575:"Moraga",94576:"Deer Park",94577:"San Leandro",94578:"San Leandro",94579:"San Leandro",94580:"San Lorenzo",94581:"Napa",94582:"San Ramon",94583:"San Ramon",94585:"Suisun City",94586:"Sunol",94587:"Union City",94588:"Pleasanton",94589:"Vallejo",94590:"Vallejo",94591:"Vallejo",94592:"Vallejo",94595:"Walnut Creek",94596:"Walnut Creek",94597:"Walnut Creek",94598:"Walnut Creek",94599:"Yountville",94601:"Oakland",94605:"Oakland",94606:"Oakland",94607:"Oakland",94608:"Emeryville",94609:"Oakland",94610:"Oakland",94611:"Oakland",94612:"Oakland",94613:"Oakland",94614:"Oakland",94615:"Oakland",94617:"Oakland",94618:"Oakland",94619:"Oakland",94620:"Piedmont",94621:"Oakland",94622:"Oakland",94623:"Oakland",94624:"Oakland",94625:"Oakland",94649:"Oakland",94659:"Oakland",94660:"Oakland",94661:"Oakland",94662:"Emeryville",94666:"Oakland",94701:"Berkeley",94702:"Berkeley",94705:"Berkeley",94706:"Albany",94707:"Berkeley",94708:"Berkeley",94709:"Berkeley",94710:"Berkeley",94712:"Berkeley",94720:"Berkeley",94801:"Richmond",94802:"Richmond",94803:"El Sobrante",94804:"Richmond",94805:"Richmond",94806:"San Pablo",94807:"Richmond",94808:"Richmond",94820:"El Sobrante",94850:"Richmond",94901:"San Rafael",94903:"San Rafael",94904:"Greenbrae",94912:"San Rafael",94913:"San Rafael",94914:"Kentfield",94915:"San Rafael",94920:"Belvedere Tiburon",94922:"Bodega",94923:"Bodega Bay",94924:"Bolinas",94926:"Cotati",94927:"Rohnert Park",94928:"Rohnert Park",94929:"Dillon Beach",94930:"Fairfax",94931:"Cotati",94933:"Forest Knolls",94937:"Inverness",94938:"Lagunitas",94939:"Larkspur",94940:"Marshall",94941:"Mill Valley",94942:"Mill Valley",94945:"Novato",94946:"Nicasio",94947:"Novato",94948:"Novato",94949:"Novato",94950:"Olema",94951:"Penngrove",94952:"Petaluma",94953:"Petaluma",94954:"Petaluma",94955:"Petaluma",94956:"Point Reyes Station",94957:"Ross",94960:"San Anselmo",94963:"San Geronimo",94964:"San Quentin",94965:"Sausalito",94966:"Sausalito",94970:"Stinson Beach",94971:"Tomales",94972:"Valley Ford",94973:"Woodacre",94974:"San Quentin",94975:"Petaluma",94976:"Corte Madera",94977:"Larkspur",94978:"Fairfax",94979:"San Anselmo",94998:"Novato",94999:"Petaluma",95001:"Aptos",95002:"Alviso",95003:"Aptos",95004:"Aromas",95005:"Ben Lomond",95006:"Boulder Creek",95007:"Brookdale",95008:"Campbell",95009:"Campbell",95010:"Capitola",95011:"Campbell",95012:"Castroville",95013:"Coyote",95014:"Cupertino",95015:"Cupertino",95017:"Davenport",95018:"Felton",95019:"Freedom",95020:"Gilroy",95021:"Gilroy",95023:"Hollister",95024:"Hollister",95026:"Holy City",95030:"Los Gatos",95031:"Los Gatos",95032:"Los Gatos",95033:"Los Gatos",95035:"Milpitas",95036:"Milpitas",95037:"Morgan Hill",95038:"Morgan Hill",95039:"Moss Landing",95041:"Mount Hermon",95042:"New Almaden",95043:"Paicines",95044:"Redwood Estates",95045:"San Juan Bautista",95046:"San Martin",95050:"Santa Clara",95051:"Santa Clara",95052:"Santa Clara",95053:"Santa Clara",95054:"Santa Clara",95055:"Santa Clara",95056:"Santa Clara",95060:"Santa Cruz",95061:"Santa Cruz",95062:"Santa Cruz",95063:"Santa Cruz",95064:"Santa Cruz",95065:"Santa Cruz",95066:"Scotts Valley",95067:"Scotts Valley",95070:"Saratoga",95071:"Saratoga",95073:"Soquel",95075:"Tres Pinos",95076:"Watsonville",95077:"Watsonville",95101:"San Jose",95103:"San Jose",95106:"San Jose",95108:"San Jose",95109:"San Jose",95110:"San Jose",95111:"San Jose",95112:"San Jose",95113:"San Jose",95115:"San Jose",95116:"San Jose",95117:"San Jose",95118:"San Jose",95119:"San Jose",95120:"San Jose",95121:"San Jose",95122:"San Jose",95123:"San Jose",95124:"San Jose",95125:"San Jose",95126:"San Jose",95133:"San Jose",95134:"San Jose",95135:"San Jose",95136:"San Jose",95138:"San Jose",95139:"San Jose",95140:"Mount Hamilton",95141:"San Jose",95148:"San Jose",95150:"San Jose",95151:"San Jose",95152:"San Jose",95153:"San Jose",95154:"San Jose",95155:"San Jose",95156:"San Jose",95157:"San Jose",95158:"San Jose",95159:"San Jose",95160:"San Jose",95161:"San Jose",95164:"San Jose",95170:"San Jose",95172:"San Jose",95173:"San Jose",95201:"Stockton",95202:"Stockton",95203:"Stockton",95204:"Stockton",95205:"Stockton",95206:"Stockton",95207:"Stockton",95208:"Stockton",95209:"Stockton",95210:"Stockton",95211:"Stockton",95212:"Stockton",95213:"Stockton",95215:"Stockton",95219:"Stockton",95220:"Acampo",95221:"Altaville",95222:"Angels Camp",95223:"Arnold",95224:"Avery",95225:"Burson",95226:"Campo Seco",95227:"Clements",95228:"Copperopolis",95229:"Douglas Flat",95236:"Linden",95237:"Lockeford",95240:"Lodi",95241:"Lodi",95242:"Lodi",95245:"Mokelumne Hill",95246:"Mountain Ranch",95247:"Murphys",95248:"Rail Road Flat",95249:"San Andreas",95250:"Sheep Ranch",95251:"Vallecito",95252:"Valley Springs",95253:"Victor",95254:"Wallace",95255:"West Point",95257:"Wilseyville",95258:"Woodbridge",95267:"Stockton",95269:"Stockton",95296:"Stockton",95297:"Stockton",95301:"Atwater",95303:"Ballico",95304:"Tracy",95305:"Big Oak Flat",95311:"Coulterville",95312:"Cressey",95313:"Crows Landing",95314:"Dardanelle",95315:"Delhi",95316:"Denair",95317:"El Nido",95318:"El Portal",95319:"Empire",95320:"Escalon",95321:"Groveland",95322:"Gustine",95323:"Hickman",95324:"Hilmar",95325:"Hornitos",95326:"Hughson",95327:"Jamestown",95328:"Keyes",95329:"La Grange",95330:"Lathrop",95333:"Le Grand",95334:"Livingston",95335:"Long Barn",95336:"Manteca",95337:"Manteca",95338:"Mariposa",95340:"Merced",95345:"Midpines",95346:"Mi Wuk Village",95347:"Moccasin",95348:"Merced",95350:"Modesto",95351:"Modesto",95352:"Modesto",95353:"Modesto",95354:"Modesto",95355:"Modesto",95356:"Modesto",95357:"Modesto",95358:"Modesto",95360:"Newman",95361:"Oakdale",95363:"Patterson",95364:"Pinecrest",95365:"Planada",95366:"Ripon",95367:"Riverbank",95368:"Salida",95369:"Snelling",95370:"Sonora",95372:"Soulsbyville",95373:"Standard",95374:"Stevinson",95375:"Strawberry",95376:"Tracy",95379:"Tuolumne",95380:"Turlock",95381:"Turlock",95382:"Turlock",95383:"Twain Harte",95385:"Vernalis",95386:"Waterford",95387:"Westley",95388:"Winton",95389:"Yosemite National Park",95391:"Tracy",95397:"Modesto",95401:"Santa Rosa",95402:"Santa Rosa",95403:"Santa Rosa",95404:"Santa Rosa",95405:"Santa Rosa",95406:"Santa Rosa",95407:"Santa Rosa",95408:"Santa Rosa",95409:"Santa Rosa",95410:"Albion",95412:"Annapolis",95415:"Boonville",95416:"Boyes Hot Springs",95417:"Branscomb",95418:"Calpella",95419:"Camp Meeker",95420:"Caspar",95422:"Clearlake",95423:"Clearlake Oaks",95424:"Clearlake Park",95425:"Cloverdale",95426:"Cobb",95427:"Comptche",95428:"Covelo",95429:"Dos Rios",95430:"Duncans Mills",95431:"Eldridge",95432:"Elk",95433:"El Verano",95435:"Finley",95436:"Forestville",95437:"Fort Bragg",95439:"Fulton",95441:"Geyserville",95442:"Glen Ellen",95443:"Glenhaven",95444:"Graton",95445:"Gualala",95446:"Guerneville",95448:"Healdsburg",95449:"Hopland",95450:"Jenner",95451:"Kelseyville",95452:"Kenwood",95453:"Lakeport",95454:"Laytonville",95456:"Littleriver",95457:"Lower Lake",95458:"Lucerne",95459:"Manchester",95460:"Mendocino",95461:"Middletown",95462:"Monte Rio",95463:"Navarro",95464:"Nice",95465:"Occidental",95466:"Philo",95467:"Hidden Valley Lake",95468:"Point Arena",95469:"Potter Valley",95470:"Redwood Valley",95471:"Rio Nido",95472:"Sebastopol",95473:"Sebastopol",95476:"Sonoma",95480:"Stewarts Point",95481:"Talmage",95482:"Ukiah",95485:"Upper Lake",95486:"Villa Grande",95487:"Vineburg",95488:"Westport",95490:"Willits",95492:"Windsor",95493:"Witter Springs",95494:"Yorkville",95497:"The Sea Ranch",95501:"Eureka",95502:"Eureka",95503:"Eureka",95511:"Alderpoint",95514:"Blocksburg",95518:"Arcata",95519:"Mckinleyville",95521:"Arcata",95524:"Bayside",95525:"Blue Lake",95526:"Bridgeville",95527:"Burnt Ranch",95528:"Carlotta",95531:"Crescent City",95532:"Crescent City",95534:"Cutten",95536:"Ferndale",95537:"Fields Landing",95538:"Fort Dick",95540:"Fortuna",95542:"Garberville",95543:"Gasquet",95545:"Honeydew",95546:"Hoopa",95547:"Hydesville",95548:"Klamath",95549:"Kneeland",95550:"Korbel",95551:"Loleta",95552:"Mad River",95553:"Miranda",95554:"Myers Flat",95555:"Orick",95556:"Orleans",95558:"Petrolia",95559:"Phillipsville",95560:"Redway",95562:"Rio Dell",95563:"Salyer",95564:"Samoa",95565:"Scotia",95567:"Smith River",95568:"Somes Bar",95569:"Redcrest",95570:"Trinidad",95571:"Weott",95573:"Willow Creek",95585:"Leggett",95587:"Piercy",95589:"Whitethorn",95595:"Zenia",95601:"Amador City",95602:"Auburn",95603:"Auburn",95604:"Auburn",95605:"West Sacramento",95606:"Brooks",95607:"Capay",95608:"Carmichael",95609:"Carmichael",95610:"Citrus Heights",95611:"Citrus Heights",95612:"Clarksburg",95613:"Coloma",95614:"Cool",95615:"Courtland",95616:"Davis",95617:"Davis",95618:"Davis",95619:"Diamond Springs",95620:"Dixon",95621:"Citrus Heights",95623:"El Dorado",95624:"Elk Grove",95625:"Elmira",95626:"Elverta",95627:"Esparto",95628:"Fair Oaks",95629:"Fiddletown",95630:"Folsom",95631:"Foresthill",95632:"Galt",95633:"Garden Valley",95634:"Georgetown",95635:"Greenwood",95636:"Grizzly Flats",95637:"Guinda",95638:"Herald",95639:"Hood",95640:"Ione",95641:"Isleton",95642:"Jackson",95644:"Kit Carson",95645:"Knights Landing",95646:"Kirkwood",95648:"Lincoln",95650:"Loomis",95651:"Lotus",95652:"Mcclellan",95653:"Madison",95654:"Martell",95655:"Mather",95656:"Mount Aukum",95658:"Newcastle",95659:"Nicolaus",95660:"North Highlands",95661:"Roseville",95662:"Orangevale",95663:"Penryn",95664:"Pilot Hill",95665:"Pine Grove",95666:"Pioneer",95667:"Placerville",95668:"Pleasant Grove",95669:"Plymouth",95670:"Rancho Cordova",95671:"Represa",95672:"Rescue",95673:"Rio Linda",95674:"Rio Oso",95675:"River Pines",95676:"Robbins",95677:"Rocklin",95678:"Roseville",95679:"Rumsey",95680:"Ryde",95681:"Sheridan",95682:"Shingle Springs",95683:"Sloughhouse",95684:"Somerset",95685:"Sutter Creek",95686:"Thornton",95687:"Vacaville",95688:"Vacaville",95689:"Volcano",95690:"Walnut Grove",95691:"West Sacramento",95692:"Wheatland",95693:"Wilton",95694:"Winters",95695:"Woodland",95696:"Vacaville",95697:"Yolo",95698:"Zamora",95699:"Drytown",95701:"Alta",95703:"Applegate",95709:"Camino",95712:"Chicago Park",95713:"Colfax",95714:"Dutch Flat",95715:"Emigrant Gap",95717:"Gold Run",95720:"Kyburz",95721:"Echo Lake",95722:"Meadow Vista",95724:"Norden",95726:"Pollock Pines",95728:"Soda Springs",95735:"Twin Bridges",95736:"Weimar",95741:"Rancho Cordova",95742:"Rancho Cordova",95746:"Granite Bay",95747:"Roseville",95757:"Elk Grove",95758:"Elk Grove",95759:"Elk Grove",95762:"El Dorado Hills",95763:"Folsom",95765:"Rocklin",95776:"Woodland",95798:"West Sacramento",95799:"West Sacramento",95812:"Sacramento",95813:"Sacramento",95814:"Sacramento",95815:"Sacramento",95816:"Sacramento",95817:"Sacramento",95818:"Sacramento",95819:"Sacramento",95820:"Sacramento",95821:"Sacramento",95822:"Sacramento",95823:"Sacramento",95824:"Sacramento",95825:"Sacramento",95826:"Sacramento",95827:"Sacramento",95828:"Sacramento",95829:"Sacramento",95830:"Sacramento",95831:"Sacramento",95832:"Sacramento",95833:"Sacramento",95834:"Sacramento",95835:"Sacramento",95836:"Sacramento",95837:"Sacramento",95838:"Sacramento",95840:"Sacramento",95841:"Sacramento",95842:"Sacramento",95843:"Antelope",95851:"Sacramento",95852:"Sacramento",95853:"Sacramento",95860:"Sacramento",95864:"Sacramento",95865:"Sacramento",95866:"Sacramento",95867:"Sacramento",95887:"Sacramento",95894:"Sacramento",95899:"Sacramento",95901:"Marysville",95903:"Beale Afb",95910:"Alleghany",95912:"Arbuckle",95913:"Artois",95914:"Bangor",95915:"Belden",95916:"Berry Creek",95917:"Biggs",95918:"Browns Valley",95919:"Brownsville",95920:"Butte City",95922:"Camptonville",95923:"Canyon Dam",95924:"Cedar Ridge",95925:"Challenge",95926:"Chico",95927:"Chico",95928:"Chico",95929:"Chico",95930:"Clipper Mills",95932:"Colusa",95934:"Crescent Mills",95935:"Dobbins",95936:"Downieville",95937:"Dunnigan",95938:"Durham",95939:"Elk Creek",95940:"Feather Falls",95941:"Forbestown",95942:"Forest Ranch",95943:"Glenn",95944:"Goodyears Bar",95945:"Grass Valley",95946:"Penn Valley",95947:"Greenville",95948:"Gridley",95949:"Grass Valley",95950:"Grimes",95951:"Hamilton City",95953:"Live Oak",95954:"Magalia",95955:"Maxwell",95956:"Meadow Valley",95957:"Meridian",95958:"Nelson",95959:"Nevada City",95960:"North San Juan",95961:"Olivehurst",95962:"Oregon House",95963:"Orland",95965:"Oroville",95966:"Oroville",95967:"Paradise",95968:"Palermo",95969:"Paradise",95970:"Princeton",95971:"Quincy",95972:"Rackerby",95973:"Chico",95974:"Richvale",95975:"Rough And Ready",95976:"Chico",95977:"Smartville",95978:"Stirling City",95979:"Stonyford",95980:"Storrie",95981:"Strawberry Valley",95982:"Sutter",95983:"Taylorsville",95984:"Twain",95986:"Washington",95987:"Williams",95988:"Willows",95991:"Yuba City",95992:"Yuba City",95993:"Yuba City",96001:"Redding",96002:"Redding",96003:"Redding",96006:"Adin",96007:"Anderson",96008:"Bella Vista",96009:"Bieber",96010:"Big Bar",96011:"Big Bend",96013:"Burney",96014:"Callahan",96015:"Canby",96016:"Cassel",96017:"Castella",96019:"Shasta Lake",96020:"Chester",96021:"Corning",96022:"Cottonwood",96023:"Dorris",96024:"Douglas City",96025:"Dunsmuir",96027:"Etna",96028:"Fall River Mills",96029:"Flournoy",96031:"Forks Of Salmon",96032:"Fort Jones",96033:"French Gulch",96034:"Gazelle",96035:"Gerber",96037:"Greenview",96038:"Grenada",96039:"Happy Camp",96040:"Hat Creek",96041:"Hayfork",96044:"Hornbrook",96046:"Hyampom",96047:"Igo",96048:"Junction City",96049:"Redding",96050:"Klamath River",96051:"Lakehead",96052:"Lewiston",96054:"Lookout",96055:"Los Molinos",96056:"Mcarthur",96057:"Mccloud",96058:"Macdoel",96059:"Manton",96061:"Mill Creek",96062:"Millville",96063:"Mineral",96064:"Montague",96065:"Montgomery Creek",96067:"Mount Shasta",96068:"Nubieber",96069:"Oak Run",96070:"Obrien",96071:"Old Station",96073:"Palo Cedro",96074:"Paskenta",96075:"Paynes Creek",96076:"Platina",96078:"Proberta",96079:"Shasta Lake",96080:"Red Bluff",96084:"Round Mountain",96085:"Scott Bar",96086:"Seiad Valley",96087:"Shasta",96088:"Shingletown",96089:"Shasta Lake",96090:"Tehama",96091:"Trinity Center",96092:"Vina",96093:"Weaverville",96094:"Weed",96095:"Whiskeytown",96096:"Whitmore",96097:"Yreka",96099:"Redding",96101:"Alturas",96103:"Blairsden-graeagle",96104:"Cedarville",96105:"Chilcoot",96106:"Clio",96107:"Coleville",96108:"Davis Creek",96109:"Doyle",96110:"Eagleville",96111:"Floriston",96112:"Fort Bidwell",96113:"Herlong",96114:"Janesville",96115:"Lake City",96116:"Likely",96117:"Litchfield",96118:"Loyalton",96119:"Madeline",96120:"Markleeville",96121:"Milford",96122:"Portola",96123:"Ravendale",96124:"Calpine",96125:"Sierra City",96126:"Sierraville",96127:"Susanville",96128:"Standish",96129:"Beckwourth",96130:"Susanville",96132:"Termo",96133:"Topaz",96134:"Tulelake",96135:"Vinton",96136:"Wendel",96137:"Westwood",96140:"Carnelian Bay",96141:"Homewood",96142:"Tahoma",96143:"Kings Beach",96145:"Tahoe City",96146:"Olympic Valley",96148:"Tahoe Vista",96150:"South Lake Tahoe",96151:"South Lake Tahoe",96152:"South Lake Tahoe",96154:"South Lake Tahoe",96155:"South Lake Tahoe",96156:"South Lake Tahoe",96157:"South Lake Tahoe",96158:"South Lake Tahoe",96160:"Truckee",96161:"Truckee",96162:"Truckee"}] 
         if(zpcd[0][zip]){ var zpcdcity =zpcd[0][zip].toUpperCase(); }else{ var zpcdcity =""; }
        
						handle.html(superObject.best + '<span>%</span>');
						$('#maximumHousePrice').text('$' + formatThousands(Math.round(superObject.DTIs[superObject.best].maximumHousePrice)));
						$('.mt-4.idxbtn').remove();
						$('#calprice').text(formatThousands(Math.round(superObject.DTIs[superObject.best].maximumHousePrice)));
						if(zip==902101){
							if($(window).width() < parseInt(1080)){
								$("<div class='mt-4 idxbtn' id='idxbtn' ><a class='btn btn-new fancybox-iframe' style='' target='_blank' href='https://agentamplification.com/staging/search-results/?type%5B%5D=" +property+ "&use_radius=on&radius=20&location%5B%5D=" +county_city+ "&min-price=1500&max-price="+ Math.round(superObject.DTIs[superObject.best].maximumHousePrice) +"' >See "+county_city_text+" Homes</a></div>").insertAfter(".mt-4.tip");
							}else{
								$("<div class='mt-4 idxbtn' id='idxbtn' ><a class='btn btn-new fancybox-iframe' style='' target='_blank' href='https://agentamplification.com/staging/search-results/?type%5B%5D=" +property+ "&use_radius=on&radius=20&location%5B%5D=" +county_city+ "&min-price=1500&max-price="+ Math.round(superObject.DTIs[superObject.best].maximumHousePrice) +"' >See All "+county_city_text+" Homes Priced Around $"+shortenLargeNumber(Math.round(superObject.DTIs[superObject.best].maximumHousePrice))+"</a></div>").insertAfter(".mt-4.tip");
							}
						}
						if($(window).width() < parseInt(1080)){
							$("<div class='mt-4 idxbtn' id='idxbtn' ><a class='btn btn-new fancybox-iframe' style='' target='_blank' href='https://agentamplification.com/staging/search-results/?type%5B%5D=" +property+ "&use_radius=on&radius=20&location%5B%5D=" +county_city+ "&min-price=1500&max-price="+ Math.round(superObject.DTIs[superObject.best].maximumHousePrice) +"' >See "+county_city_text+" Homes</a></div>").insertAfter(".mt-4.tip");	
						}else{
							$("<div class='mt-4 idxbtn' id='idxbtn' ><a class='btn btn-new fancybox-iframe' style='' target='_blank' href='https://agentamplification.com/staging/search-results/?type%5B%5D=" +property+ "&use_radius=on&radius=20&location%5B%5D=" +county_city+ "&min-price=1500&max-price="+ Math.round(superObject.DTIs[superObject.best].maximumHousePrice) +"' >See All "+county_city_text+" Homes Priced Around $"+shortenLargeNumber(Math.round(superObject.DTIs[superObject.best].maximumHousePrice))+"</a></div>").insertAfter(".mt-4.tip");
						}
						if(zip==923731 || zip==923741){
							if($(window).width() < parseInt(1080)){
								$("<div class='mt-4 idxbtn' id='idxbtn'><a class='btn btn-new fancybox-iframe' style='' target='_blank' href='https://agentamplification.com/staging/search-results/?type%5B%5D=" +property+ "&use_radius=on&radius=20&location%5B%5D=" +county_city+ "&min-price=1500&max-price="+ Math.round(superObject.DTIs[superObject.best].maximumHousePrice) +"' >SEE "+county_city_text+" Homes</a></div>").insertAfter(".mt-4.tip");
							}else{
								$("<div class='mt-4 idxbtn' id='idxbtn'><a class='btn btn-new fancybox-iframe' style='' target='_blank' href='https://agentamplification.com/staging/search-results/?type%5B%5D=" +property+ "&use_radius=on&radius=20&location%5B%5D=" +county_city+ "&min-price=1500&max-price="+ Math.round(superObject.DTIs[superObject.best].maximumHousePrice) +"' >SEE ALL AVAILABLE "+county_city_text+" Homes  Priced At Around $"+shortenLargeNumber(Math.round(superObject.DTIs[superObject.best].maximumHousePrice))+"</a></div>").insertAfter(".mt-4.tip");
							}
						}
						
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
							step: .5,
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
						$(".home-value-result").show();
						$(".home-value-result span").text( "$ " + numberWithCommas(respond.price) );
						
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
	$(document).on("click",".pp_sign-in",function(e){
		e.preventDefault();
		$(".pp_signup").slideDown("400");
		$(".pp_signin").slideUp("300");
		$(".pp_forgot").slideUp("300");
		$('html, body').animate({
			scrollTop: $(".pp_modal-left").offset().top
		}, 100);
		return false;
	});
	$(document).on("click",".pp_sign-up",function(e){
		e.preventDefault(); 
		$(".pp_signin").slideDown("400");
		$(".pp_signup").slideUp("300");
		$(".pp_forgot").slideUp("300");
		$('html, body').animate({
			scrollTop: $(".pp_modal-left").offset().top
		}, 100);
		return false;
	});
	$(document).on("click",".pp_showforgot",function(e){
		e.preventDefault();
		$(".pp_forgot").slideDown("400");
		$(".pp_signup").slideUp("300");
		$(".pp_signin").slideUp("300");
		$('html, body').animate({
			scrollTop: $(".pp_modal-left").offset().top
		}, 100);
		return false;
	});
	$(document).on("click","#back-from-calc",function(e){
		e.preventDefault();
		$("#back-from-calc").hide();
		if($('.calc-col').is(':visible')){
			$('.maincalc').animate({right: '-1000px'}, 1000);
			setTimeout(function(){
				$('.calc-col').hide();
				$('.initial-col').show();
				$(".calc-container").addClass("cal-bottom-bg");
				$('.maincalc').removeAttr("style");
			},1100);
		}
		if($('.sale-col').is(':visible')){
			$('.salingform').animate({left: '-800px'}, 1000);
			setTimeout(function(){
				$('.sale-col').hide();
				$('.initial-col').show();
				$(".calc-container").addClass("cal-bottom-bg");
				$('.salingform').removeAttr("style");
			},1100);
		}
		/*
		$('.initial-col').fadeIn(function() {
			$('.calc-col').fadeOut();
			$('.sale-col').fadeOut();
			$(".calc-container").removeClass("cal-bottom-bg");
		});
		*/
		return false;
	});
	
	var county_auto = $("#county").val();
	$.ajax({
		type : "POST",
		dataType : "json",
		url : myAjax.ajaxurl,
		data : {action: "get_cities_by_county_action",county:county_auto},
		success: function(response) {
			if(response.type == "success") {
				$("#county_city").html(response.options);
			}else if(response.type == "error"){
				
			}else {
			   alert("Error Occoured");
			}
		}
	});
	$(document).on("change","#county",function(e){
		e.preventDefault();
		var county = $(this).val();
		$("#county_city").html("");
		$.ajax({
			type : "POST",
			dataType : "json",
			url : myAjax.ajaxurl,
			data : {action: "get_cities_by_county_action",county:county},
			success: function(response) {
				if(response.type == "success") {
					$("#county_city").html(response.options);
				}else if(response.type == "error"){
					
				}else {
				   alert("Error Occoured");
				}
			}
		});
		return false;
	});

    
})( jQuery );
function loadinstop(selector,type){
	if(type=="success"){
		jQuery(selector).removeClass("kractive").addClass("krfinished");
	}else{
		jQuery(selector).removeClass("kractive").addClass("krinvalid");
	}
	setTimeout(function(){
		if(type=="success"){
			jQuery(selector).removeClass("krfinished");
		}else{
			jQuery(selector).removeClass("krinvalid");
		}
	},2000);
}
function loadingoverlay() {
	const button = document.querySelector('.krbutton');
	const submit = document.querySelector('.krsubmit');

	function toggleClass() {
		this.classList.toggle('kractive');
	}

	function addClass() {
		this.classList.add('krfinished');
	}
	function removeClass() {
		var tthis = this;
		setTimeout(function(){
			tthis.classList.remove('kractive');
			tthis.classList.remove('krfinished');
		},2000);
	}

	button.addEventListener('click', toggleClass);
	button.addEventListener('transitionend', toggleClass);
	button.addEventListener('transitionend', addClass);
	button.addEventListener('transitionend', removeClass);
}
//loadingoverlay();
function loadingoverlay2() {
	const button = document.querySelector('.krbuttonnew');
	const submit = document.querySelector('.krsubmit');

	function toggleClass() {
		this.classList.toggle('kractive');
	}

	function addClass() {
		this.classList.add('krfinished');
	}
	function removeClass() {
		var tthis = this;
		setTimeout(function(){
			tthis.classList.remove('kractive');
			tthis.classList.remove('krfinished');
		},2000);
	}

	button.addEventListener('click', toggleClass);
	button.addEventListener('transitionend', toggleClass);
	button.addEventListener('transitionend', addClass);
	button.addEventListener('transitionend', removeClass);
}
//loadingoverlay2();
const body = document.querySelector("body");
const pp_modal = document.querySelector(".pp_modal");
const modalButton = document.querySelector("#calculate");
const closeButton = document.querySelector(".pp_close-button");
//const scrollDown = document.querySelector(".scroll-down");
let isOpened = false;
/*
const openModal = () => {
	if(myAjax.user_id == 0){
		pp_modal.classList.add("is-open");
		body.style.overflow = "hidden";
	}
};
*/
const closeModal = () => {
  pp_modal.classList.remove("is-open");
  body.style.overflow = "initial";
};
/*
window.addEventListener("scroll", () => {
  if (window.scrollY > window.innerHeight / 3 && !isOpened) {
    isOpened = true;
    scrollDown.style.display = "none";
    openModal();
  }
});
*/
//modalButton.addEventListener("click", openModal);
closeButton.addEventListener("click", closeModal);

document.onkeydown = evt => {
  evt = evt || window.event;
  evt.keyCode === 27 ? closeModal() : false;
};
