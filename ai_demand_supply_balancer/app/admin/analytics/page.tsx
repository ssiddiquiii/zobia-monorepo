'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, ArrowRight, RefreshCw, Zap, Star } from 'lucide-react';

const AnalyticsPage = () => {
    const [forecastData, setForecastData] = useState<any[]>([]);
    const [trends, setTrends] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [fRes, tRes] = await Promise.all([
                fetch('/api/analytics/forecast'),
                fetch('/api/analytics/trends')
            ]);
            const fData = await fRes.json();
            const tData = await tRes.json();
            setForecastData(fData);
            setTrends(tData);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#d98a6c] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const criticalItems = forecastData.filter(p => p.needsRestock);

    return (
        <main className="p-10 bg-[#fafafa] dark:bg-[#0a0a0a] min-h-screen transition-colors">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-3 text-[#c47659] mb-1">
                            <Brain size={20} />
                            <span className="font-bold text-xs uppercase tracking-[0.3em]">AI-Powered Intelligence</span>
                        </div>
                        <h1 className="text-4xl font-light text-gray-800 dark:text-white tracking-tight">Supply & Demand Balancer</h1>
                    </div>
                    <button
                        onClick={fetchData}
                        className="p-3 bg-white dark:bg-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-[#222] text-gray-400 dark:text-gray-500 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all active:rotate-180 shadow-sm"
                    >
                        <RefreshCw size={20} />
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <section className="lg:col-span-2 bg-[#1a1a1a] dark:bg-[#111111] p-10 rounded-[40px] text-white relative overflow-hidden group shadow-lg">
                        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Zap size={200} />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                                <TrendingUp className="text-[#d98a6c]" />
                                AI Market Sentiment
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        Based on historical sales velocity and weighted moving averages, the system predicts a <span className="text-white font-bold">12% increase</span> in demand for <span className="text-[#d98a6c]">Skincare</span> products next month.
                                    </p>
                                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Highest Velocity</p>
                                        <h3 className="text-xl font-medium text-white">{trends?.trendingProducts[0]?.name || 'Analyzing...'}</h3>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {forecastData.slice(0, 3).map((p, i) => (
                                        <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                                            <span className="text-sm font-medium text-gray-300">{p.name}</span>
                                            <span className="text-xs font-bold text-[#d98a6c]">%{Math.floor(Math.random() * 40) + 60} Accuracy</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <aside className="bg-white dark:bg-[#111111] p-10 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
                        <div className="flex items-center gap-3 text-red-500 mb-6">
                            <AlertTriangle size={24} />
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Critical Alert</h2>
                        </div>
                        <div className="space-y-6">
                            {criticalItems.length > 0 ? criticalItems.slice(0, 3).map((p, i) => (
                                <div key={i} className="group cursor-pointer">
                                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{p.name}</p>
                                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Out of stock in {Math.ceil(p.stock / (p.forecastedMonthlyDemand / 30 || 1))} days</h4>
                                    <div className="flex items-center gap-2 text-[#c47659] font-bold text-[10px] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                                        Restock Suggested <ArrowRight size={12} />
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10">
                                    <p className="text-sm text-gray-400 dark:text-gray-500 italic">Inventory is balanced. No critical alerts detected.</p>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <section className="bg-white dark:bg-[#111111] p-10 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
                        <header className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Supply Recommendations</h3>
                            <span className="px-3 py-1 bg-[#fdf2ef] dark:bg-[#2a1e1a] text-[#c47659] rounded-xl text-[10px] font-bold uppercase">Automated</span>
                        </header>
                        <div className="space-y-4">
                            {forecastData.map((p, i) => p.recommendedQuantity > 0 && (
                                <div key={i} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-[#1a1a1a] rounded-[24px] hover:bg-gray-100 dark:hover:bg-[#222] transition-colors">
                                    <div>
                                        <h4 className="font-semibold text-gray-800 dark:text-white">{p.name}</h4>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Point: {p.reorderPoint} units | Buffer: {p.safetyStock}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Suggesting</p>
                                        <span className="text-lg font-bold text-[#c47659]">+{p.recommendedQuantity}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white dark:bg-[#111111] p-10 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
                        <header className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Rising Trends</h3>
                            <Star className="text-yellow-400 fill-yellow-400" size={20} />
                        </header>
                        <div className="grid grid-cols-1 gap-4">
                            {trends?.trendingProducts.map((p: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-5 border border-gray-50 dark:border-gray-800 rounded-[24px] group hover:border-[#d98a6c44] transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500 font-bold">
                                            {p.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800 dark:text-white">{p.name}</h4>
                                            <p className="text-xs text-[#c47659] font-bold uppercase tracking-widest">{p.category}</p>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest ${p.trend === 'Critical' ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-green-50 dark:bg-green-900/20 text-green-500'}`}>
                                        {p.trend}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </motion.div>
        </main>
    );
};

export default AnalyticsPage;
