'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchCart, syncCart } from '@/lib/redux/features/cartSlice';
import { fetchFavorites, syncFavorites } from '@/lib/redux/features/favoritesSlice';

export default function DataInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const favoriteItems = useSelector((state: RootState) => state.favorites.items);

    const lastSyncedCart = useRef<string>('');
    const lastSyncedFavorites = useRef<string>('');

    // Session Recovery
    useEffect(() => {
        const recoverSession = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    const { setCredentials } = await import('@/lib/redux/features/authSlice');
                    dispatch(setCredentials({ user: data.user, token: data.token }));
                } else {
                    const { setAuthChecking } = await import('@/lib/redux/features/authSlice');
                    dispatch(setAuthChecking(false));
                }
            } catch (error) {
                console.error('Session recovery failed:', error);
                const { setAuthChecking } = await import('@/lib/redux/features/authSlice');
                dispatch(setAuthChecking(false));
            }
        };
        recoverSession();
    }, [dispatch]);

    // Initial Fetch
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCart());
            dispatch(fetchFavorites());
        }
    }, [isAuthenticated, dispatch]);

    // Sync Cart
    useEffect(() => {
        if (!isAuthenticated) return;

        const currentCartStr = JSON.stringify(cartItems);
        if (currentCartStr === lastSyncedCart.current) return;

        const performSync = async () => {
            const resultAction = await dispatch(syncCart(cartItems));
            if (syncCart.fulfilled.match(resultAction)) {
                lastSyncedCart.current = JSON.stringify(resultAction.payload);
            }
        };

        performSync();
    }, [cartItems, isAuthenticated, dispatch]);

    // Sync Favorites
    useEffect(() => {
        if (!isAuthenticated) return;

        const currentFavStr = JSON.stringify(favoriteItems);
        if (currentFavStr === lastSyncedFavorites.current) return;

        const performSync = async () => {
            const resultAction = await dispatch(syncFavorites(favoriteItems));
            if (syncFavorites.fulfilled.match(resultAction)) {
                lastSyncedFavorites.current = JSON.stringify(resultAction.payload);
            }
        };

        performSync();
    }, [favoriteItems, isAuthenticated, dispatch]);

    return <>{children}</>;
}
