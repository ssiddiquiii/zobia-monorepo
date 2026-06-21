import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { RootState } from '../../store';
import Toast from 'react-native-toast-message';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((s: RootState) => s.auth);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    dispatch(logout());
    Toast.show({ type: 'success', text1: 'Logged out' });
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-6">
        <Text className="text-2xl font-bold text-gray-900 mb-6">👤 Profile</Text>

        <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
          <Text className="text-gray-500 text-sm">Name</Text>
          <Text className="text-gray-900 font-semibold text-base">{user?.name || '—'}</Text>
        </View>

        <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
          <Text className="text-gray-500 text-sm">Email</Text>
          <Text className="text-gray-900 font-semibold text-base">{user?.email || '—'}</Text>
        </View>

        <TouchableOpacity
          className="bg-white rounded-2xl p-4 mb-4 border border-gray-100"
          onPress={() => router.push('/setup')}
        >
          <Text className="text-gray-500 text-sm">⚙️ Server Configuration</Text>
          <Text className="text-blue-600 text-sm mt-1">Change server URL</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-50 rounded-2xl py-4 items-center mt-4 border border-red-100"
          onPress={handleLogout}
        >
          <Text className="text-red-600 font-bold">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
