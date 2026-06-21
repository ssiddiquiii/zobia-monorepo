import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { getBaseUrl, saveBaseUrl } from '../lib/api';

export default function SetupScreen() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    getBaseUrl().then(setUrl);
  }, []);

  const handleSave = async () => {
    if (!url.startsWith('http')) {
      Toast.show({ type: 'error', text1: 'URL must start with http://' });
      return;
    }
    await saveBaseUrl(url);
    Toast.show({ type: 'success', text1: 'Server URL saved!', text2: 'Connecting to: ' + url });
    setTimeout(() => router.back(), 1200);
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      <Text className="text-2xl font-bold text-gray-900 mb-2">Server Setup</Text>
      <Text className="text-gray-500 text-sm mb-8">
        Enter the IP address of the computer running the web project.{'\n'}
        Both devices must be on the same WiFi network.
      </Text>

      {/* Instructions */}
      <View className="bg-blue-50 rounded-xl p-4 mb-6">
        <Text className="text-blue-800 font-semibold text-sm mb-2">How to find your IP:</Text>
        <Text className="text-blue-700 text-xs">1. Open Command Prompt (cmd)</Text>
        <Text className="text-blue-700 text-xs">2. Type: ipconfig</Text>
        <Text className="text-blue-700 text-xs">3. Look for "IPv4 Address"</Text>
        <Text className="text-blue-700 text-xs mt-2 font-semibold">
          Example: http://192.168.1.5:3000
        </Text>
      </View>

      <Text className="text-gray-700 text-sm font-medium mb-2">Server URL</Text>
      <TextInput
        placeholderTextColor="#9ca3af"
        className="border border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50 mb-6"
        placeholder="http://192.168.1.5:3000"
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
        keyboardType="url"
      />

      <TouchableOpacity
        className="bg-blue-600 rounded-xl py-4 items-center"
        onPress={handleSave}
      >
        <Text className="text-white font-bold text-base">Save & Connect</Text>
      </TouchableOpacity>

      <TouchableOpacity className="mt-4 items-center" onPress={() => router.back()}>
        <Text className="text-gray-400">Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
