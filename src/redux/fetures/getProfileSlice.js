import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getProfileService,
  editProfileService,
} from '../services/getProfileService';

export const getProfile = createAsyncThunk(
  'profile/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProfileService();
      return response.data.profile;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch profile.';
      return rejectWithValue(errorMessage);
    }
  },
);

export const editProfile = createAsyncThunk(
  'profile/editProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await editProfileService(formData);

      if (response.data?.profile) {
        await AsyncStorage.setItem(
          'userData',
          JSON.stringify(response.data.profile),
        );
      }
      return response.data.profile;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to update profile.';
      return rejectWithValue(errorMessage);
    }
  },
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    userProfile: null,
    profileLoading: false,
    error: null,
  },
  reducers: {
    clearProfileError: state => {
      state.error = null;
    },
    clearProfileData: state => {
      state.userProfile = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Get Profile Reducers
      .addCase(getProfile.pending, state => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.userProfile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload;
      })

      // Edit Profile Reducers
      .addCase(editProfile.pending, state => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.userProfile = action.payload; // Updates with fresh profile object
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileError, clearProfileData } = profileSlice.actions;
export default profileSlice.reducer;
