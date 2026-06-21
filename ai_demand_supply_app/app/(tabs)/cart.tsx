import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { updateQuantity, removeFromCart, clearCart, syncCart } from '../../store/cartSlice';
import { Plus, Minus, Trash2 } from 'lucide-react-native';
import { GradientButton } from '../../components/GradientButton';
import apiClient from '../../lib/axiosClient';
import { API_ROUTES } from '../../lib/api';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

export default function CartScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((s: RootState) => s.cart);
  const { user } = useSelector((s: RootState) => s.auth);

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const delivery = subtotal > 0 ? 150 : 0;
  const total = subtotal + delivery;

  const handleUpdateQuantity = (productId: string, current: number, delta: number, stock: number) => {
    const newQuantity = current + delta;
    if (newQuantity < 1) {
       dispatch(removeFromCart(productId));
       dispatch(syncCart(items.filter(i => i.productId !== productId)));
    } else if (newQuantity <= stock) {
       dispatch(updateQuantity({ productId, quantity: newQuantity }));
       dispatch(syncCart(items.map(i => i.productId === productId ? { ...i, quantity: newQuantity } : i)));
    }
  };

  const handleCheckout = async () => {
    if (!user) {
        Toast.show({ type: 'error', text1: 'Please login to checkout' });
        router.push('/(auth)/login');
        return;
    }
    if (items.length === 0) return;
    if (!address || !city || !postalCode) {
        Toast.show({ type: 'error', text1: 'Please fill in shipping details' });
        return;
    }

    setLoading(true);
    try {
        const orderPayload = {
            customerId: user.id,
            customerName: user.name,
            total,
            items,
            shippingAddress: { address, city, postalCode },
            paymentMethod: 'COD',
            status: 'Processing'
        };

        const { data } = await apiClient.post(API_ROUTES.orders, orderPayload);
        
        // Success
        dispatch(clearCart());
        dispatch(syncCart([]));
        
        Alert.alert(
            "Order Placed Successfully! 🎉", 
            `Your tracking ID is: ${data._id}\nKeep this ID to track your order.`,
            [{ text: "Track Order", onPress: () => router.push('/(tabs)/orders') }, { text: "OK" }]
        );
        setAddress(''); setCity(''); setPostalCode('');
    } catch (err: any) {
        Toast.show({ type: 'error', text1: err.response?.data?.message || 'Checkout failed' });
    } finally {
        setLoading(false);
    }
  };

  if (items.length === 0) {
      return (
          <SafeAreaView className="flex-1 bg-white justify-center items-center">
              <Text className="text-6xl mb-4">🛒</Text>
              <Text className="text-2xl font-bold text-gray-900">Your Cart is Empty</Text>
              <Text className="text-gray-500 mt-2 text-center px-8">Looks like you haven't added anything to your cart yet.</Text>
              <TouchableOpacity className="mt-8" onPress={() => router.push('/(tabs)')}>
                  <Text className="text-brand font-bold text-lg">Start Shopping</Text>
              </TouchableOpacity>
          </SafeAreaView>
      );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">Shopping Cart</Text>
        <Text className="text-gray-500">{items.length} Items</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        {/* Cart Items */}
        {items.map((item) => (
            <View key={item.productId} className="flex-row bg-white p-3 rounded-2xl mb-3 shadow-sm border border-gray-100 items-center">
                <Image source={{ uri: item.image || 'https://via.placeholder.com/100' }} className="w-20 h-20 rounded-xl bg-gray-100" />
                <View className="flex-1 ml-3">
                    <Text className="font-bold text-gray-900 text-base" numberOfLines={1}>{item.name}</Text>
                    <Text className="text-brand font-bold mt-1">${item.price.toLocaleString()}</Text>
                    
                    <View className="flex-row items-center justify-between mt-2">
                        <View className="flex-row items-center bg-gray-100 rounded-lg p-1">
                            <TouchableOpacity onPress={() => handleUpdateQuantity(item.productId, item.quantity, -1, item.stock)} className="w-6 h-6 items-center justify-center bg-white rounded-md shadow-sm">
                                <Minus size={14} color="#333" />
                            </TouchableOpacity>
                            <Text className="w-8 text-center font-bold text-sm">{item.quantity}</Text>
                            <TouchableOpacity onPress={() => handleUpdateQuantity(item.productId, item.quantity, 1, item.stock)} className="w-6 h-6 items-center justify-center bg-white rounded-md shadow-sm">
                                <Plus size={14} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => handleUpdateQuantity(item.productId, item.quantity, -item.quantity, item.stock)}>
                            <Trash2 size={18} color="#ef4444" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        ))}

        {/* Shipping Form */}
        <View className="bg-white p-4 rounded-2xl mt-4 border border-gray-100">
            <Text className="font-bold text-gray-900 text-lg mb-3">Shipping Details</Text>
            <TextInput 
              placeholderTextColor="#9ca3af"
                placeholder="Full Address" 
                value={address} onChangeText={setAddress} 
                className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-3 text-gray-900" 
            />
            <View className="flex-row gap-3">
                <TextInput 
                  placeholderTextColor="#9ca3af"
                    placeholder="City" 
                    value={city} onChangeText={setCity} 
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900" 
                />
                <TextInput 
                  placeholderTextColor="#9ca3af"
                    placeholder="Postal Code" 
                    value={postalCode} onChangeText={setPostalCode} 
                    keyboardType="numeric"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900" 
                />
            </View>
        </View>

        {/* Order Summary */}
        <View className="bg-white p-4 rounded-2xl mt-4 mb-24 border border-gray-100">
            <Text className="font-bold text-gray-900 text-lg mb-3">Order Summary</Text>
            <View className="flex-row justify-between mb-2">
                <Text className="text-gray-500">Subtotal</Text>
                <Text className="text-gray-900 font-medium">Rs. {subtotal.toLocaleString()}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
                <Text className="text-gray-500">Delivery Fee</Text>
                <Text className="text-gray-900 font-medium">Rs. {delivery.toLocaleString()}</Text>
            </View>
            <View className="flex-row justify-between mt-2 pt-3 border-t border-gray-100">
                <Text className="font-bold text-lg text-gray-900">Total (COD)</Text>
                <Text className="font-bold text-xl text-brand">Rs. {total.toLocaleString()}</Text>
            </View>

            <GradientButton 
                title={loading ? "Processing..." : "Place Order (COD)"} 
                onPress={handleCheckout} 
                containerStyle={{ marginTop: 24 }}
                disabled={loading}
            />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
