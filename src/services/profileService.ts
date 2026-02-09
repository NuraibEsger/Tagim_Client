import axiosClient from '../api/axiosClient';

const api = import.meta.env.VITE_API_URL;

export interface SocialLink {
  platformName: string;
  url: string;
  isVisible: boolean;
}

export interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
  profileImageUrl?: string;
  socialLinks: SocialLink[];
}

export interface UpdateProfileRequest {
  fullName: string;
  phoneNumber: string;
}

export interface UploadProfileImageResponse {
  imageUrl: string;
}

export const profileService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await axiosClient.get<UserProfile>('/Profile/profile');
    const data = response.data;

    if (data.profileImageUrl) {
      const isAbsolute = data.profileImageUrl.startsWith('http://') || data.profileImageUrl.startsWith('https://')

      if (!isAbsolute) {
        data.profileImageUrl = `${api}${data.profileImageUrl}`;
      }
    }

    return data;
  },

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
    return api + relativePath;
  },
};

