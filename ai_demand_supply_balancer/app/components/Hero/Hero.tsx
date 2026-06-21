'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const Hero = () => {
    return (
        <section
            className="relative flex min-h-screen w-full items-center justify-center bg-cover bg-center overflow-hidden py-20"
            style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/hero-bg.png')" }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 max-w-4xl px-6 text-center text-white"
            >
                <motion.h1
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-8 text-4xl font-extralight tracking-tight text-white sm:text-6xl md:text-8xl leading-tight sm:leading-none"
                >
                    Fleure Beauty's<br />
                    Sunkissed Collection
                </motion.h1>
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    whileHover={{ scale: 1.05, translateY: -4 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{
                        y: { delay: 1.2, duration: 1, ease: [0.16, 1, 0.3, 1] },
                        opacity: { delay: 1.2, duration: 1 },
                        scale: { duration: 0.3 },
                        translateY: { duration: 0.3 }
                    }}
                >
                    <Link
                        href="/products"
                        className="inline-block bg-[#d98a6c] px-10 py-4 text-sm font-medium tracking-[0.2em] text-white uppercase transition-shadow duration-300 hover:shadow-2xl active:scale-95 cursor-pointer"
                    >
                        Buy Here &gt;
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
