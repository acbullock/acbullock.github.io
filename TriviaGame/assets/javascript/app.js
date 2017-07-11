var QUESTION_TIME = 24;
var clock =QUESTION_TIME;
var RESULT_TIME = 3;
var questionResultClock = RESULT_TIME;
var questionResultId;
var timerId;
var started = false;
var status = "";
var currentIndex = 0;
var done=false;
var wins=0;
var losses = 0;
var unanswered = 0;

var triviaProblem = function(question, choices, correctAnswer){
	this.question = question;
	this.choices = choices;
	this.correctAnswer=correctAnswer;
};

var makeChoiceButton = function(choice, isCorrect){
	var btn = $("<button>");
	btn.text(choice);
	btn.addClass("col-sm-3 col-xs-3 col-md-3 btn-primary");
	btn.on("click", function(){

		$("#choicesPanel").empty();
		 if(isCorrect){

			wins++;
			status="correct";
			//show question result
		 	displayResult(status);
		 	
		}
		else{
		 	losses++;
		 	status="incorrect";
		 	//show question result
		 	displayResult(status);
		 }
		
		currentIndex++;
		displayQuestion();

		clock=QUESTION_TIME;
		started=false;
		$("#timer").text(clock);


	});
	$("#choicesPanel").append(btn);
		
}
var start = function(){
	done=false;
	clock=QUESTION_TIME;
	$("#timer").text(clock);
	$("#timer").removeClass("text-danger");
	//if(!started){
		$("#startPanel").hide(400);
		$("#resultsPanel").hide(400);
		//$("#questionResultsPanel").hide(400);
		$("#question").html(problems[currentIndex].question);
		$("#choicesPanel").empty();
		$.each(problems[currentIndex].choices, function(index, value){
			var isCorrect=false;
			if(index==problems[currentIndex].correctAnswer)
				isCorrect=true;
			makeChoiceButton(value, isCorrect);
		});
		$("#timerPanel").show(400);
		$("#questionPanel").show(400);
		$("#choicesPanel").show(400);
		wins=0;
		losses=0;
		unanswered=0;
		resume();
	
	//}
};

var resume = function(){
	clearInterval(questionResultId);
	started = true;
	clock=QUESTION_TIME;
			timerId = setInterval(function(){
			clock--;
			//if time runs out
			if(clock<1){
				
				clock=QUESTION_TIME;
				$("#timer").text(clock);
				$("#timer").removeClass("text-danger");
				
				//increment unanswered..
				unanswered++;
				status="out of time";
				displayResult(status);
				
				//display next question
				currentIndex++;
				displayQuestion();
				

				
				
				
			}
			else{
				$("#timer").removeClass("text-danger");
				if(parseInt($("#timer").text())<=4)
					$("#timer").addClass("text-danger");
				$("#timer").text(clock);
			}
		},1000);
};
var displayQuestion = function(){
	if(currentIndex < problems.length){
		$("#question").html(problems[currentIndex].question);
		$("#choicesPanel").html("");
		$.each(problems[currentIndex].choices, function(index, value){
			var isCorrect=false;
			if(index==problems[currentIndex].correctAnswer)
				isCorrect=true;
			makeChoiceButton(value, isCorrect);
		});
	}
	else{
		//gameOver();
		
		displayResult(status);
		gameOver();
		


	}
};
var displayFinalResult = function(){
	displayResult("correct");
	$("#wins").text("Correct: "+wins);
					$("#losses").text("Wrong: "+losses);
					$("#unanswered").text("Unanswered: "+unanswered);
					$("#resultsPanel").show(400);
					//
};
var gameOver=function(){
	if(!done){
		done=true;
		
		setTimeout(function(){
			$("#questionPanel").hide(400);
		$("#timerPanel").hide(400);
		$("#choicesPanel").hide(400);
		stop();
		//display results
		displayFinalResult();
			
			$("#questionResultsPanel").hide(400);
			clearInterval(questionResultId);
		},RESULT_TIME*1000);
		
	}


};
var stop = function(){
	if(started){
		clearInterval(timerId);
		started = false;
	}

};

var displayResult = function(status){
	stop();
	clearInterval(questionResultId);
	
	$("#questionPanel").hide(400);
	$("#timerPanel").hide(400);
	$("#choicesPanel").hide(400);
	
	if(status=="correct"){
		$("#status").addClass("text-success");
		$("#status").removeClass("text-warning");
		$("#status").removeClass("text-danger");
		$("#status").text("Correct!");
	}
	if(status=="incorrect"){
		$("#status").addClass("text-danger");
		$("#status").removeClass("text-success");
		$("#status").removeClass("text-warning");
		$("#status").text("Wrong!");
	}
	if(status=="out of time"){
		$("#status").addClass("text-warning");
		$("#status").removeClass("text-danger");
		$("#status").removeClass("text-success");
		$("#status").text("Out of Time!");
		
		
	}

	
	questionResultClock = RESULT_TIME;
	questionResultId = setInterval(function(){
		$("#questionResultsPanel").show(400);
		questionResultClock--;
		if(questionResultClock < 1){
			 if(currentIndex == problems.length){
			 	$("#questionPanel").hide(400);
				$("#timerPanel").hide(400);
				$("#choicesPanel").hide(400);
				stop();
			 }
			 else{	

				resume();
				$("#questionResultsPanel").hide(400);
				displayQuestion();
				$("#questionPanel").show(400);
				$("#timerPanel").show(400);
				$("#choicesPanel").show(400);
			}
			

		}
		else{
			$("#correctAnswer").text("Correct Answer: " + problems[currentIndex-1].choices[problems[currentIndex-1].correctAnswer]);
		}
	}, 1000);

};

//create the trivia problems..
var problems = [];
problems.push(new triviaProblem("1. What Indiana Pacer did Knicks fan Spike Lee anger during the 1994 playoffs by calling him 'Cheryl'?", ["Michael Jordan", "Reggie Miller", "John Starks", "Larry Bird"], 1));
problems.push(new triviaProblem("2. What franchise has played in the most NBA finals since 1947?", ["Boston Celtics", "Chicago Bulls", "Cleveland Caveliers", "Los Angeles Lakers"], 3));
problems.push(new triviaProblem("3. What player did the Boston Celtics draft between won-lost seasons of 29-53 and 61-21?", ["Bill Russel", "Larry Bird", "Isaiah Thomas", "Paul Pierce"], 1));
problems.push(new triviaProblem("4. What Baltic country did Portland Trail Blazer Arvydas Sabonis play for at the 1996 Olympics?", ["Lithuania", "Finland", "Russia", "Germany"], 0));
problems.push(new triviaProblem("5. Who earned $32 million of his $36 million 1993 earnings from endorsements?", ["Charles Barkley", "Kobe Bryant", "Michael Jordan", "Kevin Garnett"], 2));

//define on click handlers for start/restart buttons
$("#restartBtn").on("click",function(){
	currentIndex=0;
	start();
});
$("#startBtn").on("click", function(){
	start();
});

//initial ui set up..
$("#timerPanel").hide(400);
$("#questionPanel").hide(400);
$("#choicesPanel").hide(400);
$("#resultsPanel").hide(400);
$("#questionResultsPanel").hide(400);
$("#startPanel").show(400);

