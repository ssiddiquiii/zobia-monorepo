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

export default function SignupScreen() {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'Please fill all fields' });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match' });
      return;
    }
    if (password.length < 6) {
      Toast.show({ type: 'error', text1: 'Password must be at least 6 characters' });
      return;
    }
    setLoading(true);
    try {
      const { data } = await apiClient.post(API_ROUTES.signup, { name, email, password });
      await SecureStore.setItemAsync('token', data.token);
      dispatch(setCredentials({ token: data.token, user: data.user }));
      Toast.show({ type: 'success', text1: 'Account created!', text2: `Welcome, ${name}!` });
      router.replace('/(tabs)');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Signup failed. Try again.';
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
        <View className="px-6 pt-20 pb-8 items-center">
          <Image 
             source={require('../../assets/images/logo.jpeg')} 
             style={{ width: 80, height: 80, borderRadius: 24, marginBottom: 16 }} 
          />
          <Text className="text-gray-800 text-3xl font-bold text-center">Create Account</Text>
          <Text className="text-gray-500 text-base mt-2 text-center">Join us to start shopping</Text>
        </View>

        {/* Form */}
        <View className="flex-1 px-6 pt-4 bg-white rounded-t-[40px] shadow-sm shadow-brand/10">
          <View className="mt-8">
            <Text className="text-gray-700 text-sm font-semibold mb-2 ml-1">Full Name</Text>
            <TextInput
              placeholderTextColor="#9ca3af"
              className="border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 bg-gray-50/50 mb-5 focus:border-brand-light focus:bg-white"
              placeholder="Your full name"
              value={name}
              onChangeText={setName}
            />

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
            <View className="relative mb-5 justify-center">
              <TextInput
                placeholderTextColor="#9ca3af"
                className="border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 bg-gray-50/50 focus:border-brand-light focus:bg-white pr-12"
                placeholder="Min. 6 characters"
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

            <Text className="text-gray-700 text-sm font-semibold mb-2 ml-1">Confirm Password</Text>
            <View className="relative mb-8 justify-center">
              <TextInput
                placeholderTextColor="#9ca3af"
                className="border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 bg-gray-50/50 focus:border-brand-light focus:bg-white pr-12"
                placeholder="Repeat password"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                className="absolute right-4"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View className="py-4">
                 <ActivityIndicator color="#c47659" size="large" />
              </View>
            ) : (
              <GradientButton title="Create Account" onPress={handleSignup} />
            )}

            <View className="flex-row justify-center mt-8 pb-10">
              <Text className="text-gray-500">Already have an account? </Text>
              <Link href="/(auth)/login">
                <Text className="text-brand font-bold">Sign In</Text>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
