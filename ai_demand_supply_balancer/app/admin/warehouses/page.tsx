'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Warehouse as WarehouseIcon, MapPin, Plus, Trash2, Box } from 'lucide-react';

const WarehousesPage = () => {
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newWarehouse, setNewWarehouse] = useState({ name: '', location: '', capacity: 1000 });

    const fetchWarehouses = async () => {
        try {
            const res = await fetch('/api/warehouses');
            const data = await res.json();
            if (res.ok) setWarehouses(data);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/warehouses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newWarehouse),
            });
            if (res.ok) {
                const added = await res.json();
                setWarehouses([added, ...warehouses]);
                setShowAddModal(false);
                setNewWarehouse({ name: '', location: '', capacity: 1000 });
            }
        } catch (error) {
            console.error('Error adding warehouse:', error);
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
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <p className="text-[#c47659] font-medium mb-1">Global Logistics</p>
                        <h1 className="text-4xl font-light text-gray-800 dark:text-white tracking-tight">Warehouses</h1>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-[#d98a6c] px-6 py-2.5 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                        <Plus size={20} />
                        New Warehouse
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {warehouses.map((wh, index) => (
                        <motion.div
                            key={wh._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-[#111111] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#fdf2ef] dark:bg-[#d98a6c]/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500 opacity-50"></div>

                            <div className="flex items-center gap-4 mb-6 relative">
                                <div className="p-3 bg-[#fdf2ef] dark:bg-[#d98a6c]/10 text-[#c47659] rounded-2xl">
                                    <WarehouseIcon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{wh.name}</h3>
                                    <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500 text-sm mt-0.5 font-medium">
                                        <MapPin size={12} />
                                        {wh.location}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 relative">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Inventory Status</span>
                                    <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">Healthy</span>
                                </div>
                                <div className="w-full h-2 bg-gray-50 dark:bg-[#222] rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '45%' }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="h-full bg-[#d98a6c]"
                                    ></motion.div>
                                </div>
                                <div className="flex justify-between text-xs font-semibold text-gray-400 dark:text-gray-500">
                                    <span>Used: 450 units</span>
                                    <span>Total: {wh.capacity}</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between relative capitalize">
                                <span className={`flex items-center gap-1.5 text-xs font-bold ${wh.isActive ? 'text-green-500' : 'text-gray-400'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${wh.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                    {wh.isActive ? 'Operational' : 'Disabled'}
                                </span>
                                <button className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {warehouses.length === 0 && (
                    <div className="bg-white dark:bg-[#111111] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 p-20 text-center flex flex-col items-center transition-colors">
                        <div className="p-5 bg-gray-50 dark:bg-[#222] rounded-full mb-4">
                            <Box size={40} className="text-gray-300 dark:text-gray-600" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">No Warehouses Registered</h3>
                        <p className="text-gray-400 dark:text-gray-500 max-w-sm mb-8 leading-relaxed">Assign warehouse locations to your products to enable precise inventory tracking and AI supply recommendations.</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="text-[#c47659] font-bold hover:underline decoration-2 underline-offset-8"
                        >+ Create First Location</button>
                    </div>
                )}
            </motion.div>

            {/* Simple Add Modal Overlay */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white dark:bg-[#1a1a1a] w-full max-w-md rounded-[32px] p-8 shadow-2xl space-y-8"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white tracking-tight">Add New Location</h2>
                                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-800 dark:hover:text-white"><X size={24} /></button>
                            </div>

                            <form onSubmit={handleAdd} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Warehouse Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-50 dark:bg-[#222] border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#fdf2ef] font-medium text-gray-800 dark:text-white"
                                        placeholder="e.g. North Wing Hub"
                                        value={newWarehouse.name}
                                        onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Specific Location</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-50 dark:bg-[#222] border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#fdf2ef] font-medium text-gray-800 dark:text-white"
                                        placeholder="e.g. Aisle 4, Shelf C"
                                        value={newWarehouse.location}
                                        onChange={(e) => setNewWarehouse({ ...newWarehouse, location: e.target.value })}
                                    />
                                </div>
                                <button className="w-full bg-[#d98a6c] hover:bg-[#c47659] transition-all text-white font-bold py-4 rounded-2xl shadow-xl shadow-[#d98a6c33]">Create Hub</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
};

const X = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export default WarehousesPage;
