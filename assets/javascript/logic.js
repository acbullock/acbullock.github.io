// TODO:  
// - add a footer - Giscard
//replace loading gif with glyphicon that we animate in css with "spin"

//refactor search and favs code (remove duplicates) - Alex
firebase.initializeApp(config);

//VARIABLES

//user Related
var userID = "";
var userEmail="";
var userRef ="";
var pets=[];
var database = null;

//
// ****************************
// if user is logged in then it should import history
// 
// TODO: 
// - if user is logged in have variables from that user with the 
//   history
//  
// ****************************
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {

  	console.log("asdfasdf"+user);
    $("#btn-logOut").show();
    $("#btn-logIn").hide();
   
    $("#loggedInLabel").show();
    $("#locatorRow").show();
    $("#view-fav-btn").show();
    // sets the lable for favorites as the user name 
    


    //Set user variables if user exists..
    userID=user.uid;
    userEmail = user.email;
    userRef = firebase.database().ref("/"+userID);
    $("#contactUsFormEmail").val(userEmail);


    //Create user in DB. Save the user's email.
    console.log("something " );
    console.log( user);
    
    userRef.child("email").set(userEmail);
    //userRef.child("name").set(user.displayName);

   	$("#loggedInLabel").addClass("text-info");
   	var labelSpan1 = $("<span>");
   	labelSpan1.addClass("glyphicon	glyphicon-user");
   	var labelSpan2 = $("<span>");
   	labelSpan2.html(" "+userEmail);
   	$("#loggedInLabel").html(labelSpan1);
   	$("#loggedInLabel").append(labelSpan2);		
    

    //===================
    //start building user's favorites modal..
    var favHeader = $("<h2>");
    favHeader.css("font-weight", "bold");
    favHeader.html(userEmail + "'s Favorites" );
    $("#favModalLabel").html(favHeader);
    //set database ref
    database  = firebase.database().ref();


    //LISTENER - Add to Favorites...
    userRef.child("favorites").on("value", function(snapshot){
      //clear the current favorites (will eventually )
      $("#favorites-section").html("");

      //Get the current users favorites from the database.
      var favs = snapshot.val();
      //console.log(favs);

      //Loop through the faves, and add them to the Fav Modal..
      $.each(favs, function(index, value){
        //  console.log("index" + value.name);

        //Get the current Favorite's information..
        var name = value.name;
        var age = value.age;
        var sex = value.sex;
        var breed = value.breed;
        if(breed == undefined)
          breed="not available";
        var mix = value.mix;
        var description = value.description;
        var email = value.email;
        var phone = value.phone;

        //Create a Well Div, and add the appropriate ui elements to it
        //this will be the individual favorite on the favModal.
        var well = $("<div>");
        well.addClass("well");

        var img = $("<img>");
        img.css("height", "150px");
        //only set image if it exists..
        userRef.child("favorites").child(name).child("photo").once("value").then(function(snapshot){
          img.attr("src", snapshot.val());
        });

  

        var nameHeader = $("<h2>");
        nameHeader.html(name);

        var ageHeader = $("<h3>");
        ageHeader.html("Age: "+age);

        var sexHeader = $("<h3>");
        sexHeader.html("Sex: " +sex);

        var breedHeader=$("<h3>");
        breedHeader.html("Breed: "+breed);
    
        var mixHeader = $("<h3>");
        mixHeader.html("Mix Breed: "+mix);

        var aboutHeader = $("<p>");
        aboutHeader.html("About: " + description );

        var emailHeader = $("<h3>");
        emailHeader.css("font-weight", "bold");
        emailHeader.css("overflow", "hidden");
        emailHeader.html("Email: "+email);

        var phoneHeader = $("<h3>");
        phoneHeader.css("font-weight", "bold");
        phoneHeader.html("Phone: "+phone);


        //Create a Button that will allow user to remove this favorite from
        //their favorites.
        var removeBtn = $("<button>");
        removeBtn.text("Remove from Favorites");
        removeBtn.addClass("remove-fave btn btn-danger");
        removeBtn.attr("data-key", name);
        removeBtn.on("click", function(event){
          var rem = $(this).attr("data-key");
          userRef.child("favorites").child(rem).remove();
        });
        removeBtn.css("margin-bottom", "10px");

        var contactBtn = $("<button>");
        contactBtn.text("Contact");
        contactBtn.addClass(" btn btn-info");
        contactBtn.attr("data-key", name);
        contactBtn.css("margin-right", "10px");
        contactBtn.css("margin-bottom", "10px");

        var contactForm = $("<form>");
        
        var formGroupDiv = $("<div>");
        formGroupDiv.addClass("form-group");

        contactForm.append(formGroupDiv);
        contactForm.css("border-width", "1px");
        contactForm.css("border-style", "inset");
        contactForm.attr("id", index);
        contactForm.hide();

        contactBtn.on("click", function(event){
        	event.preventDefault();
        	var key = $(this).attr("data-key");
        	$("[id='"+index+"']").toggle(400);
        	//$("#form-"+name).show();
        	//[href='default.htm']
        });

        var toLabel = $("<label>");
        toLabel.html("To:");
        var toInput = $("<input>");
        toInput.addClass("form-control");
        toInput.val(email);


        var subjectLabel = $("<label>");
        subjectLabel.html("Subject:");
        var subjectInput = $("<input>");
        subjectInput.addClass("form-control");
        subjectInput.val("Hi, I am interested in one of your pets");

        var msgLabel = $("<label>");
        msgLabel.html("Message:");
        var msgArea = $("<textarea>");
        msgArea.addClass("form-control");
        msgArea.val("Hi I am looking to get more information on "+ name + ".");

        var sentMsgAlert = $("<div>");
        sentMsgAlert.addClass("alert alert-success alert-dismissable fade in");
        sentMsgAlert.html($("<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>"));
        sentMsgAlert.append($("<strong>Message sent</strong>"));
        sentMsgAlert.css("margin-top", "10px");
        sentMsgAlert.hide();

        var sendBtn = $("<button>");
        sendBtn.addClass("btn btn-warning");
        sendBtn.html("Send Message");
        sendBtn.css("margin-right", "10px");
        sendBtn.css("margin-botom", "10px");
        sendBtn.on("click", function(event){
        	event.preventDefault();
          //the "to" is hard coded in email js template..
        	emailjs.send("gmail","template_LtXd8EpM",{
            //grab this from the form to get lister email..
          to_name: "lexliveslife@gmail.com",
  				from_name: userEmail,
  				subject: subjectInput.val(),
  				message_html: msgArea.val()


			});

			sentMsgAlert.show();
			$("#form-"+name).hide();


        });

        var closeBtn = $("<button>");
        closeBtn.addClass("btn btn-default");
        closeBtn.html("Close");
        closeBtn.on("click", function(event){
        	event.preventDefault();
        	$("[id='"+index+"']").hide(400);
        	
        });

        
        formGroupDiv.append(toLabel);
        formGroupDiv.append(toInput);

        formGroupDiv.append(subjectLabel);
        formGroupDiv.append(subjectInput);
        formGroupDiv.append(msgLabel);
        formGroupDiv.append(msgArea);
        formGroupDiv.append($("<br>"));
        formGroupDiv.append(sendBtn);
        formGroupDiv.append(closeBtn);
        formGroupDiv.append(sentMsgAlert);
        formGroupDiv.css("padding", "10px");
        well.append(contactBtn);
        well.append(contactForm);

        //Add the remove button to the well..
        well.append(removeBtn );
        well.append($("<hr>"));
        well.append($("<br>"));

        //append all the favorite info to the well..
        well.append(img);
        well.append(nameHeader);
        well.append(ageHeader);
        well.append(sexHeader);
        well.append(breedHeader);
        well.append(mixHeader);
        well.append(aboutHeader);
        well.append(emailHeader);
        well.append(phoneHeader);

        //well.css("background-color", "#87A257");
  		//well.css("color", "#F4F2F1");

        //append the current well to the favModal.
        $("#favorites-section").append(well);
        $("#favorites-section").append($("<br>"));
        $("#favorites-section").append($("<br>"));

      });
    });
  }
  else {
    $("#btn-logOut").hide();
    $("#btn-logIn").show();
    $("#locatorRow").hide();
    $("#loggedInLabel").hide();
    $("#view-fav-btn").hide();
    //when no user, show the sign-in modal
    //empty the previous user's results/favorites.
    $("#myModal").modal('show');
    $("#results-panel").html("");
    $("#favorites-section").html("");
  }
});

//takes the an array of pet objects, and the index to be added to favs.
//updates the current user (in the db).
var addFavorite = function(pets, index){
  //get pet to be added..
  var pet = pets[index];

  //get that pet's info..
  var name = pet.name.$t;
  var age = pet.age.$t;
  var sex = pet.sex.$t;
  var breed = pet.breeds.breed.$t;
  if(breed == undefined)
    breed="not available";
  var mix = pet.mix.$t;
  var description = "unavailable";
  if(pet.description.$t !== undefined)
  		description = pet.description.$t;
  var email ="unavailable";
    if(pet.contact.email.$t !==undefined)
      email =pet.contact.email.$t;
    console.log(pet);
  var phone = "unavailable";
  if(pet.contact.phone.$t !== undefined){
    phone= pet.contact.phone.$t;
  }
  
  //Add this fav to the current users favorites.
  userRef.child("favorites").child(name).set({
    name: name,
    age: age,
    sex: sex,
    breed: breed,
    mix: mix,
    description: description,
    email: email,
    phone: phone,
    photo:pet.media.photos.photo[0].$t

  });
  

}

//this function creates the UI elements necessary to display search results
var createWellForResult = function(index, pet){
	var well = $("<div>");
	well.addClass("well");

  //display which # result it is..
	var number = $("<label>");
	number.addClass("fa-stack fa-lg");
  number.append($("<i class='fa fa-square fa-stack-2x'></i>"));
  number.append($("<i class='fa fa-inverse fa-stack-1x'>"+(index+1)+"</i>"));
  //append to well..
  well.append(number);

  //show profile image if they have it
 	if(pet.media.photos!== undefined){
 		for(var i = 1; i < pet.media.photos.photo.length; i+=5){
  			var photo = $("<img>");
  			photo.addClass("img-thumbnail");
  			photo.css("height", "150px");
		    photo.attr("src", pet.media.photos.photo[i].$t);
		    photo.css("padding", "10px");
		    photo.css("margin", "10px");
		    well.append(photo);
  		}

	}
		
	//create ui elements for the pet info..
  var nameHeader = $("<h2>");
	nameHeader.html(pet.name.$t);

  var age = $("<h3>");
  age.html("Age: "+pet.age.$t);

  var sex = $("<h3>");
  sex.html("Sex: " +pet.sex.$t);

  var breed=$("<h3>");
  breed.html("Breed: "+pet.breeds.breed.$t);
    
  var mix = $("<h3>");
  mix.html("Mix Breed: "+pet.mix.$t);

  var about = $("<p>");
  about.html("About: " + pet.description.$t);

  var email = $("<h3>");
  email.css("font-weight", "bold");
  var emailText = "unavailable";

  if(pet.contact.email.$t !== undefined){
    emailText = pet.contact.email.$t;
  }
  //console.log(pet);
  email.html("Email: "+emailText );

  var phone = $("<h3>");
  phone.css("font-weight", "bold");
  var phoneText = "unavailable";
  if(pet.contact.phone.$t !== undefined){
    phoneText = pet.contact.phone.$t;
  }
  phone.html(" Phone: "+phoneText);


  //create label to let user know fav was added..
  var addedLabel = $("<label>");
  addedLabel.addClass("text-success");
  addedLabel.html("  " + pet.name.$t+" has been added to your favorites!");
  addedLabel.hide();


  var favButton = $("<button>");
  favButton.addClass("btn btn-warning fav-btn");
  favButton.text("Add to Favorites!")
  favButton.attr("data-index", index);
  
  favButton.on("click", function(){
    //call function that adds to firebase
    addFavorite(pets, index);
    $(this).hide(500);	
    //todo: catch error
    addedLabel.show(500);

  });

  
  //add everything to the well..
  well.append(nameHeader);
  well.append(age);
  well.append(sex);
  well.append(breed);
  well.append(mix);
  well.append(about);
  well.append(email);
  well.append(phone);
  well.append(favButton);
  well.append(addedLabel);
  //well.css("background-color", "#87A257");
  //well.css("color", "white");

  //add the well to the results panel..
	$("#results-panel").append(well);
}

//On initial load, the find button is disabled.
$("#find-btn").prop("disabled", true);

//only enable the find button when a valid zip is entered.
document.onkeyup = function(){
	if ( /^[0-9]{5}$/.test($("#zip-code-input").val().trim())) {
  		$("#find-btn").prop("disabled", false);

	}
	else
		$("#find-btn").prop("disabled", true);
}

//when a user clicks "find pets"
$("#find-btn").on("click", function(event){

  event.preventDefault();

  //Start Building query for petfinder API
  var queryURL = "http://api.petfinder.com/pet.find?format=json&key=";
  var key = "e5945be700ddfa206a0f57f1f6066743";
  var animalType="";
  var animalSize="";
  var animalSex="";
  var busyBox = $("<img>");

  busyBox.attr("src", "assets/images/petloading.gif");
  busyBox.addClass("col-md-12 float-center");
  busyBox.css("float", "33%");
  var zipCode="";
  queryURL += key;
  
	//empty current resutls every time a user does a new search
  $("#results-panel").html(busyBox);

  //retreive the search criteria..
	animalType = $("#animal-type-input").val().trim();
	animalSize = $("#animal-size-input").val().trim();
	animalSex = $("#animal-sex-input").val().trim();
	zipCode = $("#zip-code-input").val().trim();

  //add optional parameters if necessary..
	if(animalType!="show all"){
		queryURL+="&animal="+animalType;
	}
	if(animalSize !="All Sizes"){
		queryURL+="&size="+animalSize;
	}
	if(animalSex != "Show Both"){
		queryURL+="&sex="+animalSex;
	}

  //finish building query..
	queryURL+="&location="+zipCode+"&count=5&callback=?";
  	
	$.getJSON(queryURL)
  .done(function(petApiData) { 
    $("#results-panel").html("");
    console.log(petApiData);
  	if(petApiData.petfinder.pets !== undefined){
      pets = petApiData.petfinder.pets.pet;
      $.each(pets, function(index, value){
      createWellForResult(index, value);
      });
    } 
    else{
      $("#results-panel").html("No results. Please try again.");
    }
  });

  //clear the results panel..
  $("#clear-btn").on("click", function(event){
    event.preventDefault();
    $("#results-panel").html("");
  });

});





// ****************************
// creates event for the sign up of the costumer
// TODO: need to add a costumer to the database and 
// use the name of the form 
// ****************************
$("#btnSignUp").on("click", function(e) {
  e.preventDefault();

  var email = $("#formEmailSignUp").val();
  
  var pass = $("#formPassSignUp").val();

  console.log(email + " " + pass);

  var promise = firebase.auth().createUserWithEmailAndPassword(email, pass);
  console.log(promise);
  promise
  .then(function(){

    
    
   
   $("#myModal").modal("hide");
  })
  .catch(function(e) {

  	$(".errorMsg").html(e.message);
    console.log(e.message);
  });

  
  


  
  
});


	



// ****************************
// creates event for the log in 
// grabs email and password and tries to 
// match with firebase 
// TODO: 
// - how to react when wrong input
// ****************************
$("#btnLogIn").on("click", function(e) {
  e.preventDefault();
  var email = $("#formEmailLogIn").val();
  var pass = $("#formPassLogIn").val();

  console.log(email + " " + pass);

  var promise = firebase.auth().signInWithEmailAndPassword(email, pass);
  promise
  .then (function() { 
    $("#myModal").modal("hide");
  })
  .catch(function(e) {
  	$(".errorMsg").html(e.message);
    //alert(e.message);
  });

  
  
  
});




$("#btn-logIn").on("click", function(e) {
  e.preventDefault();
  $("#myModal").modal('show');
});

$("#btn-logOut").on("click", function(e) {
  e.preventDefault();
  
  firebase.auth().signOut();
  location.reload();
  
});

// // init controller
// var controller = new ScrollMagic.Controller();

// // create a scene
// new ScrollMagic.Scene({
//         duration: 100,    // the scene should last for a scroll distance of 100px
//         offset: 50        // start this scene after scrolling for 50px
//     })
//     .setPin("#results-panel") // pins the element for the the scene's duration
//     .addTo(controller); // assign the scene to the controller