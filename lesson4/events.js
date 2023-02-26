/** Wait for Content to load */
document.addEventListener("DOMContentLoaded", () => {
    // TODO: implement getters and setters
    const GAME_STATE = loadOrStartGame();
    const TILES = Array.from(document.querySelectorAll(".tile"));

    startWebGame();

    function startWebGame() {
        /**
         * 1. Load game state
         * 2. Paint game state
         * 3. Bind events or Stop events
         */
        console.log(GAME_STATE);
        startInteraction();
    }

    /** Bind events */
    function startInteraction() {
        const keyboardElement = document.getElementById("keyboard");
        keyboardElement.addEventListener("click", handleClickEvent);
        document.addEventListener("keydown", handlePressEvent);
    }

    /** Unbind events during animation */
    function stopInteraction() {
        const keyboardElement = document.getElementById("keyboard");
        keyboardElement.removeEventListener("click", handleClickEvent);
        document.removeEventListener("keydown", handlePressEvent);
    }

    /** Button click events on the keyboard elements */
    function handleClickEvent(event) {
        const button = event.target;
        if (!(button instanceof HTMLButtonElement)) {
            return;
        }
        let key = button.dataset.key;
        if (!key) {
            return;
        }
        pressKey(key);
    }

    /** Keyboard press events on the document */
    function handlePressEvent(event) {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
            return;
        }
        const key = event.key;
        pressKey(key);
    }

    /** Update TILES */
    function pressKey(key) {
        console.log("key", key);
        // TODO: implement status
        const { attempt, userAttempts, answer } = GAME_STATE;

        // if (status === "success" || status === "fail") return;
        let currentGuess = userAttempts[attempt - 1] ?? "";
        const currentLength = currentGuess.length;

        let next = TILES.findIndex(tileEle => tileEle.innerText === "");

        if (next === -1) {
            next = TOTAL_TILES;
        }

        const regex = new RegExp("^[a-zA-Z]$");

        if (regex.test(key)) {
            if (currentLength === WORD_LENGTH) return;
            const nextTile = TILES[next];
            nextTile.textContent = key;
            nextTile.dataset["status"] = "tbd";
            nextTile.dataset["animation"] = "pop";
            currentGuess += key;
            GAME_STATE.userAttempts[attempt - 1] = currentGuess;
            return;
        }

        if (key === "Backspace" || key === "Delete") {
            if (currentGuess === "") return;
            const lastTile = TILES[next - 1];
            lastTile.textContent = "";
            lastTile.dataset["status"] = "empty";
            currentGuess = currentGuess.slice(0, currentLength - 1);
            GAME_STATE.userAttempts[attempt - 1] = currentGuess;
            return;
        }

        if (key === "Enter") {
            if (currentGuess.length < WORD_LENGTH) return;
            handleSubmit(currentGuess);
            return;
        }
    }

    /** Handle Submit (Student) */
    async function handleSubmit(guess) {
        const { attempt, keyboard, answer } = GAME_STATE;
        if (isInputCorrect(guess)) {
            const highlightedCharacters = checkCharacters(guess, answer);
            GAME_STATE.highlightedRows.push(highlightedCharacters);

            GAME_STATE.keyboard = updateKeyboardHighlights(keyboard, guess, highlightedCharacters);

            GAME_STATE.status = updateGameStatus(guess, answer, attempt, MAX_ATTEMPTS);

            // saveGame(GAME_STATE)
            console.log("GAME_STATE", GAME_STATE);

            await paintAttempt(attempt, highlightedCharacters);

            GAME_STATE.attempt = attempt + 1
        }
    }

    /** Painting One Attempt (Student) */
    async function paintAttempt(attempt, highlightedCharacters) {
        stopInteraction();
        await paintRow(attempt, highlightedCharacters);
        // await paintKeyboard()
        startInteraction()
    }

    /** Painting a row on the board (Partially student) */
    async function paintRow(index, evaluation) {
        const { status: gameStatus, answer } = GAME_STATE;
        const tileIndex = (index - 1) * WORD_LENGTH;
        const length = tileIndex + WORD_LENGTH;

        return new Promise((resolve) => {
            for (let i = tileIndex; i < length; i++) {
                const charIndex = i % WORD_LENGTH;
                const status = evaluation[charIndex];
                /** Student */
                TILES[i].dataset["animation"] = "flip";
                TILES[i].style.animationDelay = `${charIndex * 400}ms`;
                TILES[i].onanimationstart = () => {
                    setTimeout(() => (TILES[i].dataset["status"] = status), 250);
                };
                // If this is the last tile of the row
                if (i === length - 1) {
                    if (gameStatus === "success") {
                        TILES[i].onanimationend = handleSuccessAnimation;
                    } else if (gameStatus === "failure") {
                        TILES[i].onanimationend = () => {
                            alert(`The word was ${answer.toUpperCase()}`);
                            // createToast(`The word was ${ANSWER.toUpperCase()}`, "fail");
                        };
                    } else {
                        TILES[i].onanimationend = () => {
                            resolve()
                        };
                    }
                }
            }
        })
    }

    /** When game ends and status is success */
    function handleSuccessAnimation() {
        const { attempt } = GAME_STATE;
        const start = (attempt - 1) * WORD_LENGTH;
        const length = start + WORD_LENGTH;

        for (let i = start; i < length; i++) {
            TILES[i].dataset["animation"] = "win";
            TILES[i].style.animationDelay = `${(i % WORD_LENGTH) * 100}ms`;

            if (i === length - 1) {
                TILES[i].onanimationend = () => {
                    alert(`${CONGRATULATIONS[attempt - 1]}!`);
                    // createToast(`${CONGRATULATIONS[attempt]}!`, "success");
                };
            }
        }
    }

    /** Painting a whole Game State  */
    function paintGameState(gameState) { }
});
