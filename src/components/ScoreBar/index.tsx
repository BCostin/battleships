import React from 'react';
import AppEmoji from '../AppEmoji';

interface IScoreBar {
    playerOne: IPlayer,
    playerTwo: IPlayer,
    hits: IGame["guesses"],
}

const ScoreBar = ({ playerOne, playerTwo, hits }: IScoreBar) => {
    if (!playerOne.username || !playerTwo.username) return <></>;

    const myHits = hits.filter(el => el.uuid === playerOne.uuid);
    const scoreOne = myHits.length;
    const scoreTwo = hits.length - scoreOne;

    let emojiOne = '128528', emojiTwo = '128528';
    if (scoreOne > scoreTwo) {
        emojiOne = '128513';
        emojiTwo = '129301';
    } else if (scoreOne < scoreTwo) {
        emojiOne = '129301';
        emojiTwo = '128513';
    }

    return(
        <div className="score-bar-wrapper">
            <div className="score-bar">
                <div className="player one">
                    <div className="emoji-wrapper"><AppEmoji code={emojiOne}/></div>
                    <div className="username">{playerOne.username}</div>
                </div>
                
                <div className="score">{myHits.length} / {hits.length - myHits.length}</div>

                <div className="player two">
                    <div className="emoji-wrapper"><AppEmoji code={emojiTwo}/></div>
                    <div className="username">{playerTwo.username}</div>
                </div>
            </div>
        </div>
    );
};

export default ScoreBar;