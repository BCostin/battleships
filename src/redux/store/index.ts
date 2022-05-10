import { configureStore } from '@reduxjs/toolkit';
import gameSlice from '../slice/game';
import playerSlice from '../slice/player';

// Combine all reducers here
// For simplicity, we will create just one / two reducers
export const store = configureStore({
    reducer: {
        player: playerSlice,
        game: gameSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;