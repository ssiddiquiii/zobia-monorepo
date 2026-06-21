import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store';
import Toast from 'react-native-toast-message';
import '../global.css';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="setup" />
      </Stack>
      <Toast />
    </Provider>
  );
}
