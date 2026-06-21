'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { logout } from '@/lib/redux/features/authSlice';
import { motion } from 'framer-motion';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer';
import { User, Mail, Shield, LogOut, Package, Heart, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
    const { user, isAuthenticated, isAuthChecking } = useSelector((state: RootState) => state.auth);
    const wishlistItems = useSelector((state: RootState) => state.favorites.items);
    const dispatch = useDispatch();
    const router = useRouter();
    const [orderCount, setOrderCount] = useState(0);

    const [orders, setOrders] = useState<any[]>([]);
    const [showOrders, setShowOrders] = useState(false);

    useEffect(() => {
        if (isAuthChecking) return; // Wait for auth check

        if (!isAuthenticated) {
            router.push('/login');
        } else if (user) {
            // Fetch real orders
            fetch(`/api/orders?customerId=${user.id}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setOrders(data);
                        setOrderCount(data.length);
                    }
                })
                .catch(err => console.error('Error fetching orders:', err));
        }
    }, [isAuthenticated, isAuthChecking, router, user]);

    if (isAuthChecking || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fffcfb]">
                <div className="w-12 h-12 border-4 border-[#d98a6c] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    };

    const stats = [
        { label: 'Orders', value: orderCount.toString(), icon: Package, onClick: () => setShowOrders(!showOrders) },
        { label: 'Wishlist', value: wishlistItems.length.toString(), icon: Heart, link: '/favorites' },
    ];

    return (
        <div className="min-h-screen bg-[#fffcfb]">
            <Header />

            <div className="pt-24 md:pt-40 pb-12 md:pb-24 px-4 md:px-12 lg:px-24">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl md:rounded-[3rem] shadow-sm border border-gray-50 overflow-hidden"
                    >
                        {/* Profile Header */}
                        <div className="bg-gradient-to-r from-[#fdf6f2] to-[#fffcfb] p-6 md:p-12 lg:p-16 text-center border-b border-gray-50">
                            <div className="w-20 h-20 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-xl border-4 border-white">
                                <User size={40} className="md:hidden text-[#d98a6c]" strokeWidth={1} />
                                <User size={64} className="hidden md:block text-[#d98a6c]" strokeWidth={1} />
                            </div>
                            <h1 className="text-2xl md:text-4xl font-light text-gray-800 mb-2">{user.name}</h1>
                            <p className="text-[#c47659] font-medium uppercase tracking-widest text-[10px] md:text-xs">{user.role}</p>
                        </div>

                        {/* Profile Details */}
                        <div className="p-6 md:p-12 lg:p-16 space-y-8 md:space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Account Information</h2>

                                    <div className="flex items-center gap-4 text-gray-600">
                                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-[#d98a6c]">
                                            <Mail size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</p>
                                            <p className="text-gray-800">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-gray-600">
                                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-[#d98a6c]">
                                            <Shield size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Account Status</p>
                                            <p className="text-gray-800">Verified Member</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4 md:mb-6">Activity Overview</h2>
                                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                                        {stats.map((stat) => {
                                            const CardContent = (
                                                <div className="p-4 md:p-6 bg-gray-50/50 rounded-2xl md:rounded-3xl border border-gray-100 hover:border-[#d98a6c] transition-colors cursor-pointer group">
                                                    <stat.icon size={18} className="md:hidden text-[#d98a6c] mb-2 group-hover:scale-110 transition-transform" />
                                                    <stat.icon size={20} className="hidden md:block text-[#d98a6c] mb-3 group-hover:scale-110 transition-transform" />
                                                    <p className="text-xl md:text-2xl font-light text-gray-800">{stat.value}</p>
                                                    <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">{stat.label}</p>
                                                </div>
                                            );

                                            if (stat.link) {
                                                return (
                                                    <Link key={stat.label} href={stat.link}>
                                                        {CardContent}
                                                    </Link>
                                                );
                                            }

                                            return (
                                                <div key={stat.label} onClick={stat.onClick}>
                                                    {CardContent}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Orders List */}
                                    {showOrders && orders.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-6 space-y-4"
                                        >
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Recent Orders</h3>
                                            {orders.slice(0, 5).map((order) => {
                                                const getStatusColor = (status: string) => {
                                                    switch (status) {
                                                        case 'Processing': return 'bg-blue-50 text-blue-600 border-blue-100';
                                                        case 'Shipped': return 'bg-purple-50 text-purple-600 border-purple-100';
                                                        case 'Delivered': return 'bg-green-50 text-green-600 border-green-100';
                                                        case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
                                                        default: return 'bg-gray-50 text-gray-600 border-gray-100';
                                                    }
                                                };

                                                const getStatusProgress = (status: string) => {
                                                    switch (status) {
                                                        case 'Processing': return 33;
                                                        case 'Shipped': return 66;
                                                        case 'Delivered': return 100;
                                                        default: return 0;
                                                    }
                                                };

                                                return (
                                                    <div key={order._id} className="p-4 md:p-5 bg-white rounded-2xl border border-gray-100 hover:border-[#d98a6c] transition-all hover:shadow-md">
                                                        {/* Order Header */}
                                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                                                            <div>
                                                                <p className="font-bold text-gray-800 text-base md:text-lg">#{order._id.slice(-6).toUpperCase()}</p>
                                                                <p className="text-xs text-gray-400 mt-1">{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                            </div>
                                                            <div className="text-left sm:text-right">
                                                                <p className="font-bold text-[#c47659] text-lg md:text-xl">${order.total.toFixed(2)}</p>
                                                                <span className={`inline-block px-2.5 md:px-3 py-1 rounded-full text-xs font-semibold mt-2 border ${getStatusColor(order.status)}`}>
                                                                    {order.status}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Progress Bar */}
                                                        {order.status !== 'Cancelled' && (
                                                            <div className="mb-4">
                                                                <div className="flex justify-between text-[10px] md:text-xs text-gray-400 mb-2">
                                                                    <span className={order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered' ? 'text-[#d98a6c] font-semibold' : ''}>Processing</span>
                                                                    <span className={order.status === 'Shipped' || order.status === 'Delivered' ? 'text-[#d98a6c] font-semibold' : ''}>Shipped</span>
                                                                    <span className={order.status === 'Delivered' ? 'text-[#d98a6c] font-semibold' : ''}>Delivered</span>
                                                                </div>
                                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-gradient-to-r from-[#d98a6c] to-[#c47659] transition-all duration-500"
                                                                        style={{ width: `${getStatusProgress(order.status)}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Order Items */}
                                                        {order.items && order.items.length > 0 && (
                                                            <div className="pt-3 md:pt-4 border-t border-gray-50">
                                                                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 md:mb-3">Items ({order.items.length})</p>
                                                                <div className="space-y-2">
                                                                    {order.items.slice(0, 2).map((item: any, idx: number) => (
                                                                        <div key={idx} className="flex items-center gap-2 md:gap-3">
                                                                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-lg md:rounded-xl overflow-hidden flex-shrink-0">
                                                                                {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="text-xs md:text-sm font-medium text-gray-800 truncate">{item.name}</p>
                                                                                <p className="text-[10px] md:text-xs text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                    {order.items.length > 2 && (
                                                                        <p className="text-[10px] md:text-xs text-gray-400 italic">+{order.items.length - 2} more items</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Delivery Info */}
                                                        {order.shippingAddress && (
                                                            <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-50 flex items-start gap-2 md:gap-3">
                                                                <Truck size={14} className="md:hidden text-[#d98a6c] mt-0.5 flex-shrink-0" />
                                                                <Truck size={16} className="hidden md:block text-[#d98a6c] mt-0.5 flex-shrink-0" />
                                                                <div className="min-w-0">
                                                                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Delivery Address</p>
                                                                    <p className="text-xs md:text-sm text-gray-600 break-words">{order.shippingAddress.address}</p>
                                                                    <p className="text-xs md:text-sm text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-12 border-t border-gray-50 flex justify-center">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#d98a6c] to-[#c47659] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-[#d98a6c33] hover:shadow-xl hover:shadow-[#d98a6c44]"
                                >
                                    <LogOut size={18} />
                                    Logout of account
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
