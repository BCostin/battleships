import React, { MouseEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDelay, getRandomNr } from '../../helpers/methods';
import { addGuess } from '../../redux/slice/game';
import { RootState } from '../../redux/store';

export const MAX_BOARD_UNITS = 10;
const maxUnits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export const Board = ({ player }: IBoard) => {
    const dispatch = useDispatch();
    const me = useSelector((state: RootState) => state.player);
    const { ships, guesses, whoNext } = useSelector((state: RootState) => state.game);

    // AI is hitting :)
    let aiHitting = false;

    useEffect(() => {
        
    }, []);

    useEffect(() => {
        console.log('whoNext: ', whoNext);

        // It's enemy's turn
        if (whoNext != me.uuid) {
            addEnemyHit();
        }

    }, [whoNext]);

    useEffect(() => {
        console.log('guesses: ', guesses);

    }, [guesses]);

    const checkHandler = (uuid: string, position: TPosition) => {
        if (whoNext != me.uuid) return;

        const enemyUUID = Object.keys(ships).filter(el => el != me.uuid)[0];
        const isHit = ships[enemyUUID].filter(el => JSON.stringify(el.positions).includes(JSON.stringify(position))).length;

        // Append to Guesses array
        addGuessHandler({
            uuid: uuid,
            uuidTarget: enemyUUID,
            position: position,
            hit: isHit,
        });

        console.log('enemyUUID: ', enemyUUID);
        console.log('isHit: ', isHit);
        console.log('guesses: ', guesses);
    }

    const addGuessHandler = (opts: IAddGuess) => {
        dispatch(addGuess({
            uuid: opts.uuid,
            uuidTarget: opts.uuidTarget,
            position: opts.position,
            hit: opts.hit,
        }));
    }

    /**
     * MAKE SURE THE AI REMOVES GUESSES FROM GENERATING RANDOM
     * OR, create a recursive method and check if the new position exists in GUESSES first
     */
    const addEnemyHit = () => {
        console.log('Wait for player to hit');
        const position: TPosition = [getRandomNr(9), getRandomNr(9)];
        const enemyUUID = Object.keys(ships).filter(el => el != me.uuid)[0];
        const isHit = ships[me.uuid] ? ships[me.uuid].filter(el => JSON.stringify(el.positions).includes(JSON.stringify(position))).length : 0;

        if (!aiHitting) {
            aiHitting = true;
            addDelay(() => {
                addGuessHandler({
                    uuid: enemyUUID,
                    uuidTarget: me.uuid,
                    position: position,
                    hit: isHit,
                });

                aiHitting = false;
                
            }, 3000)
        }
    }

    return(
        <div className="board-display">
            <h2>Player: {player.username}</h2>
            <div className="board-wrapper">
                <div className="board" data-player={player.uuid}>
                    {maxUnits.map((row, idxRow) => {
                        return(
                            <div key={idxRow} className='row'>
                                {maxUnits.map((item, idxItem) => {
                                    const itemCoords = [idxItem, idxRow];

                                    return <Item 
                                                key={`l-${idxItem}`} 
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

export const Item = ({ value, playerUUID, guessData, checkHandler, actionDisabled, playerShips }: IBoardItem) => {
    const { ships, guesses } = useSelector((state: RootState) => state.game);
    let shipFragment = false;

    const isHit = guesses.filter(guessEl => {
        // const matchPlayer = guessEl.uuid == playerUUID;
        // const matchItemCoords = JSON.stringify(guessEl.position) == JSON.stringify(value);
        return guessEl.uuid == playerUUID && JSON.stringify(guessEl.position) == JSON.stringify(value);
    });

    playerShips && playerShips.forEach((shipEl) => {
        if (!shipFragment && JSON.stringify(shipEl.positions).includes(JSON.stringify(value))) {
            shipFragment = true;
        }
    });

    let classes = shipFragment ? 'ship-fragment' : '';

    if (isHit && isHit[0]) {
        classes += isHit[0].hit ? ' hit' : ' miss';
    }

    const handleItem = (e: MouseEvent<HTMLDivElement>) => {
        if (actionDisabled) {
            console.warn('You cannot use the other player\'s Board');
            return;
        }

        if (typeof checkHandler == 'function') {
            checkHandler(playerUUID, value);
        }
    };

    return(
        <div 
            className={`item ${classes}`} 
            onClick={handleItem}
            data-value={value}
        >{`${value}`}</div>
    );
};
