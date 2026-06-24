import api from '../services/api';
import { ENDPOINTS } from '../endPoints';

export const getRideHistoryService = async () => {
  try {
    const response = await api.get(ENDPOINTS.GET_RIDE_HISTORY);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};
