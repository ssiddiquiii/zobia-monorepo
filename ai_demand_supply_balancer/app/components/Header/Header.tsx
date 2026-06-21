'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, ShoppingCart, Heart, User, LogOut, Mail, Shield } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/lib/redux/features/authSlice';
import { fetchCart } from '@/lib/redux/features/cartSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';

const Header = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const favoriteItems = useSelector((state: RootState) => state.favorites.items);

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const favoriteCount = favoriteItems.length;

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCart());
        }
    }, [isAuthenticated, dispatch]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show header when scrolling up, hide when scrolling down
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down
                setIsVisible(false);
                setIsMobileMenuOpen(false);
            } else {
                // Scrolling up
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Collection', href: '/products' },
        { name: 'Shop By Type', href: '/#shop-by-type' },
        { name: 'Categories', href: '/#categories' },
        { name: 'Bestsellers', href: '/#bestsellers' },
        { name: 'Locations', href: '/#locations' },
    ];

    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    const handleLogout = () => {
        dispatch(logout());
        setIsMobileMenuOpen(false);
        setIsProfileDropdownOpen(false);
    };

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    return (
        <>
            <AnimatePresence>
                {isVisible && (
                    <motion.header
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        exit={{ y: -100 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed top-0 left-0 right-0 z-50"
                    >
                        <nav className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
                            {/* Centered Navigation with Background */}
                            <div className="flex items-center justify-center">
                                <div className="bg-white/90 backdrop-blur-md shadow-sm rounded-full px-4 md:px-8 py-2 md:py-3 flex items-center gap-4 md:gap-8">
                                    {/* Desktop Navigation Links - Centered */}
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.1 }}
                                        className="hidden lg:flex items-center gap-8"
                                    >
                                        {navLinks.map((link, index) => (
                                            <motion.div
                                                key={link.name}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                                            >
                                                <Link
                                                    href={link.href}
                                                    className="text-gray-700 hover:text-[#c47659] font-medium transition-colors relative group text-sm whitespace-nowrap"
                                                >
                                                    {link.name}
                                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#c47659] transition-all duration-300 group-hover:w-full" />
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </motion.div>

                                    {/* Divider */}
                                    <div className="hidden lg:block w-px h-6 bg-gray-200"></div>

                                    {/* Cart & Fav Icons */}
                                    <div className="flex items-center gap-4 md:gap-6">
                                        <Link href="/favorites">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="relative p-1 text-gray-700 hover:text-[#c47659] transition-colors"
                                            >
                                                <Heart size={20} className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" strokeWidth={1.5} />
                                                {favoriteCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#d98a6c] text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                                                        {favoriteCount}
                                                    </span>
                                                )}
                                            </motion.button>
                                        </Link>

                                        <Link href="/cart">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="relative p-1 text-gray-700 hover:text-[#c47659] transition-colors"
                                            >
                                                <ShoppingCart size={20} className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" strokeWidth={1.5} />
                                                {cartCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-900 text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                                                        {cartCount}
                                                    </span>
                                                )}
                                            </motion.button>
                                        </Link>
                                    </div>

                                    {/* Auth Buttons - Desktop */}
                                    {!isAuthenticated ? (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.3 }}
                                            className="hidden lg:flex items-center gap-3"
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Link
                                                    href="/login"
                                                    className="px-5 py-2 text-gray-700 font-medium hover:text-[#c47659] transition-colors text-sm whitespace-nowrap"
                                                >
                                                    Login
                                                </Link>
                                            </motion.div>
                                            <motion.div
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Link
                                                    href="/signup"
                                                    className="px-6 py-2 bg-gradient-to-r from-[#d98a6c] to-[#c47659] text-white font-medium rounded-full shadow-lg shadow-[#d98a6c33] hover:shadow-xl hover:shadow-[#d98a6c44] transition-all text-sm whitespace-nowrap"
                                                >
                                                    Sign Up
                                                </Link>
                                            </motion.div>
                                        </motion.div>
                                    ) : (
                                        <div className="hidden lg:block relative">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={toggleProfileDropdown}
                                                className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d98a6c] to-[#c47659] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-[#d98a6c22] transition-transform"
                                            >
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </motion.button>

                                            {/* Profile Dropdown - Desktop */}
                                            <AnimatePresence>
                                                {isProfileDropdownOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                                                    >
                                                        {/* User Info Section */}
                                                        <div className="p-5 bg-gradient-to-br from-[#fdf6f2] to-white border-b border-gray-100">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d98a6c] to-[#c47659] text-white flex items-center justify-center font-bold text-lg shadow-md">
                                                                    {user?.name?.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-semibold text-gray-800 truncate">{user?.name}</p>
                                                                    <p className="text-xs text-[#c47659] uppercase tracking-wider font-medium">{user?.role}</p>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 text-gray-600">
                                                                    <Mail size={14} className="text-[#d98a6c]" />
                                                                    <p className="text-xs truncate">{user?.email}</p>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-gray-600">
                                                                    <Shield size={14} className="text-[#d98a6c]" />
                                                                    <p className="text-xs">Verified Member</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="p-2">
                                                            <Link href="/profile" onClick={() => setIsProfileDropdownOpen(false)}>
                                                                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors text-sm font-medium">
                                                                    <User size={16} />
                                                                    View Profile
                                                                </button>
                                                            </Link>
                                                            <button
                                                                onClick={handleLogout}
                                                                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
                                                            >
                                                                <LogOut size={16} />
                                                                Logout
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )}

                                    {/* Mobile Menu Button */}
                                    <div className="lg:hidden flex items-center">
                                        <button
                                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                            className="p-1.5 text-gray-700 hover:text-[#c47659] transition-colors"
                                        >
                                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </motion.header>
                )}
            </AnimatePresence>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && isVisible && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed top-[70px] md:top-[90px] left-0 right-0 z-40 lg:hidden overflow-hidden flex justify-center px-6"
                    >
                        <div className="bg-white/95 backdrop-blur-md shadow-lg rounded-3xl max-w-md w-full">
                            <nav className="px-6 py-6 space-y-4">
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={handleLinkClick}
                                            className="block py-2 text-gray-700 hover:text-[#c47659] font-medium transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                ))}

                                <div className="pt-4 border-t border-gray-200 flex flex-col gap-4">
                                    {!isAuthenticated ? (
                                        <>
                                            <Link
                                                href="/login"
                                                onClick={handleLinkClick}
                                                className="block py-2 text-gray-700 hover:text-[#c47659] font-medium transition-colors"
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                href="/signup"
                                                onClick={handleLinkClick}
                                                className="w-full py-4 bg-gradient-to-r from-[#d98a6c] to-[#c47659] text-white font-medium rounded-2xl shadow-lg text-sm text-center"
                                            >
                                                Sign Up
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                                <button className="flex items-center gap-3 py-2 text-[#d98a6c] font-bold uppercase tracking-widest text-xs w-full">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d98a6c] to-[#c47659] text-white flex items-center justify-center font-bold text-xs shadow-md shadow-[#d98a6c22]">
                                                        {user?.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    My Profile
                                                </button>
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 py-2 text-red-500 font-medium transition-colors"
                                            >
                                                <LogOut size={18} />
                                                Logout
                                            </button>
                                        </>
                                    )}
                                </div>
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
