'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import {
    X,
    Package,
    Truck,
    CreditCard,
    Calendar,
    User,
    MapPin,
    ArrowUpRight,
    CheckCircle2,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders/${id}`);
            const data = await res.json();
            if (res.ok) {
                setOrder({
                    ...data,
                    displayId: `#${data._id.slice(-6).toUpperCase()}`,
                    displayTotal: `$${data.total.toLocaleString()}`,
                    displayDate: new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    customerEmail: data.customerId?.email || 'N/A'
                });
            } else {
                console.error('Order not found');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#d98a6c] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-medium">
                    Order not found
                </div>
                <Link href="/admin/orders" className="text-[#c47659] hover:underline flex items-center gap-2">
                    <ArrowLeft size={16} /> Back to Orders
                </Link>
            </div>
        );
    }

    return (
        <main className="p-6 md:p-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <Link href="/admin/orders" className="text-[#c47659] hover:underline flex items-center gap-2 text-sm font-medium mb-4">
                            <ArrowLeft size={16} /> Back to Orders
                        </Link>
                        <div className="flex items-center gap-4">
                            <h1 className="text-4xl font-light text-gray-800 dark:text-white tracking-tight">Order Details</h1>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                order.status === 'Shipped' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                    'bg-[#fdf2ef] dark:bg-[#2a1e1a] text-[#c47659]'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-gray-400 dark:text-gray-500 mt-2 font-medium">
                            {order.displayId} — Placed on {order.displayDate}
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Order Items */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-[#111111] rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
                            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-[#1a1a1a]">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    Order Items
                                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-[#222] px-2 py-0.5 rounded-full">
                                        {order.items?.length || 0}
                                    </span>
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50 dark:bg-[#222] border-b border-gray-50 dark:border-gray-800">
                                        <tr>
                                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Product</th>
                                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 text-center">Qty</th>
                                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 text-right">Unit</th>
                                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800 transition-colors">
                                        {order.items?.map((item: any, i: number) => (
                                            <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-[#1a1a1a] transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-14 h-14 bg-gray-100 dark:bg-[#222] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
                                                            {item.image && (
                                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Category: {item.category || 'General'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-center text-sm font-medium text-gray-600 dark:text-gray-400">x{item.quantity}</td>
                                                <td className="px-8 py-6 text-right text-sm text-gray-400 dark:text-gray-500 font-medium">${item.price.toLocaleString()}</td>
                                                <td className="px-8 py-6 text-right text-sm font-bold text-gray-900 dark:text-white">${(item.price * item.quantity).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Financial Breakdown */}
                        <div className="bg-gray-900 rounded-[40px] p-10 text-white relative overflow-hidden group shadow-xl">
                            <ArrowUpRight className="absolute -top-10 -right-10 w-48 h-48 text-white/5 opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Subtotal</p>
                                    <p className="text-2xl font-light">${(order.total * 0.92).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Tax (8.0%)</p>
                                    <p className="text-2xl font-light">${(order.total * 0.08).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Shipping Fee</p>
                                    <p className="text-2xl font-light">Free</p>
                                </div>
                                <div className="text-right sm:text-left lg:text-right">
                                    <p className="text-[10px] font-bold text-[#d98a6c] uppercase tracking-widest mb-1.5">Total Amount</p>
                                    <p className="text-4xl font-light text-[#d98a6c] mb-1">{order.displayTotal}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center justify-end gap-2">
                                        <CheckCircle2 size={12} className={order.paymentStatus === 'Paid' ? "text-green-500" : "text-yellow-500"} />
                                        {order.paymentStatus === 'Paid' ? 'Payment Verified' : 'Payment Pending'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Information & Actions */}
                    <div className="space-y-8">
                        <section className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 rounded-[40px] p-8 shadow-sm transition-colors">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                                <div className="p-2 bg-[#fdf2ef] dark:bg-[#2a1e1a] rounded-xl text-[#d98a6c]">
                                    <User size={18} />
                                </div>
                                Customer Profile
                            </h3>
                            <div className="space-y-4">
                                <div className="p-5 bg-gray-50 dark:bg-[#1a1a1a] rounded-3xl transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mb-1">Full Name</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{order.customerName}</p>
                                </div>
                                <div className="p-5 bg-gray-50 dark:bg-[#1a1a1a] rounded-3xl transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mb-1">Email Address</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{order.customerEmail || 'N/A'}</p>
                                </div>
                                <div className="p-5 bg-gray-50 dark:bg-[#1a1a1a] rounded-3xl transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mb-1">Contact Number</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{order.shippingAddress?.phone || order.phone || 'N/A'}</p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 rounded-[40px] p-8 shadow-sm transition-colors">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                                <div className="p-2 bg-[#fdf2ef] dark:bg-[#2a1e1a] rounded-xl text-[#d98a6c]">
                                    <MapPin size={18} />
                                </div>
                                Logistics Details
                            </h3>
                            <div className="p-6 bg-[#fdf2ef]/20 dark:bg-[#222]/50 border border-dashed border-[#d98a6c]/30 rounded-3xl">
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-loose font-medium">
                                    {order.shippingAddress?.address || 'No Address Provided'}<br />
                                    {order.shippingAddress?.city}{order.shippingAddress?.city && order.shippingAddress?.postalCode ? ', ' : ''} {order.shippingAddress?.postalCode}
                                </p>
                            </div>
                        </section>

                        <section className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 rounded-[40px] p-8 shadow-sm transition-colors">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                                <div className="p-2 bg-[#fdf2ef] dark:bg-[#2a1e1a] rounded-xl text-[#d98a6c]">
                                    <CreditCard size={18} />
                                </div>
                                Execution Center
                            </h3>

                            <div className="flex justify-between items-center p-5 bg-gray-50 dark:bg-[#1a1a1a] rounded-3xl mb-8 transition-colors">
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{order.paymentMethod || 'COD'}</p>
                                <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border ${order.paymentStatus === 'Paid'
                                    ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/40 border-green-100 dark:border-green-900/50'
                                    : order.paymentStatus === 'Failed'
                                        ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/40 border-red-100 dark:border-red-900/50'
                                        : 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/40 border-yellow-100 dark:border-yellow-900/50'
                                    }`}>
                                    {order.paymentStatus === 'Paid' ? 'Paid (Completed)' : (order.paymentStatus || 'Pending')}
                                </span>
                            </div>

                            {order.status !== 'Delivered' && (
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2">Lifecycle Management</p>
                                    <div className="grid grid-cols-1 gap-4">
                                        <button
                                            disabled={updatingStatus}
                                            onClick={async () => {
                                                setUpdatingStatus(true);
                                                try {
                                                    const res = await fetch(`/api/orders/${order._id}`, {
                                                        method: 'PATCH',
                                                        body: JSON.stringify({ status: 'Delivered' })
                                                    });
                                                    if (res.ok) {
                                                        await fetchOrder();
                                                        alert('Order completed successfully!');
                                                    }
                                                } finally {
                                                    setUpdatingStatus(false);
                                                }
                                            }}
                                            className="w-full py-5 bg-[#d98a6c] text-white rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#d98a6c33] hover:bg-[#c47659] hover:translate-y-[-2px] active:translate-y-[0] transition-all disabled:opacity-50"
                                        >
                                            {updatingStatus ? 'Communicating...' : 'Verify & Mark Delivered'}
                                        </button>
                                        <button
                                            disabled={updatingStatus}
                                            onClick={async () => {
                                                setUpdatingStatus(true);
                                                try {
                                                    const res = await fetch(`/api/orders/${order._id}`, {
                                                        method: 'PATCH',
                                                        body: JSON.stringify({ status: 'Cancelled' })
                                                    });
                                                    if (res.ok) {
                                                        await fetchOrder();
                                                    }
                                                } finally {
                                                    setUpdatingStatus(false);
                                                }
                                            }}
                                            className="w-full py-5 bg-gray-50 dark:bg-[#222] text-gray-400 dark:text-gray-500 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-all disabled:opacity-50"
                                        >
                                            Terminate Order
                                        </button>
                                    </div>
                                </div>
                            )}

                            {order.status === 'Delivered' && (
                                <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-[32px] border border-green-100 dark:border-green-900/50 flex items-center justify-center gap-3 text-green-600 dark:text-green-400">
                                    <CheckCircle2 size={24} />
                                    <p className="text-xs font-black uppercase tracking-widest">Order Life-cycle Finished</p>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
