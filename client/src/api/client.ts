import axios from 'axios';
import type {
  Part,
  CreatePartDto,
  UpdatePartDto,
} from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Cliente unico para a API Nest; cookies seguem junto para integracoes autenticadas.
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// A API de pecas usa serialId nas rotas publicas.
export const partsApi = {
  getAll: async (): Promise<Part[]> => {
    const response = await apiClient.get('/parts');
    return response.data;
  },

  getById: async (serialId: string): Promise<Part> => {
    const response = await apiClient.get(`/parts/${serialId}`);
    return response.data;
  },

  create: async (data: CreatePartDto): Promise<Part> => {
    const response = await apiClient.post('/parts', data);
    return response.data;
  },

  update: async (serialId: string, data: UpdatePartDto): Promise<Part> => {
    const response = await apiClient.patch(`/parts/${serialId}`, data);
    return response.data;
  },

  delete: async (serialId: string): Promise<void> => {
    await apiClient.delete(`/parts/${serialId}`);
  },
};

// Autenticacao fica no microservice Better Auth; este cliente e para regras de negocio.

export default apiClient;
