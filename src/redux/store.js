import { configureStore } from '@reduxjs/toolkit';
import authReducer from './fetures/authSlice';
import profileReducer from './fetures/getProfileSlice';
import rideHistoryReducer from './fetures/rideHistorySlice';
import notificationReducer from './fetures/notificationSlice';
import changePasswordReducer from './fetures/changePasswordSlice'; // Import the changePasswordReducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    rideHistory: rideHistoryReducer,
    notification: notificationReducer,
    changePassword: changePasswordReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
