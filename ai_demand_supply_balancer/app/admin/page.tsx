'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CustomerProfileModal from '@/app/components/Admin/CustomerProfileModal';

const AdminDashboard = () => {
    const [stats, setStats] = useState<any[]>([]);
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const [statsRes, ordersRes] = await Promise.all([
                fetch('/api/stats'),
                fetch('/api/orders')
            ]);

            const statsData = await statsRes.json();
            const ordersData = await ordersRes.json();

            setStats([
                { name: 'Total Revenue', value: statsData.totalRevenue, change: statsData.revenueChange, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                { name: 'Active Orders', value: statsData.activeOrders, change: statsData.ordersChange, icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
                { name: 'Total Products', value: statsData.totalProducts, change: statsData.productsChange, icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
                { name: 'Customers', value: statsData.customers, change: statsData.customersChange, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
            ]);

            setRecentTransactions(ordersData.slice(0, 5).map((order: any) => ({
                id: `#${order._id.slice(-6).toUpperCase()}`,
                customer: order.customerName,
                customerId: order.customerId?._id || order.customerId,
                amount: `$${order.total.toLocaleString()}`,
                status: order.status,
                date: new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            })));

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCustomerClick = async (customerId: string) => {
        if (!customerId) return;
        try {
            const res = await fetch(`/api/customers/${customerId}`);
            const data = await res.json();
            setSelectedCustomer(data);
            setIsProfileModalOpen(true);
        } catch (error) {
            console.error('Error fetching customer details:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#d98a6c] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <main className="p-4 md:p-6 lg:p-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <header className="mb-6 md:mb-10">
                    <p className="text-[#c47659] font-medium mb-1">Overview</p>
                    <h1 className="text-3xl md:text-4xl font-light text-gray-800 dark:text-white tracking-tight">Dashboard</h1>
                </header>

                {/* Hero Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative mb-8 md:mb-12 rounded-2xl md:rounded-3xl overflow-hidden h-48 md:h-64 group"
                >
                    <img
                        src="/admin-banner.jpg"
                        alt="Skincare Dashboard"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#d98a6c]/90 via-[#c47659]/70 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-2xl md:text-4xl lg:text-5xl font-light text-white mb-2 md:mb-3 tracking-tight"
                        >
                            Welcome to Your Skincare Hub
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="text-white/90 text-sm md:text-lg font-light max-w-2xl"
                        >
                            Manage your skincare inventory, track orders, and grow your beauty business with ease.
                        </motion.p>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="bg-white dark:bg-[#111111] p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors"
                        >
                            <div className="flex justify-between items-start mb-3 md:mb-4">
                                <div className="p-2 md:p-3 bg-[#fdf2ef] dark:bg-[#2a1e1a] rounded-xl md:rounded-2xl text-[#c47659]">
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                                    </svg>
                                </div>
                                <span className="text-xs md:text-sm font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium mb-1">{stat.name}</p>
                            <p className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white tracking-tight">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Recent Transactions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-white dark:bg-[#111111] rounded-[32px] md:rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors"
                >
                    <div className="p-6 md:p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center transition-colors">
                        <h2 className="text-xl font-medium text-gray-800 dark:text-white">Recent Transactions</h2>
                        <Link href="/admin/orders">
                            <button className="text-[#c47659] font-medium hover:underline decoration-2 underline-offset-4">View All</button>
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        {recentTransactions.length > 0 ? (
                            <>
                                {/* Desktop Table View */}
                                <table className="w-full text-left hidden md:table">
                                    <thead>
                                        <tr className="border-b border-gray-50 dark:border-gray-800 text-gray-400 dark:text-gray-500 text-sm font-medium">
                                            <th className="px-8 py-4 font-medium">Transaction ID</th>
                                            <th className="px-8 py-4 font-medium">Customer</th>
                                            <th className="px-8 py-4 font-medium">Amount</th>
                                            <th className="px-8 py-4 font-medium">Status</th>
                                            <th className="px-8 py-4 font-medium">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600 dark:text-gray-400">
                                        {recentTransactions.map((trx, index) => (
                                            <motion.tr
                                                key={trx.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.6 + (index * 0.1) }}
                                                className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
                                            >
                                                <td className="px-8 py-4 font-medium text-gray-800 dark:text-gray-200">{trx.id}</td>
                                                <td className="px-8 py-4 text-gray-800 dark:text-gray-200">
                                                    <button
                                                        onClick={() => handleCustomerClick(trx.customerId)}
                                                        className="flex items-center gap-3 hover:text-[#d98a6c] transition-colors group/name"
                                                    >
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d98a6c] to-[#c47659] text-white flex items-center justify-center font-bold text-xs shadow-md shadow-[#d98a6c22] group-hover/name:scale-110 transition-transform">
                                                            {trx.customer?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-medium">{trx.customer}</span>
                                                    </button>
                                                </td>
                                                <td className="px-8 py-4 font-semibold text-gray-800 dark:text-gray-200">{trx.amount}</td>
                                                <td className="px-8 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${trx.status === 'Completed' || trx.status === 'Delivered' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                                                        trx.status === 'Processing' || trx.status === 'Pending' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' :
                                                            'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                        }`}>
                                                        {trx.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4 text-gray-400 dark:text-gray-500 text-sm">{trx.date}</td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Mobile Card View */}
                                <div className="md:hidden space-y-4 p-4">
                                    {recentTransactions.map((trx, index) => (
                                        <motion.div
                                            key={trx.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * index }}
                                            className="bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl p-4 border border-gray-100 dark:border-gray-800/50 transition-colors"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Transaction ID</span>
                                                    <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">{trx.id}</p>
                                                </div>
                                                <span className="text-xs text-gray-400 dark:text-gray-500">{trx.date}</span>
                                            </div>

                                            <div className="flex items-center gap-3 mb-4 p-3 bg-white dark:bg-[#111111] rounded-xl border border-gray-100 dark:border-gray-800 transition-colors">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d98a6c] to-[#c47659] text-white flex items-center justify-center font-bold text-xs shadow-md">
                                                    {trx.customer?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate">{trx.customer}</p>
                                                    <button
                                                        onClick={() => handleCustomerClick(trx.customerId)}
                                                        className="text-xs text-[#c47659] font-medium hover:underline"
                                                    >
                                                        View Profile
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center pt-2 border-t border-gray-200/50 dark:border-gray-800">
                                                <div>
                                                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Amount</span>
                                                    <p className="font-bold text-gray-900 dark:text-white">{trx.amount}</p>
                                                </div>
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${trx.status === 'Completed' || trx.status === 'Delivered' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                                    trx.status === 'Processing' || trx.status === 'Pending' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                                                        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                                    }`}>
                                                    {trx.status}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="p-10 text-center text-gray-400">No recent transactions found.</div>
                        )}
                    </div>
                </motion.div>
            </motion.div>

            <CustomerProfileModal
                customer={selectedCustomer}
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </main>
    );
};

export default AdminDashboard;
