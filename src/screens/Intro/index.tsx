import React, { ChangeEvent, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPlayer } from '../../redux/slice/Game';
import { RootState } from '../../redux/store';

// Mock a default player object
const myData: IPlayer = {
    uuid: 'a',
    username: '',
};

const Intro = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get my current data from store
    const me = useSelector((state: RootState) => state.game.player);
    
    // Enter a username
    const handleName = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(setPlayer({...myData, username: e.target.value}));
    }

    // Submit your username
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key == 'Enter') {
            navigate("/boards");
        }
    }

    return(
        <div>
            Please pick a username
            <input 
                type={"text"} 
                onChange={handleName}
                onKeyDown={handleKeyDown} 
                value={me.username} 
            />
        </div>
    );
};

export default Intro;