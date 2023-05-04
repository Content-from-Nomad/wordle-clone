// current guess = P      A      P     E      R
// answer        = A      P      P     L      E
// result        = yellow yellow green yellow grey

const wordList = ["apple", "paper", "melon", "zebra", "books", "cheap"];

function startGame(round) {
    const userAttempts = [];
    const answer = wordList[0];
    let attempt = 0;
    while (attempt < round) {
        let currentGuess = prompt("Guess a five letter word: ");
        // 1. Check if word is in word list
        if (isInputCorrect(currentGuess)) {
            console.log(currentGuess);
            // 2. Update user attempts
            userAttempts.push(currentGuess);
            // 3. Update attempt count
            attempt = attempt + 1;
            // 4. absent (grey), present (yellow), correct (green)
            const highlightedCharacters = getCharactersHighlight(
                currentGuess,
                answer
            );
            alert(highlightedCharacters);
        } else {
            retry(currentGuess);
        }
    }
}

function isInputCorrect(word) {
    return wordList.includes(word);
}

function retry(word) {
    alert(`${word} is not in word list`);
}

function getCharactersHighlight(word, answer) {
    // 1. split characters
    const wordSplit = word.split("");
    const result = [];

    // 2. check order of characters
    wordSplit.forEach((character, index) => {
        if (character === answer[index]) {
            // 2a. correct = index of word equal index of answer
            result.push("correct");
        } else if (answer.includes(character)) {
            // 2b. present = if not correct, character is part of answer
            result.push("present");
        } else {
            // 2c. absent = else, it must be absent
            result.push("absent");
        }
    });

    return result;
}

startGame(2);
