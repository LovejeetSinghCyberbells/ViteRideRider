import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getNotificationsService,
  markAllAsReadService,
} from '../services/notificationSerivce';

// ─── FETCH NOTIFICATIONS THUNK ───
export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getNotificationsService();
      // Backend returns: response.data.notifications
      return response.data.notifications;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch notifications.';
      return rejectWithValue(errorMessage);
    }
  },
);

// ─── MARK ALL AS READ THUNK ───
export const markNotificationsAsRead = createAsyncThunk(
  'notification/markNotificationsAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await markAllAsReadService();
      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to update notifications.';
      return rejectWithValue(errorMessage);
    }
  },
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    list: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearNotificationError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch Reducers
      .addCase(fetchNotifications.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Mark All Read Reducers (Instant state modification for smoother UX)
      .addCase(markNotificationsAsRead.fulfilled, state => {
        state.list = state.list.map(notification => ({
          ...notification,
          isRead: true,
        }));
      });
  },
});

export const { clearNotificationError } = notificationSlice.actions;
export default notificationSlice.reducer;
