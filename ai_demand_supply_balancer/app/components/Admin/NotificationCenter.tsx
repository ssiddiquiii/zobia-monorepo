'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertTriangle, CheckCircle, Info, AlertCircle, Trash2, CheckCheck } from 'lucide-react';
import { useNotifications } from '@/app/contexts/NotificationContext';
import { useRouter } from 'next/navigation';

const NotificationCenter = () => {
    const { notifications, removeNotification, clearAll, markAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        setUnreadCount(notifications.filter(n => !n.isRead).length);
    }, [notifications]);

    const handleNotificationClick = (notif: any) => {
        // Mark as read first
        if (!notif.isRead) {
            markAsRead(notif.id);
        }

        // Navigate based on related entity
        if (notif.relatedEntity) {
            const { type, id } = notif.relatedEntity;
            switch (type) {
                case 'order':
                    router.push(`/admin/orders/${id}`);
                    break;
                case 'product':
                    router.push(`/admin/products/edit/${id}`);
                    break;
                case 'warehouse':
                    router.push(`/admin/warehouses`);
                    break;
                default:
                    break;
            }
            setIsOpen(false);
        } else if (notif.title.toLowerCase().includes('order')) {
            // Fallback for notifications without explicit relatedEntity but mention 'order'
            router.push('/admin/orders');
            setIsOpen(false);
        } else if (notif.title.toLowerCase().includes('stock') || notif.title.toLowerCase().includes('product')) {
            router.push('/admin/products');
            setIsOpen(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="text-green-500" size={20} />;
            case 'warning':
                return <AlertTriangle className="text-yellow-500" size={20} />;
            case 'error':
                return <AlertCircle className="text-red-500" size={20} />;
            default:
                return <Info className="text-blue-500" size={20} />;
        }
    };

    const getStyles = (type: string) => {
        switch (type) {
            case 'success':
                return 'bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-800/20';
            case 'warning':
                return 'bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-800/20';
            case 'error':
                return 'bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-800/20';
            default:
                return 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/20';
        }
    };

    return (
        <div className="relative">
            {/* Bell Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-3 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] rounded-2xl transition-all group"
            >
                <Bell className="text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" size={22} />
                {unreadCount > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                    >
                        <span className="text-white text-[10px] font-black">{unreadCount > 9 ? '9+' : unreadCount}</span>
                    </motion.div>
                )}
            </button>

            {/* Notification Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40"
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 top-16 w-80 sm:w-96 bg-white dark:bg-[#161616] rounded-[32px] shadow-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white/80 dark:bg-[#161616]/80 backdrop-blur-md">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        Notifications
                                        {unreadCount > 0 && (
                                            <span className="px-2 py-0.5 bg-[#d98a6c] text-white text-[10px] rounded-full">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">Alert History</p>
                                </div>
                                {notifications.length > 0 && (
                                    <button
                                        onClick={clearAll}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all uppercase tracking-widest border border-transparent hover:border-red-100 dark:hover:border-red-800/40"
                                    >
                                        <Trash2 size={12} />
                                        Clear All
                                    </button>
                                )}
                            </div>

                            {/* Notifications List */}
                            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                                {notifications.length > 0 ? (
                                    <div className="p-4 space-y-3">
                                        {notifications.map((notif, index) => (
                                            <motion.div
                                                key={notif.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ delay: index * 0.05 }}
                                                onClick={() => handleNotificationClick(notif)}
                                                className={`p-4 rounded-2xl border ${getStyles(notif.type)} relative group cursor-pointer hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 ${!notif.isRead ? 'ring-1 ring-[#d98a6c]/20' : ''}`}
                                            >
                                                {!notif.isRead && (
                                                    <div className="absolute top-4 right-4 flex items-center gap-1">
                                                        <span className="text-[8px] font-black text-[#d98a6c] uppercase tracking-tighter">New</span>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#d98a6c] animate-pulse" />
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => removeNotification(notif.id)}
                                                    className="absolute top-3 right-3 p-1 opacity-0 group-hover:opacity-100 hover:bg-white rounded-lg transition-all"
                                                >
                                                    <X size={14} className="text-gray-400" />
                                                </button>

                                                <div className="flex gap-3">
                                                    <div className="flex-shrink-0 mt-0.5">
                                                        {getIcon(notif.type)}
                                                    </div>
                                                    <div className="flex-1 pr-6">
                                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{notif.title}</h4>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{notif.message}</p>
                                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium mt-2">
                                                            {new Date(notif.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-20 text-center">
                                        <Bell className="mx-auto mb-4 text-gray-200 dark:text-gray-700" size={48} />
                                        <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">No new notifications</p>
                                        <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">You're all caught up!</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e5e5;
          border-radius: 10px;
        }
      `}</style>
        </div>
    );
};

export default NotificationCenter;
