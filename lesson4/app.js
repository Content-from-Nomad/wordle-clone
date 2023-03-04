/** Wait for Content to load */
document.addEventListener("DOMContentLoaded", () => {
    startWebGame();

    const TILES = Array.from(document.querySelectorAll(".tile"));

    /** Start the whole game (Student) */
    function startWebGame() {
        /**
         * 1. Load game state
         * 2. Paint game state
         * 3. Bind events or Stop events
         */
        console.log(GameState);
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

    /** Handle keypress (Student) */
    function pressKey(key) {
        console.log("key", key);
        // TODO: implement status
        // if (status === "success" || status === "fail") return;
        const currentGuess = GameState.getCurrentGuess();

        let next = TILES.findIndex(tileEle => tileEle.innerText === "");

        if (next === -1) {
            next = MAX_ATTEMPTS * WORD_LENGTH;
        }

        const regex = new RegExp("^[a-zA-Z]$");

        if (regex.test(key)) {
            handleKey(currentGuess, key, next);
        } else if (key === "Backspace" || key === "Delete") {
            handleDelete(currentGuess, next);
        } else if (key === "Enter") {
            handleSubmit(currentGuess, next);
        }
    }

    /** Handle a valid keypress (Student) */
    function handleKey(currentGuess, key, next) {
        const currentLength = currentGuess.length;
        if (currentLength === WORD_LENGTH) return;
        const nextTile = TILES[next];
        nextTile.textContent = key;
        nextTile.dataset["status"] = "tbd";
        nextTile.dataset["animation"] = "pop";
        GameState.setUserAttempt(currentGuess + key);
    }

    /** Handle delete (Student) */
    function handleDelete(currentGuess, next) {
        if (currentGuess === "") return;
        const currentLength = currentGuess.length;
        const lastTile = TILES[next - 1];
        lastTile.textContent = "";
        lastTile.dataset["status"] = "empty";
        currentGuess = currentGuess.slice(0, currentLength - 1);
        GameState.setUserAttempt(currentGuess);
    }

    /** Handle Submit (Student) */
    async function handleSubmit(currentGuess) {
        if (currentGuess.length < WORD_LENGTH) return;
        const {attempt, keyboard, answer} = GameState;
        if (isInputCorrect(currentGuess)) {
            const highlightedCharacters = checkCharacters(currentGuess, answer);
            GameState.setHighLightedRows(highlightedCharacters);

            const highlightKeyboard = updateKeyboardHighlights(keyboard, currentGuess, highlightedCharacters);
            GameState.setHighlightedKeyboard(highlightKeyboard);

            const updatedStatus = updateGameStatus(currentGuess, answer, attempt, MAX_ATTEMPTS);
            GameState.setStatus(updatedStatus);

            // saveGame(GAME_STATE)

            await paintAttempt(attempt, highlightedCharacters);

            GameState.incrementAttempt();

            console.log("GAME_STATE", GameState);
        }
    }

    /** Painting One Attempt (Student) */
    async function paintAttempt(attempt, highlightedCharacters) {
        stopInteraction();
        await paintRow(attempt, highlightedCharacters);
        // await paintKeyboard()
        startInteraction();
    }

    /** Painting a row on the board (Partially student) */
    async function paintRow(index, evaluation) {
        const {status: gameStatus, answer} = GameState;
        const startTile = index * WORD_LENGTH;
        const endTile = startTile + WORD_LENGTH;

        return new Promise(resolve => {
            for (let i = startTile; i < endTile; i++) {
                const charIndex = i % WORD_LENGTH;
                const status = evaluation[charIndex];
                /** Student */
                TILES[i].dataset["animation"] = "flip";
                TILES[i].style.animationDelay = `${charIndex * 400}ms`;
                TILES[i].onanimationstart = () => {
                    setTimeout(() => (TILES[i].dataset["status"] = status), 250);
                };
                // If this is the last tile of the row
                // FIXME: will this have issue when repainting an old game?
                if (i === endTile - 1) {
                    if (gameStatus === "success") {
                        TILES[i].onanimationend = () => handleSuccessAnimation(index);
                    } else if (gameStatus === "failure") {
                        TILES[i].onanimationend = () => {
                            alert(`The word was ${answer.toUpperCase()}`);
                        };
                    } else {
                        TILES[i].onanimationend = resolve;
                    }
                }
            }
        });
    }

    /** When game ends and status is success */
    function handleSuccessAnimation(index) {
        const startTile = index * WORD_LENGTH;
        const endTile = startTile + WORD_LENGTH;

        for (let i = startTile; i < endTile; i++) {
            TILES[i].dataset["animation"] = "win";
            TILES[i].style.animationDelay = `${(i % WORD_LENGTH) * 100}ms`;

            if (i === endTile - 1) {
                TILES[i].onanimationend = () => {
                    alert(`${CONGRATULATIONS[index]}!`);
                };
            }
        }
    }

    /** Painting a whole Game State  */
    function paintGameState(gameState) {}
});
