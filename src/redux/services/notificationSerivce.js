import api from '../services/api';
import { ENDPOINTS } from '../endPoints';

// 1. Fetch all notifications
export const getNotificationsService = async () => {
  try {
    const response = await api.get(
      ENDPOINTS.GET_NOTIFICATIONS || '/customer/notifications',
    );
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

// 2. Mark all notifications as read
export const markAllAsReadService = async () => {
  try {
    const response = await api.patch(
      ENDPOINTS.MARK_NOTIFICATIONS_READ || '/customer/notifications/read-all',
    );
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};
