import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL_KEY = 'SERVER_BASE_URL';
const DEFAULT_URL = 'http://192.168.0.103:3000'; // fallback

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
