import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loginService,
  registerService,
  logoutService,
} from '../services/authServices'; // Imported registerService

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await loginService(loginData);
      const { token, user } = response.data;

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));

      return { token, user };
    } catch (error) {
      console.log(error, 'error_+_+__+_+__++');
      const errorMessage =
        error.response?.data?.message || 'Login failed. Please try again.';
      return rejectWithValue(errorMessage);
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (signUpData, { rejectWithValue }) => {
    try {
      const response = await registerService(signUpData);
      const { user } = response.data;

      return { user };
    } catch (error) {
      console.log(error, 'error_+_+__+_+__++');
      const errorMessage =
        error.response?.data?.message ||
        'Registration failed. Please try again.';
      return rejectWithValue(errorMessage);
    }
  },
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutService();
    } catch (error) {
      console.log('Backend logout error:', error);
    } finally {
      // 2. Always clean up local storage sessions
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
    }
    return null;
  },
);

export const restoreToken = createAsyncThunk('auth/restoreToken', async () => {
  const token = await AsyncStorage.getItem('userToken');
  const userJson = await AsyncStorage.getItem('userData');
  const user = userJson ? JSON.parse(userJson) : null;
  return { token, user };
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoading: true, // ONLY for the initial restoreToken check on app launch
    isAuthLoading: false, // for login / signup in-flight requests
    userToken: null,
    user: null,
    error: null,
  },
  reducers: {
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.isAuthLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthLoading = false;
        state.userToken = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthLoading = false;
        state.error = action.payload;
      })
      // Register User Reducers
      .addCase(registerUser.pending, state => {
        state.isAuthLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthLoading = false;
        // Note: userToken is intentionally NOT set here — signup
        // should not auto-login the user.
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthLoading = false;
        state.error = action.payload || 'Registration failed';
      })
      .addCase(restoreToken.pending, state => {
        state.isLoading = true;
      })
      .addCase(restoreToken.fulfilled, (state, action) => {
        state.userToken = action.payload.token;
        state.user = action.payload.user;
        state.isLoading = false;
      })
      .addCase(restoreToken.rejected, state => {
        state.isLoading = false;
        state.userToken = null;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.userToken = null;
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
