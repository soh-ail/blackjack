// TO DO: Add jquery


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
    document.getElementById("player-score").innerHTML = "Player Score: " + playerScore;
    document.getElementById("dealer-score").innerHTML = "Dealer Score: " + "?";
    document.getElementById("dealerTotalWins").innerText = "Dealer Wins: " + dealerTotalWins;
    document.getElementById("playerTotalWins").innerText = "Player Wins: " + playerTotalWins;
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
        document.getElementById("player-card").append(cardImg);
        cardImg.className = "card"
    }

    while (dealerCount < 2) {
        let cardImg = document.createElement("img")
        let nextCard = deck.shift();
        cardImg.src = "./images/" + nextCard + ".svg";
        dealerScore += cardScore(nextCard);
        dealerAces += checkAce(nextCard);
        document.getElementById("dealer").append(cardImg);
        cardImg.className = "card"
        dealerCount ++;
    }

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stand").addEventListener("click", stand);
}



const checkPlayerScore = (playerScore, playerAces) => {
    while (playerScore > 21 && playerAces > 0) {
        playerScore -=10;
        playerAces -= 1;
    }
    document.getElementById("player-score").innerHTML = "Player Score: " + playerScore;
    return playerScore
}

const checkDealerScore = (dealerScore, dealerAces) => {
    while (dealerScore > 21 && dealerAces > 0) {
       dealerScore -=10;
        dealerAces -= 1;
    }
    document.getElementById("dealer-score").innerHTML = "Dealer Score: " + dealerScore;
    return dealerScore
}
const cardScore = (card) => {
    cardCheck = card.split("_")[0];
    cardValue = cardCheck

    // checks if card is not a numbered card - if not an ace will return 10.
    if (isNaN(cardValue)) {
        if (cardValue === "ace") {
            return 11;
        }
            return 10;
    }
    return Number(cardValue);
}

const checkAce = (card) => {
    if (card[0] === "a") {
        return 1;
    } return 0;
}

const hit = () => {
    if (hitActive === false) {
        return;
    }

    let cardImg = document.createElement("img")
    let nextCard = deck.shift();
    cardImg.src = "./images/" + nextCard + ".svg";
    playerScore += cardScore(nextCard);
    playerAces += checkAce(nextCard);
    document.getElementById("player-card").append(cardImg);
    cardImg.className = "card"
    checkPlayerScore(playerScore, playerAces);

    if (checkPlayerScore(playerScore, playerAces) > 21) {
        hitActive = false;
    }
}

const stand = () => {
    if (standActive === false) {
        return;
    }
    checkDealerScore(dealerScore, dealerAces); 

    while (dealerScore < 17) {
        let cardImg = document.createElement("img")
        let nextCard = deck.shift();
        cardImg.src = "./images/" + nextCard + ".svg";
        dealerScore += cardScore(nextCard);
        dealerAces += checkAce(nextCard);
        checkDealerScore(dealerScore, dealerAces);   
        document.getElementById("dealer").append(cardImg);
        cardImg.className = "card"  
    }

    hitActive = false;
    document.getElementById("faceDown").src = "./images/" + faceDown + ".svg"
    

    dealerScore = checkDealerScore(dealerScore, dealerAces);
    playerScore = checkPlayerScore(playerScore, playerAces);      

    let result = "";

    if (playerScore > 21) {
        result = "Player Bust, Dealer Wins!";
        dealerTotalWins += 1;
    }
    else if (dealerScore > 21) {
        result = "Dealer Bust, Player Wins!";
        playerTotalWins += 1;
    }
    else if (dealerScore === playerScore) {
        result = "Tied with the Dealer";
    }
    else if (playerScore < dealerScore) {
        result = "Dealer Wins!";
        dealerTotalWins += 1;
    } else if (playerScore > dealerScore) {
        result = "Player Wins!";
        playerTotalWins += 1;
    }

    document.getElementById("result").innerText = result;
    document.getElementById("playAgain").style.display = "inline";
    document.getElementById("playAgain").addEventListener("click", playAgain);
    document.getElementById("playerTotalWins").innerHTML = "Player Wins: " + playerTotalWins;
    document.getElementById("dealerTotalWins").innerHTML = "Dealer Wins: " + dealerTotalWins;
    standActive = false;
}

const playAgain = () => {
    resetGame();
    createDeck();
    shuffleDeck();
    startGame();
    document.getElementById("player-score").innerHTML = "Player Score: " + playerScore;
    document.getElementById("dealer-score").innerHTML = "Dealer Score: " + "?";
}

const resetGame = () => {

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
    result = "​";
    document.getElementById("result").innerText = result;
    
    let faceDownImg = new Image();
    faceDownImg.src = "./images/back.png"
    faceDownImg.className = "card";
    faceDownImg.id = "faceDown";
    document.getElementById("dealer").appendChild(faceDownImg);
    
    document.getElementById("playAgain").style.display = "none";
}


