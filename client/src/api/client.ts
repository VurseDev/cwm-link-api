import axios from 'axios';
import type {
  Part,
  CreatePartDto,
  UpdatePartDto,
} from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies for Better Auth sessions
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

// Note: Authentication is handled by Better Auth microservice (port 3000)
// Use the auth client from @/lib/auth for sign-in, sign-up, sign-out, and session management
// This API client is only for business logic endpoints (parts, workers, etc.)

export default apiClient;
