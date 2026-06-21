'use client';

import React from 'react';
import CategoryCard from './CategoryCard';

const ProductCategories = () => {
    const skincareCategories = [
        { title: "Cleansers", image: "/skincare-cleansers.png", link: "/products?category=cleansers" },
        { title: "Moisturizers", image: "/skincare-moisturizers.png", link: "/products?category=moisturizers" },
        { title: "Serums", image: "/skincare-serums.png", link: "/products?category=serums" },
        { title: "Sunscreen", image: "/skincare-sunscreen.png", link: "/products?category=sunscreen" },
        { title: "Toners", image: "/skincare-toners.png", link: "/products?category=toners" },
        { title: "Face Masks", image: "/skincare-masks.png", link: "/products?category=face-masks" },
        { title: "Eye Care", image: "/skincare-eyecare.png", link: "/products?category=eye-care" },
    ];

    return (
        <section className="w-full border-t border-gray-100">
            {/* Main Featured Categories */}
            <div className="flex flex-col md:flex-row w-full overflow-hidden">
                <CategoryCard
                    title="Cleansers"
                    image="/skincare-cleansers.png"
                    link="/products?category=cleansers"
                />
                <div className="w-[2px] bg-white hidden md:block" />
                <CategoryCard
                    title="Moisturizers"
                    image="/skincare-moisturizers.png"
                    link="/products?category=moisturizers"
                />
            </div>

            {/* Additional Skincare Categories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-[2px] bg-white mt-[2px]">
                {skincareCategories.slice(2).map((category, index) => (
                    <CategoryCard
                        key={category.title}
                        title={category.title}
                        image={category.image}
                        link={category.link}
                        compact={true}
                    />
                ))}
            </div>
        </section>
    );
};

export default ProductCategories;
