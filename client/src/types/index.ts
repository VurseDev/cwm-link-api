export enum PartStatus {
  AVAILABLE = 'available',
  IN_USE = 'in_use',
  MAINTENANCE = 'maintenance',
  RETIRED = 'retired',
}

export interface Part {
  id: number;
  partNumber: string;
  description: string;
  status: PartStatus;
  quantity: number;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePartDto {
  partNumber: string;
  description: string;
  status: PartStatus;
  quantity: number;
  location?: string;
}

export interface UpdatePartDto {
  partNumber?: string;
  description?: string;
  status?: PartStatus;
  quantity?: number;
  location?: string;
}

export interface Log {
  id: number;
  action: string;
  partId: number;
  workerId: number;
  timestamp: string;
  details?: string;
}

export interface Worker {
  id: number;
  name: string;
  email: string;
  role: string;
  department?: string;
  createdAt: string;
}

export interface User {
  id: number;
  email: string;
  name?: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}
