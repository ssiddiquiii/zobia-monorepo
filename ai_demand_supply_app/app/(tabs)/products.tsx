import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import apiClient from '../../lib/axiosClient';
import { API_ROUTES } from '../../lib/api';
import { ProductCard } from '../../components/ProductCard';
import { addToCart, syncCart } from '../../store/cartSlice';
import { toggleWishlistApi } from '../../store/wishlistSlice';
import Toast from 'react-native-toast-message';

export default function ProductsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((s: RootState) => s.auth);
  const wishlistItems = useSelector((s: RootState) => s.wishlist.items);
  const cartItems = useSelector((s: RootState) => s.cart.items);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async () => {
    try {
      const { data } = await apiClient.get(API_ROUTES.products);
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 pt-6 pb-4 border-b border-gray-100">
        <Text className="text-3xl font-bold text-gray-900 tracking-tight">Collection</Text>
        <Text className="text-gray-500 mt-1 font-medium">Find your perfect item</Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
           <ActivityIndicator size="large" color="#c47659" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(i) => i._id}
          numColumns={2}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchProducts(); }} />}
          renderItem={({ item }) => (
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
          )}
          ListEmptyComponent={() => (
             <View className="py-20 items-center opacity-50">
                <Text className="text-4xl mb-4">📦</Text>
                <Text className="text-gray-500 font-medium">No products found</Text>
             </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
