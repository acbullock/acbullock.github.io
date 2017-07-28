// TODO: 
// - signUp logIn validation
// - email contacnt form
// - search results crollable 
// - add a footer


firebase.initializeApp(config);

//VARIABLES

//user Related
var userID = "";
var userEmail="";
var userRef ="";
var pets=[];
var userName = "";
var database = null;

//TO DO: GET FROM FIREBASE AUTHENTICATION (GET CURRENT USER)
// ****************************
// if user is logged in then it should import history
// and show to screen
// TODO: 
// - if user is logged in have variables from that user with the 
//   history
//  
// ****************************
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  	console.log(user);
    $("#btn-logOut").show();
    $("#btn-logIn").hide();
   
    $("#loggedInLabel").show();
    $("#locatorRow").show();

    // sets the lable for favorites as the user name 
    


    //Set user variables if user exists..
    userID=user.uid
    userEmail = user.email;
    userRef = firebase.database().ref("/"+userID);



    //Create user in DB. Save the user's email.
    console.log("something " );
    console.log( user);
    console.log(user.displayName);

    userRef.child("email").set(userEmail);
    userRef.child("name").set(user.displayName);


    $("#loggedInLabel").html("Logged in as " + user.displayName);
    $("#favModalLabel").html(user.displayName + "'s Favorites" );
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

        var contactBtn = $("<button>");
        contactBtn.text("Contact");
        contactBtn.addClass(" btn btn-info");
        contactBtn.attr("data-key", name);


        var contactForm = $("<form>");
        
        var formGroupDiv = $("<div>");
        formGroupDiv.addClass("form-group");

        contactForm.append(formGroupDiv);
        contactForm.css("border-width", "1px");
        contactForm.css("border-style", "inset");
        contactForm.attr("data-key", name);
        contactForm.hide();

        contactBtn.on("click", function(event){
        	event.preventDefault();
        	var key = $(this).attr("data-key");
        	$("[data-key = "+name+"]").show();
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

        var msgLabel = $("<label>");
        msgLabel.html("Message:");
        var msgArea = $("<textarea>");
        msgArea.addClass("form-control");

        var sendBtn = $("<button>");
        sendBtn.addClass("btn btn-success");
        sendBtn.html("Send Message");

        var closeBtn = $("<button>");
        closeBtn.addClass("btn btn-warning");
        closeBtn.html("Close");

        formGroupDiv.append(toLabel);
        formGroupDiv.append(toInput);

        formGroupDiv.append(subjectLabel);
        formGroupDiv.append(subjectInput);
        formGroupDiv.append(msgLabel);
        formGroupDiv.append(msgArea);
        formGroupDiv.append($("<br>"));
        formGroupDiv.append(sendBtn);
        formGroupDiv.append(closeBtn);

        well.append(contactBtn);
        well.append(contactForm);

        //Add the remove button to the well..
        well.append(removeBtn );
        well.append($("<br>"));
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
 
        //append the current well to the favModal.
        $("#favorites-section").append(well);

      });
    });
  }
  else {
    $("#btn-logOut").hide();
    $("#btn-logIn").show();
    $("#locatorRow").hide();
    $("#loggedInLabel").hide();
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
		    photo.attr("src", pet.media.photos.photo[i].$t);
		    photo.css("padding", "10px");
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

  var favButton = $("<button>");
  favButton.addClass("btn btn-info fav-btn");
  favButton.text("Add to Favorites!")
  favButton.attr("data-index", index);
  
  favButton.on("click", function(){
    //call function that adds to firebase
    addFavorite(pets, index);
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

  var zipCode="";
  queryURL += key;
  
	//empty current resutls every time a user does a new search
  $("#results-panel").html("");
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
	queryURL+="&location="+zipCode+"&callback=?";
  
	$.getJSON(queryURL)
  .done(function(petApiData) { 
    
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
  userName = $("#formNameSignUp").val();
  var pass = $("#formPassSignUp").val();

  console.log(email + " " + pass);

  var promise = firebase.auth().createUserWithEmailAndPassword(email, pass);
  console.log(promise);
  promise
  .then(function(){

    var user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: userName

    }).then(function() {
      // Update successful.
    }).catch(function(error) {
      console.log(error.message);
    });
   
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