import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: IGame = {
    gameID: '',
    status: 'pending',
    players: [],
    ships: {},
    guesses: [],
    hits: [],
    misses: [],
    whoNext: '',
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
            console.log('setShips: ', action.payload);
            return state;
        },
        addGuess: (state, action: PayloadAction<IGuess>) => {
            const exists = state.guesses.filter(el => {
                return el.uuid == action.payload.uuid && JSON.stringify(el.position) == JSON.stringify(action.payload.position)
            });
            
            if (!exists.length) { 
                state.guesses.push(action.payload);

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