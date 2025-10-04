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

/**
 * -------------------------
 *  Retry Strategy
 * -------------------------
 * - Exponential backoff
 * - Retry only safe/idempotent requests (GET/HEAD/OPTIONS)
 * - Retry on network errors or 5xx responses
 */
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

/**
 * -------------------------
 * ⏱ Request Interceptor
 * -------------------------
 * - Attach in-memory token (safer than localStorage)
 * - Skip if headers['skip-auth'] is true
 * - Add unique request ID for tracing/logs
 */
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

/**
 * -------------------------
 *  Response Interceptor
 * -------------------------
 * - Auto refresh token on 401
 * - Skip if headers['skip-refresh'] is true
 * - Queue requests while refreshing (single-flight)
 * - Logout if refresh fails
 */
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

    // Skip refresh if requested
    if (config.headers['skip-refresh']) return Promise.reject(error);

    // Handle 401 Unauthorized
    if (response.status === 401 && !config._retry) {
      config._retry = true; // prevent infinite loop

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          const newToken = await AuthService.refreshToken(); // may throw
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
