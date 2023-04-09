/** Game State (Student) */
const GameState = {
    attempt: 0,
    userAttempts: [],
    highlightedRows: [],
    keyboard: getKeyboard(),
    answer: "apple",
    status: "in-progress",
    getAttempt() {
        return this.attempt;
    },
    incrementAttempt() {
        this.attempt += 1;
        return this.attempt;
    },
    getAnswer() {
        return this.answer;
    },
    getCurrentGuess() {
        let currentGuess = this.userAttempts[this.attempt] ?? "";
        return currentGuess;
    },
    getUserAttempt() {
        return this.userAttempts;
    },
    setUserAttempt(currentGuess) {
        this.userAttempts[this.attempt] = currentGuess;
        return this.userAttempts;
    },
    getHighlightedRows() {
        return this.highlightedRows;
    },
    setHighlightedRows(highlightedCharacters) {
        this.highlightedRows.push(highlightedCharacters);
        return this.highlightedRows;
    },
    getKeyboard() {
        return this.keyboard;
    },
    setKeyboard(keyboard) {
        this.keyboard = keyboard;
        return this.keyboard;
    },
    getStatus() {
        return this.status;
    },
    setStatus(status) {
        this.status = status;
        return this.status;
    },
    save() {
        saveGame({
            attempt: this.attempt,
            userAttempts: this.userAttempts,
            highlightedRows: this.highlightedRows,
            keyboard: this.keyboard,
            status: this.status,
            timestamp: new Date().getTime(),
        });
    },
    loadOrStart(debug) {
        const {
            attempt,
            userAttempts,
            highlightedRows,
            keyboard,
            answer,
            status,
        } = loadOrStartGame(debug);
        this.attempt = attempt;
        this.userAttempts = userAttempts;
        this.highlightedRows = highlightedRows;
        this.keyboard = keyboard;
        this.answer = answer;
        this.status = status;
    },
};
