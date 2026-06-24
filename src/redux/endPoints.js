export const BASE_URL = 'http://49.13.70.253:4044/api'; // Apne system IP se badal sakte hain

export const ENDPOINTS = {
  // ─── Auth Endpoints ───
  LOGIN: `/auth/login`,
  REGISTER: `/auth/customerregister`,
  LOGOUT: '/auth/logout',
  CHANGEPASSWORD: '/auth/changepassword',

  GET_PROFILE: `/customer/profile`,
  UPDATE_PROFILE: `/customer/profile`,

  // ─── Ride History Endpoints ───
  GET_RIDE_HISTORY: `/customer/ride-history`,

  // ─── Notification Endpoints ───
  GET_NOTIFICATIONS: `/customer/notifications`,
  MARK_NOTIFICATIONS_READ: `/customer/notifications/read-all`,
};
