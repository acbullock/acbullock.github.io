//Object definition
var game = {

	//will act as a word constructor
	makeWord: function(word, sound, hint){
		this.word=word;
		this.sound=sound;
		this.hint = hint;
	},
	
	//Array of possible words--will hold word objects
	words:[],

	currentIndex:0,

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
				result.push("&nbsp;&nbsp;&nbsp;")
		}

		return result;
	},

	//Function to pick a random word from the Words array
	//accepts an array, returns a random element
	//updates the callers current index
	PickWord: function(words){
		this.currentIndex = Math.floor(Math.random()*words.length);
	},

	//Function to start new game
	//picks new word, updates scores, resets guessed letters
	StartNewGame: function(){
		this.PickWord(this.words);
		this.gameString = this.ConvertWordToGame(this.words[this.currentIndex].word);
		document.getElementById("GuessesLeftId").style="color:white;"
		document.getElementById("HintId").innerHTML=this.words[this.currentIndex].hint;
		this.guessesLeft=10;
		this.lettersGuessed=[];
	},

	//checks if a guess is correct, updates game object accordingly
	CheckGuess: function(guess, currWord){
		guess=guess.toUpperCase();
		currWord=currWord.toUpperCase();

		var isCorrectGuess = this.words[this.currentIndex].word.toUpperCase().includes(guess);

		//Do nothing if user already guessed this letter
		if(this.lettersGuessed.includes(guess) || this.gameString.includes(guess))
			return;
		
		//update game string if correct guess
		if(isCorrectGuess){

			for(var i = 0; i < currWord.length; i++){
				if(guess === currWord[i]){
					
					this.gameString[i] = guess;
					isCorrectGuess = true;
				}
			}
		}
		
		//update game object accordingly
		else{
			this.guessesLeft--;
			//warn user when 3 guesses remaining
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
	
	//checks if a user has won, updates game object accordingly
	CheckWin: function(){
		
		if(!this.gameString.includes("_")){
			this.gamesWon++;
			this.words[this.currentIndex].sound.play();
			this.StartNewGame();
		}
	},

	//Updates the screen with the "game" object's values
	UpdateScreen: function(){
		document.getElementById("GamesWonId").innerHTML = this.gamesWon;
		document.getElementById("GamesLostId").innerHTML = this.gamesLost;
		document.getElementById("GameBoardId").innerHTML = this.gameString.join("  ");
		document.getElementById("LettersGuessedId").innerHTML = this.lettersGuessed;
		document.getElementById("GuessesLeftId").innerHTML = this.guessesLeft;

	},



}
//create array of word objects inside of the game object
game.words=[new game.makeWord("nicki minaj", new Audio('assets/sounds/Nicki - Minaj.mp3'), "Guess The Artist"), new game.makeWord("outkast", new Audio('assets/sounds/Big Boi From Outkast - Big Boi From Outkast.mp3'), "Guess The Artist"), new game.makeWord("travis scott", new Audio('assets/sounds/Travis Scott - Intro sound signature.mp3'), "Guess The Artist"), new game.makeWord("desiigner", new Audio('assets/sounds/Desiigner - Desiigner.mp3'), "Guess The Artist"), new game.makeWord("bad and boujee", new Audio('assets/sounds/Migos - Raindrop Drop Top Sound Effect.mp3'), "Guess The Song"), new game.makeWord("madeintyo", new Audio('assets/sounds/Made - In.mp3'), "Guess The Artist"), new game.makeWord("lil wayne", new Audio('assets/sounds/Lil - Wayne.mp3'), "Guess The Artist"), new game.makeWord("kanye west", new Audio('assets/sounds/Kanye West - Kanye West.mp3'), "Guess The Artist"), new game.makeWord("rick ross", new Audio('assets/sounds/Rick - Ross.mp3'), "Guess The Artist"), new game.makeWord("french montana", new Audio('assets/sounds/french - montana.mp3'), "Guess The Artist"), new game.makeWord("gucci mane", new Audio('assets/sounds/Gucci - Mane.mp3'), "Guess The Artist"), new game.makeWord("stillmatic", new Audio('assets/sounds/Nas - Saying.mp3'), "Guess The Album"),new game.makeWord("money longer", new Audio('assets/sounds/Lil Uzi Vert - It Do Not Matter Sound Effect.mp3'), "Guess The Song"),new game.makeWord("kodak black", new Audio('assets/sounds/Kodak Black - The Finesse Kid Sound Effect.mp3'), "Guess The Artist"), new game.makeWord("the slim shady lp", new Audio('assets/sounds/Eminem - Slim.mp3'), "Guess The Album"),new game.makeWord("big sean", new Audio('assets/sounds/Big - Sean.mp3'), "Guess The Artist"),new game.makeWord("the black album", new Audio('assets/sounds/JAY - Z.mp3'), "Guess The Album"),new game.makeWord("lil jon", new Audio('assets/sounds/LIL - JON.mp3'), "Guess The Artist"),new game.makeWord("life after death",new Audio('assets/sounds/BIGGIE - AND.mp3'), "Guess The Album"),new game.makeWord("dj khaled",new Audio('assets/sounds/DJ - Khaled.mp3'), "Guess The Artist")];

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
		//for every valid key, check the guess, check if they won, 
		//update the game object, and update the screen.
		game.CheckGuess(event.key, game.words[game.currentIndex].word);
		game.CheckWin(game.GameString);
		game.UpdateScreen();
	}
		
}