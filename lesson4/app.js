/** Wait for Content to load */
document.addEventListener("DOMContentLoaded", () => {
    const TILES = Array.from(document.querySelectorAll(".tile"));
    const ROWS = Array.from(document.querySelectorAll(".row"));
    const KEYBOARD = document.querySelector("#keyboard");
    const KEYBOARD_KEYS = KEYBOARD.querySelectorAll("button");

    /** Start the whole game (Student) */
    function startWebGame() {
        GameState.loadOrStart(true);
        paintGameState();
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
        const status = GameState.getStatus();

        if (status !== "in-progress") {
            return;
        }

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
        lastTile.removeAttribute("data-animation");
        currentGuess = currentGuess.slice(0, currentLength - 1);
        GameState.setUserAttempt(currentGuess);
    }

    /** Handle Submit (Student) */
    async function handleSubmit(currentGuess) {
        if (currentGuess.length < WORD_LENGTH) {
            return;
        }

        const answer = GameState.getAnswer();
        const oldKeyboard = GameState.getKeyboard();
        const attempt = GameState.getAttempt();

        // 1. Check if word is in word list
        if (isInputCorrect(currentGuess)) {
            // 2. absent (grey), present (yellow), correct (green)
            const highlightedCharacters = checkCharacters(currentGuess, answer);
            GameState.setHighlightedRows(highlightedCharacters);
            // 3. highlight keyboard
            const newKeyboard = updateKeyboardHighlights(
                oldKeyboard,
                currentGuess,
                highlightedCharacters
            );
            GameState.setKeyboard(newKeyboard);
            // 4. Paint Attempt (can see the changes on website)
            // a. On the attempt row: Flip tile + Color tile
            // b. Color the keyboard
            await paintAttempt(attempt, highlightedCharacters, newKeyboard);

            // 5. update status
            const newStatus = updateGameStatus(
                currentGuess,
                answer,
                attempt + 1, // MAX_ATTEMPT is 1-based
                MAX_ATTEMPTS // default 6
            );
            GameState.setStatus(newStatus);

            await paintResult(newStatus, answer, attempt);

            // 6. Update attempt count
            GameState.incrementAttempt();

            // 7. Save game
            GameState.save();

            console.log("GAME_STATE", GameState);
        } else {
            // 8. Handle wrong words
            shakeRow(currentGuess, attempt);
        }
    }

    /** Painting One Attempt (Student) */
    async function paintAttempt(attempt, highlightedCharacters) {
        stopInteraction();
        await paintRow(attempt, highlightedCharacters);
        paintKeyboard();
        startInteraction();
    }

    /** Shaking a row on the board (Partially student) */
    function shakeRow(currentGuess, index) {
        stopInteraction();

        alert(`${currentGuess.toUpperCase()} not in world list`);

        ROWS[index].dataset.status = "invalid";
        ROWS[index].onanimationend = () => {
            ROWS[index].removeAttribute("data-status");
            startInteraction();
        };
    }

    /** Painting a row on the board (Partially student) */
    // Can use ROWS for this as well
    async function paintRow(index, evaluation) {
        const startTile = index * WORD_LENGTH;
        const endTile = startTile + WORD_LENGTH - 1;

        return new Promise(resolve => {
            for (let i = startTile; i <= endTile; i++) {
                const charIndex = i % WORD_LENGTH;
                const status = evaluation[charIndex];
                TILES[i].dataset["animation"] = "flip";
                TILES[i].style.animationDelay = `${charIndex * 400}ms`;
                TILES[i].onanimationstart = () => {
                    setTimeout(
                        () => (TILES[i].dataset["status"] = status),
                        250
                    );
                };
                if (i === endTile) {
                    TILES[i].onanimationend = resolve;
                }
            }
        });
    }

    /** Handle game status animation (Student) */
    async function paintResult(newStatus, answer, index) {
        if (newStatus === "in-progress") {
            return;
        }
        if (newStatus === "success") {
            handleSuccessAnimation(index);
        } else {
            alert(`The word was ${answer.toUpperCase()}`);
        }
    }

    /** When game ends and status is success (Student) */
    // Can use ROWS for this as well
    function handleSuccessAnimation(index) {
        const startTile = index * WORD_LENGTH;
        const endTile = startTile + WORD_LENGTH - 1;

        for (let i = startTile; i <= endTile; i++) {
            TILES[i].dataset["animation"] = "win";
            TILES[i].style.animationDelay = `${(i % WORD_LENGTH) * 100}ms`;

            if (i === endTile) {
                TILES[i].onanimationend = () => {
                    alert(`${CONGRATULATIONS[index]}!`);
                };
            }
        }
    }

    /** Highligh keyboard keys (Student) */
    function paintKeyboard() {
        const newKeyboard = GameState.getKeyboard();

        KEYBOARD_KEYS.forEach(keyEl => {
            const key = keyEl.dataset.key;
            const newStatus = newKeyboard[key];
            keyEl.dataset.status = newStatus;
        });
    }

    /** Painting a whole Game State (Student) */
    async function paintGameState() {
        const attempt = GameState.getAttempt();

        if (attempt === 0) {
            return;
        }

        const evaluation = GameState.getHighlightedRows();
        const userAttempts = GameState.getUserAttempt();
        const previousChars = userAttempts.flatMap(word => [...word.split("")]);

        paintKeyboard();

        previousChars.forEach((char, i) => {
            TILES[i].textContent = char;
            TILES[i].dataset.status = "reveal";
        });

        for (let col = 0; col < WORD_LENGTH; col++) {
            for (let row = 0; row < attempt; row++) {
                const idx = row * WORD_LENGTH + col;
                TILES[idx].dataset.animation = "flip";
                TILES[idx].style.animationDelay = `${col * 400}ms`;
                TILES[idx].onanimationstart = () => {
                    setTimeout(() => {
                        TILES[idx].dataset.status = evaluation[row][col];
                    }, 200);
                };
            }
        }
    }

    startWebGame();
});
