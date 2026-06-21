'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LocationItemProps {
    address: string;
    city: string;
    index: number;
}

const LocationItem: React.FC<LocationItemProps> = ({ address, city, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
            className="mb-10 last:mb-0"
        >
            <p className="text-xl font-light text-white/90 leading-relaxed">
                {address}<br />
                {city}
            </p>
        </motion.div>
    );
};

export default LocationItem;
