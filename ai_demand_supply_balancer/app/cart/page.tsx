'use client';

import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, syncCart } from '@/lib/redux/features/cartSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { items: cartItems } = useSelector((state: RootState) => state.cart);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal > 100 ? 0 : 15;
    const total = subtotal + shipping;

    const handleCheckout = () => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/cart');
            return;
        }
        router.push('/checkout');
    };

    return (
        <div className="min-h-screen bg-[#fffcfb]">
            <Header />

            <div className="pt-40 pb-24 px-6 md:px-12 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-extralight text-[#c47659] mb-16"
                    >
                        Your Bag
                    </motion.h1>

                    {cartItems.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                            {/* Items List */}
                            <div className="lg:col-span-2 space-y-8">
                                <AnimatePresence mode="popLayout">
                                    {cartItems.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex gap-6 p-6 bg-white rounded-3xl shadow-sm border border-gray-50 group hover:shadow-md transition-shadow"
                                        >
                                            <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>

                                            <div className="flex flex-col justify-between flex-grow">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-xl font-light text-gray-800 mb-1">{item.name}</h3>
                                                        <p className="text-[#c47659] font-medium">${item.price.toFixed(2)}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => dispatch(removeFromCart(item.id))}
                                                        className="text-gray-300 hover:text-red-400 transition-colors p-2"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center border border-gray-100 rounded-full bg-gray-50/50 p-1">
                                                        <button
                                                            onClick={() => {
                                                                if (item.quantity > 1) {
                                                                    const newItems = cartItems.map(i =>
                                                                        i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
                                                                    );
                                                                    dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
                                                                    if (isAuthenticated) dispatch(syncCart(newItems));
                                                                }
                                                            }}
                                                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
                                                        <button
                                                            onClick={() => {
                                                                const availableStock = parseInt(item.stock?.toString() || '0', 10);
                                                                if (item.quantity < availableStock) {
                                                                    const newItems = cartItems.map(i =>
                                                                        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                                                                    );
                                                                    dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }));
                                                                    if (isAuthenticated) dispatch(syncCart(newItems));
                                                                }
                                                            }}
                                                            disabled={item.quantity >= parseInt(item.stock?.toString() || '0', 10)}
                                                            className={`w-8 h-8 flex items-center justify-center transition-colors ${item.quantity >= parseInt(item.stock?.toString() || '0', 10) ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-gray-900'}`}
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                    <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Summary Card */}
                            <div className="lg:col-span-1">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-50 sticky top-32"
                                >
                                    <h2 className="text-2xl font-light text-gray-800 mb-8 border-b border-gray-100 pb-4">Order Summary</h2>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between text-gray-500">
                                            <span>Subtotal</span>
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500">
                                            <span>Shipping</span>
                                            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                                        </div>
                                        {shipping > 0 && (
                                            <p className="text-[10px] text-[#c47659] font-bold uppercase tracking-widest">
                                                Add ${(100 - subtotal).toFixed(2)} more for free shipping
                                            </p>
                                        )}
                                        <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                                            <span className="text-xl font-light text-gray-800">Total</span>
                                            <span className="text-3xl font-bold text-[#c47659]">${total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        className="w-full py-5 bg-gray-900 text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 group"
                                    >
                                        Checkout Now
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <div className="mt-8 pt-8 border-t border-gray-50 flex justify-center gap-4 grayscale opacity-30">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-40 bg-white rounded-[3rem] shadow-sm border border-gray-50"
                        >
                            <div className="w-24 h-24 bg-[#fff5f0] rounded-full flex items-center justify-center mx-auto mb-8">
                                <ShoppingBag size={40} className="text-[#d98a6c]" />
                            </div>
                            <h2 className="text-3xl font-light text-gray-800 mb-4">Your bag is empty</h2>
                            <p className="text-gray-400 max-w-xs mx-auto mb-10 font-light">
                                Looks like you haven&apos;t added anything to your ritual yet.
                            </p>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-3 px-10 py-4 bg-[#d98a6c] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#c47659] transition-colors shadow-lg shadow-[#d98a6c33]"
                            >
                                Start Shopping
                            </Link>
                        </motion.div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}


