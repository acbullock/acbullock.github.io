


 
//On initial load, the find button is disabled.
$("#submit-btn-phone").prop("disabled", true);
$("#submit-btn-email").prop("disabled", true);

//only enable the find button when a valid zip is entered.
document.onkeyup = function(){

	if ( $("#contactUsFormName").val().trim() !== "" &&  $("#contactUsFormEmail").val().trim() && $("#contactUsFormText").val().trim()) {
  		$("#submit-btn-email").prop("disabled", false);

	}
	else {
		$("#submit-btn-email").prop("disabled", true);
	}

	if ( $("#contactUsFormPhoneName").val().trim() !== "" &&  $("#contactUsFormPhoneNumber").val().trim() && $("#contactUsFormPhoneText").val().trim()) {
  		$("#submit-btn-phone").prop("disabled", false);

	}
	else {
		$("#submit-btn-phone").prop("disabled", true);
	}

}



$("#submit-btn-phone").on("click", function(e) {
	e.preventDefault();
	
	$.ajax({
		type: "POST",
		
		url: "https://api.twilio.com/2010-04-01/Accounts/"+SID+"/Messages.json",
		data: {
		"To" : "+13053317450",
		"From" : "+14422455756",
		"Body" : $("#contactUsFormPhoneName").val().trim() + " " + $("#contactUsFormPhoneText").val().trim()
		},
		beforeSend: function (xhr) {
                    xhr.setRequestHeader ("Authorization", "Basic " + btoa(SID + ':' + Key));
                },
		success: function(data) {
			console.log(data.responseText);
			$("#contactUsFormPhoneName").val();
			$("#contactUsFormPhoneNumber").val(); 
			$("#contactUsFormPhoneText").val();
		},
		error: function(data) {
			console.log(data.responseText);
			$("#contactUsFormPhoneName").val();
			$("#contactUsFormPhoneNumber").val(); 
			$("#contactUsFormPhoneText").val();
		}
	});
});

$("#submit-btn-email").on("click", function(e) {
	var adminEmail = "lexliveslife@gmail.com";
	e.preventDefault();
	//the "to" is currently hard coded to alex's email (in emailjs template)
	emailjs.send("gmail","template_LtXd8EpM",{

				to_name: adminEmail,
  				from_name: $("#contactUsFormEmail").val().trim(),
  				subject: $("#contactUsFormName").val().trim() + " " + $("#contactUsFormEmail").val().trim(),
  				message_html: $("#contactUsFormText").val().trim()
			});
	console.log("we send an email");
	// $("#contactUsFormName").val("");
	// $("#contactUsFormEmail").val("");
	// $("#contactUsFormText").val("");
});