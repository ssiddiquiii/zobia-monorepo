'use client';

import { motion } from 'framer-motion';

const ShopByTypeContent = () => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-1 items-center justify-center bg-[#fdf2ef] px-10 text-center"
        >
            <h2 className="text-6xl font-light tracking-tight text-[#c47659] sm:text-7xl lg:text-8xl leading-none max-w-xl">
                Shop by<br />
                Product Type
            </h2>
        </motion.div>
    );
};

export default ShopByTypeContent;
