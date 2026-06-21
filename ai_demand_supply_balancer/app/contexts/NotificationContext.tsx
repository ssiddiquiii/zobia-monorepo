'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type NotificationType = 'success' | 'warning' | 'error' | 'info';

export interface Notification {
    id: string;
    _id?: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: Date;
    isRead?: boolean;
    relatedEntity?: {
        type: 'product' | 'order' | 'warehouse';
        id: string;
    };
}

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (type: NotificationType, title: string, message: string, relatedEntity?: Notification['relatedEntity']) => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
    markAsRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Professional notification sound URL
const NOTIFICATION_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3';

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [audio] = useState<HTMLAudioElement | null>(typeof Audio !== 'undefined' ? new Audio(NOTIFICATION_SOUND) : null);

    const playSound = useCallback(() => {
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('Audio play failed', e));
        }
    }, [audio]);

    // Fetch notifications from API
    const fetchNotifications = useCallback(async () => {
        try {
            const res = await fetch('/api/notifications?limit=20');
            const data = await res.json();

            if (!data || !data.notifications) {
                console.error('Invalid notification data received:', data);
                return;
            }

            // Map MongoDB _id to id for frontend consistency
            const fetched: Notification[] = data.notifications.map((n: any) => ({
                id: n._id,
                _id: n._id,
                type: n.type,
                title: n.title,
                message: n.message,
                timestamp: new Date(n.timestamp),
                isRead: n.isRead,
                relatedEntity: n.relatedEntity
            }));

            setNotifications(prev => {
                // Check if there are any new unread notifications that we didn't have before
                const previousIds = new Set(prev.map(n => n.id));
                const hasNew = fetched.some(n => !previousIds.has(n.id) && !n.isRead);

                if (hasNew && previousIds.size > 0) { // Don't play sound on first load
                    playSound();
                }

                return fetched;
            });
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    }, [playSound]);

    // Poll for notifications every 10 seconds
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    // addNotification for local toasts
    const addNotification = useCallback((type: NotificationType, title: string, message: string, relatedEntity?: Notification['relatedEntity']) => {
        const id = `local-${Date.now()}`;
        const newNotif: Notification = {
            id,
            type,
            title,
            message,
            timestamp: new Date(),
            isRead: false,
            relatedEntity
        };
        setNotifications(prev => [newNotif, ...prev]);
        playSound();
    }, [playSound]);

    const removeNotification = useCallback(async (id: string) => {
        if (!id.startsWith('local-')) {
            try {
                // DELETE from database
                await fetch(`/api/notifications?id=${id}`, {
                    method: 'DELETE'
                });
            } catch (err) {
                console.error('Failed to delete notification:', err);
            }
        }
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const markAsRead = useCallback(async (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        if (!id.startsWith('local-')) {
            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isRead: true })
            });
        }
    }, []);

    const clearAll = useCallback(async () => {
        try {
            await fetch('/api/notifications?deleteAll=true', {
                method: 'DELETE'
            });
            setNotifications([]);
        } catch (err) {
            console.error('Failed to clear notifications:', err);
        }
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, clearAll, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};
