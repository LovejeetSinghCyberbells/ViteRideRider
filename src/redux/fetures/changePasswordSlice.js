import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { changePasswordService } from '../services/changePassword'; // Apne correct auth service path ke mutabiq import adjust karein

// ─── CHANGE PASSWORD ASYNC THUNK ───
export const submitChangePassword = createAsyncThunk(
  'auth/submitChangePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await changePasswordService(passwordData);
      // Backend returns: { success: true, message: "Password changed successfully" }
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to change password. Please try again.';
      return rejectWithValue(errorMessage);
    }
  },
);

const changePasswordSlice = createSlice({
  name: 'changePassword',
  initialState: {
    isUpdating: false,
    updateSuccess: false,
    updateError: null,
  },
  reducers: {
    resetPasswordState: state => {
      state.isUpdating = false;
      state.updateSuccess = false;
      state.updateError = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(submitChangePassword.pending, state => {
        state.isUpdating = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(submitChangePassword.fulfilled, state => {
        state.isUpdating = false;
        state.updateSuccess = true;
      })
      .addCase(submitChangePassword.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload;
      });
  },
});

export const { resetPasswordState } = changePasswordSlice.actions;
export default changePasswordSlice.reducer;
