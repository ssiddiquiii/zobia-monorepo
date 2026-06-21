import axios from 'axios';
import { getBaseUrl } from './api';
import * as SecureStore from 'expo-secure-store';

const apiClient = axios.create({
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Inject base URL dynamically before each request
apiClient.interceptors.request.use(async (config) => {
  const baseURL = await getBaseUrl();
  config.baseURL = baseURL;

  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
