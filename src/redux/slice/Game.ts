import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { shipTypes } from '../../screens/Boards';

const initialState: IGame = {
    gameID: '',
    status: 'pending',
    players: [],
    ships: {},
    guesses: [],
    whoNext: '',
    winner: null,
}

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGameID: (state, action: PayloadAction<string>) => {
            state.gameID = action.payload;
            return state;
        },
        setStatus: (state, action: PayloadAction<IGame["status"]>) => {
            state.status = action.payload;
            return state;
        },
        setThisPlayer: (state, action: PayloadAction<IPlayer>) => {
            state.players.push(action.payload);
            return state;
        },
        setShips: (state, action: PayloadAction<IGame["ships"]>) => {
            state.ships = action.payload;
            return state;
        },
        addGuess: (state, action: PayloadAction<IGuess>) => {
            const data = action.payload;

            const exists = state.guesses.filter(el => {
                return el.uuid == data.uuid && JSON.stringify(el.position) == JSON.stringify(data.position)
            });
            
            // Only add non-duplicate guesses
            if (!exists.length) {
                if (state.guesses.length) {
                    if (state.guesses[state.guesses.length - 1].uuid != data.uuid) {
                        state.guesses.push(data);
                    }
                } else {
                    state.guesses.push(data);
                }

                if (data.hit) {
                    const myTotalGuesses = state.guesses.filter(el => el.uuid == data.uuid && el.hit).length;
                    let totalValidHits = 0;
                    Object.keys(shipTypes).forEach(el => totalValidHits += shipTypes[el].size);

                    if (myTotalGuesses == totalValidHits) {
                        state.winner = state.players.filter(el => el.uuid == data.uuid)[0];
                    }
                }

                // Also change 'whoNext'
                state.whoNext = state.players.filter(el => el.uuid !== action.payload.uuid)[0].uuid;
            }

            return state;
        },
        setWhoNext: (state, action: PayloadAction<string>) => {
            state.whoNext = action.payload;
            return state;
        },
        resetGameInstance: (state) => {
            state = initialState;
            return state;
        },
    },
})

export const {
    setGameID,
    setStatus,
    setThisPlayer,
    setShips,
    addGuess,
    setWhoNext,
    resetGameInstance,
} = gameSlice.actions;

export default gameSlice.reducer;