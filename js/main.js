/* global $ */
(function(){


	// Give name input focus
	$("input[id='name']").focus();

	// Create & hide 'other' input field until selected
	var otherTitle = $("#other-title");
	$("#other-title").detach();

	// On 'title' input change
	$("select[id='title']").change(function() {

		// If 'other' is selected show field
		if($("select[id='title'] option:selected").text() == $("option[value='other']").text()) {
			$(".basic-info").append(otherTitle);
		} else {

			// Else hide field
			$("#other-title").detach();
		}

	});


	// Shirt theme options
	var themeSelect = $("option[class='select-theme']");
	var jsPuns = $("option[class='js-puns']");
	var heartJS = $("option[class='heart-js']");

	// Hide colors until a theme is selected
	$("#color-select").hide();
	$("label[for='color']").hide();

	// Show available color options for shirt themes & hide others
	$("select[id='design']").change(function() {

		if($("select[id='design'] option:selected").text() == $("option[value='js-puns']").text()) {
			themeSelect.detach();
			heartJS.detach();
			$("select[id='color']").append(jsPuns);
			$("label[for='color']").show();
			$("#color-select").show();
		} else if($("select[id='design'] option:selected").text() == $("option[value='heart-js']").text()) {
			themeSelect.detach();
			jsPuns.detach();
			$("select[id='color']").append(heartJS);
			$("label[for='color']").show();
			$("#color-select").show();
		} else if($("select[id='design'] option:selected").text() == $("option[value='select_theme']").text()) {
			$("#color-select").hide();
			$("label[for='color']").hide();
		}

	});


	// For each activites label element, give element properties of dateTime & price
	$(".activities label").each(function() {

		// Slice time & price text
		var valueLoc = $(this).text().indexOf("—") + 2;
		var values = $(this).text().slice(valueLoc).split(" ");

		// If label element has both date & price assign properties
		if(values[2]) {

			this.dateTime = values[0] + " " + values[1];
			this.price = parseInt(values[2].slice(1));

		// Else if label element only has price assign property
		} else {

			this.dateTime = "*";
			this.price = parseInt(values[0].slice(1));

		}

	});


	// Calculates price of all selected activities 
	function priceCalc() {

		// Reset total
		var total = 0;

		// Hide previous calculation
		$(".price").detach();

		// For each checked activity add together price properties
		$(".activities input:checked").each(function() {

			total += this.parentNode.price;

		});

		// Show new price
		$(".activities").append("<p class='price'>Total: $" + total + "</p>");

		// Hide price of 0
		if(total === 0) {
			$(".price").hide();
		}
	}


	// Disables conflicting date/time
	function timeCheck(x) {

		// Array of activities 
		var schd = $(".activities label");

		for(var i = 0; i < schd.length; i++) {

			// If any activity has the same date/time as x ( where x = selected activity ) AND if current iteration != x
			if(schd[i].dateTime == x.parentNode.dateTime && schd[i] != x.parentNode) {
				
				// Disable check input for conflicting date/time if x is checked when function runs
				if(x.checked) {
					schd[i].childNodes[0].disabled = true;
					schd[i].style.color = "gray";
				} 

				// Enable check input for previously conflicting date/time activities if x was not checked when function runs
				else {
					schd[i].childNodes[0].disabled = false;
					schd[i].style.color = "initial";
				}

			}
		} 
	}

	// Run when any activitie's input changes
	$(".activities input").change(function() {

		// Calculate price of all selected activities
		priceCalc();

		// Disable conflicting activitie's date/time values
		timeCheck(this);
	});


	// Initially show payment method of credit card & hide others
	var thisVal = $("#credit-card");

	$("#paypal").hide();
	$("#bitcoin").hide();

	// On payment method change
	$("select[id='payment']").change(function() {

		// Hide previously selected payment method
		thisVal.hide();

		// Store currently selected payment method
		thisVal = $("#" + $("#payment option:selected").val() + "");

		// Show new payment method
		thisVal.show();

	});


	// Disable submission of name field is empty
	function nameCheck(e) {

		if($("input[id='name']").val().length === 0) {
			e.preventDefault();

			// Apply required field indicator on attempted submission if blank
			$("label[for='name']").text("Name: (Please Provide A Name)").css("color", "red");
		} 

		// Remove required field indicator if field meets requirements
		else {$("label[for='name']").text("Name:").css("color", "initial");}

	}


	// Check for proper email format
	function emailFormatCheck() {

		// RegExp which checks for a pattern of /any text | @ symbol | any amount of text | dot | any text/
		var properFormat = new RegExp(/.@*.\..+/g);

		// Test email form value with RegExp
		var properFormatTest = properFormat.test($("input[id='mail']").val());

		// Return boolean
		return properFormatTest;

	}


	// Disable form submission if improper email format
	function emailCheck(e) {

		// If email format returned false prevent submission
		if(!emailFormatCheck()) {
			e.preventDefault();

			// Apply required field indicator
			$("label[for='mail']").text("Email: (Please Provide A Vaild Email)").css("color", "red");
		} 

		// Remove required field indicator if field meets requirements
		else {$("label[for='mail']").text("Email:").css("color", "initial");}

	}


	// Disable submission if no payment method is selected
	function paymentCheck(e) {

		// Prevent submission & apply required field indicator
		if($("select[id='payment']").val() == 'select_method') {
			e.preventDefault();
			$(".payment legend p").detach();
			$(".payment legend").append("<p>Please Select A Payment Mehotd</p>");
			$(".payment legend p").css("color", "red");
		} 

		// Else ,remove field indicator
		else {$(".payment legend p").detach();}

		// If credit card payment option was selected, run creditCheck
		if($("select[id='payment']").val() == 'credit-card') {
			creditCheck(e);
		}

	}


	// Checks the formatting of the credit card field
	function creditCheck(e) {

		// Uses validateCreditCard package for proper format
		$("#cc-num").validateCreditCard(function(result) {

			// If invalid credit card format, prevent submission & apply required field indicator
			if(!result.length_valid || !result.luhn_valid) {
				e.preventDefault();
				$("label[for='cc-num']").css("color", "red");
			} 

			// Else ,remove field indicators
			else { $("label[for='cc-num']").css("color", "initial"); }
		});

		// If invalid zip code format, prevent submission & apply required field indicator
		if($("#zip").val().length < 5) { 
			e.preventDefault();
			$("label[for='zip']").css("color", "red");
		} 

		// Else, remove field indicators
		else { $("label[for='zip']").css("color", "initial"); }

		// If invalid CVV information, prevent submission & apply required field indicator
		if($("#cvv").val().length < 3) { 
			e.preventDefault();
			$("label[for='cvv']").css("color", "red");
		} 

		// Else, remove field indicator
		else { $("label[for='cvv']").css("color", "initial"); }
	}


	// Prevents submission if shirt selection hasn't been made
	function shirtCheck(e) {

		// If no shirt selection has been made prevent submission & apply required field indcator
		if($("select[id='design']").val() == 'select_theme') {
			e.preventDefault();
			$(".shirt legend p").detach();
			$(".shirt legend").append("<p>Select A Shirt</p>");
			$(".shirt legend p").css("color", "red");
		}

		// Else, remove field indicator
		else {$(".shirt legend p").detach();}
	}

	// Prevents submission if no activities has been selected
	function activityCheck(e) {

		for(var i = 0; i < $(".activities input").length; i++) {

			// If any activities are selected, break out of loop
			if($(".activities input")[i].checked) {
				$(".activities legend p").detach();
				break;
			} 

			// Else if loop has not been broke at 6 intervals, prevent submission & apply required field indicator
			else if(i == 6) {
				e.preventDefault();
				$(".activities legend p").detach();
				$(".activities legend").append("<p>Select An Activity</p>");
				$(".activities legend p").css("color", "red");
			}

		}	
	}


	// If all intergrity functions pass, default button functionalaity isn't prevented and form is submitted
	$("button[type='submit']").click(function(e) {

		nameCheck(e);
		emailCheck(e);
		shirtCheck(e);
		activityCheck(e);
		paymentCheck(e);

	});
})()

	