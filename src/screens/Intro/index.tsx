import React, { ChangeEvent, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPlayer } from '../../redux/slice/player';
import { RootState } from '../../redux/store';

// Mock a default player object
const myData: IPlayer = {
    uuid: 'uuid-a',
    username: '',
};

const Intro = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get my current data from store
    const me = useSelector((state: RootState) => state.player);
    
    // Enter a username
    const handleName = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        dispatch(setPlayer({...myData, username: name.trim()}));
    }

    // Submit your username
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key == 'Enter') {
            navigate("/boards");
        }
    }

    return(
        <div className="intro-wrapper">
            <div className="content">
                <h1 className="title">Battleship</h1>

                <div className="inner">
                    <p className="title">Please enter a username</p>

                    <input 
                        className="input-username"
                        type={"text"}
                        autoFocus
                        onChange={handleName}
                        onKeyDown={handleKeyDown} 
                        value={me.username}
                        placeholder={"Username here ..."}
                    />
                </div>
            </div>
        </div>
    );
};

export default Intro;