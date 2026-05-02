import axios from 'axios';
import { msalInstance } from '../components/AuthProvider';
import { loginRequest } from '../config/authConfig';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api', // Updated port to 5000 to match backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for attaching token
api.interceptors.request.use(
  async (config) => {
    try {
      // Get the active account or the first one available
      const account = msalInstance.getActiveAccount() || msalInstance.getAllAccounts()[0];
      if (account) {
        const response = await msalInstance.acquireTokenSilent({
          ...loginRequest,
          account: account
        });
        // We use idToken as the backend expects audience to be the Client ID
        config.headers.Authorization = `Bearer ${response.idToken}`;
      }
    } catch (error) {
      console.error('Failed to acquire token silently', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for logging/errors in Neon Style
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('NEURAL_LINK_FAILURE:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const taskApi = {
  getAll: (userId: string) => api.get(`/tasks?userId=${userId}`),
  create: (data: any) => api.post('/tasks', data),
  updatePriority: (id: string, priority: string) => api.patch(`/tasks/${id}/priority`, { priority }),
};

export const financeApi = {
  getAll: (userId: string) => api.get(`/finance?userId=${userId}`),
  create: (data: any) => api.post('/finance', data),
  delete: (id: string) => api.delete(`/finance/${id}`),
};

export const groceryApi = {
  getAll: (userId: string) => api.get(`/groceries?userId=${userId}`),
  create: (data: any) => api.post('/groceries', data),
  toggle: (id: string, is_checked: boolean) => api.patch(`/groceries/${id}`, { is_checked }),
  delete: (id: string) => api.delete(`/groceries/${id}`),
};

export const moodApi = {
  getAll: (userId: string) => api.get(`/mood?userId=${userId}`),
  log: (data: any) => api.post('/mood', data),
};

export const menstrualApi = {
  getAll: (userId: string) => api.get(`/menstrual?userId=${userId}`),
  log: (data: any) => api.post('/menstrual', data),
};

export const eventsApi = {
  getAll: (userId: string) => api.get(`/events?userId=${userId}`),
  create: (data: any) => api.post('/events', data),
};

export default api;
