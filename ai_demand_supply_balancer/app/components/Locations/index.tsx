'use client';

import { motion } from 'framer-motion';
import LocationItem from './LocationItem';

const locations = [
    {
        address: "408 Byers Lane",
        city: "Sacramento, CA 94260"
    },
    {
        address: "2507 Snowbird Lane",
        city: "Bellevue, NE 68005"
    },
    {
        address: "189 49th Avenue Grise Fiord,",
        city: "NU X0A 0J0"
    },
    {
        address: "163 Woodlands Place Algies",
        city: "Bay, Rodney 0920"
    }
];

const Locations = () => {
    return (
        <section className="flex flex-col md:flex-row min-h-screen w-full overflow-hidden">
            {/* Left Content Area (Text) */}
            <motion.div
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-1 flex-col justify-center bg-[#d98a6c] px-8 md:px-24 py-16 md:py-0"
            >
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="text-4xl sm:text-6xl md:text-8xl font-extralight text-white mb-10 md:mb-16"
                >
                    Our Locations
                </motion.h2>

                <div className="flex flex-col">
                    {locations.map((loc, index) => (
                        <LocationItem
                            key={index}
                            index={index}
                            address={loc.address}
                            city={loc.city}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Right Image Area */}
            <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-1 overflow-hidden"
            >
                <motion.div
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: "url('/hero-bg.png')" }}
                />
                <div className="absolute inset-0 bg-black/5" />
            </motion.div>
        </section>
    );
};

export default Locations;
