'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer';
import ProductCard from '@/app/components/Bestsellers/ProductCard';

const CATEGORIES = [
    'Cleansers',
    'Moisturizers',
    'Serums',
    'Sunscreen',
    'Toners',
    'Face Masks',
    'Eye Care'
];

function ProductsContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category') || 'All';

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(initialCategory);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const url = activeCategory === 'All'
                    ? '/api/products'
                    : `/api/products?category=${encodeURIComponent(activeCategory)}`;
                const res = await fetch(url);
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [activeCategory]);

    return (
        <div className="min-h-screen bg-[#fffcfb]">
            <Header />

            {/* Hero Section */}
            <div className="bg-[#fff5f0] pt-40 pb-20 px-6 md:px-12 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-extralight text-[#c47659] mb-6">
                            {activeCategory === 'All' ? 'Our Collection' : activeCategory}
                        </h1>
                        <p className="text-gray-500 text-lg md:text-xl font-light tracking-wide max-w-2xl">
                            Discover our curated selection of premium beauty essentials, formulated with the finest ingredients for your daily ritual.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Sub-navigation Categories */}
            <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <div className="max-w-7xl mx-auto flex justify-center py-6 gap-8 md:gap-12">
                    <button
                        onClick={() => setActiveCategory('All')}
                        className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${activeCategory === 'All' ? 'text-[#d98a6c]' : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        All
                        {activeCategory === 'All' && (
                            <motion.div layoutId="activeCat" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#d98a6c]" />
                        )}
                    </button>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${activeCategory.toLowerCase() === cat.toLowerCase() ? 'text-[#d98a6c]' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {cat}
                            {activeCategory.toLowerCase() === cat.toLowerCase() && (
                                <motion.div layoutId="activeCat" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#d98a6c]" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <section className="py-24 px-6 md:px-12 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-4">
                            <div className="w-16 h-16 border-4 border-[#d98a6c] border-t-transparent rounded-full animate-spin shadow-xl"></div>
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-4">Revealing Beauty...</span>
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-12">
                            <AnimatePresence mode="popLayout">
                                {products.map((product, index) => (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <ProductCard
                                            id={product._id}
                                            index={index}
                                            name={product.name}
                                            price={`$${product.price}`}
                                            image={product.image || '/shop-by-type-bg.png'}
                                            stock={product.stock || 0}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="text-center py-40 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                            <h3 className="text-2xl text-gray-400 font-light mb-4">No products found in this category</h3>
                            <button
                                onClick={() => setActiveCategory('All')}
                                className="text-[#d98a6c] text-sm font-bold uppercase tracking-widest hover:underline"
                            >
                                Show All Products
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <ProductsContent />
        </Suspense>
    );
}
