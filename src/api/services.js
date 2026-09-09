import api from './axios';

export const authApi = {
  adminLogin: (credentials) => api.post('/auth/admin-login', credentials),
  adminRegister: (payload) => api.post('/auth/admin-register', payload),
  getMe: () => api.get('/auth/me'),
};

export const productApi = {
  getAll: (params = {}) =>
    api.get('/products', {
      params: {
        includeInactive: true,
        limit: 100,
        page: 1,
        ...params,
      },
    }),
  create: (payload) => api.post('/products', payload),
  update: (id, payload) => api.put(`/products/${id}`, payload),
  remove: (id) => api.delete(`/products/${id}?hard=true`),
};

export const customerApi = {
  getAll: (params = {}) => api.get('/users/customers', { params }),
  create: (payload) => api.post('/users/customers', payload),
  updateStatus: (id, payload) =>
    api.patch(`/users/customers/${id}/status`, payload),
};
