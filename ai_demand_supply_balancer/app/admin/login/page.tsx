'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/lib/redux/features/authSlice';
import { Eye, EyeOff } from 'lucide-react';

const AdminLoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    requiredRole: 'admin'
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            // Save to Redux
            dispatch(setCredentials({
                user: data.admin,
                token: data.token
            }));

            alert('Login successful! Redirecting to dashboard...');
            window.location.href = '/admin';
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fdf2ef] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white rounded-[2rem] shadow-xl p-10 border border-[#fdf2ef]"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-[#d98a6c] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-light text-gray-800 tracking-tight">Admin Login</h1>
                    <p className="text-gray-400 mt-2">Welcome back to Fleure Beauty Portal</p>
                </div>

                {error && (
                    <motion.div initial={{ x: -10 }} animate={{ x: 0 }} className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm">
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-[#fdf2ef] transition-all"
                            placeholder="admin@fleure.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-[#fdf2ef] transition-all pr-12"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#d98a6c] text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0] transition-all disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Hint: admin@fleure.com / admin123
                    </div>
                </form>

                <p className="text-center mt-8 text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link href="/admin/signup" className="text-[#c47659] font-semibold hover:underline">
                        Request Access
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLoginPage;
