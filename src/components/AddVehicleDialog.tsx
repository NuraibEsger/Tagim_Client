import { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Box, IconButton, Typography 
} from '@mui/material';
import { vehicleService } from '../services/vehicleService';
import toast from 'react-hot-toast';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import CloseIcon from '@mui/icons-material/Close';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import PaletteIcon from '@mui/icons-material/Palette';
import PhoneIcon from '@mui/icons-material/Phone';

interface Props {
  open: boolean;
  onClose: () => void;
  onVehicleAdded?: () => void;
}

export default function AddVehicleDialog({ open, onClose, onVehicleAdded }: Props) {
  const [formData, setFormData] = useState({
    licensePlate: '',
    make: '',
    model: '',
    color: '',
    contactNumber: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await vehicleService.create(formData);
      toast.success('Maşın uğurla əlavə edildi!');
      
      // Formu təmizlə və bağla
      setFormData({ licensePlate: '', make: '', model: '', color: '', contactNumber: '' });
      onClose();
      
      // Siyahını yenilə
      if (onVehicleAdded) {
        onVehicleAdded();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Xəta baş verdi');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2.5
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <DirectionsCarFilledIcon sx={{ fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold">
            Yeni Avtomobil
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: '#fff',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.2)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3, mt: 2}}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField 
            fullWidth 
            label="Dövlət Nömrə Nişanı"
            name="licensePlate" 
            placeholder="99-XX-999" 
            value={formData.licensePlate} 
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <ConfirmationNumberIcon sx={{ color: '#667eea', mr: 1 }} />
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#667eea',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea',
                }
              }
            }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField 
              fullWidth 
              label="Marka" 
              name="make" 
              placeholder="Toyota" 
              value={formData.make} 
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <DriveEtaIcon sx={{ color: '#667eea', mr: 1 }} />
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  }
                }
              }}
            />
            <TextField 
              fullWidth 
              label="Model" 
              name="model" 
              placeholder="Prius" 
              value={formData.model} 
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <DriveEtaIcon sx={{ color: '#667eea', mr: 1 }} />
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  }
                }
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField 
              fullWidth 
              label="Rəng" 
              name="color" 
              value={formData.color} 
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <PaletteIcon sx={{ color: '#667eea', mr: 1 }} />
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  }
                }
              }}
            />
            <TextField 
              fullWidth 
              label="Əlaqə Nömrəsi" 
              name="contactNumber" 
              value={formData.contactNumber} 
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <PhoneIcon sx={{ color: '#667eea', mr: 1 }} />
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  }
                }
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2, gap: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{
            borderColor: '#ccc',
            color: '#666',
            '&:hover': {
              borderColor: '#999',
              background: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          Ləğv et
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          sx={{
            px: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Yadda Saxla
        </Button>
      </DialogActions>
    </Dialog>
  );
}