import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {Board, MAX_BOARD_UNITS } from '../../components/Board';
import GameLoader from '../../components/GameLoader';
import ModalFinish from '../../components/ModalFinish';
import PlayAgainButton from '../../components/PlayAgainButton';
import ShipHits from '../../components/ShipHits';
import { addDelay, getDirection, getRandomNr } from '../../helpers/methods';
import { useMockPlayer } from '../../hooks/useMockPlayer';
import { resetGameInstance, setGameID, setShips, setStatus, setThisPlayer, setWhoNext } from '../../redux/slice/game';
import { RootState } from '../../redux/store';

const shiptTypesArr = ["carrier", "battleship", "cruiser", "submarine", "destroyer"];

export const shipTypes: Record<string, IShipType> = {
    carrier: { size: 5, count: 1, color: 'red', image: 'aircraftShape.png' },
    battleship: { size: 4, count: 1, color: 'blue', image: 'battleshipShape.png' },
    cruiser: { size: 3, count: 1, color: 'green', image: 'cruiserShape.png' },
    submarine: { size: 3, count: 1, color: 'yellow', image: 'submarineShape.png' },
    destroyer: { size: 2, count: 1, color: 'black', image: 'carrierShape.png' },
};

// // Variable Reference from assignment ... leave this comment
// const shipLayout = [
//     { "ship": "carrier", "positions": [[2,9], [3,9], [4,9], [5,9], [6,9]] },
//     { "ship": "battleship", "positions": [[5,2], [5,3], [5,4], [5,5]] },
//     { "ship": "cruiser", "positions": [[8,1], [8,2], [8,3]] },
//     { "ship": "submarine", "positions": [[3,0], [3,1], [3,2]] },
//     { "ship": "destroyer", "positions": [[0,0], [1,0]] }
// ]

const Boards = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Players data
    const me = useSelector((state: RootState) => state.player);
    const playerTwo = useMockPlayer();
    
    const { status, winner, players, whoNext, hits } = useSelector((state: RootState) => state.game);
    const gameReady = status == "ongoing";

    // When the screen mounts, we must create ALL the data needed to play the game
    useEffect(() => {
        // On refresh just redirect back to intro based on my username
        // Otherwise, start the game
        if (!me.username) {
            dispatch(resetGameInstance());
            navigate('/');
        } else {
            runGameInstance();
        }

    }, []);

    // Monitor the connected players
    useEffect(() => {
        console.warn('A player has joined the room');

        // When we have exactly 2 players, update game status and game id
        if (players.length === 2 && status === "pending") {
            dispatch(setGameID('game-1'));

            if (whoNext == '' && !hits.length) {
                // Randomly set who makes the first move. 0 / 1
                const rand = Math.round(Math.random());
                dispatch(setWhoNext(players[rand].uuid));
            }

            // Simulate waiting for the other user
            addDelay(() => setGameStatus("ongoing"), 2500);
        }

    }, [players]);

    // Monitor the Game Status. We need this to generate all the data when the game 'starts'
    useEffect(() => {
        // Here we can save different data like the start time
        // or the game instance just for having some sort of history in a db
        // based on the STATUS OF THE GAME
        switch (status) {
            case 'pending':
                // Save specific data for waiting ...
            break;
            
            case 'ongoing':
                // Save start time and other data ...
                // ... do other things ...

                // Generate ships for both players
                generateShips();

            break;

            case 'finished':
                // Save a history after each game ...
            break;

            default:
                return;
        }

    }, [status]);

    // Wrapper for setting up the game instance
    const runGameInstance = () => {
        connectPlayers();
    }

    const setGameStatus = (gameStatus: IGame["status"]) => dispatch(setStatus(gameStatus));

    // 'Connect' both players to the same instance / room
    const connectPlayers = () => {
        // Add myself
        dispatch(setThisPlayer(me));

        // At the same time, we will connect the other player here, for simplicity
        dispatch(setThisPlayer(playerTwo));
    };

    // Generate random ships for current player
    // We will also use this to generate for the second player
    const generateShips = () => {
        const playerIDs = players.map((el) => el.uuid);

        const generatePositions = (shipLen: number, allShips: IShipLayout[]): any => {
            let newPos: TPosition[] = [];
            let startCoords: TPosition = [getRandomNr(MAX_BOARD_UNITS), getRandomNr(MAX_BOARD_UNITS)]; // set a default value non-zero

            const isHoriz = getDirection() === 'horizontal';
            
            const toRight = isHoriz && startCoords[0] + (shipLen - 1) >= MAX_BOARD_UNITS - 1 ? false : true;
            const toBottom = !isHoriz && startCoords[1] + (shipLen - 1) >= MAX_BOARD_UNITS - 1 ? false : true;
            
            // Add the starting point of the ship
            newPos = [startCoords];

            const updatedShipLen = shipLen - 1;

            // Generate the rest of the coords.
            // Allow generation from left to right / right to left / top to bottom / bottom to top
            for (let i = 0; i < updatedShipLen; i ++) {
                const xVal = newPos[newPos.length - 1][0];
                const yVal = newPos[newPos.length - 1][1];

                const x = isHoriz ?  xVal + (toRight ? 1 : -1) : xVal;
                const y = !isHoriz ? yVal + (toBottom ? 1 : -1) : yVal;
                
                newPos.push([x, y]);
            }
            
            // Check if there's another ship with an intersection point
            const pointsIntersect = allShips.filter((el) => {
                if (el.positions) {
                    let exists: any = [];
                    newPos.forEach(newEl => {
                        if (JSON.stringify(el.positions).includes(JSON.stringify(newEl))) {
                            exists.push(newEl);
                        }
                    });
                    return exists.length > 0; 
                }
            });

            if (pointsIntersect.length) {
                return generatePositions(shipLen, allShips);

            } else {
                return newPos;
            }
        };

        let newShips: IGame["ships"] = {}; // Object containing ships for each Player UUID

        playerIDs.forEach((el) => {
            let playerShips: IShipLayout[] = [];
            shiptTypesArr.forEach((el) => {
                // Start generating the positions
                const { size, color } = shipTypes[el];
                let positions = generatePositions(size, playerShips);
                
                const newShip: IShipLayout = {
                    ship: el,
                    size: size,
                    color: color !== undefined ? color : '',
                    hits: 0,
                    positions: positions,
                };
    
                playerShips.push(newShip);
            });
            
            // Add ships to each player uuid
            newShips[el] = playerShips;
            
            // Release var
            playerShips = [];
        });
        
        dispatch(setShips(newShips));
    };
    
    return(
        <>
            {winner ? <ModalFinish winner={winner} me={me} /> : null}

            <div className={`${whoNext == me.uuid ? 'me' : 'enemy'}`} />
        
            <div className="main-wrapper">
                {!gameReady ? (
                    <GameLoader />

                ) : (
                    <>
                        {players.map((el, i) => {
                            return(
                                <div key={i} className="board-container">
                                    <Board player={el} />
                                    <ShipHits player={el} />
                                </div>
                            );
                        })}
                    </>
                )}

            </div>
        </>
    );
};

export default Boards;