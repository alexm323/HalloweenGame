class AudioController {
	//Constructors only run when a new object is created
	constructor() {
		this.bgMusic = new Audio('Assets/Audio/creepy.mp3');
		this.flipSound = new Audio('Assets/Audio/flip.wav');
		this.matchSound = new Audio('Assets/Audio/match.wav');
		this.victorySound = new Audio('Assets/Audio/victory.wav');
		this.gameOverSound = new Audio('Assets/Audio/gameover.wav');
		this.bgMusic.volume = 0.1;
		this.bgMusic.loop = true;
	}
	startMusic() {
		this.bgMusic.play();
	}
	stopMusic() {
		this.bgMusic.pause();
		this.bgMusic.currentTime = 0;
	}
	flip() {
		this.flipSound.play();
	}
	match() {
		this.matchSound.play();
	}
	victory() {
		this.stopMusic();
		this.victory.play();
	}
	gameOver() {
		this.stopMusic();
		this.gameOverSound.play();
	}
}

class MixOrMatch {
	constructor(totalTime, cards) {
		this.cardsArray = cards;
		this.totalTime = totalTime;
		this.timeRemaining = totalTime;
		this.timer = document.getElementById('time-remaining');
		this.ticker = document.getElementById('flips');
		this.audioController = new AudioController();
	}
	startGame() {
		this.cardToCheck = null;
		this.totalClicks = 0;
		this.timeRemaining = this.totalTime;
		this.matchedCards = [];
		this.budy = true;

		setTimeout(() => {
			this.audioController.startMusic();
			this.shuffleCards();
			this.countDown = this.startCountDown();
			this.busy = false;
		}, 500);
		this.hideCards();
		this.timer.innerText = this.timeRemaining;
		this.ticker.innerText = this.totalClicks;
	}
	hideCards() {
		//we're going to loop through the cards array
		this.cardsArray.forEach((card) => {
			card.classList.remove('visible');
			card.classList.remove('matched');
		});
	}
	startCountDown() {
		return setInterval(() => {
			this.timeRemaining--;
			this.timer.innerText = this.timeRemaining;
			if (this.timeRemaining === 0) {
				this.gameOver();
			}
		}, 1000);
	}
	gameOver() {
		clearInterval(this.countDown);
		this.audioController.gameOver();
		document.getElementById('game-over-text').classList.add('visible');
	}
	victory() {
		clearInterval(this.countDown);
		this.audioController.victory();
		document.getElementById('victory-text').classList.add('visible');
	}

	flipCard(card) {
		if (this.canFlipCard(card)) {
			this.audioController.flip();
			this.totalClicks++;
			this.ticker.innerText = this.totalClicks;
			card.classList.add('visible');

			//are we trying to match a card or are we flipping a card for the first time
			if (this.cardToCheck) {
				this.checkForCardMatch(card);
			} else {
				//if the this.cardToCheck is null, we set the cardToCheck value to be that card because that means we are looking for a new card to check
				this.cardToCheck = card;
			}
		}
	}
	checkForCardMatch() {
		if (this.getCardType(card) === this.getCardType(this.cardToCheck(card))) this.cardMatch(card, this.cardToCheck);
		else this.cardMisMatch(card, this.cardToCheck);
		this.cardToCheck = null;
	}
	cardMatch(card1, card2) {
		//when we match a card , push both of those cards to the matched cards array
		this.matchedCards.push(card1);
		this.matchedCards.push(card2);
		card1.classList.add('matched');
		card2.classList.add('matched');
		this.audioController.match();
		if (this.matchedCards.length === this.cardsArray) {
			this.victory();
		}
	}
	cardMisMatch(card1, card2) {
		this.busy = true;
		setTimeout(() => {
			card1.classList.remove('visible');
			card2.classList.remove('visible');
			this.busy = false;
		}, 1000);
	}
	getCardType(card) {
		// 	//This code right here is how he is evaluating the cards. I need to either figure out how to pull a source out from the classes I give the divs in my own project . Or I need to figure out another value I can pull out to evaluate the cards.
		return card.getElementsByClassName('card-value')[0].src;
	}

	shuffleCards() {
		for (let i = this.cardsArray.length - 1; i > 0; i--) {
			let randIndex = Math.floor(Math.random() * (i + 1));
			//order is a css property that mixes the order of the cards here
			this.cardsArray[randIndex].style.order = i;
			//we're taking a random item in the card list and switched it with another item in the array list
			this.cardsArray[i].style.order = randIndex;
		}
	}
	canFlipCard() {
		return true;
		//there is going to be 3 scenarios where we don't want a user to be able to flip a card. the first is when this.busy is true because it is going to be checking if there is an animation going on, the 2nd is if you are clicking on a card that is already a matched card, 3rd case this.cardToCheck it starts null because you start with no card to compare it to right away
		//return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
	}
}

function ready() {
	let overlays = Array.from(document.getElementsByClassName('overlay-text'));
	let cards = Array.from(document.getElementsByClassName('card'));
	let game = new MixOrMatch(100, cards);
	//for each here calls a function for every item in the array overlays that we got by using the array.from method on the HTML collection
	overlays.forEach((overlay) => {
		overlay.addEventListener('click', () => {
			overlay.classList.remove('visible');
			game.startGame();
		});
	});
	cards.forEach((card) => {
		card.addEventListener('click', () => {
			game.flipCard(card);
		});
	});
}

//Initializes the game and has all the scripts wait to run until the html elements are all loaded
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', ready());
} else {
	ready();
}
//new MixOrMatch(100, cardsArray)
