import axiosClient from '../api/axiosClient';

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password?: string;
}



// UserTokenPayload and getUserFromToken are moved to ../utils/authUtils.ts
// We keep authService focused on API calls.

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await axiosClient.post('/Auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await axiosClient.post('/Auth/register', data);
    return response.data;
  }
};

