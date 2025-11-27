import axios from 'axios';
import { PurchaseOrder, ApiResponse, CompanyProfile } from '../types/index';

const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL || 'http://localhost:4000/api',
  withCredentials: true,
});

export const authApi = {
  signup: (data: { username: string; email: string; password: string; full_name?: string }) =>
    api.post<ApiResponse<any>>('/auth/signup', data),

  login: (username: string, password: string) =>
    api.post<ApiResponse<any>>('/auth/login', { username, password }),

  logout: () =>
    api.post<ApiResponse<any>>('/auth/logout'),

  getMe: () =>
    api.get<ApiResponse<any>>('/auth/me'),

  checkStatus: () =>
    api.get<any>('/auth/status'),
};

export const purchaseOrdersApi = {
  list: (q: string = '', page: number = 1, limit: number = 10) =>
    api.get<ApiResponse<PurchaseOrder[]>>('/purchase-orders', {
      params: { q, page, limit },
    }),

  get: (id: string) =>
    api.get<ApiResponse<PurchaseOrder>>(`/purchase-orders/${id}`),

  create: (payload: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>) =>
    api.post<ApiResponse<PurchaseOrder>>('/purchase-orders', payload),

  update: (id: string, payload: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>) =>
    api.put<ApiResponse<PurchaseOrder>>(`/purchase-orders/${id}`, payload),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/purchase-orders/${id}`),

  downloadPDF: (id: string, company?: CompanyProfile) => {
    if (company) {
      // Send company data in request body
      return api.post(`/purchase-orders/${id}/pdf`, { company }, { responseType: 'blob' });
    }
    // Fallback to GET without company data
    return api.get(`/purchase-orders/${id}/pdf`, { responseType: 'blob' });
  },
};

export const companyApi = {
  get: () =>
    api.get<ApiResponse<CompanyProfile>>('/company'),

  save: (profile: CompanyProfile) =>
    api.post<ApiResponse<CompanyProfile>>('/company', profile),
};

export default api;
