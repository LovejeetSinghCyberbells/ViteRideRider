import api from '../services/api';
import { ENDPOINTS } from '../endPoints';

export const loginService = async loginData => {
  try {
    const response = await api.post(ENDPOINTS.LOGIN, loginData);
    return response;
  } catch (error) {
    console.log(error, 'error_+_+__+_+__++');
    return Promise.reject(error);
  }
};

export const registerService = async signUpData => {
  try {
    const response = await api.post(ENDPOINTS.REGISTER, signUpData);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const logoutService = async () => {
  try {
    const response = await api.post(ENDPOINTS.LOGOUT);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};
