import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IGame {
    player: IPlayer,
    activePlayers: IPlayer[] | undefined[],
    whoNext: string
}

const initialState: IGame = {
    player: {
        uuid: '',
        username: '',
    },
    activePlayers: [],
    whoNext: '',
}

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setWhoNext: (state, action: PayloadAction<string>) => {
            state.whoNext = action.payload;
        },
        setPlayer: (state, action: PayloadAction<IPlayer>) => {
            state.player = action.payload;
            return state;
        },
    },
})

export const { 
    setWhoNext,
    setPlayer,
} = gameSlice.actions;

export default gameSlice.reducer;