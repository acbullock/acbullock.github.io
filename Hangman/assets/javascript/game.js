//Object definitions

//word constructor--each word has a string and a sound



var game = {

	//will act as a word constructor
	makeWord: function(word, sound){
		this.word=word;
		this.sound=sound;
	},
	
	//Array of possible words
	words:[],


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
		return words[Math.floor(Math.random()*words.length)].word;
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
	



	PlayWinningSong: function(word, words){
		for(var i =0; i< this.words.length; i++){
			if(this.words[i].word===word)
				this.words[i].sound.play();
		}
	},
	//checks if a user has won
	CheckWin: function(){
		
		for(var i = 0; i < this.gameString.length; i++){
			if(this.gameString[i]==="_"){
				return false;
			}
		}
		this.gamesWon++;
		
		this.PlayWinningSong(this.currentWord, this.words);
		
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

	},



}
	game.words=[new game.makeWord("nicki minaj", new Audio('assets/sounds/Nicki - Minaj.mp3')), new game.makeWord("outkast", new Audio('assets/sounds/Big Boi From Outkast - Big Boi From Outkast.mp3')), new game.makeWord("travis scott", new Audio('assets/sounds/Travis Scott - Intro sound signature.mp3')), new game.makeWord("desiigner", new Audio('assets/sounds/Desiigner - Desiigner.mp3')), new game.makeWord("migos", new Audio('assets/sounds/Migos - Raindrop Drop Top Sound Effect.mp3')), new game.makeWord("madeintyo", new Audio('assets/sounds/Made - In.mp3')), new game.makeWord("lil wayne", new Audio('assets/sounds/Lil - Wayne.mp3')), new game.makeWord("kanye west", new Audio('assets/sounds/Kanye West - Kanye West.mp3')), new game.makeWord("rick ross", new Audio('assets/sounds/Rick - Ross.mp3')), new game.makeWord("french montana", new Audio('assets/sounds/french - montana.mp3')), new game.makeWord("gucci mane", new Audio('assets/sounds/Gucci - Mane.mp3')), new game.makeWord("nas", new Audio('assets/sounds/Nas - Saying.mp3')),new game.makeWord("lil uzi vert", new Audio('assets/sounds/Lil Uzi Vert - It Do Not Matter Sound Effect.mp3')),new game.makeWord("kodak black", new Audio('assets/sounds/Kodak Black - The Finesse Kid Sound Effect.mp3')), new game.makeWord("eminem", new Audio('assets/sounds/Eminem - Slim.mp3')),new game.makeWord("big sean", new Audio('assets/sounds/Big - Sean.mp3')),new game.makeWord("jay z", new Audio('assets/sounds/JAY - Z.mp3')),new game.makeWord("lil jon", new Audio('assets/sounds/LIL - JON.mp3')),new game.makeWord("notorious big",new Audio('assets/sounds/BIGGIE - AND.mp3')),new game.makeWord("dj khaled",new Audio('assets/sounds/DJ - Khaled.mp3'))];
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