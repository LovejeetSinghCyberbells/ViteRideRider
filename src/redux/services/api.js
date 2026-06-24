import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../endPoints';

// Axios instance create kiya
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── REQUEST INTERCEPTOR ──────────────────────────────────────────────────
// Har request bhejone se pehle yeh chalega aur AsyncStorage se token check karke attach karega
api.interceptors.request.use(
  async config => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token from storage', error);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// ─── RESPONSE INTERCEPTOR ─────────────────────────────────────────────────
// Backend se response aate waqt agar koi global error (jaise 401 Unauthorized) aaye toh handle karega
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response) {
      // Agar token expire ho gaya ho ya invalid ho
      if (error.response.status === 401) {
        console.log('Unauthorized request! Clearing storage...');
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userData');
        // Yahan aap app ko reload ya auth screen par trigger karne ka global custom event dispatch kar sakte hain
      }
    }
    return Promise.reject(error);
  },
);

export default api;
