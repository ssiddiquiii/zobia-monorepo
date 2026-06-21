'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const Bestsellers = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBestsellers = async () => {
            try {
                const res = await fetch('/api/products?limit=3');
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching bestsellers:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBestsellers();
    }, []);

    return (
        <section className="bg-[#fff5f0] py-24 px-6 md:px-12 lg:px-24 w-full">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl sm:text-6xl md:text-8xl font-extralight text-[#c47659] text-center mb-12 md:mb-20"
                >
                    Bestsellers
                </motion.h2>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-[#d98a6c] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16 mb-20">
                        {products.map((product, index) => (
                            <ProductCard
                                key={product._id}
                                id={product._id}
                                index={index}
                                name={product.name}
                                price={`$${product.price}`}
                                image={product.image || '/shop-by-type-bg.png'}
                                stock={product.stock || 0}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-400 py-20">No bestsellers found in database.</p>
                )}

                <div className="flex justify-center">
                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "#c47659" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = '/products'}
                        className="bg-[#d98a6c] text-white px-12 py-4 text-sm font-medium tracking-[0.2em] uppercase transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        View All
                    </motion.button>
                </div>
            </div>
        </section>
    );
};

export default Bestsellers;
