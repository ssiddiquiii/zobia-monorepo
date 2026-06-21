import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Image
} from 'react-native';
import { Link, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { setCredentials } from '../../store/authSlice';
import apiClient from '../../lib/axiosClient';
import { API_ROUTES } from '../../lib/api';
import { GradientButton } from '../../components/GradientButton';
import { Feather } from '@expo/vector-icons';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({ type: 'error', text1: 'Please fill all fields' });
      return;
    }
    setLoading(true);
    try {
      const { data } = await apiClient.post(API_ROUTES.login, { email, password });
      await SecureStore.setItemAsync('token', data.token);
      dispatch(setCredentials({ token: data.token, user: data.user }));
      Toast.show({ type: 'success', text1: 'Welcome back!' });
      router.replace('/(tabs)');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Login failed. Check your credentials.';
      Toast.show({ type: 'error', text1: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-brand-bg"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="px-6 pt-24 pb-10 items-center">
          <Image 
             source={require('../../assets/images/logo.jpeg')} 
             style={{ width: 80, height: 80, borderRadius: 24, marginBottom: 16 }} 
          />
          <Text className="text-gray-800 text-3xl font-bold text-center">Welcome Back</Text>
          <Text className="text-gray-500 text-base mt-2 text-center">Sign in to your account to continue</Text>
        </View>

        {/* Form */}
        <View className="flex-1 px-6 pt-4 bg-white rounded-t-[40px] shadow-sm shadow-brand/10">
          <View className="mt-8">
            <Text className="text-gray-700 text-sm font-semibold mb-2 ml-1">Email Address</Text>
            <TextInput
              placeholderTextColor="#9ca3af"
              className="border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 bg-gray-50/50 mb-5 focus:border-brand-light focus:bg-white"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text className="text-gray-700 text-sm font-semibold mb-2 ml-1">Password</Text>
            <View className="relative mb-8 justify-center">
              <TextInput
                placeholderTextColor="#9ca3af"
                className="border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 bg-gray-50/50 focus:border-brand-light focus:bg-white pr-12"
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                className="absolute right-4"
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View className="py-4">
                 <ActivityIndicator color="#c47659" size="large" />
              </View>
            ) : (
              <GradientButton title="Sign In" onPress={handleLogin} />
            )}

            <View className="flex-row justify-center mt-8">
              <Text className="text-gray-500">Don't have an account? </Text>
              <Link href="/(auth)/signup">
                <Text className="text-brand font-bold">Sign Up</Text>
              </Link>
            </View>

            {/* Server Setup link */}
            <TouchableOpacity
              className="mt-8 items-center"
              onPress={() => router.push('/setup')}
            >
              <Text className="text-gray-400 text-xs font-medium">⚙️ Configure Server URL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
