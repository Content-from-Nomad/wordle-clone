/** Wait for Content to load */
document.addEventListener('DOMContentLoaded', () => {
    console.log("start web game")
    // TODO: implement getters and setters
    const GAME_STATE = loadOrStartGame()
    const TILES = Array.from(document.querySelectorAll(".tile"))

    startWebGame()

    function startWebGame() {
        /**
         * 1. Load game state 
         * 2. Paint game state 
         * 3. Bind events or Stop events 
         */
        console.log(GAME_STATE)
        startInteraction()
    }

    /** Bind events */
    function startInteraction() {
        const keyboardElement = document.getElementById("keyboard")
        keyboardElement.addEventListener("click", handleClickEvent);
        document.addEventListener("keydown", handlePressEvent);
    }

    /** Unbind events during animation */
    function stopInteraction() {
        const keyboardElement = document.getElementById("keyboard")
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

    /** Update TILES and TILES_NODES */
    function pressKey(key) {
        console.log('key', key)
        // TODO: implement status
        const { attempt, userAttempts, } = GAME_STATE;

        // if (status === "success" || status === "fail") return;
        let currentGuess = userAttempts[attempt - 1] ?? "";
        const currentLength = currentGuess.length;

        const next = TILES.findIndex((tileEle) => tileEle.innerText === "");

        if (next === -1) {
            return
            // next = TOTAL_TILES;
        }

        const regex = new RegExp("^[a-zA-Z]$");

        if (regex.test(key)) {
            if (currentLength === WORD_LENGTH) return;
            const nextTile = TILES[next];
            nextTile.textContent = key;
            nextTile.dataset["status"] = "tbd";
            nextTile.dataset["animation"] = "pop";
            currentGuess += key;
            GAME_STATE.userAttempts[attempt - 1] = currentGuess
            return;
        }

        console.log('currentGuess', currentGuess)
        if (key === "Backspace" || key === "Delete") {
            if (currentGuess === "") return;
            const lastTile = TILES[next - 1];
            lastTile.textContent = "";
            lastTile.dataset["status"] = "empty";
            currentGuess = currentGuess.slice(0, currentLength - 1);
            GAME_STATE.userAttempts[attempt - 1] = currentGuess
            return;
        }

        if (key === "Enter") {
            if (currentGuess.length < WORD_LENGTH) return;
            handleSubmit(currentGuess)
            return;
        }
    }

    /** Handle Submit (Student) */
    function handleSubmit(guess) {
        const { attempt, userAttempts, keyboard, answer } = GAME_STATE
        if (isInputCorrect(guess)) {
            GAME_STATE.attempt = attempt + 1

            const highlightedCharacters = checkCharacters(guess, answer)
            GAME_STATE.highlightedRows.push(highlightedCharacters)

            GAME_STATE.keyboard = updateKeyboardHighlights(keyboard, guess, highlightedCharacters)

            // saveGame(GAME_STATE)
            console.log('GAME_STATE', GAME_STATE)

            paintAttempt(attempt, highlightedCharacters)
        }
    }

    /** Painting One Attempt */
    function paintAttempt(attempt, highlightedCharacters) {
        stopInteraction()
        paintRow(attempt, highlightedCharacters)
    }

    function paintRow(index, evaluation) {
        const tileIndex = (index - 1) * WORD_LENGTH;
        const length = tileIndex + WORD_LENGTH;

        for (let i = tileIndex; i < length; i++) {
            const charIndex = i % WORD_LENGTH;
            const status = evaluation[charIndex];
            const key = TILES[i].textContent;
            TILES[i].dataset["animation"] = "flip";
            TILES[i].style.animationDelay = `${charIndex * 400}ms`;
            TILES[i].onanimationstart = () => {
                setTimeout(() => (TILES[i].dataset["status"] = status), 250);
                // setTimeout(() => paintKey(key, status), 250);
            };
            if (i === length - 1) {
                TILES[i].onanimationend = startInteraction
            }
            //     if (i === length - 1 && STATE.status === "success") {
            //         TILES[i].onanimationend = bounce;
            //     }
            //     if (i === length - 1 && STATE.status === "fail") {
            //         TILES[i].onanimationend = () => {
            //             // createToast(`The word was ${ANSWER.toUpperCase()}`, "fail");
            //         };
            //     }
        }
    }


    /** Painting a whole Game State  */
    function paintGameState(gameState) { }
})
