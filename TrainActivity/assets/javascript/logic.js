var isNullOrWhitespace = function isNullOrWhitespace( input ) {

    if (typeof input === 'undefined' || input == null) return true;

    return input.replace(/\s/g, '').length < 1;
};
// Initialize Firebase
var config = {
	apiKey: "AIzaSyCfVMBdDEbGApIb6fBMfeX2fdKuoKbpiCs",
	authDomain: "traindev-7f74a.firebaseapp.com",
	databaseURL: "https://traindev-7f74a.firebaseio.com",
	projectId: "traindev-7f74a",
	storageBucket: "traindev-7f74a.appspot.com",
	messagingSenderId: "781383247053"
};
firebase.initializeApp(config);

var database = firebase.database();

//add train button logic
$("#add-train-btn").on("click", function(event){
	event.preventDefault();
	$("#add-train-btn").prop("disabled", true);
	// Grabs user input
	var trainName = $("#train-name-input").val().trim();
	var destination = $("#destination-input").val().trim();
	var trainStart = moment($("#start-input").val().trim(), "hh:mm").format("X");
	var trainRate = $("#rate-input").val().trim();

	// Creates local "temporary" object for holding employee data
	var newTrain = {
		name: trainName,
		dest: destination,
		start: trainStart,
		rate: trainRate
	};

	// Uploads train data to the database
	database.ref("trains/"+newTrain.name).set(newTrain);

	// Logs everything to console
	console.log(newTrain.name);
	console.log(newTrain.dest);
	console.log(newTrain.start);
	console.log(newTrain.rate);

	// Alert
	//alert("Train successfully added");

	// Clears all of the text-boxes
	$("#train-name-input").val("");
	$("#destination-input").val("");
	$("#start-input").val("");
	$("#rate-input").val("");
});

var updateTableFunction = function(){
	$("#train-table > tbody").html("");
	database.ref("/trains/").off("child_added");
	database.ref("/trains/").on("child_added", function(childSnapshot){updater(childSnapshot)});
	
};
var updater = function(childSnapshot) {
	


  console.log(childSnapshot.val());

	// Store everything into a variable.
 	var trainName = childSnapshot.val().name;
	var trainDest = childSnapshot.val().dest;
	var trainStart = childSnapshot.val().start;
 	var trainRate = childSnapshot.val().rate;
	
	// Employee Info
	// console.log(trainName);
	// console.log(trainDest);
	// console.log(trainStart);
	// console.log(trainRate);

	// First Time (pushed back 1 year to make sure it comes before current time)
	var startTimeConverted = moment.unix(trainStart).subtract(1, "days");
	//console.log(moment(startTimeConverted).format("HH:mm") );
  	
	// Current Time
    var currentTime = moment();
    //console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(startTimeConverted), "minutes");
   // console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var Remainder = diffTime % trainRate;
    console.log(Remainder);

    // Minute Until Train
    var MinutesTillTrain = trainRate - Remainder;
   // console.log("MINUTES TILL TRAIN: " + MinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(MinutesTillTrain, "minutes");
    var nextTrainPretty = moment(nextTrain).format("hh:mm A");
  //  console.log("ARRIVAL TIME: " + nextTrainPretty);


  // Add each train's data into the table
  $("#train-table > tbody").append("<tr class='trainRow'><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
  trainRate + "</td><td>" + nextTrainPretty + "</td><td>" +  MinutesTillTrain + "</td><td><button class='btn btn-success hover-btn' data-name='"+trainName+"'><i class='fa fa-pencil-square-o' aria-hidden='true'></i></button></td><td><button class='btn btn-danger hover-btn' data-name='"+trainName+"'><i class='fa fa-times'></i></button></td></tr>");

  $(".btn-danger").off("click");
  $(".btn-danger").on("click", function(){
		var trainName = $(this).attr("data-name");
		database.ref("/trains").child(trainName).remove();
	});
  $(".btn-success").off("click");
  $(".btn-success").on("click", function(){

		
		var name = $(this).attr("data-name");
		var dest = "";
		var rate = "";
		var start = "";
		//var arrivalTime = "";
		database.ref("/trains").once("value").then(function(snapshot){
			dest = snapshot.child(name).val().dest;
			rate = snapshot.child(name).val().rate;
			start = snapshot.child(name).val().start;
			var newName = prompt("Edit Train Name. Cancel to keep current value.");
			var newDest = prompt("Edit Destination.  Cancel to keep current value.");
			var newRate = prompt("Edit Frequency.  Cancel to keep current value.");
			var newStart = prompt("Edit start (HH:mm - military time). Cancel to keep current value.");
			if(!isNullOrWhitespace(newRate)){
				
				rate = newRate;
			}
			if(!isNullOrWhitespace(newStart)){
				
				start = newStart;
				start = moment(start, "hh:mm").format("X");
			}

			if(!isNullOrWhitespace(newDest)){
				
				dest = newDest;
			}
			if(!isNullOrWhitespace(newName)){
				database.ref("/trains/"+name).remove();
				name = newName;
				
			}
			database.ref("/trains/"+name).set({
					name: name,
					dest: dest,
					rate: rate,
					start: start
				});
			
		});
		
		 $(this).attr("data-name", name);
		

	});
  
};
$("#add-train-btn").prop("disabled", true);
document.onkeyup = function(event){
	var error = false;
	if(isNullOrWhitespace($("#train-name-input").val().trim())){
		error = true;
	}
	if(isNullOrWhitespace($("#destination-input").val().trim())){
		error = true;
	}
	if(isNullOrWhitespace($("#rate-input").val().trim())){
		error = true;
	}
	if(isNullOrWhitespace($("#start-input").val().trim())){
		error = true;
	}
	else if(!moment($("#start-input").val().trim(), "hh:mm").isValid()){
		error = true;
	}
	if(isNaN($("#rate-input").val().trim())){
		error = true;
	}

	$("#add-train-btn").prop("disabled", error);
};


database.ref().on("value", function(snapshot){updateTableFunction()});

setInterval(function(){
	
	updateTableFunction();
	
}, 60000);

