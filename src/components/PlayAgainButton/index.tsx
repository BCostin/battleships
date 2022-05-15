import React from 'react';

const PlayAgainButton = () => {
    const handleRestart = () => {
        window.location.reload();
    };

    return(
        <div className="restart-btn" onClick={handleRestart}>Play again</div>
    );
}

export default PlayAgainButton;