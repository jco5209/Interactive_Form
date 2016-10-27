/* global $ */
/*
	on load give input field of 'name' focus -
	remove 'other' input field until selected 
*/
$("input[id='name']").focus();

var otherTitle = $("#other-title");
$("#other-title").detach();

$("select[id='title']").change(function() {

	if($("select[id='title'] option:selected").text() == $("option[value='other']").text()) {
		$(".basic-info").append(otherTitle);
	} else {
		$("#other-title").detach();
	}

});

/* 
	hide 'color' select & label until design is selected -
	depending on design selected, append appropriate shirts
*/
var themeSelect = $("option[class='select-theme']");
var jsPuns = $("option[class='js-puns']");
var heartJS = $("option[class='heart-js']");

$("#color-select").hide();
$("label[for='color']").hide();

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


/*
	run for each .activites label -
	store indices of reoccurring "—" pattern within the label text -
	create array of all strings(seperated by whitespace) after the reoccuring "-" for each label-
	
	give each label a property of .dateTime & .price -
	.dateTime = appropriate index of day & time string -
	.price = appropriate index of price string & parseInt'd for future calculation -
	if date & time does not exist, give placeholder value for .dateTime
*/
$(".activities label").each(function() {

	var valueLoc = $(this).text().indexOf("—") + 2;

	var values = $(this).text().slice(valueLoc).split(" ");

	if(values[2]) {

		this.dateTime = values[0] + " " + values[1];
		this.price = parseInt(values[2].slice(1));

	} else {

		this.dateTime = "*";
		this.price = parseInt(values[0].slice(1));

	}

});


/*
	access .price property for each checked input's label parent -
	calculate total price & append -
	if total = 0, remove total display 
*/
function priceCalc() {

	var total = 0;

	$(".price").detach();

	$(".activities input:checked").each(function() {

		total += this.parentNode.price;

	});

	$(".activities").append("<p class='price'>Total: $" + total + "</p>");

	if(total === 0) {
		$(".price").hide();
	}
}

/*
	'for loop' runs for each '.activities label' -
	if current iteration has a matching .dateTime property of 'this' && current iteration isn't 'this', run code block -
	if 'this' is checked, disable conflicting .dateTime input & change color of label to gray -
	else if 'this' is not checked, enable input recolor to initial color
*/
function timeCheck(x) {

	var schd = $(".activities label");

	for(var i = 0; i < schd.length; i++) {

		if(schd[i].dateTime == x.parentNode.dateTime && schd[i] != x.parentNode) {
			
			if(x.checked) {
				schd[i].childNodes[0].disabled = true;
				schd[i].style.color = "gray";
			} else {
				schd[i].childNodes[0].disabled = false;
				schd[i].style.color = "initial";
			}

		}
	} 
}

$(".activities input").change(function() {
	priceCalc();
	timeCheck(this);
});


/*
	on payment method change hide previously displayed -
	update 'thisVal' to store currently selected option -
	show current selected option
*/
$("#paypal").hide();
$("#bitcoin").hide();

var thisVal = $("#credit-card");

$("select[id='payment']").change(function() {

	thisVal.hide();
	thisVal = $("#" + $("#payment option:selected").val() + "");
	thisVal.show();

});


/*
	if input field of 'name' is empty, preventDefault submit function -
	apply required field indicator 
*/
function nameCheck(e) {

	if($("input[id='name']").val().length === 0) {
		e.preventDefault();
		$("label[for='name']").text("Name: (Please Provide A Name)").css("color", "red");
	} else {$("label[for='name']").text("Name:").css("color", "initial");}

}

/*
	using regExp constructor, test for pattern of /any text | @ symbol | any amount of text | dot | any text/ -
	test this pattern on 'mail' input & return boolean result
*/
function emailFormatCheck() {

	var properFormat = new RegExp(/.@*.\..+/g);
	var properFormatTest = properFormat.test($("input[id='mail']").val());

	return properFormatTest;

}

/*
	if emailFormatCheck() returns false, preventDefault submission function -
	apply required field indicator
*/
function emailCheck(e) {

	if(!emailFormatCheck()) {
		e.preventDefault();
		$("label[for='mail']").text("Email: (Please Provide A Vaild Email)").css("color", "red");
	} else {$("label[for='mail']").text("Email:").css("color", "initial");}

}

/*
	if no payment method is selected, preventDefualt submission function -
	apply required field indicator -

	if credit card option is selected, run creditCheck() function
*/
function paymentCheck(e) {

	if($("select[id='payment']").val() == 'select_method') {
		e.preventDefault();
		$(".payment legend p").detach();
		$(".payment legend").append("<p>Please Select A Payment Mehotd</p>");
		$(".payment legend p").css("color", "red");
	} else {$(".payment legend p").detach();}

	if($("select[id='payment']").val() == 'credit-card') {
		creditCheck(e);
	}

}

/*
	using Pawel Decowski's jqueryCreditCheck plugin, check if credit card number is valid -
	if credit card number is not valid, preventDefault submission function & apply required field indicator -

	if 'zip' input's length is less than 5, preventDefault submission function & apply required field indicator -

	if 'cvv' input's length is less than 3, preventDefault submission function & apply required field indicator - 
*/
function creditCheck(e) {

	$("#cc-num").validateCreditCard(function(result) {
		if(!result.length_valid || !result.luhn_valid) {
			e.preventDefault();
			$("label[for='cc-num']").css("color", "red");
		} else { $("label[for='cc-num']").css("color", "initial"); }
	});

	if($("#zip").val().length < 5) { 
		e.preventDefault();
		$("label[for='zip']").css("color", "red");
	} else { $("label[for='zip']").css("color", "initial"); }

	if($("#cvv").val().length < 3) { 
		e.preventDefault();
		$("label[for='cvv']").css("color", "red");
	} else { $("label[for='cvv']").css("color", "initial"); }
}

/*
	if design selection hasn't been made, preventDefault submission function & apply required field indicator
*/
function shirtCheck(e) {

	if($("select[id='design']").val() == 'select_theme') {
		e.preventDefault();
		$(".shirt legend p").detach();
		$(".shirt legend").append("<p>Select A Shirt</p>");
		$(".shirt legend p").css("color", "red");
	} else {$(".shirt legend p").detach();}
}

/*
	'for loop' runs for each '.activites input' -
	if any inputs are checked, break out of loop -
	else if 'i' reaches length of 6, preventDefault submission function & apply required field indicator
*/
function activityCheck(e) {

	for(var i = 0; i < $(".activities input").length; i++) {

		if($(".activities input")[i].checked) {
			$(".activities legend p").detach();
			break;
		} else if(i == 6) {
			e.preventDefault();
			$(".activities legend p").detach();
			$(".activities legend").append("<p>Select An Activity</p>");
			$(".activities legend p").css("color", "red");
		}

	}	
}


//if all intergrity functions pass, default button functionalaity isn't prevented and form is submitted
$("button[type='submit']").click(function(e) {

	nameCheck(e);
	emailCheck(e);
	shirtCheck(e);
	activityCheck(e);
	paymentCheck(e);

});


// -end