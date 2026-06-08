export const PartStatus = {
  AVAILABLE: 'available',
  IN_USE: 'in_use',
  MAINTENANCE: 'maintenance',
  RETIRED: 'retired',
} as const;

export type PartStatus = (typeof PartStatus)[keyof typeof PartStatus];

export interface Part {
  id: number;
  serialId: string;
  partName: string;
  partDescription: string;
  status: PartStatus;
  createdAt: string;
  logs?: Log[];
}

export interface CreatePartDto {
  serialId: string;
  operator: string;
  partName: string;
  partDescription: string;
  status: PartStatus;
}

export interface UpdatePartDto {
  partName?: string;
  partDescription?: string;
  status?: PartStatus;
}

export interface Log {
  id: number;
  step: string;
  operator: string;
  partId: number;
  timestamp: string;
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
