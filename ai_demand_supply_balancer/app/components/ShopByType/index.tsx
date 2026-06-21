'use client';

import ShopByTypeContent from './ShopByTypeContent';
import ShopByTypeImage from './ShopByTypeImage';

const ShopByType = () => {
    return (
        <section className="flex flex-col md:flex-row h-auto md:h-screen w-full overflow-hidden border-b border-gray-100">
            <ShopByTypeContent />
            <ShopByTypeImage />
        </section>
    );
};

export default ShopByType;
