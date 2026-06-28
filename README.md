**Course:** COMP2132 – JavaScript and jQuery  
**Project:** Hangman Game  
**Author:** Christopher Watters  
**Date:** June 2026

---

## Project Description

This project is a web-based version of the classic Hangman game developed using HTML5, SCSS/CSS, and JavaScript. The game randomly selects a word and hint from a JSON file. The player attempts to guess the hidden word one letter at a time before the hangman image is fully displayed.

The application demonstrates JavaScript programming concepts including DOM manipulation, event handling, objects, functions, JSON data retrieval using Fetch API, animations, and responsive web design.

---

## Features

- Randomly selects a word and hint from a JSON file.
- Uses the Fetch API to load game data.
- Displays a hint for every word.
- Accepts guesses using:
  - Text input
  - On-screen alphabet buttons
- Correct guesses reveal matching letters.
- Incorrect guesses display the next hangman image.
- Prevents duplicate guesses.
- Tracks incorrect guesses.
- Displays win and loss messages.
- Disables game controls when the game ends.
- Includes a Play Again button to reset the game.
- Responsive layout for desktop, tablet, and mobile devices.
- Includes a fade-in animation when letters are revealed.

---

## Technologies Used

- HTML5
- SCSS
- CSS3
- JavaScript (ES6)
- JSON
- Fetch API

---

## How to Run

1. Open the project folder in Visual Studio Code.
2. Install the **Live Server** extension if it is not already installed.
3. Right-click **index.html**.
4. Select **Open with Live Server**.
5. Play the game in your web browser.

> **Note:** The project uses the JavaScript Fetch API to load the JSON word list. Opening the HTML file directly from the file system (`file://`) will prevent the JSON file from loading correctly.

---

## Game Rules

1. A random word is selected from the JSON word bank.
2. A hint is displayed to help the player.
3. Guess one letter at a time.
4. Correct letters appear in their proper positions.
5. Incorrect guesses reveal another part of the hangman.
6. The player loses after six incorrect guesses.
7. The player wins by revealing every letter in the word.
8. Once the game ends, the player must press **Play Again** to start a new game.

---
