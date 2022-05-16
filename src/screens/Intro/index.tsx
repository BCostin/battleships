import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
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
    const [redirect, setRedirect] = useState(false);

    // Get my current data from store
    const me = useSelector((state: RootState) => state.player);
    const { players, ships } = useSelector((state: RootState) => state.game);

    useEffect(() => {
        if (players.length && ships[me.uuid]) {
            setRedirect(true);
        }
    
    }, []);

    // Enter a username
    const handleName = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        dispatch(setPlayer({...myData, username: name.trim()}));
    }

    // Submit your username
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key == 'Enter') {
            setRedirect(true);
        }
    }

    if (redirect) return <Navigate replace to={"/boards"} />;

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