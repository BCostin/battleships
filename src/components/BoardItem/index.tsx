import React, { MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';


export const BoardItem = ({ value, playerUUID, checkHandler, actionDisabled, playerShips }: IBoardItem) => {
    const { guesses } = useSelector((state: RootState) => state.game);
    let shipFragment = false;
    let shipName = '';
    let classes = '';

    const isHit = guesses.filter(guessEl => {
        return guessEl.uuid == playerUUID && JSON.stringify(guessEl.position) == JSON.stringify(value);
    });

    playerShips && playerShips.forEach((shipEl) => {
        if (!shipFragment && JSON.stringify(shipEl.positions).includes(JSON.stringify(value))) {
            shipName = shipEl.ship;
            classes += ` ${shipEl.color}`;
            shipFragment = true;
        }
    });

    if (actionDisabled) classes += ' disabled';
    if (shipFragment) classes += ' ship-fragment';

    if (isHit && isHit[0]) {
        classes += isHit[0].hit ? ' hit' : ' miss';
    }

    const handleItem = (e: MouseEvent<HTMLDivElement>) => {
        if (actionDisabled) {
            console.warn('You cannot use the other player\'s Board');
            return;
        }

        if (typeof checkHandler == 'function') {
            checkHandler({
                uuid: playerUUID, 
                position: value,
            });
        }
    };

    return(
        <div 
            className={`item ${classes}`} 
            onClick={handleItem}
            data-value={value}
            data-ship={shipName}
        />
    );
};

export default BoardItem;