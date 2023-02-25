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
    "cheap"
]

const rating = {
    unknown: 0,
    absent: 1,
    present: 2,
    correct: 3
}

function startGame(round) {
    const userAttempts = []
    const highlightedRows = []
    const answer = wordList[0] // TODO: change this to by date
    let keyboard = getKeyboard()
    let attempt = 1
    while (attempt <= round) {
        let userInput = prompt("Guess a five letter word: ")
        // 1. Check if word is in word list 
        if (isInputCorrect(userInput)) {
            console.log(userInput)
            // 2. Update user attempts 
            userAttempts.push(userInput)
            // 3. Update attempt count
            attempt = attempt + 1
            // 4. absent (grey), present (yellow), correct (green)
            const highlightedCharacters = checkCharacters(userInput, answer)
            highlightedRows.push(highlightedCharacters)
            console.log(highlightedCharacters)
            // 5. highlight keyboard
            keyboard = updateKeyboardHighlights(keyboard, userInput, highlightedCharacters)
            console.log(keyboard)
            // 6. save game 
            saveGame({
                attempt,
                userAttempts,
                highlightedRows,
                keyboard
            })
        } else {
            retry(userInput)
        }
    }
}

function isInputCorrect(word) {
    return wordList.includes(word)
}

function retry(word) {
    alert(`${word} is not in word list`)
}

function checkCharacters(word, answer) {
    // 1. split characters 
    const wordSplit = word.split("")
    const result = []

    // 2. check order of characters 
    wordSplit.forEach((character, index) => {
        if (character === answer[index]) {
            // 2a. correct = index of word equal index of answer
            result.push("correct")
        } else if (answer.includes(character)) {
            // 2b. present = if not correct, character is part of answer    
            result.push("present")
        } else {
            // 2c. absent = else, it must be absent    
            result.push("absent")
        }
    })

    return result
}

function getKeyboard() {
    const alphabets = "abcdefghijklmnopqrstuvwxyz".split("")
    const entries = []
    for (const alphabet of alphabets) {
        entries.push([alphabet, "unknown"])
    }
    return Object.fromEntries(entries)
}

// Iterate keys, pass key’s current state and object of new characters state from guess to function, it returns character’s new state
function updateKeyboardHighlights(keyboard, guess, highlightedCharacters) {
    const newKeyboard = Object.assign({}, keyboard)
    const guessStatus = getGuessBestStatus(guess, highlightedCharacters)
    Object.keys(guessStatus).forEach((character) => {
        const prevStatus = keyboard[character]
        const nextStatus = getCharacterNewStatus(character, prevStatus, guessStatus)
        newKeyboard[character] = nextStatus
    })
    return newKeyboard
}

// consolidate the newHighlight, one character and the best status of the guess 
// this edge case 
// p = correct
// p = present 
function getGuessBestStatus(guess, highlightedCharacters) {
    const result = {}
    for (let i = 0; i < guess.length; i++) {
        const char = guess[i]
        const nextStatus = highlightedCharacters[i]
        if (char in result) {
            const nextRating = rating[nextStatus]
            const prevRating = result[char]
            if (nextRating > prevRating) {
                result[char] = nextStatus
            }
            continue
        }
        result[char] = nextStatus
    }
    return result
}

// given a character from the keyboard, it's current status, and the best guess status
// return what status i should use this round
function getCharacterNewStatus(character, prevStatus, guessStatus) {
    if (!character in guessStatus) {
        return prevStatus
    }
    const nextStatus = guessStatus[character]
    const nextRating = rating[nextStatus]
    const prevRating = rating[prevStatus]
    if (nextRating > prevRating) {
        return nextStatus
    }
    return prevStatus
}

function saveGame(gameState) {
    window.localStorage.setItem("PREFACE_WORDLE", JSON.stringify(gameState))
}

function loadGame() {
    // TODO
}

startGame(2) 
