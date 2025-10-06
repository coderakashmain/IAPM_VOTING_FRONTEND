import axios from "axios";
import axiosRetry from "axios-retry";
import AuthService from "./authService";
import { log } from "../Utils/logger";

const baseURL = import.meta.env.VITE_APP_API_BASE;

const instance = axios.create({
  baseURL,
  timeout: 30_000, // 30s
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});


axiosRetry(instance, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    const method = error?.config?.method?.toLowerCase();
    return (
      axiosRetry.isNetworkError(error) ||
      (axiosRetry.isRetryableError(error) &&
        ["get", "head", "options"].includes(method))
    );
  },
});


instance.interceptors.request.use(
  async (config) => {
    if (!config.headers['skip-auth']) {
      const token = AuthService.getAccessToken();
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    config.headers["X-Request-Id"] = AuthService.getRequestId();

    return config;
  },
  (error) => Promise.reject(error)
);


let isRefreshing = false;
let refreshQueue = [];

function enqueueFailedRequest(cb) {
  refreshQueue.push(cb);
}

function flushQueue(error, token = null) {
  refreshQueue.forEach((cb) => cb(error, token));
  refreshQueue = [];
}

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;

    if (!response) return Promise.reject(error);

   
    if (config.headers['skip-refresh']) return Promise.reject(error);

    
    if (response.status === 401 && !config._retry) {
      config._retry = true; 

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          const newToken = await AuthService.refreshToken();
          flushQueue(null, newToken);
        }

        return new Promise((resolve, reject) => {
          enqueueFailedRequest((err, token) => {
            if (err) return reject(err);
            if (token) config.headers.Authorization = `Bearer ${token}`;
            resolve(instance(config));
          });
        });
      } catch (refreshErr) {
        flushQueue(refreshErr, null);
        AuthService.logout();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    const friendly = {
      status: response.status,
      message:
        response.data?.message ||
        response.statusText ||
        "Something went wrong. Please try again.",
      data: response.data,
    };

    if (import.meta.env.DEV) log("error", "API error", friendly);

    return Promise.reject(friendly);
  }
);

export default instance;
