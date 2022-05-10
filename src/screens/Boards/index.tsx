import React, { useEffect } from 'react';

// The total units of a single board (on a side)
const boardUnits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// We mostly need this to set a direction, left of right for ship generation
const getRandomBit = () => Math.round(Math.random());

// Generate a random number from 0 to 9 only
// We will use this method to work with positions on the Board
const getRandomNumber = () => Math.floor(Math.random() * 10);

// Needed for ships' directions
const getDirection = () => getRandomBit() == 0 ? 'left' : 'right';

const Boards = () => {

    // When the screen mounts, we must create ALL the data needed to play the game
    useEffect(() => {
        runGameInstance();

    }, []);

    // Wrapper for setting up the game instance
    const runGameInstance = () => {
        connectPlayers();
        generateShips();
        displayBoard();
    }

    // 'Connect' both players to the same instance
    const connectPlayers = () => {};

    // Generate random ships for current player
    // We will also use this to 'artificially' generate for the second player
    const generateShips = () => {};
    

    const displayBoard = () => {};

    return(
        <div>Battle fields</div>
    );
};

export default Boards;