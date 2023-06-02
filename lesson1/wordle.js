/**
 * Objective:
 * 1) Get a guess from the user
 * 2) Validate the guess
 * 3) Stop when we guess 6 times
 * 4) Learn about numbers, strings and arrays
 *
 */

const wordList = ["apple", "paper", "melon", "zebra", "books", "cheap"];

function startGame(round) {
    let attempt = 0;
    while (attempt < round) {
        let currentGuess = prompt("Guess a five letter word: ");
        // 1. Check if word is in word list
        if (validateInput(currentGuess)) {
            console.log(currentGuess);
            attempt = attempt + 1;
        } else {
            retry(currentGuess);
        }
    }
}

function validateInput(word) {
    // Checking an item in list
    return wordList.includes(word);
}

function retry(word) {
    // Include a variable in to a string (aka f-string in python)
    alert(`${word} is not in word list`);
}

startGame(2);
