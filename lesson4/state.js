/** Game State (Student) */
const GameState = {
    attempt: 0,
    userAttempts: [],
    highlightedRows: [],
    keyboard: getKeyboard(),
    answer: "apple",
    status: "in-progress",
    incrementAttempt() {
        this.attempt += 1;
        return this.attempt;
    },
    getCurrentGuess() {
        let currentGuess = this.userAttempts[this.attempt] ?? "";
        return currentGuess;
    },
    setUserAttempt(currentGuess) {
        this.userAttempts[this.attempt] = currentGuess;
        return this.userAttempts;
    },
    setHighLightedRows(highlightedCharacters) {
        this.highlightedRows.push(highlightedCharacters);
        return this.highlightedRows;
    },
    setHighlightedKeyboard(keyboard) {
        this.keyboard = keyboard;
        return this.keyboard;
    },
    setStatus(status) {
        this.status = status;
        return this.status;
    },
};

// Example on git
