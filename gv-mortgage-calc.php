<?php

/**
 * @wordpress-plugin
 * Plugin Name: GreenVista Realty Innovative Mortgage Calculator
 * Plugin URI:  http://wwwolf.ru
 * Description: This plugin lets to put a mortgage calculator into any page of the website. Shortcode: <code>[mortgage_calculator]</code>
 * Version:	 1.2.0
 * Author:	  Nikita P
 * Author URI:  http://wwwolf.ru
 * Text Domain: wwwolf_gv_mortgage_calculator
 */
require_once(plugin_dir_path( __FILE__ )."calculator-records.php"); 
include plugin_dir_path( __FILE__ ) . 'wp-mail.php';

function calculator_plugin_activate(){
	// WP Globals
	global $table_prefix, $wpdb;

	// Customer Table
	$user_calculator_collections = $table_prefix . 'user_calculator_collections';
	$county_cities = $table_prefix . 'county_cities';

	// Create Customer Table if not exist
	if( $wpdb->get_var( "show tables like '$user_calculator_collections'" ) != $user_calculator_collections ) {
		// Query - Create Table
		$sql = "CREATE TABLE `$user_calculator_collections` (";
		$sql .= "`id` int(100) NOT NULL AUTO_INCREMENT, ";
		$sql .= "`user_id` int(100) NOT NULL, ";
		$sql .= "`available_assets` varchar(255) NOT NULL, ";
		$sql .= "`assets_from_sale` varchar(255) NOT NULL, ";
		$sql .= "`annual_gross_income` varchar(255) NOT NULL, ";
		$sql .= "`credit_score` varchar(255) NOT NULL, ";
		$sql .= "`county` varchar(255) NOT NULL, ";
		$sql .= "`county_city` varchar(255) NOT NULL, ";
		$sql .= "`zip_code_cal` varchar(255) NOT NULL, ";
		$sql .= "`monthly_debt_payment` varchar(255) NOT NULL, ";
		$sql .= "`loan_type` varchar(255) NOT NULL, ";
		$sql .= "`period` varchar(255) NOT NULL, ";
		$sql .= "`property_usage` varchar(255) NOT NULL, ";
		$sql .= "`property_type` varchar(255) NOT NULL, ";
		$sql .= "`purchase_history` varchar(255) NOT NULL, "; 
		$sql .= "`estimated_home_value` varchar(255) NOT NULL, ";
		$sql .= "`street` varchar(255) NOT NULL, ";
		$sql .= "`city` varchar(255) NOT NULL, ";
		$sql .= "`state` varchar(255) NOT NULL, ";
		$sql .= "`zip_code` varchar(255) NOT NULL, ";
		$sql .= "`current_mortgage_balance` varchar(255) NOT NULL, ";
		$sql .= "`repairs_andor_credits` varchar(255) NOT NULL, ";
		$sql .= "`annual_property_tax_amount` varchar(255) NOT NULL, ";
		$sql .= "`close_the_sale` varchar(255) NOT NULL, ";
		$sql .= "`for_sale_by_owner` varchar(255) NOT NULL, ";
		$sql .= "`calculate_clicked` int(100) NOT NULL, ";
		$sql .= "`calculate_time` varchar(100) NOT NULL, ";
		$sql .= "PRIMARY KEY (`id`) ";
		$sql .= ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;";

		// Include Upgrade Script
		require_once( ABSPATH . '/wp-admin/includes/upgrade.php' );
	
		// Create Table
		dbDelta( $sql );
	}
	if( $wpdb->get_var( "show tables like '$county_cities'" ) != $county_cities ) {
		// Query - Create Table
		$sql = "CREATE TABLE `$county_cities` (";
		$sql .= "`id` int(100) NOT NULL AUTO_INCREMENT, ";
        $sql .= "`city` varchar(255) NOT NULL, ";
		$sql .= "`city_ascii` varchar(255) NOT NULL, ";
		$sql .= "`state_id` varchar(255) NOT NULL, ";
		$sql .= "`state_name` varchar(255) NOT NULL, ";
		$sql .= "`county_fips` int(100) NOT NULL, ";
		$sql .= "`county_name` varchar(255) NOT NULL, ";
		$sql .= "`lat` varchar(255) NOT NULL, ";
		$sql .= "`lng` varchar(255) NOT NULL, ";
		$sql .= "`population` int(100) NOT NULL, ";
		$sql .= "`density` int(100) NOT NULL, ";
		$sql .= "`source` varchar(255) NOT NULL, ";
		$sql .= "`military` varchar(255) NOT NULL, ";
		$sql .= "`incorporated` varchar(255) NOT NULL, ";
		$sql .= "`timezone` varchar(255) NOT NULL, ";
		$sql .= "`ranking` int(11) NOT NULL, ";
		$sql .= "`zips` text NOT NULL, ";
		$sql .= "`city_id` int(100) NOT NULL, ";
		$sql .= "PRIMARY KEY (`id`) ";
		$sql .= ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;";

		// Include Upgrade Script
		require_once( ABSPATH . '/wp-admin/includes/upgrade.php' );
	
		// Create Table
		dbDelta( $sql );
		//insert data into table
		if (($counties = fopen(plugin_dir_path( __FILE__ ) . 'db/county_cities.csv', 'r')) !== FALSE) {
			while ($county = fgetcsv($counties, 10000, ',')) {
				//echo"<pre>";print_r($county);echo"</pre>";die(" didee");
				 $wpdb->insert( $county_cities, array(
					'city' => $county[1], 
					'city_ascii' => $county[2],
					'state_id' => $county[3], 
					'state_name' => $county[4],
					'county_fips' => $county[5], 
					'county_name' => $county[6], 
					'lat' => $county[7],
					'lng' => $county[8], 
					'population' => $county[9], 
					'density' => $county[10],
					'source' => $county[11], 
					'military' => $county[12], 
					'incorporated' => $county[13], 
					'timezone' => $county[14],
					'ranking' => $county[15], 
					'zips' => $county[16], 
					'city_id' => $county[17] ) 
				);
				
			}
		}
	}
	
	
} 
register_activation_hook( __FILE__, 'calculator_plugin_activate' );
add_action( 'wp_ajax_get_price', 'get_price' );
add_action( 'wp_ajax_nopriv_get_price', 'get_price' );
function get_price() {	

	$url = "https://zillow-com1.p.rapidapi.com/propertyExtendedSearch?location=" . urlencode($_POST["address"]) ; 
		
	$curl = curl_init();
	curl_setopt_array($curl, [
		CURLOPT_URL => $url,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_FOLLOWLOCATION => true,
		CURLOPT_ENCODING => "",
		CURLOPT_MAXREDIRS => 10,
		CURLOPT_TIMEOUT => 30,
		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		CURLOPT_CUSTOMREQUEST => "GET",
		CURLOPT_HTTPHEADER => [
			"x-rapidapi-host: zillow-com1.p.rapidapi.com",
			"x-rapidapi-key: aa1e5f2382msh2e1f4b1ad7461d1p177d4djsn20d21cd9821e"
		],
	]);

	$response = json_decode( curl_exec($curl) );
	
	if ( isset( $response->zpid ) ) {
		
		$curl1 = curl_init();
		curl_setopt_array($curl1, [
			CURLOPT_URL => "https://zillow-com1.p.rapidapi.com/property?zpid=" . $response->zpid,
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_FOLLOWLOCATION => true,
			CURLOPT_ENCODING => "",
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 30,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => "GET",
			CURLOPT_HTTPHEADER => [
				"x-rapidapi-host: zillow-com1.p.rapidapi.com",
				"x-rapidapi-key: aa1e5f2382msh2e1f4b1ad7461d1p177d4djsn20d21cd9821e"
			],
		]);

		echo curl_exec($curl1);
		
	}
	
	wp_die();
	
}
 
add_action( 'wp_ajax_gv_mortgage_calc', 'gv_mortgage_calc_backend' );
add_action( 'wp_ajax_nopriv_gv_mortgage_calc', 'gv_mortgage_calc_backend' );
function gv_mortgage_calc_backend() {	

	$assets = $_GET['assets'];
	$assets2 = $_GET['assets2'];
	$income = $_GET['income'];
	$score = $_GET['score'];
	$county = $_GET['county'];
	$zip = $_GET['zip'];

	$debt = $_GET['debt'];
	$type = $_GET['type'];
	$period = $_GET['period'];
	$usage = $_GET['usage'];
	$property = $_GET['property'];
	$history = $_GET['history'];

	$important = 0;

	if (($counties = fopen(plugin_dir_path( __FILE__ ) . 'db/maxloanamount.csv', 'r')) !== FALSE) {
		while ($countyLimit = fgetcsv($counties, 0, ',')) {

			if ($countyLimit[0] == $county) {
				if ($property == 0) {
					$maximumLoanAmount = $countyLimit[1];
				}
				if ($property == 1) {
					$maximumLoanAmount = $countyLimit[1];
				}
				if ($property == 2) {
					$maximumLoanAmount = $countyLimit[2];
				}
				if ($property == 3) {
					$maximumLoanAmount = $countyLimit[3];
				}
				if ($property == 4) {
					$maximumLoanAmount = $countyLimit[4];
				}
			}
		}
		fclose($counties);
	}
	$closingCosts = $maximumLoanAmount * .01;
	$assets = $assets + $assets2;
	$varAssets = $assets;
	$downPayment = $varAssets - $closingCosts;

	function Calculations(	$limit = 50,
							$assets,
							$assets2,
							$income,
							$score,
							$county,
							$zip,
							$debt,
							$type,
							$period,
							$usage,
							$property,
							$history,
							$important,
							$maximumLoanAmount,
							$closingCosts,
							$varAssets,
							$downPayment) {

		$i = 0;
		$k = 0;
		$l = 0;
		while ($i < 1) {
			while ($k < 1) {
				while ($l < 1) {
					$downPayment = $varAssets - $closingCosts;
					$maximumHousePrice = $downPayment + $maximumLoanAmount;
					$downPaymentPercent = $downPayment / $maximumHousePrice * 100;
					
					$loanToValue = $maximumLoanAmount / $maximumHousePrice * 100;

					if ($loanToValue < 5) {
						if (($varAssets - 500) > 0) {
							$varAssets -= 500;
							$downPayment = $varAssets - $closingCosts;
						} else {
							$maximumLoanAmount = 0;
							$maximumHousePrice = 0;
							$errorObject = 'LTV < 5 & Assets < 0';
							break 3;
						}								
					} else if ($loanToValue > 95) {								
						$maximumLoanAmount -= 1000;
						$closingCosts = $maximumLoanAmount * .015;
					} else {
						break;
					}
				}


				if ($type == 'conventional') {
					$companyRevenue = 1.0;
					$LLPAs = 0;

					if ($score >= 620 && $score < 640) {
						$row = 6;
					} else if ($score >= 640 && $score < 660) {
						$row = 5;
					} else if ($score >= 660 && $score < 680) {
						$row = 4;
					} else if ($score >= 680 && $score < 700) {
						$row = 3;
					} else if ($score >= 700 && $score < 720) {
						$row = 2;
					} else if ($score >= 720 && $score < 740) {
						$row = 1;
					} else if ($score >= 740) {
						$row = 0;
					}

					if ($loanToValue <= 60) {
						$col = 0;
					} else if ($loanToValue > 60 && $loanToValue <= 70) {
						$col = 1;
					} else if ($loanToValue > 70 && $loanToValue <= 75) {
						$col = 2;
					} else if ($loanToValue > 75 && $loanToValue <= 80) {
						$col = 3;
					} else if ($loanToValue > 80 && $loanToValue <= 85) {
						$col = 4;
					} else if ($loanToValue > 85 && $loanToValue <= 90) {
						$col = 5;
					} else if ($loanToValue > 90 && $loanToValue <= 95) {
						$col = 6;
					} else if ($loanToValue > 95 && $loanToValue <= 97) {
						$col = 7;
					}
					

					if (($creditScoreAdjustmentsFile = fopen(plugin_dir_path( __FILE__ ) . 'db/conv_ScoreAdjustment.csv', 'r')) !== FALSE) {
						$n = 0;
						while ($creditScoreAdjustments = fgetcsv($creditScoreAdjustmentsFile, 0, ',')) {
							if ($n == $row) {
								$creditScoreAdjustment = $creditScoreAdjustments[$col];
							}
							$n++;
						}
						fclose($creditScoreAdjustmentsFile);
					}

					if ($property >= 2) {
						$LLPAs += 1.000;
					} 
					if ($property == 1) {
						$LLPAs += 0.750;
					}
					if ($usage == 3) {
						if ( ($downPayment / $maximumHousePrice * 100) >= 25 ) {
							$LLPAs += 2.125;
						} else if ( ($downPayment / $maximumHousePrice * 100) < 25  && ($downPayment / $maximumHousePrice * 100) >= 20 ) {
							$LLPAs += 3.375;
						} else {
							$LLPAs += 4.125;
						}
					}
					if ($maximumLoanAmount <= 75000) {
						$LLPAs += 0.625;
					} else if ($maximumLoanAmount > 75000 && $maximumLoanAmount <= 99999) {
						$LLPAs += 0.375;
					}
					if ($maximumLoanAmount > 484350) {
						$LLPAs += 0;
					}

					$totalLoanCost = $companyRevenue + $creditScoreAdjustment + $LLPAs;



					if (($rateSheets = fopen(plugin_dir_path( __FILE__ ) . 'db/conv_' . $period . '.csv', 'r')) !== FALSE) {
						while ($rateSheet = fgetcsv($rateSheets, 0, ',')) {
							if ($rateSheet[1] >= $totalLoanCost) {
								$interestRate = $rateSheet[0];
							}
							if ($rateSheet[1] < $totalLoanCost) {
								break;
							}
						}
						fclose($rateSheets);
					}
				}

				if ($type == 'FHA' || $type == 'VA') {

					$companyRevenue = 1.0;
					$LLPAs = 0;

					if ($score >= 550 && $score < 580) {
						$creditScoreAdjustment = 3.375;
					} else if ($score >= 580 && $score < 600) {
						$creditScoreAdjustment = 2.625;
					} else if ($score >= 600 && $score < 620) {
						$creditScoreAdjustment = 1.750;
					} else if ($score >= 620 && $score < 640) {
						$creditScoreAdjustment = 1.000;
					} else if ($score >= 640 && $score < 660) {
						$creditScoreAdjustment = 0.500;
					} else if ($score >= 660 && $score < 680) {
						$creditScoreAdjustment = 0.125;
					} else if ($score >= 680 && $score < 700) {
						$creditScoreAdjustment = -0.25;
					} else if ($score >= 700 && $score < 720) {
						$creditScoreAdjustment = -0.125;
					} else if ($score >= 700 && $score < 720) {
						$creditScoreAdjustment = -0.375;
					} else if ($score >= 720) {
						$creditScoreAdjustment = -0.250;
					}

					$totalLoanCost = $companyRevenue + $creditScoreAdjustment + $LLPAs;

					if ($type == 'FHA') {
						if (($rateSheets = fopen(plugin_dir_path( __FILE__ ) . 'db/FHA_' . $period . '.csv', 'r')) !== FALSE) {
							while ($rateSheet = fgetcsv($rateSheets, 0, ',')) {
								if ($rateSheet[1] >= $totalLoanCost) {
									$interestRate = $rateSheet[0];
								}
								if ($rateSheet[1] < $totalLoanCost) {
									break;
								}
							}
							fclose($rateSheets);
						}
					}
					if ($type == 'VA') {
						if (($rateSheets = fopen(plugin_dir_path( __FILE__ ) . 'db/VA_' . $period . '.csv', 'r')) !== FALSE) {
							while ($rateSheet = fgetcsv($rateSheets, 0, ',')) {
								if ($rateSheet[1] >= $totalLoanCost) {
									$interestRate = $rateSheet[0];
								}
								if ($rateSheet[1] < $totalLoanCost) {
									break;
								}
							}
							fclose($rateSheets);
						}
					}
					
				}
				

				//Mortgage Payment
				$mortgagePayment = ($maximumLoanAmount) * (($interestRate / 1200 * pow(1+$interestRate/1200, $period * 12)) / (pow(1+$interestRate/1200, $period * 12) - 1));

				//Monthly Property Tax Amount
				$monthlyPropertyTax = $maximumHousePrice * 1.25 / 100 / 12;

				//Hazard Insurance Amount
				$hazardInsurance = $maximumHousePrice * .25 / 100 / 12;

				//Mortgage Insurance Amount
				if ($downPaymentPercent < 20) {
					if ($score >= 620 && $score < 640) {
						$mortgageInsuranceRate = 1.21;
					} else if ($score >= 640 && $score < 660) {
						$mortgageInsuranceRate = 1.16;
					} else if ($score >= 660 && $score < 680) {
						$mortgageInsuranceRate = 1.09;
					} else if ($score >= 680 && $score < 700) {
						$mortgageInsuranceRate = .85;
					} else if ($score >= 700 && $score < 720) {
						$mortgageInsuranceRate = .66;
					} else if ($score >= 720 && $score < 740) {
						$mortgageInsuranceRate = .58;
					} else if ($score >= 740 && $score < 760) {
						$mortgageInsuranceRate = .47;
					} else if ($score >= 760) {
						$mortgageInsuranceRate = .33;
					}
				} else {
					$mortgageInsuranceRate = 0;
				}
				
				if ($type == 'conventional') {
					$mortgageInsurance = $maximumLoanAmount * $mortgageInsuranceRate / 100 / 12;
				}
				if ($type == 'FHA') {
					$mortgageInsurance = $maximumLoanAmount * 0.8 / 100 / 12; // 1.75% of Loan Amount - one-time payment
				}
				if ($type == 'VA') {
					$mortgageInsurance = 0; // 2.15% of Loan Amount - one-time payment
				}

				$totalMortgagePayment = $mortgagePayment + $monthlyPropertyTax + $hazardInsurance + $mortgageInsurance;
				$totalMortgagePaymentPercent = $totalMortgagePayment / ($income / 12) * 100;

				$debtToIncome = ($totalMortgagePayment + $debt) / ($income / 12) * 100;

				if ($maximumLoanAmount >= 75000) {
					if ($debtToIncome < $limit) {

						$superObject['maximumHousePrice'] = round($maximumHousePrice);
						$superObject['maximumLoanAmount'] = round($maximumLoanAmount);

						$superObject['downPayment'] = round($downPayment);
						$superObject['downPaymentPercent'] = floor($downPaymentPercent);
						$superObject['closingCosts'] = round($closingCosts);

						$superObject['interestRate'] = $interestRate;

						$superObject['monthlyPropertyTax'] = round($monthlyPropertyTax);
						$superObject['hazardInsurance'] = round($hazardInsurance);
						$superObject['mortgageInsurance'] = round($mortgageInsurance);

						$superObject['mortgagePayment'] = round($mortgagePayment);
						$superObject['totalMortgagePayment'] = round($totalMortgagePayment);
						$superObject['totalPayments'] = round($totalMortgagePayment + $debt);
						$superObject['debtToIncome'] = ceil($debtToIncome);
						$superObject['loanToValue'] = $loanToValue;

						break 2;
					} else if ($debtToIncome < $limit && $debtToIncome < ($limit - 1)) {
						if ($varAssets - 500 > 0) {
							$varAssets -= 500;
						} else {
							$maximumLoanAmount = 0;
							$maximumHousePrice = 0;
							$errorObject = 'DTI <'.$limit.' & DTI <'.($limit-1).' & Assets < 0';
							break 2;
						}	
					} else {
						$maximumLoanAmount -= 1000;
						$closingCosts = $maximumLoanAmount * .01;
					}
				} else {
					break 2;
					$errorObject = 'Loan Amount < 75000';
				}
			}

			if ($varAssets - 500 > 0) {
				$varAssets -= 500;
			} else {
				$maximumLoanAmount = 0;
				$maximumHousePrice = 0;
				$errorObject = 'Assets < 0';
				break;
			}					
		}

		$arr = [];
		$arr[] = $maximumLoanAmount;
		$arr[] = $maximumHousePrice;

		if (isset($superObject)) {
			$arr[] = $superObject;
		} 
		if (isset($errorObject)) {
			$arr[] = $errorObject;
		}
		
		return $arr;
	}

	$compArrLoanAmount = [];
	$compArrHousePrice = [];
	if ($type == 'conventional') {
		$maxRange = 50;
	}
	if ($type == 'FHA') {
		$maxRange = 56;
	}
	if ($type == 'VA') {
		$maxRange = 47;
	}
	for ($comp = 20; $comp <= $maxRange; $comp++) {
		$val = Calculations($comp,
							$assets,
							$assets2,
							$income,
							$score,
							$county,
							$zip,
							$debt,
							$type,
							$period,
							$usage,
							$property,
							$history,
							$important,
							$maximumLoanAmount,
							$closingCosts,
							$varAssets,
							$downPayment);
		$compArrLoanAmount[] = $val[0];
		$compArrHousePrice[] = $val[1];
	}
	if ($important == 1) {
		$compResult = max($compArrHousePrice);
		$index = array_search($compResult, $compArrHousePrice);
	} else {
		$compResult = max($compArrLoanAmount);
		$index = array_search($compResult, $compArrLoanAmount);
	}
	
	$superObject = [];
	for ($i = 20; $i <= $maxRange; $i++) {
		$aaa = Calculations($i,
							$assets,
							$assets2,
							$income,
							$score,
							$county,
							$zip,
							$debt,
							$type,
							$period,
							$usage,
							$property,
							$history,
							$important,
							$maximumLoanAmount,
							$closingCosts,
							$varAssets,
							$downPayment);
		$superObject['best'] = $index + 20;
		if ($aaa[2]['debtToIncome'] != $i) {
			if ($aaa[2]['debtToIncome'] == $superObject['DTIs'][$i-1]['debtToIncome'] && $i > 20 && $aaa[2]['debtToIncome'] > 20 && $aaa[2]['debtToIncome'] < ($index + 20)) {
				$aaa[2]['debtToIncome'] = $i;
				$superObject['DTIs'][$i] = $aaa[2];
			} else if ($aaa[2]['debtToIncome'] < 20) {
				$superObject['DTIs'][$i] = 'error';
			} else {
				$superObject['DTIs'][$i] = 'error';
			}
		} else {
			$superObject['DTIs'][$i] = $aaa[2];
		}
		if (isset($superObject[e])) {
			unset($superObject[e]);
		}		
		$superObject['min'] = 100;
		foreach ($superObject['DTIs'] as $object) {
			if ($object != 'error') {
				if ($superObject['min'] == 100 || $superObject['min'] > $object['debtToIncome']) {
					$superObject['min'] = $object['debtToIncome'];
				}
				$superObject['max'] = $object['debtToIncome'];
			}
		}
	}
	$resultObject = $superObject;
	
	/* Pull data from ZIllow */
	$zip = $_GET['zip'];
	$address = $_GET['address'];
	
	if ( $_GET['property'] == 0 ) {
		
		$home_type = "Houses";
		
	} else if ( $_GET['property'] == 1 ) {
		
		$home_type = "Condos,Townhomes";
		
	} else if ( $_GET['property'] == 2 || $_GET['property'] == 3 || $_GET['property'] == 4 ) {
		
		$home_type = "Multi-family";
		
	}
	
	//$home_type = "";
	$price = $resultObject["DTIs"][$resultObject["best"]]["maximumHousePrice"];
		
	$minPrice = $price - ( round($price * 0.1 ) );
	$maxPrice = $price + ( round($price * 0.05) );
		
	//$minPrice = 908718;
	//$maxPrice = 1192691;
	//echo $price . " " . $minPrice . " "  . $maxPrice;
	
	$url = "https://zillow-com1.p.rapidapi.com/propertyExtendedSearch?status_type=ForSale&location=" . $zip . "&home_type=" . $home_type . "&minPrice=" . $minPrice . "&maxPrice=" . $maxPrice; 
	
	$curl = curl_init();
	curl_setopt_array($curl, [
		CURLOPT_URL => $url,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_FOLLOWLOCATION => true,
		CURLOPT_ENCODING => "",
		CURLOPT_MAXREDIRS => 10,
		CURLOPT_TIMEOUT => 30,
		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		CURLOPT_CUSTOMREQUEST => "GET",
		CURLOPT_HTTPHEADER => [
			"x-rapidapi-host: zillow-com1.p.rapidapi.com",
			"x-rapidapi-key: aa1e5f2382msh2e1f4b1ad7461d1p177d4djsn20d21cd9821e"
		],
	]);

	$response = json_decode(curl_exec($curl));
	
	//print_r($response);
	
	//if ( $address == "" ) {	
	
		$resultObject["zillow"] = $response;
	
	/*	
	} else {
		
		curl_setopt_array($curl, [
			CURLOPT_URL => "https://zillow-com1.p.rapidapi.com/property?zpid=" . $response->zpid,
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_FOLLOWLOCATION => true,
			CURLOPT_ENCODING => "",
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 30,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => "GET",
			CURLOPT_HTTPHEADER => [
				"x-rapidapi-host: zillow-com1.p.rapidapi.com",
				"x-rapidapi-key: aa1e5f2382msh2e1f4b1ad7461d1p177d4djsn20d21cd9821e"
			],
		]);

		$response = json_decode(curl_exec($curl));
		
		$resultObject["zillow"] = $response;
		
	}	
	
	print_r($response);
	*/
	
	echo json_encode($resultObject);

	wp_die();
}

function gv_mortgage_calc_HTML($atts, $content = null) {
	$a = shortcode_atts( array(
		'color' => 'light'
	), $atts );

	static $id = 0;
	$id++;

	static $ids = array();
	$ids[] = $id;
	
	$version = '1.0.0';
	ob_start();

	include( plugin_dir_path( __FILE__ ) . 'gv-mortgage-calc-frontend.php');
	
	wp_enqueue_script( 'gv_mortgage_calc_script_1', plugins_url( 'js/bootstrap.bundle.min.js', __FILE__ ), array( 'jquery' ) );
	wp_enqueue_script( 'gv_mortgage_calc_script_2', plugins_url( 'js/jquery-ui.min.js', __FILE__ ), array( 'jquery' ) );
	wp_enqueue_script( 'gv_mortgage_calc_script_3', plugins_url( 'js/jquery.ui.touch-punch.min.js', __FILE__ ), array( 'jquery' ) );
	wp_enqueue_script( 'gv_mortgage_calc_script_4', plugins_url( 'js/lc_switch.min.js', __FILE__ ), array( 'jquery' ) );
	wp_enqueue_script( 'gv_mortgage_calc_script_5', plugins_url( 'js/morris.js', __FILE__ ), array( 'jquery' ) );
	wp_enqueue_script( 'gv_mortgage_calc_script_6', plugins_url( 'js/raphael.min.js', __FILE__ ), array( 'jquery' ) );
	wp_enqueue_script( 'gv_mortgage_calc_script', plugins_url( 'js/script.js', __FILE__ ), array( 'jquery' ), time() );
	wp_localize_script( 'gv_mortgage_calc_script', 'gvMortgageCalcPlugin', array(
		'ajaxurl' => admin_url( 'admin-ajax.php' ),
		'ids' => $ids
	));
	wp_enqueue_style( 'style-range-css', plugins_url( 'css/style-range.css', __FILE__ ), array(), rand(), 'all');
	wp_enqueue_script( 'script-range-js', plugins_url( 'js/script-range.js', __FILE__ ), array(), rand(), true );

	return ob_get_clean();
}
add_shortcode('gv_mortgage_calculator', 'gv_mortgage_calc_HTML');

add_action( 'wp_enqueue_scripts', 'new_custom_scripts_and_styles' );
function new_custom_scripts_and_styles() {
	wp_enqueue_style( 'gv-font-awesome', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css', array(), rand(), 'all');
	wp_enqueue_style( 'gv-slick', plugins_url( 'slick/slick.css', __FILE__ ), array(), rand(), 'all');
	wp_enqueue_style( 'gv-slick-theme', plugins_url( 'slick/slick-theme.css', __FILE__ ), array(), rand(), 'all');
	wp_enqueue_script( 'gv-slick', plugins_url( 'slick/slick.js', __FILE__ ), array(), rand(), true );
	wp_enqueue_style( 'gv-style-custom', plugins_url( 'css/gv-custom-style.css', __FILE__ ), array(), rand(), 'all');
	wp_enqueue_script( 'gv-js-cookie', plugins_url( 'js/jquery.cookie.js', __FILE__ ), array(), rand(), true );
	wp_enqueue_script( 'gv-validate', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.5/jquery.validate.min.js', array(), rand(), true );
	wp_enqueue_script( 'gv-validate-additional', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.5/additional-methods.min.js', array(), rand(), true );
	$user_id = get_current_user_id();
	wp_localize_script( 'gv-validate', 'myAjax', array( 'ajaxurl' => admin_url( 'admin-ajax.php'),'siteurl' => site_url(),"user_id" => $user_id));
	wp_enqueue_script( 'gv-script-custom', plugins_url( 'js/gv-custom-script.js', __FILE__ ), array(), rand(), true );
}

add_action("wp_ajax_add_user_for_calculator", "add_user_for_calculator_function");
add_action("wp_ajax_nopriv_add_user_for_calculator", "add_user_for_calculator_function");

function add_user_for_calculator_function(){
	global $wpdb;
	//echo"<pre>";print_r($_REQUEST);echo"</pre>";die(' working');
    $first_name = $_REQUEST["first_name"];
    $last_name = $_REQUEST["last_name"];
    $user_email = $_REQUEST["email"];
    $phone = $_REQUEST["phone"];
    $message = $_REQUEST["message"];
	$username = strstr($user_email, '@', true); 
    $random_password = wp_generate_password( $length = 12, $include_standard_special_chars = false );

    if (username_exists($username) == null && email_exists($user_email) == false) {
		$new_user_id = wp_create_user( $username, $random_password, $user_email );
		$user = get_user_by('id', $new_user_id);
		$user->add_role('subscriber');
		update_user_meta($new_user_id,"first_name",$first_name);
		update_user_meta($new_user_id,"last_name",$last_name);
		update_user_meta($new_user_id,"phone",$phone);
		update_user_meta($new_user_id,"message",$message);
		$creds = array(
			'user_login' => $username,
			'user_password' => $random_password,
			'remember' => false
		);
		$user_verify = wp_signon( $creds, false );
		wp_clear_auth_cookie();
		//do_action('wp_login', $user_verify->ID);
		wp_set_current_user($user_verify->ID);
		wp_set_auth_cookie($user_verify->ID, true);
		//wp_new_user_notification($new_user_id, $random_password);
		$user_id = $new_user_id;
		$firstname = $user->first_name;
		$email = $user->user_email;
		$adt_rp_key = get_password_reset_key( $user );
		$user_login = $user->user_login;
		$rp_link = '<a href="' . wp_login_url()."?action=rp&key=$adt_rp_key&login=" . rawurlencode($user_login) . '">' . wp_login_url()."?action=rp&key=$adt_rp_key&login=" . rawurlencode($user_login) . '</a>';

		if ($firstname == "") $firstname = "User";
		$message = "Hi ".$firstname.",<br>";
		$message .= "An account has been created on ".get_bloginfo( 'name' )." for email address ".$email."<br>";
		$message .= "Here is your Password: $random_password <br>";
		$message .= "Click here to set the password for your account: <br>";
		$message .= $rp_link.'<br>';

		//deze functie moet je zelf nog toevoegen. 
		$subject = __("Your account on ".get_bloginfo( 'name'));
		$headers = array();

		add_filter( 'wp_mail_content_type', function( $content_type ) {return 'text/html';});
		wp_mail( $email, $subject, $message);
		remove_filter( 'wp_mail_content_type', 'set_html_content_type' );
		 
	}else{
		echo json_encode(array("type"=>"error","message"=>"<li>User Already Exists</li>"));
		die;
	}
	$curl = curl_init();
	curl_setopt_array($curl, array(
	  CURLOPT_URL => 'https://agentamplification.com/staging/wp-json/properties/v1/user/register',
	  CURLOPT_RETURNTRANSFER => true,
	  CURLOPT_ENCODING => '',
	  CURLOPT_MAXREDIRS => 10,
	  CURLOPT_TIMEOUT => 0,
	  CURLOPT_FOLLOWLOCATION => true,
	  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	  CURLOPT_CUSTOMREQUEST => 'POST',
	  CURLOPT_POSTFIELDS => array('username' => $username,'user_password' => $random_password,'user_email' => $user_email,'first_name' => $first_name,"last_name"=>$last_name),
	));
	$response = curl_exec($curl);
	curl_close($curl);
	echo json_encode(array("type"=>"success","message"=>"<li>user registered successfully</li>","user_id"=>$new_user_id));
	die;
}
add_action("wp_ajax_login_user_for_calculator_action", "login_user_for_calculator_function");
add_action("wp_ajax_nopriv_login_user_for_calculator_action", "login_user_for_calculator_function");

function login_user_for_calculator_function(){
	global $wpdb;
	//echo"<pre>";print_r($_REQUEST);echo"</pre>";die(' working');

    $gv_email = $_REQUEST["gv_email"];
    $gv_password = $_REQUEST["gv_password"];

	if (email_exists($gv_email) == false) {
		echo json_encode(array("type"=>"error","message"=>"<li>User Not Exists</li>"));
		die; 
	}
	 
	$creds = array(
		'user_login' => $gv_email,
		'user_password' => $gv_password,
		'remember' => false
	);
	$user_verify = wp_signon( $creds, false );
	//echo"<pre>";print_r($user_verify);echo"</pre>";die(' working');
	if(is_wp_error($user_verify)){
		echo json_encode(array("type"=>"error","message"=>"<li>Invalid login details</li>"));
		die; 
	}else{
		wp_clear_auth_cookie();
		do_action('wp_login', $user_verify->ID);
		wp_set_current_user($user_verify->ID);
		wp_set_auth_cookie($user_verify->ID, true);
	}
	$curl = curl_init();
	curl_setopt_array($curl, array(
	  CURLOPT_URL => 'https://agentamplification.com/staging/wp-json/properties/v1/user/login',
	  CURLOPT_RETURNTRANSFER => true,
	  CURLOPT_ENCODING => '',
	  CURLOPT_MAXREDIRS => 10,
	  CURLOPT_TIMEOUT => 0,
	  CURLOPT_FOLLOWLOCATION => true,
	  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	  CURLOPT_CUSTOMREQUEST => 'POST',
	  CURLOPT_POSTFIELDS => array('user_password' => $gv_password,'user_email' => $gv_email),
	));
	$response = curl_exec($curl);
	curl_close($curl);

	echo json_encode(array("type"=>"success","message"=>"<li>User Logged in successfully</li>","user_id"=>$user_verify->ID));
	die;
}

add_action("wp_ajax_forgot_password_calculator_action", "forgot_password_calculator_function");
add_action("wp_ajax_nopriv_forgot_password_calculator_action", "forgot_password_calculator_function");
function forgot_password_calculator_function(){
	global $wpdb;
	//echo"<pre>";print_r($_REQUEST);echo"</pre>";die(' working');

    $gv_email = $_REQUEST["gv_email"];
    $gv_password = $_REQUEST["gv_password"];

	if (email_exists($gv_email) == false) {
		echo json_encode(array("type"=>"error","message"=>"<li>User Not Exists</li>"));
		die; 
	}
	 
	$user = get_user_by( 'email', $gv_email );
	$user_id = $user->ID;
    $firstname = $user->first_name;
    $email = $user->user_email;
    $adt_rp_key = get_password_reset_key( $user );
    $user_login = $user->user_login;
    $rp_link = '<a href="' . wp_login_url()."?action=rp&key=$adt_rp_key&login=" . rawurlencode($user_login) . '">' . wp_login_url()."?action=rp&key=$adt_rp_key&login=" . rawurlencode($user_login) . '</a>';

    if ($firstname == "") $firstname = "User";
    $message = "Hi ".$firstname.",<br>";
    $message .= "Someone Request passowrd reset on ".get_bloginfo( 'name' )." for email address ".$email."<br>";
    $message .= "Click here to set the password for your account: <br>";
    $message .= $rp_link.'<br>';

	//deze functie moet je zelf nog toevoegen. 
	$subject = __("Password Reset: on ".get_bloginfo( 'name'));
	$headers = array();

	add_filter( 'wp_mail_content_type', function( $content_type ) {return 'text/html';});
	wp_mail( $email, $subject, $message);
	remove_filter( 'wp_mail_content_type', 'set_html_content_type' );
	echo json_encode(array("type"=>"success","message"=>"<li>Reset Password link Send to your email</li>","user_id"=>$user_id));
	die;
}

add_action("wp_ajax_user_calculator_collections_action", "user_calculator_collections_function");
add_action("wp_ajax_nopriv_user_calculator_collections_action", "user_calculator_collections_function");

function user_calculator_collections_function(){
	global $wpdb;
	//echo"<pre>";print_r($_REQUEST);echo"</pre>";die(' working');
	$user_calculator_collections = $wpdb->prefix."user_calculator_collections";
	$user_id = get_current_user_id();
	$available_assets = (isset($_REQUEST['available_assets']) ? $_REQUEST['available_assets'] : "");
	$assets_from_sale = (isset($_REQUEST['assets_from_sale']) ? $_REQUEST['assets_from_sale'] : "");
	$annual_gross_income = (isset($_REQUEST['annual_gross_income']) ? $_REQUEST['annual_gross_income'] : "");
	$credit_score = (isset($_REQUEST['credit_score']) ? $_REQUEST['credit_score'] : "");
	$county = (isset($_REQUEST['county']) ? $_REQUEST['county'] : "");
	$county_city = (isset($_REQUEST['county_city']) ? $_REQUEST['county_city'] : "");
	$zip_code_cal = (isset($_REQUEST['zip_code_cal']) ? $_REQUEST['zip_code_cal'] : "");
	$monthly_debt_payment = (isset($_REQUEST['monthly_debt_payment']) ? $_REQUEST['monthly_debt_payment'] : "");
	$loan_type = (isset($_REQUEST['loan_type']) ? $_REQUEST['loan_type'] : "");
	$period = (isset($_REQUEST['period']) ? $_REQUEST['period'] : "");
	$property_usage = (isset($_REQUEST['property_usage']) ? $_REQUEST['property_usage'] : "");
	$property_type = (isset($_REQUEST['property_type']) ? $_REQUEST['property_type'] : "");
	$purchase_history = (isset($_REQUEST['purchase_history']) ? $_REQUEST['purchase_history'] : "");
	$estimated_home_value = (isset($_REQUEST['estimated_home_value']) ? $_REQUEST['estimated_home_value'] : "");
	$street = (isset($_REQUEST['street']) ? $_REQUEST['street'] : "");
	$city = (isset($_REQUEST['city']) ? $_REQUEST['city'] : "");
	$state = (isset($_REQUEST['state']) ? $_REQUEST['state'] : "");
	$zip_code = (isset($_REQUEST['zip_code']) ? $_REQUEST['zip_code'] : "");
	$current_mortgage_balance = (isset($_REQUEST['current_mortgage_balance']) ? $_REQUEST['current_mortgage_balance'] : "");
	$repairs_andor_credits = (isset($_REQUEST['repairs_andor_credits']) ? $_REQUEST['repairs_andor_credits'] : "");
	$annual_property_tax_amount = (isset($_REQUEST['annual_property_tax_amount']) ? $_REQUEST['annual_property_tax_amount'] : "");
	$close_the_sale = (isset($_REQUEST['close_the_sale']) ? $_REQUEST['close_the_sale'] : "");
	$for_sale_by_owner = (isset($_REQUEST['for_sale_by_owner']) ? $_REQUEST['for_sale_by_owner'] : "");
	$calculate_clicked = 1;
	$calculate_time = date("Y-m-d H:i:s");
	//$post_id = $wpdb->get_results("SELECT post_id FROM $user_calculator_collections WHERE meta_key = 'mfn-post-link1' AND meta_value =");

	$wpdb->insert( 
        $user_calculator_collections, 
        array( 
            'user_id' => $user_id, 
            'available_assets' => $available_assets, 
            'assets_from_sale' => $assets_from_sale, 
            'annual_gross_income' => $annual_gross_income, 
            'credit_score' => $credit_score, 
            'county' => $county, 
            'county_city' => $county_city, 
            'zip_code_cal' => $zip_code_cal, 
            'monthly_debt_payment' => $monthly_debt_payment, 
            'loan_type' => $loan_type, 
            'period' => $period, 
            'property_usage' => $property_usage, 
            'property_type' => $property_type, 
            'purchase_history' => $purchase_history, 
            'estimated_home_value' => $estimated_home_value, 
            'street' => $street, 
            'city' => $city, 
            'state' => $state, 
            'zip_code' => $zip_code, 
            'current_mortgage_balance' => $current_mortgage_balance, 
            'repairs_andor_credits' => $repairs_andor_credits, 
            'annual_property_tax_amount' => $annual_property_tax_amount, 
            'close_the_sale' => $close_the_sale, 
            'for_sale_by_owner' => $for_sale_by_owner, 
            'calculate_clicked' => $calculate_clicked, 
            'calculate_time' => $calculate_time, 
        ) 
    );
    $id = $wpdb->insert_id;

	echo json_encode(array("type"=>"success","message"=>"Inserted successfully","user_id"=>$user_id,"insert_id"=>$id));
	die;
}

add_action("wp_ajax_get_cities_by_county_action", "get_cities_by_county_function");
add_action("wp_ajax_nopriv_get_cities_by_county_action", "get_cities_by_county_function");
function get_cities_by_county_function(){
	global $wpdb;
	$county = "Alameda";
	$table = $wpdb->prefix."county_cities";
	$html="";
	$county = (isset($_REQUEST["county"]) ? $_REQUEST["county"] : $county );
	
	$cities = $wpdb->get_results('SELECT * FROM '.$table.' WHERE county_name ="'.$county.'"');
	//echo"<pre>";print_r($cities);echo"</pre>";die(" working");
	if($cities){
		foreach($cities as $city){
			$value = str_replace(" ", "-",$city->city);
			$html.="<option value='".strtolower($value)."'>".$city->city."</option>";
		}
	}	
	echo json_encode(array("type"=>"success","options"=>$html));
	die;
}
/*
add_action( 'admin_menu', 'wpdocs_register_API_custom_menu_page' );
function wpdocs_register_API_custom_menu_page(){
	add_menu_page( 
		__( 'Calculator Records', 'textdomain' ),
		'Calculator Records',
		'manage_options',
		'calculator-records-page',
		'API_custom_menu_page',
		"dashicons-rest-api",
		6
	); 
}
function API_custom_menu_page(){
	esc_html_e( 'Admin Page Test', 'textdomain' );	
	include(plugin_dir_path( __FILE__ )."calculator-records.php");

	
}
*/
