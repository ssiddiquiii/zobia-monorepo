'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    FileText,
    Download,
    Search,
    Filter,
    ArrowUpRight,
    CheckCircle2,
    Calendar,
    User,
    DollarSign,
    X,
    ExternalLink
} from 'lucide-react';

const InvoicesPage = () => {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

    const fetchInvoices = async () => {
        try {
            const res = await fetch('/api/invoices');
            if (res.ok) {
                const data = await res.json();
                setInvoices(data);
            }
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleDownloadPDF = (invoice: any) => {
        const doc = new jsPDF();

        // Header / Logo area
        doc.setFillColor(217, 138, 108); // #d98a6c
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(30);
        doc.setFont('helvetica', 'bold');
        doc.text('FLEURE', 20, 25);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Premium Beauty & Skincare', 20, 32);

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.text('INVOICE', 160, 25);
        doc.setFontSize(10);
        doc.text(invoice.invoiceNumber, 160, 32);

        // Company Details
        doc.setTextColor(80, 80, 80);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Fleure Beauty Inc.', 20, 55);
        doc.setFont('helvetica', 'normal');
        doc.text('123 Aesthetics Avenue', 20, 60);
        doc.text('New York, NY 10001', 20, 65);
        doc.text('billing@fleure.com', 20, 70);

        // Bill To
        doc.setFont('helvetica', 'bold');
        doc.text('BILL TO:', 120, 55);
        doc.setFont('helvetica', 'normal');
        doc.text(invoice.customerName, 120, 60);
        doc.text(invoice.customerEmail, 120, 65);
        doc.text(`${invoice.billingAddress?.street || ''}`, 120, 70);
        doc.text(`${invoice.billingAddress?.city || ''}, ${invoice.billingAddress?.state || ''} ${invoice.billingAddress?.zip || ''}`, 120, 75);

        // Horizontal Line
        doc.setDrawColor(240, 240, 240);
        doc.line(20, 85, 190, 85);

        // Table
        autoTable(doc, {
            startY: 95,
            head: [['Description', 'Quantity', 'Price', 'Total']],
            body: invoice.items.map((item: any) => [
                item.name,
                item.quantity,
                `$${item.price.toFixed(2)}`,
                `$${(item.price * item.quantity).toFixed(2)}`
            ]),
            headStyles: { fillColor: [217, 138, 108], textColor: [255, 255, 255], fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [249, 250, 251] },
            margin: { left: 20, right: 20 }
        });

        // Totals
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text('Subtotal:', 140, finalY);
        doc.text('Tax (8%):', 140, finalY + 7);

        doc.setTextColor(80, 80, 80);
        doc.text(`$${(invoice.amount * 0.92).toFixed(2)}`, 180, finalY, { align: 'right' });
        doc.text(`$${(invoice.amount * 0.08).toFixed(2)}`, 180, finalY + 7, { align: 'right' });

        doc.setTextColor(217, 138, 108);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Total Amount: ', 140, finalY + 18);
        doc.text(`$${invoice.amount.toLocaleString()}`, 180, finalY + 18, { align: 'right' });

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(180, 180, 180);
        doc.setFont('helvetica', 'italic');
        doc.text('Thank you for choosing Fleure. For any inquiries, please contact support@fleure.com', 105, 280, { align: 'center' });

        doc.save(`${invoice.invoiceNumber}_fleure.pdf`);
    };

    const filteredInvoices = invoices.filter(inv =>
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <p className="text-[#c47659] font-medium mb-1">Financial Records</p>
                        <h1 className="text-4xl font-light text-gray-800 dark:text-white tracking-tight">Invoices</h1>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white dark:bg-[#111111] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl">
                                <FileText size={24} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Total Issued</span>
                        </div>
                        <h3 className="text-3xl font-light text-gray-800 dark:text-white">{invoices.length}</h3>
                    </div>
                    <div className="bg-white dark:bg-[#111111] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-2xl">
                                <DollarSign size={24} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Revenue Collected</span>
                        </div>
                        <h3 className="text-3xl font-light text-gray-800 dark:text-white">
                            ${invoices.reduce((acc, inv) => acc + inv.amount, 0).toLocaleString()}
                        </h3>
                    </div>
                    <div className="bg-white dark:bg-[#111111] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-2xl">
                                <CheckCircle2 size={24} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Paid Invoices</span>
                        </div>
                        <h3 className="text-3xl font-light text-gray-800 dark:text-white">
                            {invoices.filter(inv => inv.status === 'Paid').length}
                        </h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#111111] rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
                    <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by Invoice # or Customer"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl border-none text-sm placeholder:text-gray-400 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#d98a6c44] transition-all"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-50 dark:border-gray-800 text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                    <th className="px-8 py-6">Invoice #</th>
                                    <th className="px-8 py-6">Customer</th>
                                    <th className="px-8 py-6">Date</th>
                                    <th className="px-8 py-6">Amount</th>
                                    <th className="px-8 py-6 text-right">Status</th>
                                    <th className="px-8 py-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInvoices.map((inv, i) => (
                                    <tr key={inv._id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-[#1a1a1a] transition-colors">
                                        <td className="px-8 py-6">
                                            <span className="font-bold text-gray-900 dark:text-white">{inv.invoiceNumber}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-[#fdf2ef] dark:bg-[#2a1e1a] rounded-full flex items-center justify-center text-[#c47659] text-[10px] font-bold">
                                                    {inv.customerName.charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{inv.customerName}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-gray-400 dark:text-gray-500">
                                            {new Date(inv.issuedDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-bold text-gray-900 dark:text-gray-200">${inv.amount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => setSelectedInvoice(inv)}
                                                className="p-2 hover:bg-white dark:hover:bg-[#222] rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all text-gray-400 hover:text-[#c47659]"
                                            >
                                                <ExternalLink size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredInvoices.length === 0 && (
                            <div className="p-20 text-center text-gray-300 dark:text-gray-600 italic">No invoices found.</div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Invoice Detail Modal */}
            <AnimatePresence>
                {selectedInvoice && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedInvoice(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-[#1a1a1a] w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors"
                        >
                            <header className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-[#222]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white dark:bg-[#1a1a1a] rounded-2xl flex items-center justify-center text-[#d98a6c] shadow-sm">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedInvoice.invoiceNumber}</h2>
                                        <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">Issued on {new Date(selectedInvoice.issuedDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedInvoice(null)}
                                    className="p-3 hover:bg-white dark:hover:bg-[#1a1a1a] rounded-2xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                                >
                                    <X size={24} />
                                </button>
                            </header>

                            <div className="p-10">
                                <div className="grid grid-cols-2 gap-10 mb-10">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">Billed To</p>
                                        <div className="space-y-1">
                                            <p className="font-bold text-gray-900 dark:text-white">{selectedInvoice.customerName}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{selectedInvoice.customerEmail}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {selectedInvoice.billingAddress?.street}<br />
                                                {selectedInvoice.billingAddress?.city}, {selectedInvoice.billingAddress?.state} {selectedInvoice.billingAddress?.zip}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">Payment Summary</p>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Subtotal: ${(selectedInvoice.amount * 0.92).toFixed(2)}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Tax (8%): ${(selectedInvoice.amount * 0.08).toFixed(2)}</p>
                                            <p className="text-4xl font-light text-[#c47659] mt-4">${selectedInvoice.amount.toLocaleString()}</p>
                                            <span className="inline-block px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-[10px] font-bold uppercase tracking-widest mt-2">{selectedInvoice.status}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden mb-10">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50/50 dark:bg-[#222] border-b border-gray-100 dark:border-gray-800">
                                            <tr className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                                <th className="px-6 py-4">Item Description</th>
                                                <th className="px-6 py-4 text-center">Qty</th>
                                                <th className="px-6 py-4 text-right">Price</th>
                                                <th className="px-6 py-4 text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                            {selectedInvoice.items?.map((item: any, i: number) => (
                                                <tr key={i}>
                                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-200">{item.name}</td>
                                                    <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">{item.quantity}</td>
                                                    <td className="px-6 py-4 text-right text-sm text-gray-500 dark:text-gray-400">${item.price.toFixed(2)}</td>
                                                    <td className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-gray-200">${(item.price * item.quantity).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <button
                                    onClick={() => handleDownloadPDF(selectedInvoice)}
                                    className="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black dark:hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
                                >
                                    <Download size={18} />
                                    Download PDF Invoice
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
};

export default InvoicesPage;
