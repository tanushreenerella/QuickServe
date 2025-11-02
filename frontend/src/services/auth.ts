// src/services/auth.ts
import api from './api';
import type { AuthResponse, User } from '../types';

export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },

  signup: async (userData: any): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', userData);
    return response.data;
  },

  verifyToken: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  }
};