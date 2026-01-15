import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import { vehicleService, type Vehicle } from '../services/vehicleService';
import toast from 'react-hot-toast';
import { handleApiError } from '../utils/errorHandler';

interface EditVehicleDialogProps {
  open: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  onVehicleUpdated: (updatedVehicle: Vehicle) => void;
}

export default function EditVehicleDialog({
  open,
  onClose,
  vehicle,
  onVehicleUpdated
}: EditVehicleDialogProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    licensePlate: '',
    make: '',
    model: '',
    color: '',
    contactNumber: '',
  });

  // Modal açılanda mövcud məlumatları formaya doldur
  useEffect(() => {
    if (open && vehicle) {
      setForm({
        licensePlate: vehicle.licensePlate || '',
        make: vehicle.make || '',
        model: vehicle.model || '',
        color: vehicle.color || '',
        contactNumber: vehicle.contactNumber || '',
      });
    }
  }, [open, vehicle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Backend request
      await vehicleService.update({
        id: Number(vehicle.id), // ID-ni mütləq göndərməliyik
        ...form
      });

      toast.success('Avtomobil məlumatları uğurla yeniləndi!');
      
      // Parent komponenti xəbərdar edirik ki, UI yenilənsin
      onVehicleUpdated({
        ...vehicle,
        ...form
      });
      
      onClose();
    } catch (error: any) {
      console.error(error);
      handleApiError(error, 'Avtomobil məlumatları yenilənərkən xəta baş verdi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ background: '#f5f5f5', fontWeight: 'bold' }}>
        Avtomobil Məlumatlarını Yenilə
      </DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={3} sx={{ mt: 1 }}>
          <TextField
            label="Dövlət Nömrə Nişanı"
            name="licensePlate"
            value={form.licensePlate}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            InputProps={{
              readOnly: false, // Əgər nömrə dəyişdirilə bilməzdirsə true et
            }}
          />
          
          <Box display="flex" gap={2}>
            <TextField
              label="Marka"
              name="make"
              value={form.make}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Model"
              name="model"
              value={form.model}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          <TextField
            label="Rəng"
            name="color"
            value={form.color}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Əlaqə Nömrəsi"
            name="contactNumber"
            value={form.contactNumber.trim()}
            onChange={handleChange}
            fullWidth
            helperText="Nümunə: +994 50 123 45 67"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Ləğv et
        </Button>
        <Button 
            variant="contained" 
            onClick={handleSubmit} 
            disabled={loading}
            sx={{ background: '#667eea' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Yadda saxla'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}