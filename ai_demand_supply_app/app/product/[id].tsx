import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, ArrowLeft, ShoppingCart, Minus, Plus } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { addToCart, syncCart } from '../../store/cartSlice';
import { toggleWishlistApi } from '../../store/wishlistSlice';
import apiClient from '../../lib/axiosClient';
import { API_ROUTES } from '../../lib/api';
import Toast from 'react-native-toast-message';
import { GradientButton } from '../../components/GradientButton';
import { ProductCard } from '../../components/ProductCard';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((s: RootState) => s.auth);
  const wishlistItems = useSelector((s: RootState) => s.wishlist.items);
  const cartItems = useSelector((s: RootState) => s.cart.items);
  
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const isFavorite = wishlistItems.includes(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch product
        const { data } = await apiClient.get(API_ROUTES.product(id));
        setProduct(data);
        
        // Fetch related products (we'll just fetch all and filter out current)
        const allRes = await apiClient.get(API_ROUTES.products);
        setRelated(allRes.data.filter((p: any) => p._id !== id).slice(0, 5));
      } catch (err) {
        console.error(err);
        Toast.show({ type: 'error', text1: 'Error loading product details' });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleToggleFavorite = () => {
    if (!user) { Toast.show({ type: 'error', text1: 'Please login first' }); return; }
    dispatch(toggleWishlistApi(id));
  };

  const handleAddToCart = () => {
    if (!user) { Toast.show({ type: 'error', text1: 'Please login first' }); return; }
    if (product.stock < quantity) {
        Toast.show({ type: 'error', text1: 'Not enough stock available' });
        return;
    }
    const newItem = { 
        productId: product._id, 
        name: product.name, 
        price: product.price, 
        image: product.image, 
        quantity, 
        stock: product.stock 
    };
    dispatch(addToCart(newItem));
    dispatch(syncCart([...cartItems.filter(i => i.productId !== newItem.productId), { ...newItem, quantity: (cartItems.find(i => i.productId === newItem.productId)?.quantity || 0) + quantity }]));
    Toast.show({ type: 'success', text1: 'Added to cart' });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#c47659" />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500 font-medium">Product not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 p-2 bg-gray-100 rounded-full">
            <ArrowLeft color="#333" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Image Header */}
        <View className="w-full h-96 bg-gray-100 relative">
          <Image source={{ uri: product.image || 'https://via.placeholder.com/600' }} className="w-full h-full" resizeMode="cover" />
          
          <SafeAreaView className="absolute top-0 left-0 right-0 flex-row justify-between px-4 pt-2">
            <TouchableOpacity 
                onPress={() => router.back()} 
                className="w-10 h-10 bg-white/80 rounded-full items-center justify-center backdrop-blur-md"
            >
              <ArrowLeft size={24} color="#1f2937" />
            </TouchableOpacity>
            
            <TouchableOpacity 
                onPress={handleToggleFavorite} 
                className="w-10 h-10 bg-white/80 rounded-full items-center justify-center backdrop-blur-md"
            >
              <Heart size={20} color={isFavorite ? '#c47659' : '#1f2937'} fill={isFavorite ? '#c47659' : 'transparent'} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Details Section */}
        <View className="px-6 pt-6 bg-white rounded-t-3xl -mt-6">
          <View className="flex-row justify-between items-start mb-2">
             <Text className="text-3xl font-bold text-gray-900 flex-1 mr-4">{product.name}</Text>
             <Text className="text-2xl font-bold text-brand">${product.price?.toLocaleString()}</Text>
          </View>
          
          <Text className="text-gray-500 text-sm mb-6">{product.category}</Text>
          
          <Text className="text-gray-700 leading-6 text-base">{product.description}</Text>

          {/* Stock & Quantity */}
          <View className="flex-row items-center justify-between mt-8 border-t border-b border-gray-100 py-4">
             <View>
                <Text className="text-gray-500 text-sm font-medium">Availability</Text>
                <Text className={`text-base font-bold mt-1 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                </Text>
             </View>

             {product.stock > 0 && (
                 <View className="flex-row items-center bg-gray-50 rounded-full p-1 border border-gray-200">
                    <TouchableOpacity 
                        className="w-8 h-8 items-center justify-center rounded-full bg-white shadow-sm"
                        onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                        <Minus size={16} color="#333" />
                    </TouchableOpacity>
                    <Text className="w-10 text-center font-bold text-lg">{quantity}</Text>
                    <TouchableOpacity 
                        className="w-8 h-8 items-center justify-center rounded-full bg-white shadow-sm"
                        onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    >
                        <Plus size={16} color="#333" />
                    </TouchableOpacity>
                 </View>
             )}
          </View>

          {/* Related Products */}
          {related.length > 0 && (
              <View className="mt-8">
                  <Text className="text-xl font-bold text-gray-900 mb-4">Related Products</Text>
                  <FlatList
                    data={related}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => (
                      <View style={{ marginRight: 16 }}>
                        <ProductCard
                          id={item._id}
                          name={item.name}
                          price={item.price}
                          image={item.image || 'https://via.placeholder.com/300'}
                          stock={item.stock}
                          isFavorite={wishlistItems.includes(item._id)}
                          onToggleFavorite={() => {
                              if (!user) { Toast.show({ type: 'error', text1: 'Please login first' }); return; }
                              dispatch(toggleWishlistApi(item._id));
                          }}
                          onAddToCart={() => {
                              if (!user) { Toast.show({ type: 'error', text1: 'Please login first' }); return; }
                              const newItem = { productId: item._id, name: item.name, price: item.price, image: item.image, quantity: 1, stock: item.stock };
                              dispatch(addToCart(newItem));
                              dispatch(syncCart([...cartItems, newItem]));
                              Toast.show({ type: 'success', text1: 'Added to cart' });
                          }}
                        />
                      </View>
                    )}
                  />
              </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Add to Cart Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8 flex-row items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
         <View>
            <Text className="text-gray-500 text-xs font-medium">Total Price</Text>
            <Text className="text-2xl font-bold text-gray-900">${(product.price * quantity).toLocaleString()}</Text>
         </View>
         <View className="w-1/2">
             <GradientButton 
                title={product.stock > 0 ? "Add to Cart" : "Out of Stock"} 
                onPress={handleAddToCart}
                disabled={product.stock === 0}
                containerStyle={{ opacity: product.stock > 0 ? 1 : 0.5 }}
             />
         </View>
      </View>
    </View>
  );
}
