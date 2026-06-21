'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Package,
    Truck,
    CreditCard,
    Calendar,
    User,
    MapPin,
    ExternalLink,
    Search,
    Filter,
    ArrowUpRight,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

const OrdersPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [filterStatus, setFilterStatus] = useState('All');

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            if (res.ok) {
                setOrders(data.map((o: any) => ({
                    ...o,
                    id: `#${o._id.slice(-6).toUpperCase()}`,
                    displayTotal: `$${o.total.toLocaleString()}`,
                    displayDate: new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    customerEmail: o.customerId?.email || 'N/A',
                    customerIdRaw: o.customerId?._id || o.customerId, // Handle populated or raw ID
                    customerId: o.customerId?._id || o.customerId // Keep for backward compat if needed, but safer to use specific
                })));
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#d98a6c] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <main className="p-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <p className="text-[#c47659] font-medium mb-1">Customer Sales</p>
                        <h1 className="text-4xl font-light text-gray-800 dark:text-white tracking-tight">Orders</h1>
                    </div>
                    <div className="flex gap-4">

                    </div>
                </header>

                <div className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
                    <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setFilterStatus('All')}
                                className={`text-sm font-semibold pb-1 px-2 transition-colors ${filterStatus === 'All' ? 'text-[#c47659] border-b-2 border-[#c47659]' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                            >
                                All Orders
                            </button>
                            <button
                                onClick={() => setFilterStatus('Processing')}
                                className={`text-sm font-medium pb-1 px-2 transition-colors ${filterStatus === 'Processing' ? 'text-[#c47659] border-b-2 border-[#c47659]' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                            >
                                Processing
                            </button>
                            <button
                                onClick={() => setFilterStatus('Completed')}
                                className={`text-sm font-medium pb-1 px-2 transition-colors ${filterStatus === 'Completed' ? 'text-[#c47659] border-b-2 border-[#c47659]' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                            >
                                Completed
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {orders.length > 0 ? (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50 dark:border-gray-800 text-gray-400 dark:text-gray-500 text-sm font-medium">
                                        <th className="px-8 py-4 font-medium">Order ID</th>
                                        <th className="px-8 py-4 font-medium">Customer</th>
                                        <th className="px-8 py-4 font-medium">Date</th>
                                        <th className="px-8 py-4 font-medium">Total</th>
                                        <th className="px-8 py-4 font-medium">Status</th>
                                        <th className="px-8 py-4 text-right font-medium">View</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600 dark:text-gray-400">
                                    {orders
                                        .filter(o => {
                                            const matchesSearch = o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.toLowerCase().includes(searchTerm.toLowerCase());
                                            const matchesFilter = filterStatus === 'All'
                                                ? true
                                                : filterStatus === 'Completed'
                                                    ? (o.status === 'Delivered' || o.status === 'Completed')
                                                    : o.status === filterStatus;
                                            return matchesSearch && matchesFilter;
                                        })
                                        .map((order, index) => (
                                            <motion.tr
                                                key={order._id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
                                            >
                                                <td className="px-8 py-6 font-medium text-gray-800 dark:text-gray-200">{order.id}</td>
                                                <td className="px-8 py-6 font-medium text-gray-800 dark:text-gray-200">{order.customerName}</td>
                                                <td className="px-8 py-6 text-sm text-gray-400 dark:text-gray-500">{order.displayDate}</td>
                                                <td className="px-8 py-6 font-semibold text-gray-800 dark:text-gray-200">{order.displayTotal}</td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                                                        order.status === 'Shipped' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                                                            order.status === 'Processing' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' :
                                                                'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <Link
                                                        href={`/admin/orders/${order._id}`}
                                                        className="p-2 inline-block hover:bg-white dark:hover:bg-[#222] rounded-lg border border-transparent hover:border-gray-100 dark:hover:border-gray-800 transition-all group"
                                                    >
                                                        <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-[#c47659] transition-colors" />
                                                    </Link>
                                                </td>
                                            </motion.tr>
                                        ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-10 text-center text-gray-400">No orders found in the database.</div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Order Detail Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedOrder(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-[#111111] w-full max-w-4xl max-h-[90vh] rounded-[40px] overflow-hidden shadow-2xl relative z-10 border border-gray-100 dark:border-gray-800 flex flex-col transition-colors"
                        >
                            {/* Modal Header */}
                            <header className="p-8 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1a1a1a] flex justify-between items-center transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white dark:bg-[#222] rounded-2xl flex items-center justify-center text-[#d98a6c] shadow-sm">
                                        <Package size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{selectedOrder.id}</h2>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${selectedOrder.status === 'Delivered' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                                selectedOrder.status === 'Shipped' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                                    'bg-[#fdf2ef] dark:bg-[#2a1e1a] text-[#c47659]'
                                                }`}>
                                                {selectedOrder.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">Placed on {selectedOrder.displayDate}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-3 hover:bg-white dark:hover:bg-[#222] rounded-2xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-800"
                                >
                                    <X size={24} />
                                </button>
                            </header>

                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Left Column: Order Items */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            Order Items
                                            <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-[#222] px-2 py-0.5 rounded-full">
                                                {selectedOrder.items?.length || 0}
                                            </span>
                                        </h3>
                                        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm transition-colors">
                                            <table className="w-full text-left">
                                                <thead className="bg-gray-50/50 dark:bg-[#222] border-b border-gray-50 dark:border-gray-800">
                                                    <tr>
                                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Product</th>
                                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 text-center">Qty</th>
                                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 text-right">Unit</th>
                                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 text-right">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                                    {selectedOrder.items?.map((item: any, i: number) => (
                                                        <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-[#222] transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-12 h-12 bg-gray-100 dark:bg-[#222] rounded-xl overflow-hidden border border-gray-50 dark:border-gray-800">
                                                                        {item.image && (
                                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                                        )}
                                                                    </div>
                                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</p>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-center text-sm font-medium text-gray-600 dark:text-gray-400">x{item.quantity}</td>
                                                            <td className="px-6 py-4 text-right text-sm text-gray-400 dark:text-gray-500">${item.price.toFixed(2)}</td>
                                                            <td className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Financial Breakdown */}
                                        <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                                            <ArrowUpRight className="absolute -top-4 -right-4 w-32 h-32 text-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                            <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Subtotal</p>
                                                    <p className="text-xl font-light">${(selectedOrder.total * 0.92).toFixed(2)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Tax (8%)</p>
                                                    <p className="text-xl font-light">${(selectedOrder.total * 0.08).toFixed(2)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Shipping</p>
                                                    <p className="text-xl font-light">Free</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-[#d98a6c] uppercase tracking-widest mb-1">Order Total</p>
                                                    <p className="text-3xl font-light text-[#d98a6c]">{selectedOrder.displayTotal}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Customer & Shipping */}
                                    <div className="space-y-6">
                                        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm transition-colors">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                                <User size={18} className="text-[#d98a6c]" />
                                                Customer Info
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="p-4 bg-gray-50 dark:bg-[#222] rounded-2xl transition-colors">
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mb-1">Full Name</p>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedOrder.customerName}</p>
                                                </div>
                                                <div className="p-4 bg-gray-50 dark:bg-[#222] rounded-2xl transition-colors">
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mb-1">Email Address</p>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedOrder.customerEmail || 'N/A'}</p>
                                                </div>
                                                <div className="p-4 bg-gray-50 dark:bg-[#222] rounded-2xl transition-colors">
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mb-1">Phone Number</p>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedOrder.shippingAddress?.phone || selectedOrder.phone || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm transition-colors">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                                <MapPin size={18} className="text-[#d98a6c]" />
                                                Shipping Address
                                            </h3>
                                            <div className="p-5 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50/30 dark:bg-[#222]">
                                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                                    {selectedOrder.shippingAddress?.address || 'No Address Provided'}<br />
                                                    {selectedOrder.shippingAddress?.city}{selectedOrder.shippingAddress?.city && selectedOrder.shippingAddress?.postalCode ? ', ' : ''} {selectedOrder.shippingAddress?.postalCode}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm transition-colors">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                                <CreditCard size={18} className="text-[#d98a6c]" />
                                                Payment Detail
                                            </h3>
                                            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-[#222] rounded-2xl mb-4 transition-colors">
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{selectedOrder.paymentMethod || 'Credit Card'}</p>
                                                <span className="text-[10px] font-black text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-lg uppercase tracking-widest">
                                                    {selectedOrder.paymentStatus || 'Paid'}
                                                </span>
                                            </div>

                                            {selectedOrder.status !== 'Delivered' && (
                                                <div className="space-y-4">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Update Order Life-cycle</p>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <button
                                                            disabled={updatingStatus}
                                                            onClick={async () => {
                                                                setUpdatingStatus(true);
                                                                try {
                                                                    const res = await fetch(`/api/orders/${selectedOrder._id}`, {
                                                                        method: 'PATCH',
                                                                        body: JSON.stringify({ status: 'Delivered' })
                                                                    });
                                                                    if (res.ok) {
                                                                        await fetchOrders();
                                                                        setSelectedOrder(null);
                                                                        alert('Order completed and invoice generated!');
                                                                    }
                                                                } finally {
                                                                    setUpdatingStatus(false);
                                                                }
                                                            }}
                                                            className="py-3.5 bg-[#d98a6c] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#d98a6c22] hover:bg-[#c47659] transition-all disabled:opacity-50"
                                                        >
                                                            {updatingStatus ? 'Processing...' : 'Mark Delivered'}
                                                        </button>
                                                        <button
                                                            disabled={updatingStatus}
                                                            onClick={async () => {
                                                                setUpdatingStatus(true);
                                                                try {
                                                                    const res = await fetch(`/api/orders/${selectedOrder._id}`, {
                                                                        method: 'PATCH',
                                                                        body: JSON.stringify({ status: 'Cancelled' })
                                                                    });
                                                                    if (res.ok) {
                                                                        await fetchOrders();
                                                                        setSelectedOrder(null);
                                                                    }
                                                                } finally {
                                                                    setUpdatingStatus(false);
                                                                }
                                                            }}
                                                            className="py-3.5 bg-gray-50 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-50"
                                                        >
                                                            Cancel Order
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedOrder.status === 'Delivered' && (
                                                <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
                                                    <CheckCircle2 size={18} className="text-green-600" />
                                                    <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Order Completed & Invoiced</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
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
                    background: #eee;
                    border-radius: 10px;
                }
            `}</style>
        </main>
    );
};

export default OrdersPage;
