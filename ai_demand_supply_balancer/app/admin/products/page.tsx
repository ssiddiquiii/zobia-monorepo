'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '@/lib/constants/categories';

const ProductsPage = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (res.ok) {
                setProducts(data.map((p: any) => ({
                    ...p,
                    id: `#${p._id.slice(-6).toUpperCase()}`,
                    price: `$${p.price.toLocaleString()}`
                })));
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDelete = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                // Remove from local state immediately for snappy feel
                setProducts(products.filter(p => p._id !== productId));
            } else {
                const data = await res.json();
                alert(data.message || 'Error deleting product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to connect to the server');
        }
    };

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
                        <p className="text-[#c47659] font-medium mb-1">Inventory Management</p>
                        <h1 className="text-4xl font-light text-gray-800 dark:text-white tracking-tight">Products</h1>
                    </div>
                    <Link href="/admin/products/new">
                        <button className="bg-[#d98a6c] px-6 py-2.5 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all">
                            + New Product
                        </button>
                    </Link>
                </header>

                <div className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
                    <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-gray-50 dark:bg-[#1a1a1a] border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#fdf2ef] w-full md:w-64 text-gray-800 dark:text-white placeholder-gray-400"
                            />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-gray-50 dark:bg-[#1a1a1a] border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#fdf2ef] text-gray-500 dark:text-gray-400 w-full md:w-auto outline-none transition-colors"
                            >
                                <option>All Categories</option>
                                {PRODUCT_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {products.length > 0 ? (
                            <>
                                {/* Desktop Table View */}
                                <table className="w-full text-left hidden md:table">
                                    <thead>
                                        <tr className="border-b border-gray-50 dark:border-gray-800 text-gray-400 dark:text-gray-500 text-sm font-medium">
                                            <th className="px-8 py-4 font-medium whitespace-nowrap">Image</th>
                                            <th className="px-8 py-4 font-medium">Product ID</th>
                                            <th className="px-8 py-4 font-medium">Product Name</th>
                                            <th className="px-8 py-4 font-medium">Price</th>
                                            <th className="px-8 py-4 font-medium">Stock</th>
                                            <th className="px-8 py-4 font-medium">Category</th>
                                            <th className="px-8 py-4 text-right font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600 dark:text-gray-400">
                                        {filteredProducts.map((product, index) => (
                                            <motion.tr
                                                key={product._id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
                                            >
                                                <td className="px-8 py-4">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 dark:bg-[#222] border border-gray-100 dark:border-gray-700">
                                                        {product.image ? (
                                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                                                                <Plus className="w-4 h-4" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 font-medium text-gray-400 dark:text-gray-500">{product.id}</td>
                                                <td className="px-8 py-6 font-semibold text-gray-800 dark:text-white">{product.name}</td>
                                                <td className="px-8 py-6 text-gray-800 dark:text-gray-200">{product.price}</td>
                                                <td className="px-8 py-6 text-gray-800 dark:text-gray-200">{product.stock} units</td>
                                                <td className="px-8 py-6">
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-50 dark:bg-[#222] text-gray-600 dark:text-gray-400">
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/admin/products/edit/${product._id}`}>
                                                            <button className="p-2 text-gray-400 hover:text-[#c47659] hover:bg-[#fdf2ef] dark:hover:bg-[#2a1e1a] rounded-lg transition-all">
                                                                <Edit3 className="w-4 h-4" />
                                                            </button>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(product._id)}
                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Mobile Card View */}
                                <div className="md:hidden space-y-4 p-4">
                                    {filteredProducts.map((product, index) => (
                                        <motion.div
                                            key={product._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * index }}
                                            className="bg-gray-50 dark:bg-[#111111] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 relative transition-colors"
                                        >
                                            <div className="flex gap-4 mb-4">
                                                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 flex-shrink-0">
                                                    {product.image ? (
                                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                                                            <Plus className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1">{product.id}</p>
                                                            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">{product.name}</h3>
                                                            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-200 dark:bg-[#222] text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                                                {product.category}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <Link href={`/admin/products/edit/${product._id}`}>
                                                                <button className="p-2 bg-white dark:bg-[#222] text-gray-400 hover:text-[#c47659] border border-gray-200 dark:border-gray-700 rounded-lg transition-colors">
                                                                    <Edit3 className="w-4 h-4" />
                                                                </button>
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(product._id)}
                                                                className="p-2 bg-white dark:bg-[#222] text-gray-400 hover:text-red-500 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
                                                <div>
                                                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-0.5">Price</span>
                                                    <span className="font-bold text-gray-900 dark:text-white">{product.price}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-0.5">Stock</span>
                                                    <span className="font-bold text-gray-900 dark:text-white">{product.stock} units</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="p-10 text-center text-gray-400">No products found in the database.</div>
                        )}
                    </div>
                </div>
            </motion.div>
        </main>
    );
};

export default ProductsPage;
