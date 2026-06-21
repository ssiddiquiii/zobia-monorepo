import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import cartReducer from './features/cartSlice';
import favoritesReducer from './features/favoritesSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        favorites: favoritesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
