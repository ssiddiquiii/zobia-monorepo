'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Calendar, ShoppingBag, DollarSign, User } from 'lucide-react';

interface Customer {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    totalOrders: number;
    totalSpent: number;
    status: string;
    createdAt: string;
}

interface CustomerProfileModalProps {
    customer: Customer | null;
    isOpen: boolean;
    onClose: () => void;
}

const CustomerProfileModal = ({ customer, isOpen, onClose }: CustomerProfileModalProps) => {
    if (!customer) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors"
                    >
                        {/* Header/Banner */}
                        <div className="h-32 bg-gradient-to-r from-[#d98a6c] to-[#c47659] relative">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all z-10"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Profile Info */}
                        <div className="px-8 pb-10 -mt-12 relative">
                            <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
                                <div className="w-24 h-24 rounded-full bg-white dark:bg-[#1a1a1a] p-1 shadow-xl transition-colors">
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#fdf2ef] to-[#f7e4de] dark:from-[#2a1e1a] dark:to-[#3a2e2a] flex items-center justify-center text-[#c47659] text-3xl font-bold border-2 border-white dark:border-[#1a1a1a]">
                                        {customer.name?.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-3xl font-light text-gray-800 dark:text-white tracking-tight mb-1">{customer.name}</h2>
                                    <p className="text-gray-400 dark:text-gray-500 text-sm font-medium tracking-wider">CUSTOMER ID: #{customer._id.slice(-6).toUpperCase()}</p>
                                </div>
                                <div className="absolute top-2 right-0 hidden md:block">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest ${customer.status === 'active'
                                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30'
                                        : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700'
                                        }`}>
                                        {customer.status || 'Active'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Contact Details */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Contact Information</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 group">
                                            <div className="p-3 bg-gray-50 dark:bg-[#2a1e1a] rounded-2xl text-[#d98a6c] group-hover:bg-[#fdf2ef] dark:group-hover:bg-[#3a2e2a] transition-colors">
                                                <Mail size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Email Address</p>
                                                <p className="text-gray-800 dark:text-gray-200 font-medium">{customer.email || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 group">
                                            <div className="p-3 bg-gray-50 dark:bg-[#2a1e1a] rounded-2xl text-[#d98a6c] group-hover:bg-[#fdf2ef] dark:group-hover:bg-[#3a2e2a] transition-colors">
                                                <Phone size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Phone Number</p>
                                                <p className="text-gray-800 dark:text-gray-200 font-medium">{customer.phone || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 group">
                                            <div className="p-3 bg-gray-50 dark:bg-[#2a1e1a] rounded-2xl text-[#d98a6c] group-hover:bg-[#fdf2ef] dark:group-hover:bg-[#3a2e2a] transition-colors">
                                                <Calendar size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Joined Date</p>
                                                <p className="text-gray-800 dark:text-gray-200 font-medium">{new Date(customer.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Stats */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Performance Overview</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="bg-[#fdf2ef]/50 dark:bg-[#2a1e1a] p-6 rounded-3xl border border-[#fdf2ef] dark:border-[#3a2e2a] flex justify-between items-center transition-all hover:shadow-md">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white dark:bg-[#1a1a1a] rounded-2xl text-[#c47659] shadow-sm">
                                                    <ShoppingBag size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Total Orders</p>
                                                    <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 tracking-tight">{customer.totalOrders}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-[#fdf2ef]/50 dark:bg-[#2a1e1a] p-6 rounded-3xl border border-[#fdf2ef] dark:border-[#3a2e2a] flex justify-between items-center transition-all hover:shadow-md">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white dark:bg-[#1a1a1a] rounded-2xl text-[#c47659] shadow-sm">
                                                    <DollarSign size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Total Spent</p>
                                                    <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 tracking-tight">${customer.totalSpent?.toLocaleString() || '0'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="mt-10 pt-8 border-t border-gray-50 dark:border-gray-800 flex justify-end gap-3 transition-colors">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                                >
                                    Close
                                </button>
                                <button className="px-8 py-3 bg-[#d98a6c] text-white font-medium rounded-2xl hover:bg-[#c47659] transition-all shadow-lg shadow-[#d98a6c33]">
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CustomerProfileModal;
