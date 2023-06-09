/**
 * Objective:
 * 1) Get the colours for every alphabet (keyboard highlights)
 * 2) Learn about objects (aka dictionary in python)
 */

// Keyboards... keys... alphabets... dictionary!!!
// ["a", "b", "c"...]
// ["present", "unknown", "absent"...]
// {a: "present", b: "unknown", c: "absent"}

const wordList = ["apple", "paper", "melon", "zebra", "books", "cheap"];

// You can't compare colours (they don't have greater than and lesser than)
// So you convert them to numbers!!
const rating = {
    unknown: 0,
    absent: 1,
    present: 2,
    correct: 3,
};

function startGame(round) {
    const userAttempts = [];
    const answer = wordList[0];
    // Create the keyboard dictionary
    let keyboard = getKeyboard();
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
            const highlightedCharacters = checkCharacters(currentGuess, answer);
            alert(highlightedCharacters);
            // 5. highlight keyboard
            keyboard = updateKeyboardHighlights(
                keyboard,
                currentGuess,
                highlightedCharacters
            );
            console.log(newKeyboard);
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

// Teacher provided
// {"a": "unknown", "b": "unknown", ..., "z": "unknown"}
function getKeyboard() {
    const alphabets = "abcdefghijklmnopqrstuvwxyz".split("");
    const entries = [];
    for (const alphabet of alphabets) {
        entries.push([alphabet, "unknown"]);
    }
    return Object.fromEntries(entries);
}

function updateKeyboardHighlights(keyboard, userInput, highlightedCharacter) {
    // 5a. use userInput ("apple") highlightedCharacters (["correct", "present"...])
    // 5b. compare keyboard["a"] with "correct",
    // if keyboard status < "correct", update keyboard
    const newKeyboard = Object.assign({}, keyboard);

    for (let i = 0; i < highlightedCharacter.length; i++) {
        const character = userInput[i]; // R
        const nextStatus = highlightedCharacter[i]; // absent
        const nextRating = rating[nextStatus]; // 1
        const previousStatus = newKeyboard[character]; // unknown
        const previousRating = rating[previousStatus]; // 0

        // How do we handle a colour upgrade?
        // Eg. If previous colour is yellow, and new colour is green, final colour is green
        // Eg. If previous colour is green, and new colour is yellow, final colour is green
        // Keyboard always keep your best shot
        if (nextRating > previousRating) {
            newKeyboard[character] = nextStatus;
        }
    }

    return newKeyboard;
}

startGame(2);
