import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  FlatList, ActivityIndicator, RefreshControl, Image, Dimensions, TextInput
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import apiClient from '../../lib/axiosClient';
import { API_ROUTES } from '../../lib/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductCard } from '../../components/ProductCard';
import { addToCart, syncCart } from '../../store/cartSlice';
import { toggleWishlistApi } from '../../store/wishlistSlice';
import Toast from 'react-native-toast-message';
import { Search as SearchIcon } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((s: RootState) => s.auth);
  const wishlistItems = useSelector((s: RootState) => s.wishlist.items);
  const cartItems = useSelector((s: RootState) => s.cart.items);
  
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchProducts = async () => {
    try {
      const { data } = await apiClient.get(API_ROUTES.products);
      setAllProducts(data);
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

  // Compute Categories dynamically
  const categories = ['All', ...Array.from(new Set(allProducts.map(p => p.category).filter(Boolean)))];
  
  // Filter products based on search and category
  const displayedProducts = allProducts.filter(p => {
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
  });

  const renderProduct = (item: any) => (
    <View key={item._id} style={{ marginBottom: 16 }}>
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
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchProducts(); }} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-6 flex-row justify-between items-center">
          <View className="flex-row items-center">
             <Image source={require('../../assets/images/logo.jpeg')} style={{ width: 44, height: 44, borderRadius: 22, marginRight: 12 }} />
             <View>
               <Text className="text-gray-500 text-sm font-medium">Hello there 👋</Text>
               <Text className="text-gray-900 text-xl font-bold mt-0.5">
                 {user?.name?.split(' ')[0] || 'Guest'}
               </Text>
             </View>
          </View>
          <TouchableOpacity 
            className="w-10 h-10 rounded-full bg-brand-light/20 items-center justify-center shadow-sm"
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Text className="text-brand font-bold text-lg">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="mx-6 bg-gray-50 rounded-2xl px-5 py-2 flex-row items-center border border-gray-100 shadow-sm">
          <SearchIcon size={20} color="#9ca3af" />
          <TextInput 
            placeholderTextColor="#9ca3af"
            placeholder="Search for products..." 
            className="flex-1 ml-3 text-gray-900 text-base h-12"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Hero Section */}
        <View className="mx-6 mt-8 rounded-3xl overflow-hidden bg-brand-light shadow-md shadow-brand/20" style={{ height: 160 }}>
           <View className="absolute inset-0 bg-black/10" />
           <View className="flex-1 p-6 justify-center">
              <Text className="text-white text-xs font-bold tracking-widest uppercase mb-2">New Collection</Text>
              <Text className="text-white text-2xl font-bold w-2/3">Discover Premium Quality</Text>
              <TouchableOpacity className="bg-white px-4 py-2 rounded-full self-start mt-4" onPress={() => router.push('/(tabs)/products')}>
                 <Text className="text-brand text-xs font-bold uppercase">Shop Now</Text>
              </TouchableOpacity>
           </View>
        </View>

        {/* Categories (Shop By Type) */}
        <View className="mt-8 px-6">
           <Text className="text-gray-900 text-lg font-bold mb-4">Shop By Type</Text>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {categories.map((cat: any) => (
                 <TouchableOpacity 
                    key={cat} 
                    onPress={() => setSelectedCategory(cat)}
                    className={`mr-3 px-6 py-2 rounded-full border ${selectedCategory === cat ? 'bg-brand border-brand' : 'bg-white border-gray-200'}`}
                 >
                    <Text className={`${selectedCategory === cat ? 'text-white' : 'text-gray-600'} font-medium`}>{cat}</Text>
                 </TouchableOpacity>
              ))}
           </ScrollView>
        </View>

        {/* All Products Grid */}
        <View className="mt-10 px-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-900 text-lg font-bold">
              {searchQuery ? 'Search Results' : selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#c47659" className="py-8" />
          ) : displayedProducts.length === 0 ? (
            <Text className="text-gray-500 text-center py-8">No products found.</Text>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {displayedProducts.map(item => renderProduct(item))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
