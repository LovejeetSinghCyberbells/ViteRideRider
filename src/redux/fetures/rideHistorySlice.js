import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRideHistoryService } from '../services/rideHistoryService';

// ─── GET RIDE HISTORY ASYNC THUNK ───
export const fetchRideHistory = createAsyncThunk(
  'rideHistory/fetchRideHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRideHistoryService();
      return response.data.history;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch ride history.';
      return rejectWithValue(errorMessage);
    }
  },
);

const rideHistorySlice = createSlice({
  name: 'rideHistory',
  initialState: {
    rides: [],
    historyLoading: false,
    error: null,
  },
  reducers: {
    clearHistoryError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchRideHistory.pending, state => {
        state.historyLoading = true;
        state.error = null;
      })
      .addCase(fetchRideHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.rides = action.payload;
      })
      .addCase(fetchRideHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearHistoryError } = rideHistorySlice.actions;
export default rideHistorySlice.reducer;
