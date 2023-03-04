// word =   alley
// answer = apple
// return ["correct", "present", "present", "present", "absent"]

// ["a", "b", "c"...]
// ["present", "unknown", "absent"...]
// {a: "present", b: "unknown", c: "absent"}

// maybe for keyboard
// present: ["a", "l"]
// absent: ["a", "l", "e"]

// a p p l e
// p a p e r
// b a p p e

const wordList = ["right", "since", "fifth", "bappe", "fifty", "apple", "alley", "paper", "melon", "zebra", "books", "cheap"];

const rating = {
    unknown: 0,
    absent: 1,
    present: 2,
    correct: 3,
};

function startGame(round) {
    const userAttempts = [];
    const highlightedRows = [];
    const answer = "apple"; // TODO: change this to by date
    let keyboard = getKeyboard();
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
            highlightedRows.push(highlightedCharacters);
            console.log(highlightedCharacters);
            // 5. highlight keyboard
            keyboard = updateKeyboardHighlights(keyboard, userInput, highlightedCharacters);
            console.log(keyboard);
            // 6. Save game
            saveGame({
                attempt,
                keyboard,
                userAttempts,
                highlightedRows,
            });
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

        if (nextRating > previousRating) {
            newKeyboard[character] = nextStatus;
        }
    }

    return newKeyboard;
}

function saveGame(gameState) {
    window.localStorage.setItem("PREFACE_WORDLE", JSON.stringify(gameState));
}

startGame(1);

// {
//     present: [i],
//     absent: [s, n, c, e]
// }

// {
//     correct: [i, a, p],
//     present: [t, a, p],
//     absent: [s, n, c, e, r, g, h],
//     unknown: [a, b, c, d...]
// }
