'use client';

import { motion } from 'framer-motion';
import SocialIcons from './SocialIcons';

const Footer = () => {
    return (
        <section className="flex flex-col md:flex-row h-screen w-full overflow-hidden border-t border-gray-100">
            {/* Left Image Area */}
            <motion.div
                initial={{ opacity: 0, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.5 }}
                className="relative flex flex-1 overflow-hidden"
            >
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: "url('/makeup.png')" }}
                />
                <div className="absolute inset-0 bg-black/5" />
            </motion.div>

            {/* Right Content Area */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1, delay: 0.2 }}
                className="flex flex-1 flex-col items-center justify-center bg-[#fdf2ef] px-12 md:px-24 text-center"
            >
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h2 className="text-6xl md:text-8xl font-extralight text-[#c47659] mb-4">
                        Stay updated!
                    </h2>
                    <motion.a
                        href="#"
                        whileHover={{ x: 8 }}
                        className="inline-block text-2xl font-light text-[#c47659] underline decoration-[#c47659] underline-offset-8 transition-colors hover:text-[#d98a6c]"
                    >
                        Sign up for our newsletter
                    </motion.a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-32"
                >
                    <h3 className="text-4xl font-light text-[#c47659] uppercase tracking-widest mb-4">
                        Need anything?
                    </h3>
                    <p className="text-xl font-light text-[#c47659] mb-12">
                        hello@reallygreatsite.com
                    </p>

                    <SocialIcons />

                    <p className="mt-12 text-lg font-light text-[#c47659]">
                        @reallygreatsite
                    </p>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Footer;
