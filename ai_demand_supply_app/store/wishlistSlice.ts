import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../lib/axiosClient';
import { API_ROUTES } from '../lib/api';

interface WishlistState {
  items: string[]; // array of product IDs
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async () => {
  const { data } = await apiClient.get(API_ROUTES.wishlist);
  return data.items.map((i: any) => i.productId || i) || [];
});

export const toggleWishlistApi = createAsyncThunk('wishlist/toggle', async (productId: string, { getState }) => {
  const state = getState() as any;
  const items = state.wishlist.items;
  let newItems = [...items];
  
  if (newItems.includes(productId)) {
    newItems = newItems.filter(id => id !== productId);
  } else {
    newItems.push(productId);
  }
  
  await apiClient.post(API_ROUTES.wishlist, { items: newItems });
  return newItems;
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlistLocal: (state, action: PayloadAction<string>) => {
      const exists = state.items.includes(action.payload);
      if (exists) {
        state.items = state.items.filter(id => id !== action.payload);
      } else {
        state.items.push(action.payload);
      }
    },
    clearWishlist: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(toggleWishlistApi.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { toggleWishlistLocal, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
