'use client';

import { motion } from 'framer-motion';

const ShopByTypeImage = () => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-1 flex-col items-end justify-start bg-cover bg-center p-12 overflow-hidden group"
        >
            <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 bg-cover bg-center transition-transform"
                style={{ backgroundImage: "url('/shop-by-type-bg.png')" }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

            <motion.a
                href="#"
                whileHover={{ x: 10 }}
                className="relative z-10 text-xl font-medium tracking-wide text-white underline decoration-white underline-offset-8 transition-all hover:text-[#d98a6c] hover:decoration-[#d98a6c]"
            >
                Skincare &gt;
            </motion.a>
        </motion.div>
    );
};

export default ShopByTypeImage;
