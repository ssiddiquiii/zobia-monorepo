'use client';

import { useState } from 'react';
import Sidebar from '../components/Admin/Sidebar';
import NotificationCenter from '../components/Admin/NotificationCenter';
import AlertsMonitor from '../components/Admin/AlertsMonitor';
import { NotificationProvider } from '../contexts/NotificationContext';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith('/admin/login') || pathname?.startsWith('/admin/signup');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <NotificationProvider>
            {!isAuthPage && <AlertsMonitor />}
            <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex flex-col lg:flex-row transition-colors duration-300">
                {/* Mobile Header */}
                {!isAuthPage && (
                    <div className="lg:hidden bg-white dark:bg-[#111111] border-b border-gray-100 dark:border-gray-800 p-4 flex items-center justify-between sticky top-0 z-30 transition-colors">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#222] rounded-xl transition-colors"
                            >
                                <Menu size={24} />
                            </button>
                            <span className="font-bold text-gray-900 dark:text-white">Fleure Admin</span>
                        </div>
                        <NotificationCenter />
                    </div>
                )}

                {!isAuthPage && (
                    <Sidebar
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                    />
                )}

                <div className={`${!isAuthPage ? 'lg:ml-64' : 'w-full'} flex-1 relative min-w-0`}>
                    {!isAuthPage && (
                        <div className="hidden lg:block absolute top-8 right-12 z-50">
                            <NotificationCenter />
                        </div>
                    )}
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </div>
            </div>
        </NotificationProvider>
    );
}
