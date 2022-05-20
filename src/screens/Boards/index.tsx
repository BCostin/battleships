import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {Board, MAX_BOARD_UNITS } from '../../components/Board';
import GameLoader from '../../components/GameLoader';
import ModalFinish from '../../components/ModalFinish';
import ScoreBar from '../../components/ScoreBar';
import ShipHits from '../../components/ShipHits';
import { checkIntersection, generateAllCoords, generatePlayerShips } from '../../helpers/boardMethods';
import { addDelay, getRandomNr } from '../../helpers/methods';
import { useMockPlayer } from '../../hooks/useMockPlayer';
import { resetGameInstance, setGameID, setShips, setStatus, setThisPlayer, setWhoNext } from '../../redux/slice/game';
import { RootState } from '../../redux/store';

export const shipTypes: Record<string, IShipType> = {
    carrier: { size: 5, count: 1, color: 'red', image: 'aircraftShape.png' },
    battleship: { size: 4, count: 1, color: 'blue', image: 'battleshipShape.png' },
    cruiser: { size: 3, count: 1, color: 'green', image: 'cruiserShape.png' },
    submarine: { size: 3, count: 1, color: 'yellow', image: 'submarineShape.png' },
    destroyer: { size: 2, count: 1, color: 'black', image: 'carrierShape.png' },
};

const Boards = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Players data
    const me = useSelector((state: RootState) => state.player);
    const playerTwo = useMockPlayer();
    
    const { status, winner, players, ships, whoNext, guesses } = useSelector((state: RootState) => state.game);
    const gameReady = status == "ongoing";

    // When the screen mounts, we must create ALL the data needed to play the game
    useEffect(() => {
        // On refresh just redirect back to intro based on my username
        // Otherwise, start the game
        if (!me.username) {
            dispatch(resetGameInstance());
            navigate('/');
        } else {
            if (!players.length || !ships[me.uuid]) {
                runGameInstance();
            }
        }

    }, []);

    // Monitor the connected players
    useEffect(() => {
        console.warn('A player has joined the room');

        // When we have exactly 2 players, update game status and game id
        if (players.length === 2 && status === "pending") {
            dispatch(setGameID('game-1'));

            if (whoNext == '') {
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

                if (!players.length || !ships[me.uuid]) {
                    // Generate ships for both players
                    generateShips();
                }

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
            const startCoords: TPosition = [getRandomNr(MAX_BOARD_UNITS), getRandomNr(MAX_BOARD_UNITS)]; // set a default value non-zero

            // Generate all coords. Allow left to right / right to left / top to bottom / bottom to top
            const newPos = generateAllCoords(startCoords, shipLen);
            
            // Check if there's another ship with an intersection point
            if (checkIntersection(allShips, newPos)) {
                return generatePositions(shipLen, allShips);
            } else {
                return newPos;
            }
        };

        // Object containing ships for each Player UUID
        const newShips = generatePlayerShips(playerIDs, generatePositions); 

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
                        <ScoreBar 
                            playerOne={me} 
                            playerTwo={playerTwo}
                            hits={guesses.filter(el => el.hit)}
                        />

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