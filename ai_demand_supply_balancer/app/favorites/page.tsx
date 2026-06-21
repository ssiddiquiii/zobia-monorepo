'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { removeFromFavorites } from '@/lib/redux/features/favoritesSlice';
import { addToCart } from '@/lib/redux/features/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer';
import ProductCard from '@/app/components/Bestsellers/ProductCard';
import { HeartOff, ShoppingCart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
    const favoriteItems = useSelector((state: RootState) => state.favorites.items);
    const dispatch = useDispatch();

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
                        Wishlist
                    </motion.h1>

                    {favoriteItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-12">
                            <AnimatePresence mode="popLayout">
                                {favoriteItems.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="relative group"
                                    >
                                        <ProductCard
                                            id={product.id}
                                            index={index}
                                            name={product.name}
                                            price={`$${product.price}`}
                                            image={product.image}
                                            stock={product.stock}
                                        />

                                        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => dispatch(removeFromFavorites(product.id))}
                                                className="w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors"
                                                title="Remove from favorites"
                                            >
                                                <HeartOff size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const { id, name, price, image, stock } = product;
                                                    dispatch(addToCart({ id, name, price, image, stock }));
                                                }}
                                                className="w-10 h-10 bg-gray-900 shadow-lg rounded-full flex items-center justify-center text-white hover:bg-black transition-colors"
                                                title="Add to cart"
                                            >
                                                <ShoppingCart size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-40 bg-white rounded-[3rem] shadow-sm border border-gray-50"
                        >
                            <div className="w-24 h-24 bg-[#fff5f0] rounded-full flex items-center justify-center mx-auto mb-8">
                                <HeartOff size={40} className="text-[#d98a6c]" />
                            </div>
                            <h2 className="text-3xl font-light text-gray-800 mb-4">Your wishlist is empty</h2>
                            <p className="text-gray-400 max-w-xs mx-auto mb-10 font-light">
                                Save the products you love to keep ritual inspiration close at hand.
                            </p>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-3 px-10 py-4 bg-[#d98a6c] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#c47659] transition-colors shadow-lg shadow-[#d98a6c33]"
                            >
                                Browse Collection
                            </Link>
                        </motion.div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
