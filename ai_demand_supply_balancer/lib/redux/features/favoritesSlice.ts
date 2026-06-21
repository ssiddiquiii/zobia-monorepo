import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface FavoriteItem {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
}

interface FavoritesState {
    items: FavoriteItem[];
    loading: boolean;
}

const initialState: FavoritesState = {
    items: [],
    loading: false,
};

export const fetchFavorites = createAsyncThunk('favorites/fetchFavorites', async () => {
    const response = await fetch('/api/wishlist');
    const data = await response.json();
    return data.map((item: any) => ({
        id: item.productId || item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        stock: item.stock || 0
    }));
});

export const syncFavorites = createAsyncThunk('favorites/syncFavorites', async (items: FavoriteItem[]) => {
    const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
    });
    return response.json();
});

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        toggleFavorite: (state, action: PayloadAction<FavoriteItem>) => {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index >= 0) {
                state.items.splice(index, 1);
            } else {
                state.items.push(action.payload);
            }
        },
        removeFromFavorites: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchFavorites.pending, (state) => {
                state.loading = true;
            });
    }
});

export const { toggleFavorite, removeFromFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
