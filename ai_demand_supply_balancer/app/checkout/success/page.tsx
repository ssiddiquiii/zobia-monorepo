'use client';

import { motion } from 'framer-motion';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer';
import { CheckCircle, Package, Home, User } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-[#fffcfb]">
            <Header />

            <div className="pt-40 pb-24 px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.6 }}
                        className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8"
                    >
                        <CheckCircle className="text-green-500" size={64} />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-6xl font-extralight text-gray-800 mb-4"
                    >
                        Order Placed!
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl text-gray-500 mb-12 font-light"
                    >
                        Thank you for your order. We'll deliver it to your doorstep soon!
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-12"
                    >
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <Package className="text-[#d98a6c]" size={32} />
                            <h2 className="text-2xl font-light text-gray-800">What's Next?</h2>
                        </div>

                        <div className="space-y-4 text-left max-w-md mx-auto">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-[#fdf2ef] rounded-full flex items-center justify-center flex-shrink-0 text-[#c47659] font-bold">
                                    1
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Order Confirmation</h3>
                                    <p className="text-sm text-gray-500">You'll receive a confirmation call shortly</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-[#fdf2ef] rounded-full flex items-center justify-center flex-shrink-0 text-[#c47659] font-bold">
                                    2
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Processing</h3>
                                    <p className="text-sm text-gray-500">We'll carefully pack your order</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-[#fdf2ef] rounded-full flex items-center justify-center flex-shrink-0 text-[#c47659] font-bold">
                                    3
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Delivery</h3>
                                    <p className="text-sm text-gray-500">Estimated delivery in 3-5 business days</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-[#fdf2ef] rounded-full flex items-center justify-center flex-shrink-0 text-[#c47659] font-bold">
                                    4
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Payment</h3>
                                    <p className="text-sm text-gray-500">Pay cash when you receive your order</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link
                            href="/profile"
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#d98a6c] text-white rounded-full hover:bg-[#c47659] transition-all shadow-lg"
                        >
                            <User size={20} />
                            View My Orders
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-700 rounded-full hover:bg-gray-50 transition-all border border-gray-200"
                        >
                            <Home size={20} />
                            Back to Home
                        </Link>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
