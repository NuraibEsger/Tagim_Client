import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  Chip
} from '@mui/material';
import Navbar from '../components/Navbar';
import { vehicleService } from '../services/vehicleService';
import type { Vehicle } from '../services/vehicleService';
import { getUserFromToken } from '../services/authService';
import toast from 'react-hot-toast';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import PaletteIcon from '@mui/icons-material/Palette';
import PhoneIcon from '@mui/icons-material/Phone';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EditVehicleDialog from '../components/EditVehicleDialog';

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    licensePlate: '',
    make: '',
    model: '',
    color: '',
    contactNumber: '',
  });
  const currentUser = getUserFromToken();

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) {
        toast.error('Avtomobil ID-si tapılmadı');
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        const data = await vehicleService.getById(id);
        setVehicle(data);
      } catch (error: any) {
        toast.error(error.response?.data?.detail || 'Avtomobil məlumatları yüklənə bilmədi');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id, navigate]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !id || !vehicle) return;

    try {
      setUploadingImage(true);
      const url = await vehicleService.uploadImage(id, file);
      if (url) {
        setVehicle({ ...vehicle, imageUrl: url });
        toast.success('Avtomobil şəkli yeniləndi');
      } else {
        toast.error('Şəkil URL-i alınmadı');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.detail || 'Şəkli yükləmək mümkün olmadı');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  const openEditDialog = () => {
    if (!vehicle) return;
    setForm({
      licensePlate: vehicle.licensePlate,
      make: vehicle.make,
      model: vehicle.model,
      color: vehicle.color,
      contactNumber: vehicle.contactNumber,
    });
    setEditOpen(true);
  };

  const handleVehicleUpdated = (updatedVehicle: Vehicle) => {
    setVehicle(updatedVehicle); // UI-ı dərhal yenilə
  };

  if (loading) return <Navbar />; // Sadələşdirmə
  if (!vehicle) return null;

  const isOwner =
    !!currentUser?.userId &&
    !!vehicle.userId &&
    String(currentUser.userId) === String(vehicle.userId);

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        {/* Geri Dön Düyməsi */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{
              color: '#667eea',
              '&:hover': {
                background: 'rgba(102, 126, 234, 0.1)'
              }
            }}
          >
            Geri Dön
          </Button>
          {isOwner && (
            <Button variant="outlined" onClick={openEditDialog}>
              Məlumatları Dəyiş
            </Button>
          )}
        </Box>

        {/* Avtomobil Detalları */}
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
            gap: 4 
          }}
        >
          {/* Sol tərəf - İkon və əsas məlumat */}
          <Box>
            <Card
              sx={{
                borderRadius: 4,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                p: 4,
                textAlign: 'center',
                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.3)'
              }}
            >
              {vehicle.imageUrl ? (
                <Box
                  sx={{
                    mb: 3,
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Box
                    component="img"
                    src={vehicle.imageUrl}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    sx={{
                      maxWidth: '100%',
                      maxHeight: 200,
                      borderRadius: 3,
                      objectFit: 'cover',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.35)'
                    }}
                  />
                </Box>
              ) : (
                <DirectionsCarFilledIcon
                  sx={{
                    fontSize: 120,
                    mb: 3,
                    opacity: 0.9
                  }}
                />
              )}
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {vehicle.make} {vehicle.model}
              </Typography>
              <Chip
                label={vehicle.licensePlate}
                sx={{
                  mt: 2,
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  height: 40,
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Box mt={3}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<PhotoCameraIcon />}
                  disabled={uploadingImage}
                  sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}
                >
                  {uploadingImage ? 'Yüklənir...' : 'Şəkil Yüklə / Dəyiş'}
                  <input
                    type="file"
                    hidden
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageChange}
                  />
                </Button>
              </Box>
            </Card>
          </Box>

          {/* Sağ tərəf - Ətraflı məlumat */}
          <Box>
            <Paper
              sx={{
                p: 4,
                borderRadius: 4,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                border: '1px solid rgba(102, 126, 234, 0.2)'
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{
                  mb: 4,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Avtomobil Məlumatları
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Dövlət Nömrə Nişanı */}
                <Card
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    background: '#fff',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <ConfirmationNumberIcon sx={{ color: '#fff', fontSize: 28 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Dövlət Nömrə Nişanı
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="#667eea">
                        {vehicle.licensePlate}
                      </Typography>
                    </Box>
                  </Box>
                </Card>

                {/* Marka və Model */}
                <Box 
                  sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2 
                  }}
                >
                  <Box>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                        background: '#fff',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <DriveEtaIcon sx={{ color: '#fff', fontSize: 28 }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Marka
                          </Typography>
                          <Typography variant="h6" fontWeight="bold" color="#667eea">
                            {vehicle.make}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Box>
                  <Box>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                        background: '#fff',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <DriveEtaIcon sx={{ color: '#fff', fontSize: 28 }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Model
                          </Typography>
                          <Typography variant="h6" fontWeight="bold" color="#667eea">
                            {vehicle.model}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Box>
                </Box>

                {/* Rəng */}
                <Card
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    background: '#fff',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <PaletteIcon sx={{ color: '#fff', fontSize: 28 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Rəng
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="#667eea">
                        {vehicle.color || 'Məlumat yoxdur'}
                      </Typography>
                    </Box>
                  </Box>
                </Card>

                {/* Əlaqə Nömrəsi */}
                <Card
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    background: '#fff',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <PhoneIcon sx={{ color: '#fff', fontSize: 28 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Əlaqə Nömrəsi
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="#667eea">
                        {vehicle.contactNumber || 'Məlumat yoxdur'}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>

      {vehicle && (
        <EditVehicleDialog 
          open={editOpen}
          onClose={() => setEditOpen(false)}
          vehicle={vehicle}
          onVehicleUpdated={handleVehicleUpdated}
        />
      )}
    </>
  );
}

