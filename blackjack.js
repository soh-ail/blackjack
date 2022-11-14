let gameStatus = "Player Turn - Press Hit or Stand to Proceed";
let dealerScore = 0;
let playerScore = 0;
let deck = [];
let playerAces = 0
let dealerAces = 0;
let faceDown = [];
let hitActive = true;
let standActive = true;
let dealerCount = 0;
let playerTotalWins = 0;
let dealerTotalWins = 0;

window.onload = function() {
    createDeck();
    shuffleDeck();
    startGame();
    $("#gameStatus").html(gameStatus)
    $("#player-score").html("Player Score: " + playerScore);
    $("#dealer-score").html("Dealer Score: ?");
    $("#dealerTotalWins").html("Dealer Wins: " + dealerTotalWins);
    $("#playerTotalWins").html("Player Wins: " + playerTotalWins);
    }


const createDeck = () => {
    let suits = ["_of_diamonds", "_of_hearts", "_of_spades", "_of_clubs"];
    let values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];
    
    // loop through deck to suits and values arrays to create deck e.g. queen_of_diamonds
    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + suits[i]);
        }
    } 
    return deck;
}

const shuffleDeck = () => {

    //Fisher-Yates shuffle algorithm courtesy of https://bost.ocks.org/mike/shuffle/
    let n = deck.length    
    while (n > 0) {
        let i = Math.floor(Math.random() * n--);
        let t = deck[n];
        deck[n] = deck[i];
        deck [i] = t;
    }
   return deck;
}

// starts game: deals 2 cards each to dealer and player
const startGame = () => {
    faceDown = deck.shift(); 
    dealerScore += cardScore(faceDown);
    dealerCount += 1;
    dealerAces += checkAce(faceDown)

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img")
        let nextCard = deck.shift();
        cardImg.src = "./images/" + nextCard + ".svg";
        playerScore += cardScore(nextCard);
        playerAces += checkAce(nextCard);
        $("#player-card").append(cardImg);
        cardImg.className = "card"
    }

    while (dealerCount < 2) {
        let cardImg = document.createElement("img")
        let nextCard = deck.shift();
        cardImg.src = "./images/" + nextCard + ".svg";
        dealerScore += cardScore(nextCard);
        dealerAces += checkAce(nextCard);
        $("#dealer").append(cardImg);
        cardImg.className = "card"
        dealerCount ++;
    }

    // runs hit or stand on click of either button
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stand").addEventListener("click", stand);
}


// checks how many aces player/dealer has, if score > 21, will reduce score by 10 for each ace until score < 21
const checkPlayerScore = (playerScore, playerAces) => {
    while (playerScore > 21 && playerAces > 0) {
        playerScore -=10;
        playerAces -= 1;
    }
    $("#player-score").html("Player Score: " + playerScore);
    return playerScore
}

const checkDealerScore = (dealerScore, dealerAces) => {
    while (dealerScore > 21 && dealerAces > 0) {
       dealerScore -=10;
        dealerAces -= 1;
    }
    $("#dealer-score").html("Dealer Score: " + dealerScore);
    return dealerScore
}

// checks and retuns value of card. If card is NaN (i.e. J,K,Q,A) will return 10 or 11
const cardScore = (card) => {
    cardCheck = card.split("_")[0];
    cardValue = cardCheck

    
    if (isNaN(cardValue)) {
        if (cardValue === "ace") {
            // by default ace is 11 unless score > 21
            return 11;
        }
            return 10;
    }
    return Number(cardValue);
}

// counts ace in player/dealers hand - used to determine how many times checkPlayerScore/checkDealerScore iterates

const checkAce = (card) => {
    if (card[0] === "a") {
        return 1;
    } return 0;
}

const hit = () => {
    if (hitActive === false) {
        return;
    }

    // creates image corresponding to value of first position in deck array and adds to player score
    let cardImg = document.createElement("img")
    let nextCard = deck.shift();
    cardImg.src = "./images/" + nextCard + ".svg";
    playerScore += cardScore(nextCard);
    playerAces += checkAce(nextCard);
    $("#player-card").append(cardImg);
    cardImg.className = "card"
    checkPlayerScore(playerScore, playerAces);

    // if after reducing aces to 1, score is still >21, then prevent further hits
    if (checkPlayerScore(playerScore, playerAces) > 21) {
        hitActive = false;
    }
}

const stand = () => {
    // if stand button is inactive, do not allow press again
    if (standActive === false) {
        return;
    }

    // deals cards for dealer until score drawn is at least 16
    // creates images and score for cards in same way as player
    checkDealerScore(dealerScore, dealerAces); 
    while (dealerScore < 17) {
        let cardImg = document.createElement("img")
        let nextCard = deck.shift();
        cardImg.src = "./images/" + nextCard + ".svg";
        dealerScore += cardScore(nextCard);
        dealerAces += checkAce(nextCard);
        checkDealerScore(dealerScore, dealerAces);   
        $("#dealer").append(cardImg);;
        cardImg.className = "card"  
    }

    // deactivates hit button so player can't get more cards after dealer reveals score
    hitActive = false;

    //reveal facedown card
    $("#faceDown").attr("src", `./images/${faceDown}.svg`);
    

    dealerScore = checkDealerScore(dealerScore, dealerAces);
    playerScore = checkPlayerScore(playerScore, playerAces);      

    
    // evaluate result
    if (playerScore > 21) {
        gameStatus = "Player Bust, Dealer Wins!";
        dealerTotalWins += 1;
    }
    else if (dealerScore > 21) {
        gameStatus = "Dealer Bust, Player Wins!";
        playerTotalWins += 1;
    }
    else if (dealerScore === playerScore) {
        gameStatus = "Tied with the Dealer";
    }
    else if (playerScore < dealerScore) {
        gameStatus = "Dealer Wins!";
        dealerTotalWins += 1;
    } else if (playerScore > dealerScore) {
        gameStatus = "Player Wins!";
        playerTotalWins += 1;
    }
    
    //update score and game status, reveals play again button
    $("#gameStatus").html(gameStatus);
    $("#playAgain").show();
    document.getElementById("playAgain").addEventListener("click", playAgain);
    $("#dealerTotalWins").html("Dealer Wins: " + dealerTotalWins);
    $("#playerTotalWins").html("Player Wins: " + playerTotalWins);
    standActive = false;
}

// resets game and creates new shuffled deck
const playAgain = () => {
    resetGame();
    createDeck();
    shuffleDeck();
    startGame();
    $("#player-score").html("Player Score: " + playerScore);
    $("#dealer-score").html("Dealer Score: ?");
}

const resetGame = () => {

    // deletes all images to "reset" cards
    for (var i= document.images.length; i-->0;) {
    document.images[i].parentNode.removeChild(document.images[i]);
    }

    dealerScore = 0;
    playerScore = 0;
    deck = [];
    playerAces = 0
    dealerAces = 0;
    faceDown = [];
    hitActive = true;
    standActive = true;
    dealerCount = 0;
    gameStatus = "Player Turn - Press Hit or Stand to Proceed";
    document.getElementById("gameStatus").innerText = gameStatus;

    // creates dealers face down card again
    
    let faceDownImg = new Image();
    faceDownImg.src = "./images/back.png"
    faceDownImg.className = "card";
    faceDownImg.id = "faceDown";
    document.getElementById("dealer").appendChild(faceDownImg);
    
    $("#playAgain").hide();
}


