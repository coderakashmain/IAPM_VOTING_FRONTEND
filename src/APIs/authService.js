// src/api/authService.js
import { apiRequest } from './apiService';
import { v4 as uuidv4 } from 'uuid'; 
import { log } from '../Utils/logger';


let accessToken = null; 
let currentUser = null;

const AuthService = {
  
  setAccessToken(token) {
    accessToken = token;
    if (token) {
      sessionStorage.setItem("accessToken", token);
    } else {
      sessionStorage.removeItem("accessToken");
    }
  },

   getAccessToken() {
    if (!accessToken) {
     
      accessToken = sessionStorage.getItem("accessToken");
    }
    return accessToken;
  },

  setUser(user) {
    currentUser = user;
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
  },

  getUser() {
    if (!currentUser) {
      const userStr = sessionStorage.getItem("user");
      if (userStr) currentUser = JSON.parse(userStr);
    }
    return currentUser;
  },

  getRequestId() {
    return uuidv4();
  },

  async refreshToken() {
    try {
     
      const res = await apiRequest('post', '/auth/refresh', {}, {
        withAuth: false,
        withCredentials: true,
      });

      const token = res?.data?.token || res?.token;
      if (!token) throw new Error('No token returned by refresh');

      this.setAccessToken(token);
      return token;
    } catch (err) {
      log('warn', 'Refresh failed', err);
      throw err;
    }
  },

  async logout() {
    try {
      await apiRequest('post', '/auth/logout', {}, {
        token: true,
        retryOnAuthFail:false,
        withCredentials: true,
      });
    } catch (err) {
      
      log('warn', 'Logout request failed', err);
    } finally {
      accessToken = null;
      currentUser = null;
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem('user')
    }
  },
};

export default AuthService;
