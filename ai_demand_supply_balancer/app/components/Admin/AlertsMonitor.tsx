'use client';

import { useEffect } from 'react';
import { useNotifications } from '@/app/contexts/NotificationContext';

export default function AlertsMonitor() {
    const { addNotification } = useNotifications();

    useEffect(() => {
        const checkAlerts = async () => {
            try {
                const res = await fetch('/api/alerts');
                const data = await res.json();

                if (data.alerts && data.alerts.length > 0) {
                    // Only show the most critical/recent alerts (max 3)
                    data.alerts.slice(0, 3).forEach((alert: any) => {
                        addNotification(alert.type, alert.title, alert.message);
                    });
                }
            } catch (error) {
                console.error('Error checking alerts:', error);
            }
        };

        // Check alerts on mount
        checkAlerts();

        // Check alerts every 2 minutes
        const interval = setInterval(checkAlerts, 120000);

        return () => clearInterval(interval);
    }, [addNotification]);

    return null; // This is a background component
}
