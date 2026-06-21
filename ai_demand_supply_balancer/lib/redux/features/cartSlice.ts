import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    stock: number;
}

interface CartState {
    items: CartItem[];
    loading: boolean;
}

const initialState: CartState = {
    items: [],
    loading: false,
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
    const response = await fetch('/api/cart');
    const data = await response.json();
    return data.map((item: any) => ({
        id: item.productId || item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        stock: item.stock || 0
    }));
});

export const syncCart = createAsyncThunk('cart/syncCart', async (items: CartItem[]) => {
    const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
    });
    return response.json();
});

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                if (existingItem.quantity < action.payload.stock) {
                    existingItem.quantity += 1;
                }
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
            const item = state.items.find(item => item.id === action.payload.id);
            if (item) {
                // Enforce stock limit
                const newQuantity = Math.min(action.payload.quantity, item.stock);
                item.quantity = Math.max(1, newQuantity);
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(syncCart.fulfilled, (state, action) => {
                // Return value from server includes latest stock
                if (Array.isArray(action.payload)) {
                    // Update only if items are different (e.g. stock changed or remote update happened)
                    // We check if quantities are the same to avoid jitter during local updates
                    const localIdsAndQtys = state.items.map(i => `${i.id}-${i.quantity}`).join('|');
                    const remoteIdsAndQtys = action.payload.map((i: any) => `${i.id}-${i.quantity}`).join('|');

                    if (localIdsAndQtys !== remoteIdsAndQtys) {
                        state.items = action.payload;
                    } else {
                        // Just update stock if quantity matches
                        state.items.forEach(item => {
                            const remoteItem = action.payload.find((ri: any) => ri.id === item.id);
                            if (remoteItem) item.stock = remoteItem.stock;
                        });
                    }
                }
            });
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
