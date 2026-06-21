'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Plus, Upload, QrCode, X } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '@/lib/constants/categories';

const NewProductPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        category: PRODUCT_CATEGORIES[0],
        image: '' // This will store the Base64 string
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const categories = PRODUCT_CATEGORIES;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImagePreview(base64String);
                setFormData({ ...formData, image: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        setFormData({ ...formData, image: '' });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.image) {
            alert('Please upload a product image before publishing.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                    stock: Number(formData.stock)
                }),
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    window.location.href = '/admin/products';
                }, 2000);
            } else {
                const data = await res.json();
                alert(data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Failed to connect to the server');
        } finally {
            if (!success) setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#111111] relative transition-colors">
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white/90 dark:bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="w-32 h-32 mb-6"
                        >
                            <img
                                src="/logo.jpeg"
                                alt="Loading..."
                                className="w-full h-full object-cover rounded-3xl shadow-2xl shadow-[#d98a6c44]"
                            />
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[#c47659] font-bold tracking-widest uppercase text-sm text-center px-6"
                        >
                            {success ? 'Product Created Successfully!' : 'Processing Product & Generating QR...'}
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="p-10 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Link href="/admin/products" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#c47659] transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Inventory</span>
                    </Link>

                    <header className="mb-12">
                        <h1 className="text-4xl font-light text-gray-800 dark:text-white tracking-tight mb-2">Create New Product</h1>
                        <p className="text-gray-400 dark:text-gray-500">Launch your latest collection item with ease.</p>
                    </header>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-8">
                            <section className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-50 dark:border-gray-800 pb-4">General Information</h2>

                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Product Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g., Sunkissed Glow Primer"
                                            className="bg-gray-50 dark:bg-[#1a1a1a] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#fdf2ef] dark:focus:ring-[#2a1e1a] text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 transition-all font-medium"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Base Price ($)</label>
                                            <input
                                                type="number"
                                                required
                                                placeholder="0.00"
                                                className="bg-gray-50 dark:bg-[#1a1a1a] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#fdf2ef] dark:focus:ring-[#2a1e1a] text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 transition-all font-medium"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Initial Stock</label>
                                            <input
                                                type="number"
                                                required
                                                placeholder="0"
                                                className="bg-gray-50 dark:bg-[#1a1a1a] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#fdf2ef] dark:focus:ring-[#2a1e1a] text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 transition-all font-medium"
                                                value={formData.stock}
                                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-50 dark:border-gray-800 pb-4">Categorization</h2>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, category: cat })}
                                            className={`py-3 px-4 rounded-xl text-sm font-bold transition-all ${formData.category === cat
                                                ? 'bg-[#d98a6c] text-white shadow-lg shadow-[#d98a6c33]'
                                                : 'bg-gray-50 dark:bg-[#1a1a1a] text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-[#222]'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="space-y-8">
                            <section className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 text-center">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-50 dark:border-gray-800 pb-4 text-left">Product Image</h2>

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                />

                                {imagePreview ? (
                                    <div className="relative group aspect-square rounded-2xl overflow-hidden shadow-inner bg-gray-50 dark:bg-[#1a1a1a]">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="p-2 bg-white dark:bg-[#111] rounded-full text-gray-800 dark:text-white hover:scale-110 transition-transform"
                                            >
                                                <Upload className="w-5 h-5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="p-2 bg-white dark:bg-[#111] rounded-full text-red-500 hover:scale-110 transition-transform"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-800 hover:border-[#d98a6c44] transition-colors cursor-pointer group"
                                    >
                                        <div className="w-12 h-12 bg-white dark:bg-[#111] rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                            <Upload className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                        </div>
                                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Select Image</p>
                                    </div>
                                )}

                                <p className="text-[10px] text-gray-300 dark:text-gray-600 leading-relaxed font-medium">Recommended size: 1080x1080px. <br />Supports JPG, PNG, WEBP.</p>
                            </section>

                            <section className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                                <div className="flex items-center gap-3 text-[#c47659] mb-2">
                                    <QrCode className="w-5 h-5" />
                                    <span className="font-bold text-xs uppercase tracking-widest">Smart Automation</span>
                                </div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed font-medium">
                                    A unique QR code will be dynamically generated upon saving to simplify warehouse tracking and customer interactions.
                                </p>
                            </section>

                            <button
                                type="submit"
                                disabled={loading || !formData.image}
                                className="w-full bg-[#d98a6c] disabled:opacity-50 disabled:grayscale hover:bg-[#c47659] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#d98a6c33] hover:translate-y-[-2px] active:translate-y-[0] transition-all flex items-center justify-center gap-3"
                            >
                                <Plus className="w-5 h-5" />
                                Publish Product
                            </button>
                        </div>
                    </form>
                </motion.div>
            </main>
        </div>
    );
};

export default NewProductPage;
