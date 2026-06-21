import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    } | null;
    token: string | null;
    isAuthenticated: boolean;
    isAuthChecking: boolean;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isAuthChecking: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: AuthState['user']; token: string }>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.isAuthChecking = false;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isAuthChecking = false;
        },
        setAuthChecking: (state, action: PayloadAction<boolean>) => {
            state.isAuthChecking = action.payload;
        },
    },
});

export const { setCredentials, logout, setAuthChecking } = authSlice.actions;
export default authSlice.reducer;
