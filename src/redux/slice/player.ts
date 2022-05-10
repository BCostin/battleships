import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: IPlayer = {
    uuid: '',
    username: '',
}

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setPlayer: (state, action: PayloadAction<IPlayer>) => {
            state = action.payload;
            return state;
        },
    },
})

export const {
    setPlayer,
} = playerSlice.actions;

export default playerSlice.reducer;