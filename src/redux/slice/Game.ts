import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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
        setStatus: (state, action: PayloadAction<IGame['status']>) => {
            state.status = action.payload;
            return state;
        },
        setThisPlayer: (state, action: PayloadAction<IPlayer>) => {
            state.players.push(JSON.stringify(action.payload));
            return state;
        },
    },
})

export const {
    setStatus,
    setThisPlayer,
} = gameSlice.actions;

export default gameSlice.reducer;