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
    resetGameInstance,
} = gameSlice.actions;

export default gameSlice.reducer;