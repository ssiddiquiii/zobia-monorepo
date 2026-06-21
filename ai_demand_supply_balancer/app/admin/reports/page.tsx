'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Calendar,
    Download,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Layers,
    PieChart,
    Activity,
    FileText,
    FileSpreadsheet,
    X
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportsPage = () => {
    const [reportData, setReportData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('monthly');
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);

    const fetchAllData = async () => {
        setExportLoading(true);
        try {
            const [productsRes, customersRes, warehousesRes, ordersRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/customers'),
                fetch('/api/warehouses'),
                fetch('/api/orders')
            ]);

            const [products, customers, warehouses, orders] = await Promise.all([
                productsRes.json(),
                customersRes.json(),
                warehousesRes.json(),
                ordersRes.json()
            ]);

            return { products, customers, warehouses, orders };
        } catch (error) {
            console.error('Error fetching data for export:', error);
            return null;
        } finally {
            setExportLoading(false);
        }
    };

    const handleExportCSV = async () => {
        const fullData = await fetchAllData();
        if (!fullData) {
            alert('Failed to fetch data for report');
            return;
        }

        const { products, customers, warehouses, orders } = fullData;

        let csvContent = "\uFEFF"; // UTF-8 BOM for Excel
        csvContent += "FINANCIAL REPORTS\nDate,Orders,Revenue\n";
        reportData.forEach(row => {
            csvContent += `${new Date(0, row._id.month - 1).toLocaleString('en-US', { month: 'short' })} ${row._id.day} ${row._id.year},${row.count},${row.revenue}\n`;
        });
        csvContent += `GRAND TOTAL,${totalOrders},${totalRevenue}\n\n`;

        csvContent += "PRODUCTS\nName,SKU,Price,Stock\n";
        products.forEach((p: any) => {
            csvContent += `"${p.name}",${p.sku},${p.price},${p.stock}\n`;
        });

        csvContent += "\nCUSTOMERS\nName,Email,Status,Total Orders\n";
        customers.forEach((c: any) => {
            csvContent += `"${c.name}",${c.email},${c.status},${c.totalOrders || 0}\n`;
        });

        csvContent += "\nWAREHOUSES\nName,Location,Status,Capacity\n";
        warehouses.forEach((w: any) => {
            csvContent += `"${w.name}",${w.location},${w.status},${w.capacity}\n`;
        });

        csvContent += "\nORDERS\nCustomer,Date,Status,Total\n";
        orders.forEach((o: any) => {
            csvContent += `"${o.customerName}",${new Date(o.date).toLocaleDateString()},${o.status},${o.total}\n`;
        });
        const orderTotalRevenue = orders.reduce((acc: number, curr: any) => acc + (curr.total || 0), 0);
        csvContent += `GRAND TOTAL (ALL),,,${orderTotalRevenue}\n`;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `full_audit_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowExportModal(false);
    };

    const handleExportPDF = async () => {
        const fullData = await fetchAllData();
        if (!fullData) {
            alert('Failed to fetch data for report');
            return;
        }

        const { products, customers, warehouses, orders } = fullData;
        const doc = new jsPDF();

        // Helper for sections
        const addSection = (title: string, headers: string[][], body: any[][], startY: number) => {
            doc.setFontSize(16);
            doc.setTextColor(0);
            doc.text(title, 14, startY);
            autoTable(doc, {
                startY: startY + 5,
                head: headers,
                body: body,
                theme: 'grid',
                headStyles: { fillColor: [217, 138, 108], textColor: [255, 255, 255] },
                alternateRowStyles: { fillColor: [250, 250, 250] }
            });
            return (doc as any).lastAutoTable.finalY + 15;
        };

        // Title Page
        doc.setFontSize(24);
        doc.text('Fleure Beauty - Full Audit Report', 14, 30);
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 40);
        doc.text(`Scope: All Entities (Analytics, Products, Customers, Warehouses, Orders)`, 14, 46);

        // 1. Financials
        let currentY = addSection('1. Financial Performance',
            [['Date', 'Orders', 'Revenue ($)']],
            [
                ...reportData.map(row => [
                    `${new Date(0, row._id.month - 1).toLocaleString('en-US', { month: 'short' })} ${row._id.day}, ${row._id.year}`,
                    row.count,
                    row.revenue.toLocaleString()
                ]),
                [{ content: 'GRAND TOTAL', styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
                { content: totalOrders.toString(), styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
                { content: totalRevenue.toLocaleString(), styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }]
            ], 60);

        // 2. Products
        if (currentY > 230) { doc.addPage(); currentY = 20; }
        currentY = addSection('2. Inventory (Products)',
            [['Name', 'SKU', 'Price ($)', 'Stock']],
            products.map((p: any) => [p.name, p.sku, p.price, p.stock]), currentY);

        // 3. Customers
        if (currentY > 230) { doc.addPage(); currentY = 20; }
        currentY = addSection('3. Customer Registry',
            [['Name', 'Email', 'Status', 'Total Orders']],
            customers.map((c: any) => [c.name, c.email, c.status, c.totalOrders || 0]), currentY);

        // 4. Warehouses
        if (currentY > 230) { doc.addPage(); currentY = 20; }
        currentY = addSection('4. Warehouse Network',
            [['Name', 'Location', 'Status', 'Capacity']],
            warehouses.map((w: any) => [w.name, w.location, w.status, w.capacity]), currentY);

        // 5. Orders
        if (currentY > 230) { doc.addPage(); currentY = 20; }
        const orderTotalSum = orders.reduce((acc: number, curr: any) => acc + (curr.total || 0), 0);
        currentY = addSection('5. Order History',
            [['Customer', 'Date', 'Status', 'Total ($)']],
            [
                ...orders.slice(0, 100).map((o: any) => [o.customerName, new Date(o.date).toLocaleDateString(), o.status, o.total.toLocaleString()]),
                ['', '', { content: 'GRAND TOTAL', styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }, { content: orderTotalSum.toLocaleString(), styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }]
            ], currentY);

        doc.save(`full_audit_report_${new Date().toISOString().split('T')[0]}.pdf`);
        setShowExportModal(false);
    };

    const fetchReport = async (frame: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/reports?type=${frame}`);
            const data = await res.json();
            if (res.ok) setReportData(data);
        } catch (error) {
            console.error('Error fetching report:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport(timeframe);
    }, [timeframe]);

    const totalRevenue = reportData.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalOrders = reportData.reduce((acc, curr) => acc + curr.count, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return (
        <main className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] p-8 lg:p-12 transition-colors">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-7xl mx-auto"
            >
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-2 text-[#c47659] font-bold text-xs uppercase tracking-[0.4em] mb-3"
                        >
                            <Activity size={14} />
                            Live Intelligence
                        </motion.div>
                        <h1 className="text-5xl font-light text-gray-900 dark:text-white tracking-tight">Financial Reports</h1>
                    </div>

                    <div className="flex items-center gap-3 bg-white dark:bg-[#1a1a1a] p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                        {['monthly', 'quarterly', 'yearly'].map((frame) => (
                            <button
                                key={frame}
                                onClick={() => setTimeframe(frame)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${timeframe === frame
                                    ? 'bg-[#d98a6c] text-white shadow-lg shadow-[#d98a6c44]'
                                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                                    }`}
                            >
                                {frame}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {[
                        { label: 'Net Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, trend: '+14.2%', color: 'text-[#8a5b4a] dark:text-[#ffbba5]', bg: 'bg-[#fdf2ef] dark:bg-[#d98a6c]/10' },
                        { label: 'Total Sales', value: totalOrders.toLocaleString(), icon: ShoppingCart, trend: '+8.5%', color: 'text-gray-800 dark:text-gray-100', bg: 'bg-white dark:bg-[#111111]' },
                        { label: 'Avg. Transaction', value: `$${avgOrderValue.toFixed(2)}`, icon: PieChart, trend: '-2.1%', color: 'text-gray-800 dark:text-gray-100', bg: 'bg-white dark:bg-[#111111]' }
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 + 0.3 }}
                            className={`${stat.bg} p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group transition-colors`}
                        >
                            <stat.icon className="absolute -top-4 -right-4 w-24 h-24 text-gray-50/50 dark:text-gray-600/20 group-hover:scale-110 transition-transform duration-700" />
                            <div className="relative z-10">
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">{stat.label}</p>
                                <h3 className={`text-4xl font-light ${stat.color} mb-3`}>{stat.value}</h3>
                                <div className={`flex items-center gap-1.5 text-xs font-bold ${stat.trend.startsWith('+') ? 'text-green-500 dark:text-green-400' : 'text-red-400'}`}>
                                    {stat.trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {stat.trend} vs last period
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Visual Analytics */}
                    <section className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-[#111111] p-10 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden h-[500px] flex flex-col transition-colors">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Revenue Trajectory</h2>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">Monthly fiscal performance visualization.</p>
                                </div>
                                <button className="p-3 text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] rounded-2xl transition-colors border border-gray-50 dark:border-gray-700">
                                    <Filter size={18} />
                                </button>
                            </div>

                            <div className="flex-1 flex items-end gap-3 pb-8">
                                {loading ? (
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="w-8 h-8 border-3 border-[#d98a6c] border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : reportData.length > 0 ? reportData.map((d, i) => {
                                    const maxVal = Math.max(...reportData.map(r => r.revenue), 100);
                                    const height = (d.revenue / maxVal) * 100;
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                            <div className="relative w-full flex items-end justify-center h-full">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${height}%` }}
                                                    transition={{ duration: 1.2, delay: i * 0.05, ease: "circOut" }}
                                                    className="w-full max-w-[40px] bg-[#fdf2ef] dark:bg-[#222] group-hover:bg-[#d98a6c] rounded-full transition-all duration-500 relative"
                                                >
                                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gray-900 dark:bg-white text-white dark:text-black text-[10px] font-black py-1.5 px-3 rounded-lg shadow-xl translate-y-2 group-hover:translate-y-0">
                                                        ${d.revenue.toLocaleString()}
                                                    </div>
                                                </motion.div>
                                            </div>
                                            <span className="text-[10px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-tighter">
                                                {new Date(0, d._id.month - 1).toLocaleString('en-US', { month: 'short' })} {d._id.day}
                                            </span>
                                        </div>
                                    );
                                }) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-gray-300 dark:text-gray-600 italic">
                                        <Layers className="mb-4 opacity-20" size={48} />
                                        Predictive data awaiting sales volume.
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Historical Logs Sidebar */}
                    <aside className="bg-white dark:bg-[#111111] rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col transition-colors">
                        <header className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Cycles</h3>
                            <button className="text-[#c47659] p-2 hover:bg-[#fdf2ef] dark:hover:bg-[#2a1e1a] rounded-xl transition-colors">
                                <Download size={20} />
                            </button>
                        </header>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                            {reportData.map((row, i) => (
                                <div key={i} className="p-5 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] rounded-[28px] transition-all group border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">
                                            {new Date(0, row._id.month - 1).toLocaleString('en-US', { month: 'long' })} {row._id.day}, {row._id.year}
                                        </span>
                                        <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-200">{row.count} Orders</p>
                                        </div>
                                        <p className="text-xl font-light text-[#c47659] tracking-tight">
                                            ${row.revenue.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {reportData.length > 0 && (
                                <div className="p-6 mt-4 bg-[#fdf2ef] dark:bg-[#1a1a1a]/50 rounded-[28px] border border-[#d98a6c]/20 shadow-inner">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-bold text-[#c47659] uppercase tracking-widest mb-1">Cumulative Total</p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{totalOrders} Orders Total</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-light text-[#c47659] tracking-tight">
                                                ${totalRevenue.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {reportData.length === 0 && (
                                <div className="py-20 text-center px-10">
                                    <p className="text-sm text-gray-400 dark:text-gray-600 italic">No cycles recorded yet.</p>
                                </div>
                            )}
                        </div>
                        <div className="p-8 bg-gray-50 dark:bg-[#1a1a1a] border-t border-gray-100 dark:border-gray-800">
                            <button
                                onClick={() => setShowExportModal(true)}
                                className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black dark:hover:bg-gray-200 transition-all"
                            >
                                Generate Full Audit
                            </button>
                        </div>
                    </aside>
                </div>
            </motion.div>

            {/* Export Selection Modal */}
            <AnimatePresence>
                {showExportModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowExportModal(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-[#1a1a1a] w-full max-w-md rounded-[32px] p-10 shadow-2xl relative z-10 border border-gray-100 dark:border-gray-800"
                        >
                            <button
                                onClick={() => setShowExportModal(false)}
                                className="absolute top-6 right-6 p-2 hover:bg-gray-50 dark:hover:bg-[#222] rounded-full text-gray-400 dark:text-gray-500 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="text-center mb-10">
                                <div className="w-16 h-16 bg-[#fdf2ef] dark:bg-[#2a1e1a] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#d98a6c]">
                                    <Download size={32} />
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Export Full Audit</h2>
                                <p className="text-sm text-gray-400 dark:text-gray-500">Choose format for the multi-section report (Analytics, Products, Customers, Warehouses, Orders).</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    onClick={handleExportPDF}
                                    disabled={exportLoading}
                                    className="flex items-center gap-4 p-6 rounded-2xl border-2 border-transparent hover:border-[#d98a6c] bg-gray-50 dark:bg-[#222] hover:bg-[#fdf2ef] dark:hover:bg-[#2a1e1a] transition-all group disabled:opacity-50"
                                >
                                    <div className="w-12 h-12 bg-white dark:bg-[#1a1a1a] rounded-xl flex items-center justify-center text-red-500 shadow-sm group-hover:scale-110 transition-transform">
                                        {exportLoading ? <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : <FileText size={24} />}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-gray-900 dark:text-white uppercase tracking-widest text-[10px]">Multi-Page Document</p>
                                        <p className="text-xl font-light text-gray-800 dark:text-gray-300">{exportLoading ? 'Aggregating...' : 'Export as PDF'}</p>
                                    </div>
                                </button>

                                <button
                                    onClick={handleExportCSV}
                                    disabled={exportLoading}
                                    className="flex items-center gap-4 p-6 rounded-2xl border-2 border-transparent hover:border-green-500 bg-gray-50 dark:bg-[#222] hover:bg-green-50 dark:hover:bg-green-900/10 transition-all group disabled:opacity-50"
                                >
                                    <div className="w-12 h-12 bg-white dark:bg-[#1a1a1a] rounded-xl flex items-center justify-center text-green-500 shadow-sm group-hover:scale-110 transition-transform">
                                        {exportLoading ? <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /> : <FileSpreadsheet size={24} />}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-gray-900 dark:text-white uppercase tracking-widest text-[10px]">Comprehensive CSV</p>
                                        <p className="text-xl font-light text-gray-800 dark:text-gray-300">{exportLoading ? 'Processing...' : 'Export as CSV'}</p>
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #eee;
                    border-radius: 10px;
                }
                :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #333;
                }
            `}</style>
        </main>
    );
};

export default ReportsPage;
