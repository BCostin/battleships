import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMockPlayer } from '../../hooks/useMockPlayer';
import { resetGameInstance, setGameID, setStatus, setThisPlayer } from '../../redux/slice/game';
import { RootState } from '../../redux/store';

const shiptTypesArr = ["carrier", "battleship", "cruiser", "submarine", "destroyer"];

const shipTypes: Record<string, IShipType> = {
    carrier: { size: 5, count: 1 },
    battleship: { size: 4, count: 1 },
    cruiser: { size: 3, count: 1 },
    submarine: { size: 3, count: 1 },
    destroyer: { size: 2, count: 1 },
};

const shipLayout = [
    { "ship": "carrier", "positions": [[2,9], [3,9], [4,9], [5,9], [6,9]] },
    { "ship": "battleship", "positions": [[5,2], [5,3], [5,4], [5,5]] },
    { "ship": "cruiser", "positions": [[8,1], [8,2], [8,3]] },
    { "ship": "submarine", "positions": [[3,0], [3,1], [3,2]] },
    { "ship": "destroyer", "positions": [[0,0], [1,0]] }
]

// The total units of a single board (on a side)
const boardUnits = 10;

// We mostly need this to set a direction, left of right for ship generation
const getRandomNr = (max: number) => Math.floor(Math.random() * max);

// Generate a random number from 0 to 9 only
// We will use this method to work with positions on the Board
const getRandomNumber = () => Math.floor(Math.random() * 10);

// Need this for ships' directions
const getDirection = () => getRandomNr(2) == 0 ? 'horizontal' : 'vertical';

const Boards = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Players data
    const me = useSelector((state: RootState) => state.player);
    const playerTwo = useMockPlayer();
    
    const gameInstance = useSelector((state: RootState) => state.game);
    const gameStatus = gameInstance.status;

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
        console.log('A player has joined the room');

        // When we have exactly 2 players, update game status and game id
        if (gameInstance.players.length === 2 && gameStatus === "pending") {
            dispatch(setGameID('game-1'));
            setGameStatus("ongoing");
        }

    }, [gameInstance.players]);


    // Monitor the Game Status. We need this to generate all the data when the game 'starts'
    useEffect(() => {
        // Here we can save different data like the start time
        // or the game instance just for having some sort of history in a db
        // based on the STATUS OF THE GAME
        switch (gameStatus) {
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

    }, [gameStatus]);

    // Wrapper for setting up the game instance
    const runGameInstance = () => {
        connectPlayers();
        displayBoard();
    }

    // 'Connect' both players to the same instance / room
    const connectPlayers = () => {
        // Add myself
        dispatch(setThisPlayer(me));

        // At the same time, we will 'artificially' connect the other player here.
        dispatch(setThisPlayer(playerTwo));
    };

    // Generate random ships for current player
    // We will also use this to 'artificially' generate for the second player
    const generateShips = () => {
        const playerIDs = gameInstance.players.map((el) => el.uuid);

        // Recursive method to generate other ship type but at most 2 of the same type
        const generateShipType = (playerShips: IShipLayout[]) => {
            const newShipType = shiptTypesArr[getRandomNr(5)];
            if (playerShips.filter((el) => el.ship === newShipType).length >= 2) {
                generateShipType(playerShips);
            } else {
                return newShipType;
            }
        }

        const generatePositions = (shipLen: number, allShips: IShipLayout[]) => {            
            // This gives a 'non-index' value, pure integer.
            const maxUnit = boardUnits - shipLen;

            let newPos: TPosition[] = [];
            let startCoords: TPosition = [getRandomNr(maxUnit), getRandomNr(maxUnit)]; // set a default value non-zero

            const isHoriz = getDirection() === 'horizontal';
            
            // Add the starting point of the ship
            newPos = [startCoords];

            const updatedShipLen = shipLen - 1;

            // Check if there's another ship with the same Starting Coordinates
            const existsSameStart = allShips.filter((el) => {
                if (el.positions) {
                    return JSON.stringify(el.positions).includes(JSON.stringify(startCoords)); 
                }
            });

            if (existsSameStart.length) {
                console.log('START EXISTS: ', existsSameStart);
                generatePositions(shipLen, allShips);

            } else {
                // Generate the rest of the coords but remove the start point from the LENGTH
                for (let i = 0; i < updatedShipLen; i ++) {
                    const x = isHoriz ? newPos[newPos.length - 1][0] + 1 : newPos[newPos.length - 1][0];
                    const y = isHoriz ? newPos[newPos.length - 1][1] : newPos[newPos.length - 1][1] + 1;

                    newPos.push([x, y]);
                }

                // console.log('--------------', shipLen);
                return newPos;
            }
        };

        let newShips: IGame["ships"] = {}; // Object containing ships for each Player UUID
        let tempShips: IShipLayout[] =  []; // We need this to check positions, no duplicate starting points

        playerIDs.forEach((el) => {
            let playerShips: IShipLayout[] = [];
            for (let i = 0; i < 5; i ++) {
                // generate a random ship type
                const shipType: any = generateShipType(playerShips);

                // Start generating the positions
                const { size } = shipTypes[shipType];
                let positions = generatePositions(size, playerShips);
                
                const newShip: IShipLayout = {
                    ship: shipType,
                    size: size,
                    positions: positions,
                };
    
                playerShips.push(newShip);
                tempShips.push(newShip);

                // newShip['direction'] = getDirection();
                // let shipType = shiptTypesArr[getRandomNr(5)];

                // console.log(el + ' ' + i + ' - ' + direction);
                // newShips[el] = randomShip;
            }
            
            // Add ships to each player uuid
            newShips[el] = playerShips;
            
            // Reset this array and generate for the next player
            playerShips = [];
        });
        
        console.log('---------------------------', newShips);

    };
    

    const displayBoard = () => {};

    const setGameStatus = (gameStatus: IGame["status"]) => dispatch(setStatus(gameStatus));

    return(
        <div>Battle fields</div>
    );
};

export default Boards;