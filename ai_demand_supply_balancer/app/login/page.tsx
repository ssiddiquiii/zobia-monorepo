'use client';

import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Header from '../components/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '@/lib/redux/features/authSlice';
import { RootState } from '@/lib/redux/store';

function LoginContent() {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const redirect = searchParams.get('redirect') || '/';

    useEffect(() => {
        if (isAuthenticated) {
            router.replace(redirect === '/login' ? '/profile' : redirect);
        }
    }, [isAuthenticated, redirect, router]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    requiredRole: 'customer'
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            // Update Redux Store
            dispatch(setCredentials({ user: data.user, token: data.token }));

            // Redirect to home or intended page
            router.push(redirect);
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-32 pb-12 px-6 flex flex-col items-center justify-center min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-light text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-500">Sign in to manage your skincare journey</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex flex-col gap-2">
                            <p>{error}</p>
                            {error.includes('reset your password') && (
                                <Link href="/signup" className="text-[#c47659] font-semibold hover:underline">
                                    Click here to set your password via Signup &rarr;
                                </Link>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full px-5 py-3 rounded-xl border border-gray-200 text-gray-900 focus:border-[#d98a6c] focus:ring-2 focus:ring-[#d98a6c]/20 outline-none transition-all"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full px-5 py-3 rounded-xl border border-gray-200 text-gray-900 focus:border-[#d98a6c] focus:ring-2 focus:ring-[#d98a6c]/20 outline-none transition-all pr-12"
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
                            className="w-full py-3.5 bg-gradient-to-r from-[#d98a6c] to-[#c47659] text-white font-medium rounded-xl shadow-lg shadow-[#d98a6c33] hover:shadow-xl hover:shadow-[#d98a6c44] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-[#c47659] font-medium hover:underline">
                            Create one
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-[#faf9f6]">
            <Header />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#d98a6c]" /></div>}>
                <LoginContent />
            </Suspense>
        </main>
    );
}
