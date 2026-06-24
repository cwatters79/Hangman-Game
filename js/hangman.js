/**
 * Hangman game project.
 * 
 * @author Christopher Watters
 * @version 2132 Final pjt
 */

const gameSettings = {
    maxIncorrectGuesses: 6,
    wordBankPath: 'data/words.json',
    imagePath: 'images/hangman-'
};


const gameState = {
    wordBank: [],
    selectedWord: '',
    selectedHint: '',
    correctLetters: [],
    guessedLetters: [],
    incorrectGuesses: 0,
    isGameOver: false
};


const pageElements = 
{
    hangmanImage: document.querySelector('#hangman-image'),
    guessCount: document.querySelector('#guess-count'),
    hintText: document.querySelector('#hint-text'),
    wordDisplay: document.querySelector('#word-display'),
    guessForm: document.querySelector('#guess-form'),
    letterInput: document.querySelector('#letter-input'),
    guessButton: document.querySelector('#guess-button'),
    messageText: document.querySelector('#message-text'),
    guessedLetters: document.querySelector('#guessed-letters'),
    letterButtons: document.querySelector('#letter-buttons'),
    playAgainButton: document.querySelector('#play-again-button')
};



/**
 * Starts the program after the page has loaded.
 */
function initializeGame() 
{
    createLetterButtons();
    loadWordBank();

    pageElements.guessForm.addEventListener('submit', handleFormGuess);
    pageElements.playAgainButton.addEventListener('click', startNewGame);
}



/**
 * Loads words and hints from the JSON file.
 */
function loadWordBank() 
{
    fetch(gameSettings.wordBankPath)
        .then(function(response) 
        {
            if (!response.ok) 
                {
                throw new Error('Unable to load word bank.');
            }

            return response.json();
        })
        .then(function(words) {
            gameState.wordBank = words;
            startNewGame();
        })
        .catch(function(error) 
        {
            pageElements.hintText.textContent = 'The word bank could not be loaded. Run this project with a local server.';
            pageElements.messageText.textContent = error.message;
            disableGameControls();
        });
}



/**
 * Creates alphabet buttons for mouse/touch letter selection.
 */
function createLetterButtons() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

    pageElements.letterButtons.innerHTML = '';

    alphabet.forEach(function(letter)
     {
        const letterButton = document.createElement('button');
        letterButton.type = 'button';
        letterButton.classList.add('letter-button');
        letterButton.textContent = letter.toUpperCase();
        letterButton.dataset.letter = letter;
        letterButton.addEventListener('click', function() 
        {
            processGuess(letter);
        });

        pageElements.letterButtons.appendChild(letterButton);
    });
}


/**
 * Starts a new game by choosing a new word and resetting all interface values.
 */
function startNewGame() 
{
    const randomEntry = getRandomWordEntry();

    gameState.selectedWord = randomEntry.word.toLowerCase();
    gameState.selectedHint = randomEntry.hint;
    gameState.correctLetters = [];
    gameState.guessedLetters = [];
    gameState.incorrectGuesses = 0;
    gameState.isGameOver = false;

    pageElements.hintText.textContent = gameState.selectedHint;
    pageElements.messageText.textContent = 'Enter a letter to begin.';
    pageElements.messageText.className = '';
    pageElements.letterInput.value = '';
    pageElements.letterInput.disabled = false;
    pageElements.guessButton.disabled = false;
    pageElements.playAgainButton.classList.add('hidden');

    enableLetterButtons();
    updateDisplay();
    pageElements.letterInput.focus();
}



/**
 * Selects a random word and hint object from the loaded JSON word bank.
 *
 * @returns {Object} The selected word entry.
 */
function getRandomWordEntry() 
{
    const randomIndex = Math.floor(Math.random() * gameState.wordBank.length);
    return gameState.wordBank[randomIndex];
}


/**
 * Handles guesses submitted through the text input form.
 *
 * @param {SubmitEvent} event The form submit event.
 */
function handleFormGuess(event) 
{
    event.preventDefault();

    const guessedLetter = pageElements.letterInput.value.toLowerCase().trim();
    processGuess(guessedLetter);
    pageElements.letterInput.value = '';
}



/**
 * Checks a guessed letter and updates the game state.
 *
 * @param {string} guessedLetter The letter entered by the player.
 */
function processGuess(guessedLetter) 
{
    if (gameState.isGameOver) {
        return;
    }

    if (!isValidLetter(guessedLetter)) 
        {
        pageElements.messageText.textContent = 'Please enter one letter from A to Z.';
        return;
    }

    if (gameState.guessedLetters.includes(guessedLetter)) 
        {
        pageElements.messageText.textContent = 'You already guessed that letter. Pick another one.';
        return;
    }

    gameState.guessedLetters.push(guessedLetter);
    disableSelectedLetterButton(guessedLetter);

    if (gameState.selectedWord.includes(guessedLetter)) 
        {
        gameState.correctLetters.push(guessedLetter);
        pageElements.messageText.textContent = 'Correct guess.';
    } else {
        gameState.incorrectGuesses++;
        pageElements.messageText.textContent = 'Incorrect guess.';
    }

    updateDisplay();
    checkGameResult();
}


/**
 * Validates that the player entered exactly one alphabetic letter.
 *
 * @param {string} letter The input value to validate.
 * @returns {boolean} True when the value is one alphabetic letter.
 */
function isValidLetter(letter) 
{
    return /^[a-z]$/.test(letter);
}


/**
 * Updates the hidden word, hangman image, guess counter, and guessed letter list.
 */
function updateDisplay() 
{
    pageElements.wordDisplay.innerHTML = '';

    gameState.selectedWord.split('').forEach(function(letter) 
    {
        const letterSpace = document.createElement('span');
        letterSpace.classList.add('letter-space', 'fade-in');
        letterSpace.textContent = gameState.correctLetters.includes(letter) ? letter : '';
        pageElements.wordDisplay.appendChild(letterSpace);
    });

    pageElements.hangmanImage.src = `${gameSettings.imagePath}${gameState.incorrectGuesses}.jpg`;
    pageElements.hangmanImage.alt = `Hangman graphic showing ${gameState.incorrectGuesses} incorrect guesses`;
    pageElements.guessCount.textContent = `Incorrect guesses: ${gameState.incorrectGuesses} / ${gameSettings.maxIncorrectGuesses}`;
    pageElements.guessedLetters.textContent = gameState.guessedLetters.length === 0
        ? 'None'
        : gameState.guessedLetters.map(function(letter) 
        {
            return letter.toUpperCase();
        }).join(', ');
}



/**
 * Checks whether the player has won or lost the current game.
 */
function checkGameResult() 
{
    if (hasPlayerWon()) 
        {
        endGame(true);
        return;
    }

    if (gameState.incorrectGuesses >= gameSettings.maxIncorrectGuesses) 
        {
        endGame(false);
    }
}



/**
 * Determines whether all letters in the selected word have been guessed.
 *
 * @returns {boolean} True when the player has revealed every letter.
 */
function hasPlayerWon() 
{
    return gameState.selectedWord.split('').every(function(letter) 
    {
        return gameState.correctLetters.includes(letter);
    });
}



/**
 * Ends the game and prevents further guessing.
 *
 * @param {boolean} playerWon Whether the player won the game.
 */
function endGame(playerWon) 
{
    gameState.isGameOver = true;
    disableGameControls();
    pageElements.playAgainButton.classList.remove('hidden');

    if (playerWon) 
        {
        pageElements.messageText.textContent = `You won. The word was ${gameState.selectedWord.toUpperCase()}.`;
        pageElements.messageText.className = 'win fade-in';
    } else 
        {
        revealWord();
        pageElements.messageText.textContent = `You lost. The word was ${gameState.selectedWord.toUpperCase()}.`;
        pageElements.messageText.className = 'loss fade-in';
    }
}



/**
 * Reveals the full word after the player loses.
 */
function revealWord() 
{
    gameState.correctLetters = gameState.selectedWord.split('');
    updateDisplay();
}




/**
 * Disables the form and all letter buttons after the game ends.
 */
function disableGameControls() {
    pageElements.letterInput.disabled = true;
    pageElements.guessButton.disabled = true;

    document.querySelectorAll('.letter-button').forEach(function(button) 
    {
        button.disabled = true;
    });
}



/**
 * Enables all alphabet buttons for a new game.
 */
function enableLetterButtons() 
{
    document.querySelectorAll('.letter-button').forEach(function(button) 
    {
        button.disabled = false;
    });
}



/**
 * Disables the alphabet button that matches the current guess.
 *
 * @param {string} letter The letter button to disable.
 */
function disableSelectedLetterButton(letter) 
{
    const selectedButton = document.querySelector(`[data-letter="${letter}"]`);

    if (selectedButton) {
        selectedButton.disabled = true;
    }
}

initializeGame();
