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

const Boards = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Players data
    const me = useSelector((state: RootState) => state.player);
    const playerTwo = useMockPlayer();
    
    const { status, winner, players, ships, whoNext, guesses } = useSelector((state: RootState) => state.game);
    const gameReady = status == "ongoing";

    // When the screen mounts, we must create all the data needed to play the game
    useEffect(() => {
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
                () => {};
        }

    }, [status]);

    // Wrapper for setting up the game instance
    const runGameInstance = () => {
        connectPlayers();
    }

    const setGameStatus = (gameStatus: IGame["status"]) => dispatch(setStatus(gameStatus));

    // 'Connect' both players to the same instance / room
    const connectPlayers = () => {
        dispatch(setThisPlayer(me));
        dispatch(setThisPlayer(playerTwo));
    };

    // Generate random ships for current player
    const generateShips = () => {
        const playerIDs = players.map((el) => el.uuid);

        // Generate all coords. Allow left to right / right to left / top to bottom / bottom to top
        const generatePositions = (shipLen: number, allShips: IShipLayout[]): any => {
            const startCoords: TPosition = [getRandomNr(MAX_BOARD_UNITS), getRandomNr(MAX_BOARD_UNITS)];
            const newPos = generateAllCoords(startCoords, shipLen);
            return checkIntersection(allShips, newPos) ? generatePositions(shipLen, allShips) : newPos;
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
                {!gameReady ? <GameLoader /> : (
                    <>
                        <ScoreBar playerOne={me} playerTwo={playerTwo} hits={guesses.filter(el => el.hit)} />

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