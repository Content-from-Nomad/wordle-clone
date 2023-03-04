// word =   alley
// answer = apple
// return ["correct", "present", "present", "present", "absent"]

// ["a", "b", "c"...]
// ["present", "unknown", "absent"...]
// {a: "present", b: "unknown", c: "absent"}

// maybe for keyboard
// green = ["a", "l"]
// yellow = ["a", "l", "e"]

const wordList = [
    "apple",
    "alley",
    "paper",
    "melon",
    "zebra",
    "books",
    "cheap",
];

function startGame(round) {
    const userAttempts = [];
    const answer = wordList[0]; // TODO: change this to by date
    const keyboard = getKeyboard();
    let attempt = 1;
    while (attempt <= round) {
        let userInput = prompt("Guess a five letter word: ");
        // 1. Check if word is in word list
        if (isInputCorrect(userInput)) {
            console.log(userInput);
            // 2. Update user attempts
            userAttempts.push(userInput);
            // 3. Update attempt count
            attempt = attempt + 1;
            // 4. absent (grey), present (yellow), correct (green)
            const highlightedCharacters = checkCharacters(userInput, answer);
            alert(highlightedCharacters);
            // 5. highlight keyboard
            // TODO
            console.log(keyboard);
        } else {
            retry(userInput);
        }
    }
}

function isInputCorrect(word) {
    return wordList.includes(word);
}

function retry(word) {
    alert(`${word} is not in word list`);
}

function checkCharacters(word, answer) {
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

function getKeyboard() {
    const alphabets = "abcdefghijklmnopqrstuvwxyz".split("");
    const entries = [];
    for (const alphabet of alphabets) {
        entries.push([alphabet, "unknown"]);
    }
    return Object.fromEntries(entries);
}

startGame(2);
