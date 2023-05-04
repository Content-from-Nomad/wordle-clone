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
    return wordList.includes(word);
}

function retry(word) {
    alert(`${word} is not in word list`);
}

startGame(2);
