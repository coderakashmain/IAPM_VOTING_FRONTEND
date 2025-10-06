// src/api/apiService.js
import axiosInstance from './axiosInstance';
import AuthService from './authService';
import { from, defer } from 'rxjs';
import { shareReplay } from 'rxjs/operators';


export const apiRequest = async (
  method,
  url,
  data = {},
  { token = true, retryOnAuthFail = true, ...config } = {}
) => {
    const headers = {
    ...(config.headers || {}),
    ...(token === false ? { 'skip-auth': true } : {}),
    ...(retryOnAuthFail === false ? { 'skip-refresh': true } : {}),
  };

  const makeRequest = async () => {
    try {
      if (token && !headers['skip-auth']) {
        const accessToken = AuthService.getAccessToken();
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }
      }

      const response = await axiosInstance({
        method,
        url,
        data,
        ...config,
        headers,
         validateStatus: (status) => status >= 200 && status < 300 
      });

      return response.data;
    } catch (err) {
      
      if (
       retryOnAuthFail && token && err.response?.status === 401
      ) {
        try {
          const newToken = await AuthService.refreshToken();
          if (newToken) {
            const retryHeaders = { ...config.headers, Authorization: `Bearer ${newToken}` };
            const retryResponse = await axiosInstance({
              method,
              url,
              data,
              ...config,
              headers: retryHeaders,
               validateStatus: (status) => status >= 200 && status < 300 
            });
            return retryResponse.data;
          }
        } catch (refreshErr) {
         await   AuthService.logout();
          throw refreshErr;
        }
      }

      throw err;
    }
  };

  return makeRequest();
};


export const api = {
  get: (url, config) => apiRequest('get', url, {}, config),
  post: (url, data, config) => apiRequest('post', url, data, config),
  put: (url, data, config) => apiRequest('put', url, data, config),
  delete: (url, config) => apiRequest('delete', url, {}, config),
};


const makeObservableRequest = (method, url, data = {}, config = {}) =>
  defer(() => {
    const controller = new AbortController();
    const headers = { ...config.headers };
    const token = AuthService.getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const axiosConfig = { ...config, headers, signal: controller.signal };

    let promise;
    switch (method.toLowerCase()) {
      case 'get':
        promise = axiosInstance.get(url, axiosConfig).then((res) => res.data);
        break;
      case 'post':
        promise = axiosInstance.post(url, data, axiosConfig).then((res) => res.data);
        break;
      case 'put':
        promise = axiosInstance.put(url, data, axiosConfig).then((res) => res.data);
        break;
      case 'delete':
        promise = axiosInstance.delete(url, axiosConfig).then((res) => res.data);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    const obs = from(promise).pipe(shareReplay(1));
    obs.cancel = () => controller.abort();
    return obs; 
  });

export const api$ = {
  get: (url, config) => makeObservableRequest('get', url, {}, config),
  post: (url, data, config) => makeObservableRequest('post', url, data, config),
  put: (url, data, config) => makeObservableRequest('put', url, data, config),
  delete: (url, config) => makeObservableRequest('delete', url, {}, config),
};

export default api;
