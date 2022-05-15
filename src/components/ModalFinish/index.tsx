import React from 'react';
import PlayAgainButton from '../PlayAgainButton';

interface IModal {
    winner: IPlayer,
    me: IPlayer,
}

const ModalFinish = ({ winner, me }: IModal) => {
    return(
        <div className="modal-finish">
            <div className="content">
                <h1>{winner.uuid == me.uuid ? 'You won :)' : 'You lost :('}</h1><br/>
                <PlayAgainButton />
            </div>
        </div>
    );
};

export default ModalFinish;