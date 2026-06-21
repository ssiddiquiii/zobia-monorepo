import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '@/lib/redux/features/favoritesSlice';
import { addToCart } from '@/lib/redux/features/cartSlice';
import { RootState } from '@/lib/redux/store';

interface ProductCardProps {
    id: string;
    name: string;
    price: string | number;
    image: string;
    index: number;
    stock: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, image, index, stock }) => {
    const dispatch = useDispatch();
    const favoriteItems = useSelector((state: RootState) => state.favorites.items);
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const isFavorite = favoriteItems.some(item => item.id === id);
    const cartItem = cartItems.find(item => item.id === id);
    const currentQty = cartItem ? cartItem.quantity : 0;

    const numericPrice = typeof price === 'string' ? parseFloat(price.replace('$', '')) : price;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentQty + 1 > stock) {
            alert(`Sorry, only ${stock} items available in stock.`);
            return;
        }
        dispatch(addToCart({ id, name, price: numericPrice, image, stock }));
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(toggleFavorite({ id, name, price: numericPrice, image, stock }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col items-center ${stock === 0 ? 'opacity-70' : ''}`}
        >
            <div className="relative w-full aspect-square overflow-hidden mb-6 group cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-500">
                <motion.div
                    whileHover={stock > 0 ? { scale: 1.08 } : {}}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${image}')` }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

                {/* Out of Stock Badge */}
                {stock === 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg z-10">
                        Out of Stock
                    </div>
                )}

                {/* Actions Overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleToggleFavorite}
                        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-colors ${isFavorite ? 'bg-[#d98a6c] text-white' : 'bg-white text-gray-800 hover:text-[#d98a6c]'
                            }`}
                    >
                        <Heart size={20} fill={isFavorite ? "currentColor" : "none"} strokeWidth={1.5} />
                    </motion.button>
                    {stock > 0 && currentQty < stock && (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleAddToCart}
                            className="w-12 h-12 bg-white text-gray-800 rounded-full flex items-center justify-center shadow-xl hover:text-[#d98a6c] transition-colors"
                        >
                            <ShoppingCart size={20} strokeWidth={1.5} />
                        </motion.button>
                    )}
                </div>
            </div>
            <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                className="text-xl font-light text-[#333] mb-1"
            >
                {name}
            </motion.h3>
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.15 + 0.4 }}
                className="text-lg font-medium text-[#c47659]"
            >
                {typeof price === 'number' ? `$${price}` : price}
            </motion.p>
            {stock <= 5 && stock > 0 && (
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1">Low Stock: {stock} left</p>
            )}
        </motion.div>
    );
};

export default ProductCard;
