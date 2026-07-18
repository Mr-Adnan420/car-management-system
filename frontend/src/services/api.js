import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (token, data) => api.post(`/auth/reset-password/${token}`, data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const carAPI = {
  getAllCars: () => api.get('/cars'),
  getDraftCars: () => api.get('/cars/draft-cars'),
  getSoldCars: () => api.get('/cars/sold-cars'),
  getCarById: (id) => api.get(`/cars/${id}`),
  createCar: (data) => api.post('/cars', data),
  updateCar: (id, data) => api.put(`/cars/${id}`, data),
  deleteCar: (id) => api.delete(`/cars/${id}`),
  sellCar: (id, data) => api.put(`/cars/${id}/sell`, data),
  exportExcel: (id) => api.get(`/cars/export-excel/${id}`, { responseType: 'blob' }),
  getDashboardStats: () => api.get('/cars/dashboard'),
};

export default api;
