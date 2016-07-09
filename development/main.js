// var prompt = require('prompt');
// var Word = require('./word.js');

// prompt.start();

// game = {
// 	wordBank : ["heart and soul", "relax", "burning up", "manic monday", "into the groove", "invisible touch", "rebel yell"],
// 	wordsWon : 0,
// 	guessesRemaining : 10, //per word
// 	currentWrd : null, //the word object
// 	startGame : function (wrd){
// 		//make sure the user has 10 guesses
// 		this.resetGuessesRemaining();

// 		//get a random word from the array
// 		this.currentWrd = new Word(this.wordBank[Math.floor(Math.random()* this.wordBank.length)]);

// 		this.currentWrd.getLets(); //populate currentWrd (made from Word constructor function) object with letters

// 		this.keepPromptingUser();

// 	}, 
// 	resetGuessesRemaining : function(){
// 		this.guessRemaining = 10;
// 	},
// 	keepPromptingUser : function(){
// 		var self = this;

// 		prompt.get(['guessLetter'], function(err, result) {
// 		    // result is an object like this: { guessLetter: 'f' }
// 		    //console.log(result);
		    
// 		    console.log('  The letter or space you guessed is: ' + result.guessLetter);

// 		    //this checks if the letter was found and if it is then it sets that specific letter in the word to be found
// 		    var findHowManyOfUserGuess = self.currentWrd.checkIfLetterFound(result.guessLetter);

// 		    //if the user guessed incorrectly minus the number of guesses they have left
// 		    if (findHowManyOfUserGuess == 0){
// 		    	console.log('You guessed wrong!');
// 		    	self.guessesRemaining--;
// 		    }else{
// 		    	console.log('You guessed right!');

// 		    	//check if you win only when you are right
// 	    		if(self.currentWrd.didWeFindTheWord()){
// 			    	console.log('You Won!!!');
// 			    	return; //end game
// 			    }
// 		    }
		    
// 		    console.log('Guesses remaining: ', self.guessesRemaining);
// 		    console.log(self.currentWrd.wordRender());
// 		    console.log('here are the letters you guessed already: ');

// 		    if ((self.guessesRemaining > 0) && (self.currentWrd.found == false)){
// 		    	self.keepPromptingUser();
// 		    }
// 		    else if(self.guessesRemaining == 0){
// 		    	console.log('Game over bro it was ', self.currentWrd.word);
// 		    	console.log('Get with the program man');
// 		    }else{
// 		    	console.log(self.currentWrd.wordRender());
// 		    }
// 		});
// 	}


// };

// game.startGame();




//require the inquirer npm package
var inquirer = require('inquirer');
//require the constructor WordBank from game.js
var WordBank = require('./game.js');
//create a new instance of wordBank
var wordBank = new WordBank();
//require the constructor from word.js
var Word = require('./word.js');
//number of guesses user has
var numGuessesRemaining = 10;
//create a new instance of a random word from the word bank
var randomHangmanWord = new Word(wordBank.wordBank[Math.floor(Math.random() * wordBank.wordBank.length)]);
//populate all the user guesses in this array
var userGuesses = [];
//populate correctLettersGuessed array
randomHangmanWord.getLetters();

var playHangman = function() {
	
	if (numGuessesRemaining > 0 && randomHangmanWord.found === false) {

		console.log("\nYabba-Dabba-Doooo!");
		console.log("The Hangman Game is 80's Cartoons!");
		console.log("You have " + numGuessesRemaining + " guesses left.");
		console.log(randomHangmanWord.wordRender() + '\n');

		inquirer.prompt([{
			type: 'text',
			name: 'letterGuessed',
			message: "Pick a letter to solve Hangman.",
			
		}]).then(function(answers) {
			//checks to see if letter is valid
			var isLetter = letterValidation(answers.letterGuessed);
			if (isLetter) {
				userGuesses.push(answers.letterGuessed);
				var guardAgainstDuplicatesArr = noDuplicatesinUserGuesses(userGuesses);
				
				var findHowManyOfUserGuess = randomHangmanWord.checkIfLetterFound(answers.letterGuessed);
				console.log(randomHangmanWord.wordRender());

				if (findHowManyOfUserGuess === 0) {
					console.log("You guessed wrong!\n");
					numGuessesRemaining--;
				} else {
					console.log("You guessed right!!!");
					if (randomHangmanWord.didWeFindTheWord()) {
						console.log("You won!!!\n");
						console.log("The band was " + displayWord(randomHangmanWord) + "!");
						return;
					}
				}
				console.log("You have " + numGuessesRemaining + " guesses.");
				console.log(randomHangmanWord.wordRender());
				console.log("Here are the letters already guessed: " + guardAgainstDuplicatesArr.join(", "));
				playHangman();
			} else {
				console.log("That's not a letter. Please choose a letter");
				playHangman();
			}
		})
	} else {
		console.log("\nRuh Roh! Maybe next time!");
		console.log("The 80's Cartoon was " + displayWord(randomHangmanWord));
	}
}
//this will guard against any duplicates the user inputs
function noDuplicatesinUserGuesses(userGuessesArr) {
	var checkDuplicatesArr = [];
	for (var i = 0; i < userGuessesArr.length; i++) {
		if (checkDuplicatesArr.indexOf(userGuessesArr[i]) === -1) {
			checkDuplicatesArr.push(userGuessesArr[i]);
		}	
	}
	return checkDuplicatesArr;
}
//displays the word at end of game
function displayWord(hangmanWord) {
	var showWord = "";
	for (var i = 0; i < hangmanWord.correctLettersGuessed.length; i++) {
		showWord += hangmanWord.correctLettersGuessed[i].letterGuessed;
	}
	return showWord;
}

function letterValidation(letter) {
	var validLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' '];
	for (var i = 0; i < validLetters.length; i++) {
		if (validLetters[i] === letter) {
			return true;
		}
	}
	return false;
}

playHangman();
