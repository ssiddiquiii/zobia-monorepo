'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreVertical, Mail, Phone, Calendar } from 'lucide-react';
import CustomerProfileModal from '@/app/components/Admin/CustomerProfileModal';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch('/api/customers');
                const data = await res.json();
                setCustomers(data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="p-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <p className="text-[#c47659] font-medium mb-1">Overview</p>
                        <h1 className="text-4xl font-light text-gray-800 dark:text-white tracking-tight">Customers</h1>
                    </div>
                </header>

                {/* Filters & Search */}
                <div className="bg-white dark:bg-[#111111] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4 mb-8 transition-colors">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search customers by name or email..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-transparent focus:bg-white dark:focus:bg-[#222] focus:border-[#d98a6c]/30 outline-none transition-all text-gray-800 dark:text-gray-200 placeholder-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-[#222] transition-colors">
                            <Filter size={18} />
                            <span>Filters</span>
                        </button>
                    </div>
                </div>

                {/* Customers Table */}
                <div className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-[#1a1a1a] border-b border-gray-100 dark:border-gray-800 transition-colors">
                                    <th className="px-8 py-5 text-gray-500 dark:text-gray-400 font-medium text-sm">Customer</th>
                                    <th className="px-8 py-5 text-gray-500 dark:text-gray-400 font-medium text-sm">Contact Info</th>
                                    <th className="px-8 py-5 text-gray-500 dark:text-gray-400 font-medium text-sm">Orders</th>
                                    <th className="px-8 py-5 text-gray-500 dark:text-gray-400 font-medium text-sm">Total Spent</th>
                                    <th className="px-8 py-5 text-gray-500 dark:text-gray-400 font-medium text-sm">Status</th>
                                    <th className="px-8 py-5 text-gray-500 dark:text-gray-400 font-medium text-sm">Joined</th>
                                    <th className="px-8 py-5 text-gray-500 dark:text-gray-400 font-medium text-sm"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-8 py-10 text-center text-gray-500 dark:text-gray-400">
                                            Loading customers...
                                        </td>
                                    </tr>
                                ) : filteredCustomers.length > 0 ? (
                                    filteredCustomers.map((customer, index) => (
                                        <motion.tr
                                            key={customer._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group hover:bg-[#fdf2ef]/10 dark:hover:bg-[#1a1a1a] transition-colors"
                                        >
                                            <td className="px-8 py-5">
                                                <button
                                                    onClick={() => { setSelectedCustomer(customer); setIsProfileModalOpen(true); }}
                                                    className="flex items-center gap-4 text-left hover:text-[#d98a6c] transition-colors group/name"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d98a6c] to-[#c47659] text-white flex items-center justify-center font-bold shadow-md shadow-[#d98a6c22] group-hover/name:scale-110 transition-transform">
                                                        {customer.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800 dark:text-gray-200 group-hover/name:text-[#d98a6c]">{customer.name}</p>
                                                        <p className="text-xs text-gray-400 dark:text-gray-500">ID: #{customer._id.slice(-6).toUpperCase()}</p>
                                                    </div>
                                                </button>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                        <Mail size={14} className="text-[#c47659]" />
                                                        {customer.email || 'No email'}
                                                    </div>
                                                    {customer.phone && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                            <Phone size={14} className="text-gray-400 dark:text-gray-500" />
                                                            {customer.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-gray-600 dark:text-gray-400 font-medium">
                                                {customer.totalOrders} orders
                                            </td>
                                            <td className="px-8 py-5 font-semibold text-gray-800 dark:text-gray-200">
                                                ${customer.totalSpent?.toLocaleString() || '0'}
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${customer.status === 'active'
                                                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800'
                                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700'
                                                    }`}>
                                                    {customer.status ? customer.status.charAt(0).toUpperCase() + customer.status.slice(1) : 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-gray-500 dark:text-gray-400 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    {new Date(customer.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button className="p-2 text-gray-400 hover:text-[#c47659] hover:bg-orange-50 dark:hover:bg-[#2a1e1a] rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-8 py-12 text-center text-gray-400">
                                            No customers found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            <CustomerProfileModal
                customer={selectedCustomer}
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </main>
    );
}
