'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/app/components/Providers/ThemeProvider';
import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

const SettingsPage = () => {
    const { theme, toggleTheme } = useTheme();
    const [loading, setLoading] = useState(false);

    // Form State
    const [settings, setSettings] = useState({
        storeName: 'Fleure Beauty',
        email: 'hello@fleurebeauty.com',
        description: 'Premium cosmetics and skincare collections.'
    });

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('storeSettings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setSettings({
                    storeName: parsed.storeName || 'Fleure Beauty',
                    email: parsed.email || 'hello@fleurebeauty.com',
                    description: parsed.description || 'Premium cosmetics and skincare collections.'
                });
            } catch (e) {
                console.error('Error parsing settings:', e);
            }
        }
    }, []);

    const handleSave = () => {
        setLoading(true);
        // Simulate API call / Save to local storage
        setTimeout(() => {
            localStorage.setItem('storeSettings', JSON.stringify(settings));
            setLoading(false);
            alert('Settings saved successfully!');
        }, 1000);
    };

    return (
        <main className="p-10 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <header className="mb-10">
                    <p className="text-[#c47659] font-medium mb-1">Store Preferences</p>
                    <h1 className="text-4xl font-light text-gray-800 dark:text-white tracking-tight transition-colors">Settings</h1>
                </header>

                <div className="max-w-4xl space-y-8">
                    {/* Appearance Settings */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-[#111111] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors"
                    >
                        <h2 className="text-xl font-medium text-gray-800 dark:text-white mb-6 font-semibold flex items-center gap-2">
                            Appearance
                        </h2>
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="font-medium text-gray-700 dark:text-gray-200 font-semibold">Dark Mode</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500">Switch between light and dark themes.</p>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className={`w-14 h-8 rounded-full relative transition-colors duration-300 focus:outline-none ${theme === 'dark' ? 'bg-[#c47659]' : 'bg-gray-200'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center transition-transform duration-300 ${theme === 'dark' ? 'left-[calc(100%-1.75rem)]' : 'left-1'}`}>
                                    {theme === 'dark' ? (
                                        <Moon size={14} className="text-[#c47659]" />
                                    ) : (
                                        <Sun size={14} className="text-orange-400" />
                                    )}
                                </div>
                            </button>
                        </div>
                    </motion.div>

                    {/* General Settings */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-[#111111] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors"
                    >
                        <h2 className="text-xl font-medium text-gray-800 dark:text-white mb-6 font-semibold">General Information</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-400">Store Name</label>
                                <input
                                    type="text"
                                    value={settings.storeName}
                                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                                    className="bg-gray-50 dark:bg-[#1a1a1a] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#fdf2ef] text-gray-800 dark:text-gray-200 outline-none transition-colors"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-400">Contact Email</label>
                                <input
                                    type="email"
                                    value={settings.email}
                                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                    className="bg-gray-50 dark:bg-[#1a1a1a] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#fdf2ef] text-gray-800 dark:text-gray-200 outline-none transition-colors"
                                />
                            </div>
                            <div className="flex flex-col gap-2 col-span-2">
                                <label className="text-sm font-medium text-gray-400">Store Description</label>
                                <textarea
                                    rows={3}
                                    value={settings.description}
                                    onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                                    className="bg-gray-50 dark:bg-[#1a1a1a] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#fdf2ef] resize-none text-gray-800 dark:text-gray-200 outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Notification Settings */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-[#111111] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors"
                    >
                        <h2 className="text-xl font-medium text-gray-800 dark:text-white mb-6 font-semibold">Notifications</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-200 font-semibold">Order Confirmations</p>
                                    <p className="text-sm text-gray-400">Receive an email for every new order.</p>
                                </div>
                                <div className="w-12 h-6 bg-[#d98a6c] rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-2 border-t border-gray-50 dark:border-gray-800">
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-200 font-semibold">Stock Alerts</p>
                                    <p className="text-sm text-gray-400">Get notified when products are running low.</p>
                                </div>
                                <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full relative cursor-pointer">
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="flex justify-end gap-4">
                        <button className="px-6 py-2.5 rounded-xl text-gray-400 font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Discard Changes</button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-[#d98a6c] px-8 py-2.5 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </main>
    );
};

export default SettingsPage;
