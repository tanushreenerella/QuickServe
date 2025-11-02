// src/services/orders.ts
import api from './api';
import type { MenuItem, WaitTimePrediction, PopularItem, PeakHours, MLStatus } from '../types';
export const ordersAPI = {
  getMenu: async (): Promise<MenuItem[]> => {
    const response = await api.get<MenuItem[]>('/menu');
    return response.data;
  },

 getWaitTimePrediction: async (items: MenuItem[]): Promise<WaitTimePrediction> => {
    const response = await api.post<WaitTimePrediction>('/ml/predict/wait-time', { items });
    console.log("🧠 Wait Time API Response:", response.data);
    return response.data;
  },


  getPopularItems: async (): Promise<{ recommendations: PopularItem[] }> => {
    const response = await api.get<{ recommendations: PopularItem[] }>('/ml/recommendations/popular');
    return response.data;
  },

  getPeakHours: async (): Promise<PeakHours> => {
    const response = await api.get<PeakHours>('/ml/predict/peak-hours?hours=12');
    console.log(response.data);
    return response.data;
  },

  getMLStatus: async (): Promise<MLStatus> => {
    const response = await api.get<MLStatus>('/ml/status');
    return response.data;
  },

  createOrder: async (orderData: any): Promise<any> => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  createPaymentIntent: async (amount: number): Promise<{ clientSecret: string }> => {
    const response = await api.post<{ clientSecret: string }>('/payment/create-intent', { amount });
    return response.data;
  }
};