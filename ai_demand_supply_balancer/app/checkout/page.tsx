'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { clearCart } from '@/lib/redux/features/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer';
import { ArrowLeft, ArrowRight, CheckCircle, Package, CreditCard, Truck, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
    const { items: cartItems } = useSelector((state: RootState) => state.cart);
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: '',
        address: '',
        city: '',
        postalCode: ''
    });

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal > 100 ? 0 : 15;
    const total = subtotal + shipping;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateStep1 = () => {
        return formData.name && formData.phone && formData.address && formData.city && formData.postalCode;
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        try {
            const orderData = {
                customerId: user?.id,
                customerName: formData.name,
                phone: formData.phone,
                shippingAddress: {
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode
                },
                total,
                items: cartItems.map(item => ({
                    productId: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    image: item.image
                })),
                paymentMethod: 'COD',
                status: 'Processing'
            };

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to place order');
            }

            // Success
            dispatch(clearCart());
            router.push('/checkout/success');
        } catch (error: any) {
            console.error('Checkout error:', error);
            alert(error.message || 'Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#fffcfb]">
                <Header />
                <div className="pt-40 pb-24 px-6 text-center">
                    <Package size={64} className="mx-auto text-gray-300 mb-6" />
                    <h1 className="text-4xl font-light text-gray-800 mb-4">Your cart is empty</h1>
                    <Link href="/products" className="inline-block px-8 py-3 bg-[#d98a6c] text-white rounded-full hover:bg-[#c47659] transition-colors">
                        Continue Shopping
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fffcfb]">
            <Header />

            <div className="pt-24 md:pt-40 pb-12 md:pb-24 px-4 md:px-12 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl lg:text-7xl font-extralight text-[#c47659] mb-4"
                    >
                        Checkout
                    </motion.h1>

                    {/* Progress Steps */}
                    <div className="flex items-center gap-2 md:gap-4 mb-12 md:mb-16 overflow-x-auto pb-2">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all ${step >= s ? 'bg-[#d98a6c] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    {s}
                                </div>
                                {s < 3 && <div className={`h-0.5 w-12 md:w-16 ${step > s ? 'bg-[#d98a6c]' : 'bg-gray-200'}`} />}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <AnimatePresence mode="wait">
                                {/* Step 1: Customer Information */}
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
                                    >
                                        <div className="flex items-center gap-3 mb-6 md:mb-8">
                                            <Truck className="text-[#d98a6c]" size={24} />
                                            <h2 className="text-2xl md:text-3xl font-light text-gray-800">Delivery Information</h2>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#d98a6c] focus:ring-2 focus:ring-[#d98a6c]/20 outline-none transition-all text-gray-900"
                                                    placeholder="John Doe"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#d98a6c] focus:ring-2 focus:ring-[#d98a6c]/20 outline-none transition-all text-gray-900"
                                                    placeholder="+92 300 1234567"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#d98a6c] focus:ring-2 focus:ring-[#d98a6c]/20 outline-none transition-all text-gray-900"
                                                    placeholder="House # 123, Street ABC"
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl border border-gray-200 focus:border-[#d98a6c] focus:ring-2 focus:ring-[#d98a6c]/20 outline-none transition-all text-base text-gray-900"
                                                        placeholder="Karachi"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                                                    <input
                                                        type="text"
                                                        name="postalCode"
                                                        value={formData.postalCode}
                                                        onChange={handleInputChange}
                                                        className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#d98a6c] focus:ring-2 focus:ring-[#d98a6c]/20 outline-none transition-all text-gray-900"
                                                        placeholder="75500"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 md:mt-10">
                                            <Link href="/cart" className="flex items-center justify-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors order-2 sm:order-1">
                                                <ArrowLeft size={18} />
                                                Back to Cart
                                            </Link>
                                            <button
                                                onClick={() => validateStep1() && setStep(2)}
                                                disabled={!validateStep1()}
                                                className="flex items-center justify-center gap-2 px-8 py-4 bg-[#d98a6c] text-white rounded-full hover:bg-[#c47659] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg order-1 sm:order-2"
                                            >
                                                Continue
                                                <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 2: Payment Method */}
                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
                                    >
                                        <div className="flex items-center gap-3 mb-6 md:mb-8">
                                            <CreditCard className="text-[#d98a6c]" size={24} />
                                            <h2 className="text-2xl md:text-3xl font-light text-gray-800">Payment Method</h2>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="border-2 border-[#d98a6c] rounded-2xl p-6 bg-[#fdf2ef]">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-[#d98a6c] rounded-full flex items-center justify-center">
                                                            <Package className="text-white" size={24} />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-800 text-lg">Cash on Delivery</h3>
                                                            <p className="text-sm text-gray-500">Pay when you receive your order</p>
                                                        </div>
                                                    </div>
                                                    <CheckCircle className="text-[#d98a6c]" size={28} />
                                                </div>
                                            </div>

                                            <div className="border border-gray-200 rounded-2xl p-6 opacity-50 cursor-not-allowed">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                                            <CreditCard className="text-gray-400" size={24} />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-400 text-lg">Credit/Debit Card</h3>
                                                            <p className="text-sm text-gray-400">Coming soon</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 md:mt-10">
                                            <button
                                                onClick={() => setStep(1)}
                                                className="flex items-center justify-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors order-2 sm:order-1"
                                            >
                                                <ArrowLeft size={18} />
                                                Back
                                            </button>
                                            <button
                                                onClick={() => setStep(3)}
                                                className="flex items-center justify-center gap-2 px-8 py-4 bg-[#d98a6c] text-white rounded-full hover:bg-[#c47659] transition-all shadow-lg order-1 sm:order-2"
                                            >
                                                Continue
                                                <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Review & Confirm */}
                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
                                    >
                                        <div className="flex items-center gap-3 mb-6 md:mb-8">
                                            <CheckCircle className="text-[#d98a6c]" size={24} />
                                            <h2 className="text-2xl md:text-3xl font-light text-gray-800">Review Your Order</h2>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="border border-gray-100 rounded-2xl p-6 bg-gray-50">
                                                <h3 className="font-semibold text-gray-800 mb-3">Delivery Address</h3>
                                                <p className="text-gray-600">{formData.name}</p>
                                                <p className="text-gray-600">{formData.phone}</p>
                                                <p className="text-gray-600">{formData.address}</p>
                                                <p className="text-gray-600">{formData.city}, {formData.postalCode}</p>
                                            </div>

                                            <div className="border border-gray-100 rounded-2xl p-6 bg-gray-50">
                                                <h3 className="font-semibold text-gray-800 mb-3">Payment Method</h3>
                                                <p className="text-gray-600">Cash on Delivery (COD)</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 md:mt-10">
                                            <button
                                                onClick={() => setStep(2)}
                                                className="flex items-center justify-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors order-2 sm:order-1"
                                            >
                                                <ArrowLeft size={18} />
                                                Back
                                            </button>
                                            <button
                                                onClick={handlePlaceOrder}
                                                disabled={isProcessing}
                                                className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-black transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <Loader2 size={18} className="animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        Place Order
                                                        <CheckCircle size={18} />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1 mt-8 lg:mt-0">
                            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 lg:sticky lg:top-32">
                                <h2 className="text-xl md:text-2xl font-light text-gray-800 mb-4 md:mb-6 border-b border-gray-100 pb-4">Order Summary</h2>

                                <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-2 md:gap-3">
                                            <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs md:text-sm font-medium text-gray-800">{item.name}</p>
                                                <p className="text-[10px] md:text-xs text-gray-500">Qty: {item.quantity}</p>
                                                <p className="text-xs md:text-sm font-bold text-[#c47659]">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                                    </div>
                                    <div className="pt-3 border-t border-gray-100 flex justify-between items-end">
                                        <span className="text-xl font-light text-gray-800">Total</span>
                                        <span className="text-3xl font-bold text-[#c47659]">${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
