import axiosClient from '../api/axiosClient';

export interface UpdateProfileRequest {
  fullName: string;
  phoneNumber: string;
}

export interface UploadProfileImageResponse {
  imageUrl: string;
}

export const profileService = {
  updateProfile: async (data: UpdateProfileRequest) => {
    const response = await axiosClient.put('/Profile', data);
    return response.data;
  },

  uploadProfileImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosClient.post('/Profile/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const data = response.data as Partial<UploadProfileImageResponse> & { ImageUrl?: string };
    const relativePath = data.imageUrl || data.ImageUrl || '';

    // Backenddən gələn yol `/uploads/...` formasındadır.
    // Frontenddə bunu tam URL-ə çeviririk ki, <img src> işləsin.
    if (!relativePath) return '';

    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      return relativePath;
    }

    // DEV üçün backend origin-i burda sərt yazırıq. Lazım olsa .env-ə çıxarmaq olar.
    const backendOrigin = 'http://localhost:8080';
    return backendOrigin + relativePath;
  },
};

