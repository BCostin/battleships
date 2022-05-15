import React from 'react';

const GameLoader = () => {
    return(
        <div className="game-loader-wrapper">
            <div className="content">
                <h1 className="title">Game initializing ...</h1>
                <div className="shapes">
                    <div />
                    <div />
                    <div />
                </div>
            </div>
        </div>
    );
};

export default GameLoader;