import React, { MouseEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDelay, getRandomNr } from '../../helpers/methods';
import { useMockPlayer } from '../../hooks/useMockPlayer';
import { addGuess } from '../../redux/slice/game';
import { RootState } from '../../redux/store';
import BoardItem from '../BoardItem';

export const MAX_BOARD_UNITS = 10;
const maxUnits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export const Board = ({ player }: IBoard) => {
    // We will use 'availableEnemyPos' ONLY FOR COMPUTER HITS, to make it hit from available tiles
    const [availableEnemyPos, setAvailableEnemyPos] = useState<TPosition[]>([]);
    const dispatch = useDispatch();
    const enemy = useMockPlayer();
    const me = useSelector((state: RootState) => state.player);
    const { ships, guesses, whoNext, winner } = useSelector((state: RootState) => state.game);

    useEffect(() => {
        // It's enemy's turn
        if (whoNext != me.uuid && availableEnemyPos.length) {
            addEnemyHit();
        }
        
    }, [whoNext, availableEnemyPos]);

    useEffect(() => {
        // Used for 'computer-simulation' / Player 2
        updateEnemyAvailableGuesses();
        
    }, [guesses]);

    const updateEnemyAvailableGuesses = () => {
        if (!availableEnemyPos.length) {
            let values: TPosition[] = [];
            for (let i = 0; i < MAX_BOARD_UNITS; i ++) {
                for (let j = 0; j < MAX_BOARD_UNITS; j ++) {
                    values.push([i, j]);
                }
            }
            setAvailableEnemyPos(values);

        } else {
            // Remove each computer guess from the 'available positions' array
            const computerGuesses = guesses
                                .filter(el => el.uuid == enemy.uuid)
                                .map(el => el.position);
            
            setAvailableEnemyPos(availableEnemyPos.filter(el => {
                return !JSON.stringify(computerGuesses).includes(JSON.stringify(el));
            }));
        }
    }

    const checkHandler = ({ uuid, position }: IMyHitHandler) => {
        if (whoNext != me.uuid || winner) return;

        const enemyUUID = Object.keys(ships).filter(el => el != me.uuid)[0];
        const isHit = ships[enemyUUID].filter(el => JSON.stringify(el.positions).includes(JSON.stringify(position))).length;

        let shipType = '';
        if (isHit) {
            shipType = ships[enemyUUID].filter(el => JSON.stringify(el.positions).includes(JSON.stringify(position)))[0].ship;
        }

        // Append to Guesses array
        addGuessHandler({
            uuid: uuid,
            uuidTarget: enemyUUID,
            position: position,
            hit: isHit,
            shipType: shipType,
        });
    }

    const addGuessHandler = (opts: IGuess) => {
        dispatch(addGuess({
            uuid: opts.uuid,
            uuidTarget: opts.uuidTarget,
            position: opts.position,
            hit: opts.hit,
            shipType: opts.shipType,
        }));
    }

    /**
     * Simulate player hitting back
     * This is based on random numbers, no actual AI
     */
    const addEnemyHit = async () => {
        if (winner) return;
        
        const aiUUID = Object.keys(ships).filter(el => el != me.uuid)[0];
        
        const newGuess = availableEnemyPos[getRandomNr(availableEnemyPos.length)];
        const enemyUUID = aiUUID || enemy.uuid; // We use this for the one WHO HITS NOW
        const isHit = ships[me.uuid] ? ships[me.uuid].filter(el => JSON.stringify(el.positions).includes(JSON.stringify(newGuess))).length : 0;
        const ship = ships[me.uuid].filter(el => {
            return JSON.stringify(el.positions).includes(JSON.stringify(newGuess));
        }).map(el => el.ship)[0] || '';

        await addDelay(() => {}, 800);

        addGuessHandler({
            uuid: enemyUUID,
            uuidTarget: me.uuid,
            position: newGuess,
            hit: isHit,
            shipType: ship || '',
        });
    }

    return(
        <div className="board-display">
            <div className="board-wrapper">
                <div className="board" data-player={player.uuid}>
                    {maxUnits.map((row, idxRow) => {
                        return(
                            <div key={idxRow} className='row'>
                                {maxUnits.map((_item, idxItem) => {
                                    const itemCoords = [idxItem, idxRow];

                                    return <BoardItem 
                                                key={`row-${idxItem}`} 
                                                value={[itemCoords[0], itemCoords[1]]} 
                                                actionDisabled={player.uuid != me.uuid}
                                                playerUUID={player.uuid}
                                                playerShips={ships[player.uuid]}
                                                checkHandler={checkHandler}
                                            />
                                })}
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};