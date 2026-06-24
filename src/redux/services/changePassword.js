import api from '../services/api';
import { ENDPOINTS } from '../endPoints';

export const changePasswordService = async passwordData => {
  try {
    const response = await api.post(ENDPOINTS.CHANGEPASSWORD, passwordData);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};
