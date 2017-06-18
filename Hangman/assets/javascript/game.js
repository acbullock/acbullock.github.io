//Object definition
var game = {
	//Array of possible words
	words:["notorious big","kodak black","gucci mane","french montana", "migos", "jay z","tupac shakur", "outkast", "eminem", "future", "kendrick lamar", "j cole", "nas", "kanye west", "method man", "big pun", "snoop dogg", "puff daddy", "master p", "lil wayne"],

	currentWord:"",

	//Array to contain which letters have been guessed
	lettersGuessed:[],

	//String representing the game board
	gameString:"",

	//Wrong guesses allowed per game
	guessesLeft:10,

	gamesWon:0,
	gamesLost:0,

	//Function to convert a word to a game board
	//accepts a word, returns a string represesnting game board
	ConvertWordToGame:function(word){
		var result = [];

		//Everything but white space gets converted to an underscore
		for(var i=0; i< word.length; i++){
			if(word[i] != " "){
				result.push("_");
			}
			else
				result.push("&nbsp;")
		}

		return result;
	},

	//Function to pick a random word from the Words array
	//accepts an array, returns a random element
	PickWord: function(words){
		return words[Math.floor(Math.random()*words.length)];
	},

	//Function to start new game
	//picks new word, updates scores, resets guessed letters
	StartNewGame: function(){
		this.currentWord=this.PickWord(this.words);
		this.gameString = this.ConvertWordToGame(this.currentWord);
		document.getElementById("GuessesLeftId").style="color:white;"
		this.guessesLeft=10;
		this.lettersGuessed=[];
	},

	//checks if a guess is correct, updates game object accordingly
	CheckGuess: function(guess, currWord){
		guess=guess.toUpperCase();
		currWord=currWord.toUpperCase();

		var isCorrectGuess = false;

		//Do nothing if user already guessed this letter
		for(var i=0; i<this.lettersGuessed.length;i++){
			if(guess===this.lettersGuessed[i]){
						
				return;
			}
		}
		//Do nothing if user already guessed this letter
		for(var i=0; i<this.gameString.length; i++){
			if(guess===this.gameString[i]){
						
				return;
			}
		}

		//determine if correct/incorrect guess
		for(var i = 0; i < currWord.length; i++){
			if(guess === currWord[i]){
				this.gameString[i] = guess;
				isCorrectGuess = true;
			}
		}
		//update game object accordingly
		if(!isCorrectGuess){
			this.guessesLeft--;
			if(this.guessesLeft<4){
				document.getElementById("GuessesLeftId").style="color:red;"
			}
			this.lettersGuessed.push(guess);
			//check if gameover
			if(this.guessesLeft < 1){
				this.gamesLost++;
				this.StartNewGame();
			}
		}
		return isCorrectGuess;

	},

	//checks if a user has won
	CheckWin: function(){
		
		for(var i = 0; i < this.gameString.length; i++){
			if(this.gameString[i]==="_"){
				return false;
			}
		}
		this.gamesWon++;
		var audio = new Audio('assets/sounds/DJ - Khaled.mp3');
		audio.play();
		this.StartNewGame();
		return true;
	},

	//Updates the screen with the "game" object's values
	UpdateScreen: function(){
		document.getElementById("GamesWonId").innerHTML = this.gamesWon;
		document.getElementById("GamesLostId").innerHTML = this.gamesLost;

		document.getElementById("GameBoardId").innerHTML = this.gameString.join("  ");
		document.getElementById("LettersGuessedId").innerHTML = this.lettersGuessed;
		document.getElementById("GuessesLeftId").innerHTML = this.guessesLeft;

	}


}

//when the page is loaded, the landing page is displayed and the game page isn't
document.getElementById("GamePage").style.display="none";
document.getElementById("LandingPage").style.display="block";

//defining the function that exectues onkeyup
document.onkeyup = function(event){
	//If we are on landing page, switch to game page
	if(document.getElementById("GamePage").style.display=="none"){
		document.getElementById("GamePage").style.display="block";
		document.getElementById("LandingPage").style.display="none";
		game.StartNewGame();
		game.UpdateScreen();
		return;
	}
	//Only accept keys from a-z ignoring case
	if(/[a-z]/i.test(String.fromCharCode(event.keyCode))){
		game.CheckGuess(event.key, game.currentWord);
		game.CheckWin(game.GameString);
		game.UpdateScreen();
	}
		
}