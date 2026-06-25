import AsyncStorage from '@react-native-async-storage/async-storage';

import Constants from 'expo-constants';

const BASE_URL_KEY = 'SERVER_BASE_URL';

// In development: auto-detect local IP
// In production (APK): use Vercel deployed URL
const PRODUCTION_URL = 'https://zobia-monorepo.vercel.app'; // Production server

let dynamicLocalUrl = PRODUCTION_URL; // default: production

if (__DEV__ && Constants.expoConfig?.hostUri) {
  // Development: auto-detect laptop's local IP
  const hostIp = Constants.expoConfig.hostUri.split(':')[0];
  dynamicLocalUrl = `http://${hostIp}:3000`;
}

const DEFAULT_URL = dynamicLocalUrl;

export const getBaseUrl = async (): Promise<string> => {
  const saved = await AsyncStorage.getItem(BASE_URL_KEY);
  return saved || DEFAULT_URL;
};

export const saveBaseUrl = async (url: string): Promise<void> => {
  await AsyncStorage.setItem(BASE_URL_KEY, url.trim().replace(/\/$/, ''));
};

export const API_ROUTES = {
  // Auth
  login: '/api/auth/login',
  signup: '/api/auth/signup',
  // Products
  products: '/api/products',
  product: (id: string) => `/api/products/${id}`,
  // Orders
  orders: '/api/orders',
  order: (id: string) => `/api/orders/${id}`,
  trackOrder: (trackingId: string) => `/api/orders/track/${trackingId}`,
  // Cart
  cart: '/api/cart',
  // Wishlist
  wishlist: '/api/wishlist',
};
