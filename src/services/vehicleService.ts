import axiosClient from '../api/axiosClient';

export interface CreateVehicleRequest {
  licensePlate: string;
  make: string;
  model: string;
  color: string;
  contactNumber: string;
}

export interface UpdateVehicleRequest {
  id: number;
  licensePlate: string;
  make: string;
  model: string;
  color: string;
  contactNumber: string;
}

export interface Vehicle {
  id: number;
  publicId: string;
  licensePlate: string;
  make: string;
  model: string;
  color: string;
  contactNumber: string;
  imageUrl?: string;          // frontend-də istifadə etdiyimiz tam URL
  vehicleImageUrl?: string;   // backend DTO-dan gələn nisbi yol (VehicleImageUrl)
  userId?: string;       // backend DTO-ya əlavə etsən, buradan oxuyacağıq
}

const backendOrigin = import.meta.env.VITE_API_URL;

// Backend-dən gələn vehicledən imageUrl-i normalize edirik
const normalizeVehicle = (vehicle: Vehicle): Vehicle => {
  // Əgər artıq tam imageUrl varsa, heç nə etmirik
  if (vehicle.imageUrl && (vehicle.imageUrl.startsWith('http://') || vehicle.imageUrl.startsWith('https://'))) {
    return vehicle;
  }

  // Əgər vehicleImageUrl (yəni DTO-dakı VehicleImageUrl) doludursa, onu tam URL-ə çeviririk
  if (vehicle.vehicleImageUrl) {
    const rel = vehicle.vehicleImageUrl;
    const full =
      rel.startsWith('http://') || rel.startsWith('https://')
        ? rel
        : backendOrigin + rel;
    return { ...vehicle, imageUrl: full };
  }

  return vehicle;
};

export const vehicleService = {
  create: async (data: CreateVehicleRequest) => {
    const response = await axiosClient.post('/Vehicles', data);
    return response.data;
  },

  update: async (data: UpdateVehicleRequest) => {
    const response = await axiosClient.put('/Vehicles', data);
    return response.data;
  },
  getAll: async (): Promise<Vehicle[]> => {
    const response = await axiosClient.get('/Vehicles');
    return (response.data as Vehicle[]).map(normalizeVehicle);
  },
  getById: async (id: number): Promise<Vehicle> => {
    const response = await axiosClient.get(`/Vehicles/${id}`);
    return normalizeVehicle(response.data as Vehicle);
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/Vehicles/${id}`);
  },

  uploadImage: async (vehicleId: string, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('vehicleId', vehicleId);

    const response = await axiosClient.post<{ imageUrl: string }>('/Vehicles/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const imageUrl = response.data.imageUrl;
    if (!imageUrl) return '';

    // Əgər backend nisbi yol (/uploads/...) qaytarırsa, tam URL-ə çeviririk.
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    return backendOrigin + imageUrl;
  }
}; 