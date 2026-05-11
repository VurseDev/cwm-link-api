import axios from 'axios';
import type {
  Part,
  CreatePartDto,
  UpdatePartDto,
  AuthResponse,
  LoginDto,
  RegisterDto,
  User,
} from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Parts API
export const partsApi = {
  getAll: async (): Promise<Part[]> => {
    const response = await apiClient.get('/parts');
    return response.data;
  },

  getById: async (id: number): Promise<Part> => {
    const response = await apiClient.get(`/parts/${id}`);
    return response.data;
  },

  create: async (data: CreatePartDto): Promise<Part> => {
    const response = await apiClient.post('/parts', data);
    return response.data;
  },

  update: async (id: number, data: UpdatePartDto): Promise<Part> => {
    const response = await apiClient.patch(`/parts/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/parts/${id}`);
  },
};

// Auth API
export const authApi = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },
};

export default apiClient;
