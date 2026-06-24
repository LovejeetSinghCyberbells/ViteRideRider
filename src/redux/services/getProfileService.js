import api from '../services/api';
import { ENDPOINTS } from '../endPoints';

export const getProfileService = async () => {
  try {
    const response = await api.get(ENDPOINTS.GET_PROFILE);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const editProfileService = async profileData => {
  try {
    const response = await api.put(ENDPOINTS.UPDATE_PROFILE, profileData);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};
