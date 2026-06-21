'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, Settings, LogOut, Warehouse, BarChart3, Brain, Users, FileText } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '@/lib/redux/features/authSlice';

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/auth/logout', { method: 'POST' });
            if (res.ok) {
                dispatch(logout());
                router.push('/admin/login');
            }
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Logout failed. Please try again.');
        }
    };

    const menuItems = [
        { path: '/admin', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/admin/analytics', name: 'Analytics', icon: <Brain size={20} /> },
        { path: '/admin/products', name: 'Products', icon: <ShoppingBag size={20} /> },
        { path: '/admin/customers', name: 'Customers', icon: <Users size={20} /> },
        { path: '/admin/warehouses', name: 'Warehouses', icon: <Warehouse size={20} /> },
        { path: '/admin/orders', name: 'Orders', icon: <Package size={20} /> },
        { path: '/admin/invoices', name: 'Invoices', icon: <FileText size={20} /> },
        { path: '/admin/reports', name: 'Reports', icon: <BarChart3 size={20} /> },
        { path: '/admin/settings', name: 'Settings', icon: <Settings size={20} /> },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            <div
                className={`fixed left-0 top-0 h-full w-[240px] bg-white dark:bg-[#111111] border-r border-gray-100 dark:border-gray-800 p-5 z-50 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div
                    className="mb-10 flex items-center gap-3.5 px-1.5"
                >
                    <div className="relative w-10 h-10">
                        <img
                            src="/logo.jpeg"
                            alt="Fleure Logo"
                            className="w-full h-full object-cover rounded-xl shadow-lg shadow-[#d98a6c22] rotate-3 hover:rotate-0 transition-transform duration-500"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#111111] rounded-full"></div>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-none">Fleure</h1>
                        <p className="text-[9px] font-bold text-[#c47659] uppercase tracking-wider mt-1">Admin Portal</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar">
                    {menuItems.map((item, index) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link key={item.path} href={item.path} onClick={() => window.innerWidth < 1024 && onClose()}>
                                <div
                                    className={`group relative flex items-center gap-3.5 p-3 rounded-xl transition-all duration-300 ${isActive
                                        ? 'bg-[#fdf2ef] dark:bg-[#2a1e1a] text-[#c47659] shadow-inner shadow-[#d98a6c11]'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute left-0 w-1 h-5 bg-[#d98a6c] rounded-full"
                                        />
                                    )}
                                    <div className={`transition-transform duration-300 ${isActive ? 'scale-105' : 'group-hover:scale-105'} text-current`}>
                                        {item.icon}
                                    </div>
                                    <span className={`text-sm font-semibold tracking-tight ${isActive ? 'text-[#c47659]' : ''}`}>
                                        {item.name}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div
                    className="mt-auto space-y-3 pt-4"
                >
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3.5 p-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-300 group"
                    >
                        <div className="group-hover:scale-110 transition-transform duration-300">
                            <LogOut size={18} />
                        </div>
                        <span className="text-sm font-semibold tracking-tight">Logout</span>
                    </button>

                    <div className="pt-6 border-t border-gray-50 dark:border-gray-800">
                        <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl p-3.5">
                            <div className="flex items-center gap-2.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">System Online</span>
                            </div>
                        </div>
                        <p className="mt-3 text-[9px] text-gray-300 dark:text-gray-600 font-medium px-1">© 2026 Fleure Beauty Dashboard</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
