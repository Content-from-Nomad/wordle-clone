/** Wait for Content to load */
document.addEventListener("DOMContentLoaded", () => {
    /** Constants that contain elements on the screen */
    // Get all 30 tiles
    const TILES = Array.from(document.querySelectorAll(".tile"));
    // Get all 6 rows
    const ROWS = document.querySelectorAll(".row");
    // First get the keyboard
    const KEYBOARD = document.querySelector("#keyboard");
    // Then get each key on the keyboard
    const KEYBOARD_KEYS = KEYBOARD.querySelectorAll("button");
    // Flip animation speed
    const FLIP_SPEED = 150;

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

        let next = Array.from(TILES).findIndex(
            tileEle => tileEle.innerText === ""
        );

        if (next === -1) {
            next = MAX_ATTEMPTS * WORD_LENGTH;
        }

        const regex = new RegExp("^[a-zA-Z]$");

        if (regex.test(key)) {
            handleAlphabetKey(currentGuess, key, next);
        } else if (key === "Backspace" || key === "Delete") {
            handleDeleteKey(currentGuess, next);
        } else if (key === "Enter") {
            handleSubmitKey(currentGuess, next);
        }
    }

    /** Handle a valid keypress (Student) */
    function handleAlphabetKey(currentGuess, key, next) {
        const currentLength = currentGuess.length;
        if (currentLength === WORD_LENGTH) {
            return;
        }
        const nextTile = TILES[next];
        nextTile.textContent = key;
        nextTile.dataset.status = "tbd";
        nextTile.dataset.animation = "pop";
        // Appends to the last word in user attempts
        // eg. "b" -> "ba" -> "bat"
        GameState.setUserAttempt(currentGuess + key);
    }

    /** Handle delete (Student) */
    function handleDeleteKey(currentGuess, next) {
        if (currentGuess === "") {
            return;
        }
        const currentLength = currentGuess.length;
        const lastTile = TILES[next - 1];
        lastTile.textContent = "";
        lastTile.dataset.status = "empty";
        lastTile.removeAttribute("data-animation");
        // Remove the last character
        // eg. "bat" -> "ba" -> "b" -> ""
        currentGuess = currentGuess.slice(0, currentLength - 1);
        GameState.setUserAttempt(currentGuess);
    }

    /** Handle Submit (Student) */
    async function handleSubmitKey(currentGuess) {
        if (currentGuess.length < WORD_LENGTH) {
            return;
        }

        const answer = GameState.getAnswer();
        const oldKeyboard = GameState.getKeyboard();
        const attempt = GameState.getAttempt();

        // FIXME: rename methods
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
                attempt,
                MAX_ATTEMPTS - 1 // MAX_ATTEMPT is 1-based
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

    /** Shaking a row on the board (Student) */
    function shakeRow(currentGuess, index) {
        stopInteraction();

        alert(`${currentGuess.toUpperCase()} not in world list`);

        ROWS[index].dataset.status = "invalid";
        ROWS[index].onanimationend = () => {
            ROWS[index].removeAttribute("data-status");
            startInteraction();
        };
    }

    /** Painting a row on the board (Student) */
    async function paintRow(index, evaluation) {
        const row = ROWS[index];
        const tileRow = row.querySelectorAll(".tile");

        const animate = getRowAnimation(tileRow, evaluation);
        window.requestAnimationFrame(animate);

        // FIXME: alternative?
        await sleep(FLIP_SPEED * (WORD_LENGTH + 1));
    }

    /** Using requestAnimationFrame to time each tile's animation */
    function getRowAnimation(tileRow, tilesHighlights) {
        let start = 0;
        let index = 0;
        let stopId = 0;

        // timestamp is ms
        return function animateRow(timestamp) {
            // set start to current timestamp
            if (start === 0) {
                start = timestamp;
            }
            // if index passed is the last tile on the row
            if (index === WORD_LENGTH) {
                window.cancelAnimationFrame(stopId);
                return;
            }
            // if current tile is not flipped
            if (tileRow[index].dataset.animation !== "flip") {
                // start the flip
                tileRow[index].dataset.animation = "flip";
            }
            // if timestamp - start is halfway through the tileLimit
            if (timestamp - start >= FLIP_SPEED / 2) {
                // change the status
                tileRow[index].dataset.status = tilesHighlights[index];
            }
            // if timestamp - start is through the tileLimit
            if (timestamp - start >= FLIP_SPEED) {
                // increment the index to next tile
                start = timestamp;
                index += 1;
            }

            stopId = window.requestAnimationFrame(animateRow);
        };
    }

    /** Handle game status animation (Student) */
    async function paintResult(newStatus, answer, index) {
        if (newStatus === "in-progress") {
            // Game is still in-progress, so nothing to paint or unbind
            return;
        }

        // If success or failed, stop interaction
        stopInteraction();

        if (newStatus === "success") {
            handleSuccessAnimation(index);
        } else {
            alert(`The word was ${answer.toUpperCase()}`);
        }
    }

    /** When game ends and status is success (Student) */
    function handleSuccessAnimation(index) {
        const row = ROWS[index];
        const tileRow = row.querySelectorAll(".tile");

        for (let i = 0; i < WORD_LENGTH; i++) {
            tileRow[i].dataset.animation = "win";
            tileRow[i].style.animationDelay = `${i * 100}ms`;

            if (i === WORD_LENGTH - 1) {
                tileRow[i].onanimationend = () => {
                    console.log("first");
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

        // Start of a new game so game state is empty
        if (attempt === 0) {
            return;
        }

        const evaluation = GameState.getHighlightedRows();
        const userAttempts = GameState.getUserAttempt();

        paintKeyboard();

        const animate = animateColumn(attempt, userAttempts, evaluation);
        window.requestAnimationFrame(animate);
    }

    function animateColumn(attempt, userAttempts, evaluation) {
        let start = 0;
        let stopId = 0;
        let column = 0;
        let isColumnAnimating = false;
        let tileColumn = [];

        return function animate(timestamp) {
            if (start === 0) {
                start = timestamp;
            }
            if (!isColumnAnimating) {
                // get all tile of this column
                // eg. 12 % 5 = 2, 17 % 5 = 2
                tileColumn = TILES.slice(0, WORD_LENGTH * attempt).filter(
                    (tile, index) => index % WORD_LENGTH === column
                );

                tileColumn.forEach((tile, rowIndex) => {
                    tile.textContent = userAttempts[rowIndex][column];
                    tile.dataset.status = "reveal";
                    tile.dataset.animation = "flip";
                });
                isColumnAnimating = true;
            }
            // half way through animating, add in the color
            if (timestamp - start >= FLIP_SPEED / 2) {
                tileColumn.forEach((tile, rowIndex) => {
                    tile.dataset.status = evaluation[rowIndex][column];
                });
            }
            // tile's animation can end
            if (timestamp - start >= FLIP_SPEED) {
                isColumnAnimating = false;
                start = timestamp;
                column += 1;
            }
            if (column === WORD_LENGTH - 1) {
                window.cancelAnimationFrame(stopId);
            }
            stopId = window.requestAnimationFrame(animate);
        };
    }
    /** JavaScript sleep implementation */
    async function sleep(timeout) {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    startWebGame();
});
