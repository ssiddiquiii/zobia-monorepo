import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import apiClient from '../../lib/axiosClient';
import { API_ROUTES } from '../../lib/api';
import { Search, Package, CheckCircle2, Truck, Clock } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

export default function OrdersScreen() {
  const { user } = useSelector((s: RootState) => s.auth);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [trackingId, setTrackingId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<any>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const fetchOrders = async () => {
    if (!user) { setLoading(false); return; }
    try {
      const { data } = await apiClient.get(`${API_ROUTES.orders}?customerId=${user.id}`);
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackOrder = async (idToTrack = trackingId) => {
      if (!idToTrack.trim()) return;
      setTrackingLoading(true);
      try {
          const { data } = await apiClient.get(API_ROUTES.order(idToTrack.trim()));
          setTrackedOrder(data);
      } catch (err) {
          Toast.show({ type: 'error', text1: 'Order not found' });
          setTrackedOrder(null);
      } finally {
          setTrackingLoading(false);
      }
  };

  // Live polling for tracking and history
  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      if (user) fetchOrders();
      if (trackedOrder && trackingId) {
         apiClient.get(API_ROUTES.order(trackingId.trim())).then(res => setTrackedOrder(res.data)).catch(() => {});
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [user, trackingId, trackedOrder]);

  const renderStatusIcon = (status: string) => {
      switch (status) {
          case 'Processing': return <Clock color="#eab308" size={24} />;
          case 'Shipped': return <Truck color="#3b82f6" size={24} />;
          case 'Delivered': return <CheckCircle2 color="#22c55e" size={24} />;
          default: return <Package color="#9ca3af" size={24} />;
      }
  };

  if (!user) {
      return (
          <SafeAreaView className="flex-1 bg-white justify-center items-center">
              <Text className="text-gray-500 font-medium">Please login to view your orders</Text>
          </SafeAreaView>
      );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">Track Order</Text>
        <Text className="text-gray-500">Enter your order ID below</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-4 pb-20">
        
        {/* Tracker Input */}
        <View className="bg-white p-4 rounded-2xl mb-6 shadow-sm border border-gray-100">
            <View className="flex-row items-center bg-gray-50 rounded-xl px-3 border border-gray-200">
                <Search color="#9ca3af" size={20} />
                <TextInput 
                  placeholderTextColor="#9ca3af"
                    placeholder="e.g. 64b3c..." 
                    value={trackingId} onChangeText={setTrackingId}
                    className="flex-1 p-3 text-gray-900"
                />
                <TouchableOpacity onPress={handleTrackOrder} disabled={trackingLoading} className="bg-brand px-4 py-2 rounded-lg">
                    {trackingLoading ? <ActivityIndicator color="#fff" size="small" /> : <Text className="text-white font-bold">Track</Text>}
                </TouchableOpacity>
            </View>

            {/* Tracked Order Result */}
            {trackedOrder && (
                <View className="mt-4 pt-4 border-t border-gray-100">
                    <Text className="font-bold text-gray-900 mb-2">Order Status</Text>
                    <View className="flex-row items-center p-3 bg-gray-50 rounded-xl">
                        {renderStatusIcon(trackedOrder.status)}
                        <View className="ml-3 flex-1">
                            <Text className="font-bold text-gray-900 text-lg">{trackedOrder.status}</Text>
                            <Text className="text-gray-500 text-xs">Updated: {new Date(trackedOrder.updatedAt).toLocaleDateString()}</Text>
                        </View>
                        <Text className="text-brand font-bold">Rs. {trackedOrder.total}</Text>
                    </View>
                </View>
            )}
        </View>

        {/* Order History */}
        <Text className="font-bold text-gray-900 text-lg mb-3">Order History</Text>
        
        {loading ? (
            <ActivityIndicator color="#c47659" />
        ) : orders.length === 0 ? (
            <Text className="text-gray-500 text-center py-8">No orders found.</Text>
        ) : (
            orders.map(order => (
                <View key={order._id} className="bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-100">
                    <View className="flex-row justify-between mb-2 pb-2 border-b border-gray-100">
                        <Text className="text-gray-500 text-xs">ID: {order._id.slice(-8).toUpperCase()}</Text>
                        <Text className="text-gray-500 text-xs">{new Date(order.date).toLocaleDateString()}</Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                            {renderStatusIcon(order.status)}
                            <Text className="ml-2 font-bold text-gray-900">{order.status}</Text>
                        </View>
                        <Text className="font-bold text-brand">Rs. {order.total}</Text>
                    </View>
                </View>
            ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
