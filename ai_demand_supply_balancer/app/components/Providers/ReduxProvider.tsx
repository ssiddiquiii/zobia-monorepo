'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
import DataInitializer from './DataInitializer';

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <DataInitializer>
                {children}
            </DataInitializer>
        </Provider>
    );
}
