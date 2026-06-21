'use client';

import { motion } from 'framer-motion';

interface CategoryCardProps {
    title: string;
    image: string;
    link: string;
    compact?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, image, link, compact = false }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={`relative group w-full overflow-hidden ${compact ? 'h-[40vh] md:h-[50vh]' : 'h-[80vh] md:h-screen'}`}
        >
            {/* Background Image with Zoom on Hover */}
            <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${image}')` }}
            />

            {/* Overlay for better text readability on hover */}
            <div className="absolute inset-0 bg-black/0 transition-colors duration-700 group-hover:bg-black/15" />

            {/* Content */}
            <div className={`absolute top-0 left-0 w-full ${compact ? 'p-6' : 'p-12'}`}>
                <motion.a
                    href={link}
                    whileHover={{ x: 15 }}
                    className={`inline-block ${compact ? 'text-base md:text-lg' : 'text-xl'} font-medium tracking-wide text-[#333] underline decoration-[#333] underline-offset-8 transition-all hover:text-[#d98a6c] hover:decoration-[#d98a6c]`}
                >
                    {title} &gt;
                </motion.a>
            </div>
        </motion.div>
    );
};

export default CategoryCard;
