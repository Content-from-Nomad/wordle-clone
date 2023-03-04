/** Wait for Content to load */
document.addEventListener("DOMContentLoaded", () => {
    startWebGame();

    // TODO: a global constant to reference the TILES on the board

    /** Start the whole game (Student) */
    function startWebGame() {
        // TODO: what should the game logic be?
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
        // TODO: get current guess from state and the next tile index to update

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
        // TODO: update the tile
        // TODO: pop animation
    }

    /** Handle delete (Student) */
    function handleDelete(currentGuess, next) {
        // TODO: remove character on tile
    }

    /** Handle Submit (Student) */
    async function handleSubmit(currentGuess) {
        // TODO: Submit guess
    }

    /** Painting One Attempt */
    async function paintAttempt(attempt, highlightedCharacters, highlightedKeyboard) {
        stopInteraction();
        // await paintRow(attempt, highlightedCharacters);
        // await paintKeyboard(highlightedKeyboard);
        startInteraction();
    }

    /** Painting a row on the board (Partially student) */
    async function paintRow(index, evaluation) {
        const {status: gameStatus, answer} = GameState;
        const startTile = // TODO: get the starting index of the TILES
        const endTile = // TODO: get the ending index of the TILES 

        return new Promise(resolve => {
            for (let i = startTile; i < endTile; i++) {
                // TODO: change index to 0 to 4 to be used for indexing and timing
                const charIndex = 
                const status = evaluation[charIndex];

                /** Student */
                // TODO: flip animation 

                // this is the last tile of the row
                if (i === endTile - 1) {
                    TILES[i].onanimationend = resolve;
                }
            }
        });
    }

    /** When game ends and status is success (Student) */
    function handleSuccessAnimation(index) {
        // TODO: bounce animation for success
    }

    /** Painting keyboard update (Student) */
    async function paintKeyboard(keyboard) {
        // TODO: paint keyboard given highlights
    }

    /** Painting a whole Game State (Student) */
    function paintGameState(gameState) {
        // TODO: paint the tiles and keyboard at once
    }
});
