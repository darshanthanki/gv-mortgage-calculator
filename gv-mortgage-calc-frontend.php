<link rel="stylesheet" href="<?= plugins_url( 'css/bootstrap.min.css', __FILE__ ) ?>" media="all" type="text/css">
<link rel="stylesheet" href="<?= plugins_url( 'css/jquery-ui.min.css', __FILE__ ) ?>" media="all" type="text/css">
<link rel="stylesheet" href="<?= plugins_url( 'css/lc_switch.css', __FILE__ ) ?>" media="all" type="text/css">
<link rel="stylesheet" href="<?= plugins_url( 'css/morris.css', __FILE__ ) ?>?id=<?php echo time(); ?>" media="all" type="text/css">
<link rel="stylesheet" href="<?= plugins_url( 'css/main.css', __FILE__ ) ?>?id=<?php echo time(); ?>" media="all" type="text/css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700,800">
<!-- script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.2.6/gsap.min.js' id='jquery-core-gsap'></script>
<script type='text/javascript' src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/16327/Physics2DPlugin3.min.js' id='jquery-physics2d-js'></script -->


<div class="container calc-container">
	<div class="row top-container">
		<div class="col-lg-12">
			<div class="ml-4">				
				<img src="<?= plugins_url( 'img/logo.png', __FILE__ ) ?>">
				<!-- <img src="<?= plugins_url( 'img/logo.png', __FILE__ ) ?>" width="32" height="32"> -->
				<!-- <h1>GreenVista Realty</h1>
				<p>Mortgage Calculator</p> -->
				<div class="back-calc"><button id="back-from-calc">
					Back
					</button>
					<!--<svg id="back-from-calc" version="1.0" xmlns="http://www.w3.org/2000/svg" width="50.000000pt" height="50.000000pt" viewBox="0 0 50.000000 50.000000" preserveAspectRatio="xMidYMid meet">
						<g transform="translate(0.000000,50.000000) scale(0.100000,-0.100000)"
						fill="#6f9bb9" stroke="none">
						<path d="M125 325 c-44 -36 -80 -69 -80 -74 0 -10 155 -140 168 -141 4 0 7 19
						7 41 l0 42 48 -7 c76 -10 134 -44 157 -93 35 -75 47 -47 19 46 -27 91 -123
						171 -206 171 -14 0 -18 8 -18 40 0 22 -3 40 -7 40 -5 -1 -44 -30 -88 -65z"/>
						</g>
					</svg> -->
				</div>
			</div>
		</div>					
	</div>
	<div class="initial-col">
		<div class="row text-center">
			<div class="col-lg-12 mb-5">
				<h2></h2>
			</div>
			<div class="col-sm-6 mt-5">						
				<a id="sale-link" href="#"><img src="<?= plugins_url( '/img/house.png', __FILE__ ) ?>"/><p class="mt-3"></a>
			</div>
			<div class="col-sm-6 mt-5">
				<a id="calc-link" href="#"><img src="<?= plugins_url( 'img/piggy-bank.png', __FILE__ ) ?>" /><p class="mt-3"></p></a>
			</div>
		</div>
	</div>
	
	<!-- The Modal -->
	<div id="modalDialogCalc" class="modalcalc">
		<div class="modalcalc-content animate-top">
			<div class="modalcalc-overlay">
				<div class="modalcalc-overlay-inn">
					<div class="calcprocess">
						<button class="finished"></button>
					</div>
				</div>
			</div>
			<button class="close closecalc" style="" title="Close" aria-live="polite" tabindex="2"><svg height="30" version="1.1" width="30" xmlns="http://www.w3.org/2000/svg" style="display:block;height:22px;width:22px" role="img" viewBox="0 0 320 512"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z" fill="currentColor"></path></svg></button>
			<?php /*
			<div class="modalcalc-header">
				<h5 class="modalcalc-title">Modal title</h5>
				<button type="button" class="close">
					<span aria-hidden="true">x</span>
				</button>
			</div>
			*/ ?>
			<div class="modalcalc-body">
				<div class="modalcalc-left">
					<section class="calc-r-gif">
						<img class="calc-left-gif" src="<?php echo plugins_url( 'img/PHONE-CALL.png', __FILE__ ); ?>" />
					</section>
					<?php /*
					<h4 class="pp_modal-found">Great News! Based on the info you provided, there are <span class="propCount"> Searching the MLS...</span> homes in <span class="propCity">Compiling all affordable homes...</span> that you would have an outstanding chance of being approved to buy!</h4> */ ?>
					<?php /*
					<section class="calc-r-slider slider">
						<div>
							<img src="https://helion.agentamplification.com/wp-content/uploads/2022/11/rthnth@1200x.png">
						</div>
						<div>
							<img src="https://helion.agentamplification.com/wp-content/uploads/2022/11/rthnth@1200x.png">
						</div>
						<div>
							<img src="https://helion.agentamplification.com/wp-content/uploads/2022/11/rgbrg.png">
						</div>
					</section>
					*/ ?>
				</div>
				<div class="modalcalc-right">
					<div class="modalcalc-right-in">
						<h4 class="pp_modal-found morethenfive"><span class="GreatNews">Great News!</span> There are at least <span class="propCount"> Searching the MLS...</span> homes in <span class="propCity">Compiling all affordable homes...</span> you are pre-qualified to purchase right now...</h4>
						<h4 class="pp_modal-found lessthenfive"><span class="GreatNews">Great News!</span> Your instant prequalification will reveal your max Home price, current market rate, most efficient use of available funds, along with any available homes in your price range.</h4>
						<div style="display:none;" class="pp_signin">
							
							<form id="LoginForm" name="LoginForm" method="POST" action="">
								<div class="form-group">
									<label for="gv_email">Email</label>
									<input name="gv_email" type="text" class="form-control" id="gv_email" placeholder="Email">
								</div>
								<div class="form-group">
									<label for="gv_password">Password</label>
									<input name="gv_password" type="password" class="form-control" id="gv_password" placeholder="Password">
								</div>
								<div class="forgot-buttons">
									<a href="#" class="pp_showforgot">Forgot your password?</a>
								</div>
								<div class="pp_modal-buttons">
									<?php /*
									<button type="submit" class="pp_input-button btn btn-new">Login</button>
									*/ ?>
									<button type="submit" class="krbutton">
										<span class="krsubmit">Login</span>
										<span class="krloading"><i class="fa fa-refresh"></i></span>
										<span class="krcheck"><i class="fa fa-check"></i></span>
										<span class="krcross"><i class="fa fa-times"></i></span>
									</button>
								</div>
								<div class="LoginMessages gvMessage">
									<ul></ul>
								</div>
							</form>
							<p class="pp_sign-in">Don't have an account? <a href="#">Sign up now</a></p>
						</div>
						<div style="display:none;" class="pp_forgot">
							<form id="ForgotForm" name="ForgotForm" method="POST" action="">
								<div class="form-group">
									<label for="gv_forgot_email">Email</label>
									<input name="gv_forgot_email" type="text" class="form-control" id="gv_forgot_email" placeholder="Email">
								</div>
								<div class="pp_modal-buttons">
									<button type="submit" class="pp_input-button btn btn-new">Get password</button>
								</div>
								<div class="forgotMessages gvMessage">
									<ul></ul>
								</div>
							</form>
							<p class="pp_sign-up">Return to login? <a href="#">Sign In now</a></p>
						</div>
						<div class="pp_signup">
							<form id="RegistrationForm" name="RegistrationForm" method="POST" action="">
								<div class="form-group">
									<label for="FormControlFirstName">First Name</label>
									<input name="FormControlFirstName" type="text" class="form-control" id="FormControlFirstName" placeholder="First Name">
								</div>
								<div class="form-group">
									<label for="FormControlLastName">Last Name</label>
									<input name="FormControlLastName" type="text" class="form-control" id="FormControlLastName" placeholder="Last Name">
								</div>
								<div class="form-group">
									<label for="FormControlEmail">Email address</label>
									<input name="FormControlEmail" type="email" class="form-control" id="FormControlEmail" placeholder="name@example.com">
									<?php /*
									<p class="emailText">We are here for you! If you want to discuss your specific scenario, with no obligation, let us know how we can best reach you below.</p>
									*/ ?>
									<p class="emailText">Want to discuss a specific scenario? We are just a call or text away and we're happy to answer questions and help you find your next steps- always with no obligation.</p>
								</div>
								<?php /*
								<div class="form-group">
									<label for="FormControlPhone">Phone <span class="optionalSpan">(optional)</span></label>
									<input name="FormControlPhone" type="text" class="form-control" id="FormControlPhone" placeholder="Phone">
								</div>
								*/ ?>
								<div class="form-group">
									<label for="FormControlMessage">How can we help?</label>
									<textarea name="FormControlMessage" class="form-control" id="FormControlMessage"></textarea>
								</div> 
								<div class="form-group">
									<?php /*
									<button type="submit" name="RegisterSubmit" id="RegisterSubmit" class="btn btn-new">Complete Pre-Qualification</button>
									*/ ?>
									<button type="submit" class="krbutton krbuttonnew">
										<span class="krsubmit">Complete Pre-Qualification</span>
										<span class="krloading"><i class="fa fa-refresh"></i></span>
										<span class="krcheck"><i class="fa fa-check"></i></span>
										<span class="krcross"><i class="fa fa-times"></i></span>
									</button>
								</div>
								<div class="RegisterMessages gvMessage">
									<ul></ul>
								</div>
							</form>
							<p class="pp_sign-up">Already Have account? <a href="#">Sign In now</a></p>
						</div>
					</div>
				</div>
			</div>
			<?php /*
			<div class="modalcalc-footer">
				<button type="button" class="btn btn-secondary close">Close</button>
				<button type="button" class="btn btn-primary">Save changes</button>
			</div>
			*/ ?>
		</div>
	</div>
	
	<div class="sale-col" style="display:none;">
		<div class="row">
			<div class="col-md-6 offset-md-3 salingform">
				<form>
					
					<h3>First, let's quickly determine the profit you can expect to receive after all fee's comissions, & expenses. Then we'll see how it would impact your prospective purchase</h3>	
					
					<div class="form-group form-row">
						<label for="current-value" class="col-lg-12 col-form-label">Your Home Value Estimate</label>
						<div class="col-lg-12" data-tip="The estimated value of the home to be sold">
							<input class="form-control prefix" name="current-value" type="text" id="current-value" autocorrect="off" value="$ 250,000">
						</div>						
					</div>
					
					<h3 id = "arrows">Enter your estimate of the home's value<br/>or<br/>an address for an instant-value estimate based on recent sales</h3>	
					
					<div class="form-group form-row">
						<label for="street" class="col-lg-12 col-form-label">Street Address</label>
						<div class="col-lg-12" data-tip="Street Address">
							<input class="form-control" name="street" type="text" id="street" autocorrect="off" value="">
						</div>						
					</div>
					
					<div class="form-group form-row">
						
						<div class="col-lg-4">
							<label for="city" class=" col-form-label">City</label>
							<div data-tip="City">
								<input class="form-control" name="city" type="text" id="city" autocorrect="off" value="">
							</div>		
						</div>
							
						<div class="col-lg-4">
							<label for="state" class="col-form-label">State</label>
							<div data-tip="State">
								<select  class="form-control" id = "state" name = "state">
									<option  value="">Select State</option>
									<option  value="Alabama">Alabama</option>
									<option  value="Alaska" >Alaska</option>
									<option  value="Arizona"  >Arizona</option>
									<option  value="Arkansas" >Arkansas</option>
									<option  value="California"  >California</option>
									<option  value="Colorado"  >Colorado</option>
									<option  value="Connecticut" >Connecticut</option>
									<option  value="Delaware"  >Delaware</option>
									<option  value="Florida"  >Florida</option>
									<option  value="Georgia"  >Georgia</option>
									<option  value="Hawaii"  >Hawaii</option>
									<option  value="Idaho"  >Idaho</option>
									<option  value="Illinois" >Illinois</option>
									<option  value="Indiana" >Indiana</option>
									<option  value="Iowa"  >Iowa</option>
									<option  value="Kansas" >Kansas</option>
									<option  value="Kentucky"  >Kentucky</option>
									<option  value="Louisiana"  >Louisiana</option>
									<option  value="Maine"  >Maine</option>
									<option  value="Maryland"  >Maryland</option>
									<option  value="Massachusetts"  >Massachusetts</option>
									<option  value="Michigan"  >Michigan</option>
									<option  value="Minnesota"  >Minnesota</option>
									<option  value="Mississippi"  >Mississippi</option>
									<option  value="Missouri"  >Missouri</option>
									<option  value="Montana"  >Montana</option>
									<option  value="Nebraska"  >Nebraska</option>
									<option  value="Nevada"  >Nevada</option>
									<option  value="New Hampshire"  >New Hampshire</option>
									<option  value="New Jersey"  >New Jersey</option>
									<option  value="New Mexico"  >New Mexico</option>
									<option  value="New York"  >New York</option>
									<option  value="North Carolina"  >North Carolina</option>
									<option  value="North Dakota"  >North Dakota</option>
									<option  value="Ohio"  >Ohio</option>
									<option  value="Oklahoma"  >Oklahoma</option>
									<option  value="Oregon"  >Oregon</option>
									<option  value="Pennsylvania"  >Pennsylvania</option>
									<option  value="Rhode Island"  >Rhode Island</option>
									<option  value="South Carolina"  >South Carolina</option>
									<option  value="South Dakota"  >South Dakota</option>
									<option  value="Tennessee"  >Tennessee</option>
									<option  value="Texas"  >Texas</option>
									<option  value="Utah"  >Utah</option>
									<option  value="Vermont"  >Vermont</option>
									<option  value="Virginia"  >Virginia</option>
									<option  value="Washington"  >Washington</option>
									<option  value="Washington D.C."  >Washington D.C.</option>
									<option  value="West Virginia"  >West Virginia</option>
									<option  value="Wisconsin"  >Wisconsin</option>
									<option  value="Wyoming"  >Wyoming</option>
								</select>
							</div>
						</div>
						
						<div class="col-lg-4">
							<label for="zip_code" class="col-form-label">Zip Code</label>
							<div data-tip="Zip Code">
								<input class="form-control" name="zip_code" type="text" id="zip_code" autocorrect="off" value="">
							</div>		
						</div>
					
					</div>
					
					<div class="row mt-4">
						<div class="col-lg-12 text-center">
							<a class="btn btn-new" id="get-property-value">Get Current Property Value</a>	
						</div>
					</div>
					<div class="row mt-4">
						<div class="col-lg-12 text-center">
							<h3 class="home-value-result" style="display:none;">
								Home Value : <span></span>
							</h3>	
						</div>
					</div>
					
					
					
					
					
					
					
					
					
					<div class="form-group form-row">
						<label for="existing-loan-1" class="col-lg-12 col-form-label">Current Mortgage Balance(s)</label>
						<div class="col-lg-12" data-tip="Total of all mortgages to be paid off">
							<input class="form-control prefix" name="existing-loan-1" type="text" id="existing-loan-1" autocorrect="off" value="$ 0">
						</div>						
					</div>
					<div class="form-group form-row">
						<label for="existing-loan-2" class="col-lg-12 col-form-label">Repairs and/or credits to buyer</label>
						<div class="col-lg-12" data-tip="Total of any needed pre-sale repairs and/or credits given to the buyer">
							<input class="form-control prefix" name="existing-loan-2" type="text" id="existing-loan-2" autocorrect="off" value="$ 0">
						</div>						
					</div>
					<div class="form-group form-row">
						<label for="property-tax" class="col-lg-12 col-form-label">Annual Property Tax Amount</label>
						<div class="col-lg-12" data-tip="Annual property tax amount for the home being sold">
							<input class="form-control prefix" name="property-tax" type="text" id="property-tax" autocorrect="off" value="$ 4250">
						</div>						
					</div>
					<div class="form-group form-row">
						<label for="sale-month" class="col-lg-12 col-form-label">When would you like your sale to close escrow?</label>
							<div class="col-lg-12" data-tip="The month you think the home would sell">
								<select class="form-control" name="sale-month" id="sale-month">
									<option value="1">January</option>
									<option value="2">February</option>
									<option value="3">March</option>
									<option value="4">April</option>
									<option value="5">May</option>
									<option value="6">June</option>
									<option value="7">July</option>
									<option value="8">August</option>
									<option value="9">September</option>
									<option value="10">October</option>
									<option value="11">November</option>
									<option value="12">December</option>
								</select>
							</div>						
						</div>
					<div class="form-group form-row">
						<label for="realtor" class="col-lg-12 col-form-label">Will this be a "for sale by owner" transaction</label>
						<div class="col-lg-12" data-tip="Would you prefer not to hire a Realtor and sell the home on your own?">
							<input class="onoff" name="realtor" type="checkbox" id="realtor">
						</div>					
					</div>
					<div class="row mt-4">
						<div class="col-lg-12 text-center">
							<a class="btn btn-new" id="calculate-house-assets">Get Net Profit</a>	
						</div>
					</div>
					<div class="row mt-3">
						<div class="col-lg-12 text-center">
							<a href="#" id="skip-link" class="mt-5 small text-secondary">Skip this step</a>	
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>	
	<div class="calc-col" style="display:none;">
		<div class="row maincalc">
			<div class="col-lg-4 form-col">
				<div class="inner-form">
					<div class="row">
						<div class="col-lg-12">
							<a href="#" id="primary-options" class="options-link active">Standard Options</a>
							<a href="#" id="advanced-options" class="options-link">Advanced Options</a>
						</div>
					</div>
					<form class="mt-3 primary-row">
						<div class="form-group form-row">
							<label for="assets" class="col-lg-12 col-form-label">Funds You Want to Use Towards this Purchase </label>
							<div class="col-lg-12" data-tip="text to display here" >
								<input class="form-control prefix" name="assets" type="text" id="assets" autocorrect="off" value="$ 50,000">
							</div>						
						</div>
						<div class="form-group form-row">
							<label for="assets2" class="col-lg-12 col-form-label">Your Home-Sale Profit</label>
							<div class="col-lg-12" data-tip="text to display here" >
								<input class="form-control prefix" name="assets2" type="text" id="assets2" autocorrect="off" value="$ 0">
							</div>						
						</div>
						<div class="form-group form-row">
							<label for="income" class="col-lg-12 col-form-label">Your Annual Pre-Tax (Gross) Income</label>
							<div class="col-lg-12" data-tip="text to display here" >
								<input class="form-control prefix" name="income" type="text" id="income" autocorrect="off" value="$80,000">
							</div>						
						</div>
						<div class="form-group form-row">
							<label for="debt" class="col-lg-12 col-form-label">Monthly Debt Payment</label>
							<div class="col-lg-12" data-tip="text to display here" >
								<input class="form-control prefix" name="debt" type="text" id="debt" autocorrect="off" value="$ 500" data-postfix="$">
							</div>						
						</div>
						<div class="form-group form-row">
							<label for="score" class="col-lg-12 col-form-label">Credit Score</label>
							<div class="col-lg-12">
								<div class="sk_range" action="">
									<label class="sk_range__label" for="score">Credit Score</label>
									<input class="sk_range__input" id="score" type="range" value="680" min="620" max="800" step="1">
									<div class="sk_range__output" aria-hidden="true" data-tipp>
										<div class="sk_range__output-value-track">
											<div class="sk_range__output-values" data-values></div>
										</div>
									</div>
								</div>
								<?php /*
								<input class="form-control" name="score" type="number" id="score" autocorrect="off" value="680" min="620">
								*/ ?>
							</div>						
						</div>
						<div class="form-group form-row">
							<label for="county" class="col-lg-12 col-form-label">County</label>
							<div class="col-lg-12" data-tip="text to display here" >
								<select class="form-control" name="county" id="county">
									<option value="Alameda">Alameda</option>
									<option value="Alpine">Alpine</option>
									<option value="Amador">Amador</option>
									<option value="Butte">Butte</option>
									<option value="Calaveras">Calaveras</option>
									<option value="Colusa">Colusa</option>
									<option value="Contra Costa">Contra Costa</option>
									<option value="Del Norte">Del Norte</option>
									<option value="El Dorado">El Dorado</option>
									<option value="Fresno">Fresno</option>
									<option value="Glenn">Glenn</option>
									<option value="Humboldt">Humboldt</option>
									<option value="Imperial">Imperial</option>
									<option value="Inyo">Inyo</option>
									<option value="Kern">Kern</option>
									<option value="Kings">Kings</option>
									<option value="Lake">Lake</option>
									<option value="Lassen">Lassen</option>
									<option value="Los Angeles">Los Angeles</option>
									<option value="Madera">Madera</option>
									<option value="Marin">Marin</option>
									<option value="Mariposa">Mariposa</option>
									<option value="Mendocino">Mendocino</option>
									<option value="Merced">Merced</option>
									<option value="Modoc">Modoc</option>
									<option value="Mono">Mono</option>
									<option value="Monterey">Monterey</option>
									<option value="Napa">Napa</option>
									<option value="Nevada">Nevada</option>
									<option value="Orange">Orange</option>
									<option value="Placer">Placer</option>
									<option value="Plumas">Plumas</option>
									<option value="Riverside">Riverside</option>
									<option value="Sacramento">Sacramento</option>
									<option value="San Benito">San Benito</option>
									<option value="San Bernardino">San Bernardino</option>
									<option value="San Diego">San Diego</option>
									<option value="San Francisco">San Francisco</option>
									<option value="San Joaquin">San Joaquin</option>
									<option value="San Luis Obispo">San Luis Obispo</option>
									<option value="San Mateo">San Mateo</option>
									<option value="Santa Barbara">Santa Barbara</option>
									<option value="Santa Clara">Santa Clara</option>
									<option value="Santa Cruz">Santa Cruz</option>
									<option value="Shasta">Shasta</option>
									<option value="Sierra">Sierra</option>
									<option value="Siskiyou">Siskiyou</option>
									<option value="Solano">Solano</option>
									<option value="Sonoma">Sonoma</option>
									<option value="Stanislaus">Stanislaus</option>
									<option value="Sutter">Sutter</option>
									<option value="Tehama">Tehama</option>
									<option value="Trinity">Trinity</option>
									<option value="Tulare">Tulare</option>
									<option value="Tuolumne">Tuolumne</option>
									<option value="Ventura">Ventura</option>
									<option value="Yolo">Yolo</option>
									<option value="Yuba">Yuba</option>
								</select>
							</div>						
						</div>
						<div class="form-group form-row">
							<label for="county_city" class="col-lg-12 col-form-label">City</label>
							<div class="col-lg-12" data-tip="text to display here" >
								<select class="form-control" name="county_city" id="county_city">
								</select>
							</div>						
						</div>
						<div style="visibility: hidden;height: 0px;" class="form-group form-row">
							<label for="zip" class="col-lg-12 col-form-label">Zip Code</label>
							<div class="col-lg-12" data-tip="text to display here" >
								<input class="form-control" name="zip" type="text" id="zip" autocorrect="off" value="90210">
							</div>						
						</div>
					</form>
					<form class="mt-3 advanced-row" style="display:none;">
						<div class="form-group form-row">
							<label for="type" class="col-lg-12 col-form-label">Loan Type</label>
							<div class="col-lg-12" data-tip="text to display here" >
								<select class="form-control" name="type" id="type">
									<option value="conventional">Conventional</option>
									<option value="FHA">FHA</option>
									<option value="VA">VA</option>
								</select>
							</div>						
						</div>
						<div class="form-group form-row">
							<label for="type" class="col-lg-12 col-form-label">Period</label>
							<div class="col-lg-12" data-tip="text to display here" >
								<select class="form-control" name="period" id="period">
									<option value="30">30-years fixed</option>
									<option value="20">20-years fixed</option>
									<option value="15">15-years fixed</option>
									<option value="10">10-years fixed</option>
								</select>
							</div>						
						</div>
						<div class="form-group form-row">
							<label for="usage" class="col-lg-12 col-form-label">Property Usage</label>
							<div class="col-lg-12" data-tip="text to display here" >
								<select class="form-control" name="usage" id="usage">
									<option value="1">Primary residence</option>
									<option value="2">Second home</option>
									<option value="3">Investment</option>
								</select>
							</div>						
						</div>
						<div class="form-group form-row">
							<label for="property" class="col-lg-12 col-form-label">Property Type</label>
							<div class="col-lg-12" data-tip="text to display here" >
								<select class="form-control" name="property" id="property">
									<option value="residential">Single family</option>
									<option value="condo">Condo</option>
									<option value="2">2 units</option>
									<option value="3">3 units</option>
									<option value="4">4 units</option>
								</select>
							</div>						
						</div>
						<div class="form-group form-row">
							<label for="history" class="col-lg-12 col-form-label">Purchase History</label>
							<div class="col-lg-12" data-tip="text to display here" >
								<select class="form-control" name="history" id="history">
									<option value="1">First time homebuyer</option>
									<option value="2">Have bought a home before</option>
								</select>
							</div>						
						</div>
					</form>
					<div class="row mt-4">
						<div class="col-lg-12 text-center">
							<button class="btn btn-new" id="calculate"><span class="desktopcalc">Get Instant Pre-Qualification</span><span class="mobilecalc">Instant Pre-Qual</span></button>
							<!---<button class="btn btn-new" id="newcalculate">bbtn</button>-->
						</div>
					</div>
				</div>
			</div>

			<div class="col-lg-8 loading-col" style="display:none;">
				<div class="d-flex align-items-center justify-content-center" style="width:100%;height:100%;">
					<div class="spinner-border text-primary" role="status" style="width:10rem;height:10rem;margin-top:-8rem;">
						<span class="sr-only">Loading...</span>
					</div>
				</div>
			</div>
			<div class="col-lg-8 results-col">
				<div class="inner-result hdi-results">
					<div class="row main-results-col">										
						<div class="col-md-4 hdi-wrap">
							<div class="hdi-img">
								<img src="<?php echo plugins_url( 'img/Asset%204@3x-8.png', __FILE__ ); ?>" />
							</div>
							<div class="hdi">
								<h3 id="maximumHousePrice">0</h3>
								<p class="mb-0">Home Price</p>
							</div>
						</div>
						<div class="col-md-4 hdi-wrap">
							<div class="hdi-img">
								<img src="<?php echo plugins_url( 'img/Asset%206@3x-8.png', __FILE__ ); ?>" />
							</div>
							<div class="hdi">
								<h3><span id="downPayment">$0</span></h3>
								<p class="mb-0">Down Payment (<span id="downPaymentPercent">0</span>)</p>
							</div>
						</div>
						<!--<div class="col-lg-4">
							<p class="mt-1 mb-0">Loan amount</p>
							<h3 id="maximumLoanAmount">0</h3>			
						</div>
						-->
						<div class="col-md-4 hdi-wrap">
							<div class="hdi-img">
								<img src="<?php echo plugins_url( 'img/Asset%205@3x-8.png', __FILE__ ); ?>" />
							</div>
							<div class="hdi">
								<h3 id="interestRate">0</h3>
								<p class="mb-0">Interest Rate</p>	
							</div>
						</div>
					</div>
				</div>
				<div class="row mt-4">
					<div class="col-lg-12">
						<p class="dti-heading">Total Debt to Income Ratio</p>
					</div>
					<div class="col-lg-12">
						<div id="dti-slider">
							<div id="custom-handle" class="ui-slider-handle"></div>
						</div>
						<div class="mt-2 normal-text">
							<div id="conservative"><p>Conservative</p></div>
						    <div id="aggressive"><p>Aggressive</p></div>
						</div>
					</div>
				</div>
				<div class="inner-mortgage-payments">
					<div class="row mt-2">
					
					<!--
					<div class="col-lg-4">
						<p class="mb-0">Closing costs</p>
						<h4 id="closingCosts">0</h4>
					</div>
					-->

						<div class="col-md-4">
							<div class="row mortgage-payments-col">
								<div id="m-0" class="col-lg-12 m-segment">
									<div class="color">

									</div>
									<p class="mb-0">Principal/Interest</p>
									<h5 id="mortgagePayment">0</h5>									
								</div>
								<div id="m-1" class="col-lg-12 m-segment">
									<div class="color">

									</div>
									<p class="mb-0">Property Taxes</p>
									<h5 id="monthlyPropertyTax">0</h5>
								</div>								
								<div id="m-2" class="col-lg-12 m-segment">
									<div class="color">

									</div>
									<p class="mb-0">Mortgage Insurance</p>
									<h5 id="mortgageInsurance">0</h5>											
								</div>
								<div id="m-3" class="col-lg-12 m-segment">
									<div class="color">

									</div>
									<p class="mb-0">Homeowner Insurance</p>
									<h5 id="hazardInsurance">0</h5>											
								</div>
							</div>
						</div>
						<div class="col-md-8">
							<div id="mortgagechart" style="height: 250px; width: 250px;"></div>
						</div>
						<!--
						<div class="col-lg-6">
							<p class="mb-0">Total Payments</p>
							<h3><span id="totalPayments">0</span> ( <span id="debtToIncome">0</span> )</h3>
						</div>
						-->
					</div>
				</div>
				<div class="mt-4 tip">
					<div class="row">
						<div class="col-lg-12">
							<div>
								<h5>Congratulations. Based on the informatioin you provided. There is a chance you  will qualify for a home priced at $<span id="calprice">0</span></h5>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-lg-7 error-col" style="display:none;">
				<h2>Error (Low Funds)</h2>
			</div>
		</div>
	</div>
	
	<div id = "zillow" style="display:none;" >
	
		<div class="row mt-4">
		
			<!--
			<div class="col-sm-12 col-md-6 mb-4 property">
				<div class = "p-4 shadow bg-white rounded" >
					<img src="https://photos.zillowstatic.com/fp/0b9751b38ed89c3b79d7d02ce9594236-p_e.jpg"  />
					<p><b>$969,000</b> - CONDO</p>
					<div class="row">
						<div class="col-6 col-xl-3"><b>3</b> bed</div><div class="col-6 col-xl-3"><b>2</b> bath</div><div class="col-6 col-xl-3"><b>1,100</b> sqrt</div><div class="col-6 col-xl-3"><b>0.3535</b> acres</div>
					</div>
					<p>406 N Oakhurst Dr UNIT 303, Beverly Hills, CA 90210</p>
				</div>
			</div>
			-->
				
		</div>
	
	</div>
		
</div>