// src/api/authService.js
import { apiRequest } from './apiService';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid
import { log } from '../Utils/logger';

let accessToken = null; // store in memory (XSS safe)
let currentUser = null; // optional in-memory user state

const AuthService = {
  // ----------------- TOKEN MANAGEMENT -----------------
  setAccessToken(token) {
    accessToken = token;
    if (token) {
      sessionStorage.setItem("accessToken", token); // store in sessionStorage
    } else {
      sessionStorage.removeItem("accessToken");
    }
  },

   getAccessToken() {
    if (!accessToken) {
      // restore from sessionStorage if page refreshed
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
    return uuidv4(); // used for tracing/debugging
  },

  // ----------------- AUTH APIS -----------------
  async login({ email, password }) {
    try {
      // Public endpoint → withAuth = false
      const res = await apiRequest('post', '/auth/login', { email, password }, { withAuth: false });
      const token = res?.data?.token || res?.token;

      if (token) {
        this.setAccessToken(token);
        if (res.data) this.setUser(res.data); // if backend returns user object
      }

      return res;
    } catch (err) {
      log('error', 'Login failed', err);
      throw err;
    }
  },

  async refreshToken() {
    try {
      // Refresh token stored in httpOnly cookie → withCredentials = true
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
      await apiRequest('post', '/auth/logout', null, {
        withAuth: true,
        withCredentials: true,
      });
    } catch (err) {
      log('warn', 'Logout request failed', err);
    } finally {
      accessToken = null;
      currentUser = null;
       sessionStorage.clear(); 
    }
  },
};

export default AuthService;
