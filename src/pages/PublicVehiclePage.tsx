import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  Chip,
  CircularProgress,
  Button
} from '@mui/material';
import PublicHeader from '../components/PublicHeader';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import PaletteIcon from '@mui/icons-material/Palette';
import PhoneIcon from '@mui/icons-material/Phone';

interface PublicVehicle {
  make: string;
  model: string;
  licensePlate: string;
  color: string;
  contactNumber: string;
  vehicleImageUrl?: string;
  imageUrl?: string; // tam URL
  userFullName: string;
  userProfilePictureUrl: string;
}

const backendOrigin = 'http://localhost:8080';

export default function PublicVehiclePage() {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<PublicVehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) {
        toast.error('Avtomobil ID-si tapılmadı');
        return;
      }

      try {
        setLoading(true);
        // Backend: [HttpGet("vehicle/{publicId}")] on Vehicles controller → /api/Vehicles/vehicle/{id}
        const response = await axiosClient.get<PublicVehicle>(`/Vehicles/vehicle/${id}`);
        const raw = response.data;

        let imageUrl: string | undefined;
        if (raw.vehicleImageUrl) {
          imageUrl = raw.vehicleImageUrl.startsWith('http://') || raw.vehicleImageUrl.startsWith('https://')
            ? raw.vehicleImageUrl
            : backendOrigin + raw.vehicleImageUrl;
        }

        setVehicle({ ...raw, imageUrl });
      } catch (error: any) {
        console.error(error);
        toast.error(error?.response?.data?.detail || 'Avtomobil məlumatları yüklənə bilmədi');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  if (loading) {
    return (
      <>
        <PublicHeader />
        <Container maxWidth="md" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={60} sx={{ color: '#667eea' }} />
        </Container>
      </>
    );
  }  

  if (!vehicle) {
    return (
      <>
        <PublicHeader />
        <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
          <Paper sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h5" color="error">
              Avtomobil məlumatları tapılmadı
            </Typography>
          </Paper>
        </Container>
      </>
    );
  }

  return (
    <>
      <PublicHeader />
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          pt: 6,
          pb: 6
        }}
      >
        <Container maxWidth="md">
          <Paper
            sx={{
              p: 6,
              borderRadius: 4,
              background: '#fff',
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)'
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              {vehicle.imageUrl && (
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
                      maxHeight: 220,
                      borderRadius: 3,
                      objectFit: 'cover',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.35)'
                    }}
                  />
                </Box>
              )}
              {!vehicle.imageUrl && (
                <DirectionsCarFilledIcon
                  sx={{
                    fontSize: 100,
                    color: '#667eea',
                    mb: 3
                  }}
                />
              )}
              <Typography
                variant="h3"
                fontWeight="bold"
                gutterBottom
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {vehicle.make} {vehicle.model}
              </Typography>
              <Chip
                label={vehicle.licensePlate}
                sx={{
                  mt: 2,
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  height: 40,
                  px: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff'
                }}
              />
            </Box>

            {/* Vehicle Details */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
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

              <Card
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
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
                      Marka və Model
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="#667eea">
                      {vehicle.make} {vehicle.model}
                    </Typography>
                  </Box>
                </Box>
              </Card>

              {vehicle.color && (
                <Card
                  variant="outlined"
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
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
                        {vehicle.color}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              )}
            </Box>

            {/* Contact Section */}
            {vehicle.contactNumber && (
              <Box sx={{ textAlign: 'center', pt: 4, borderTop: '2px solid rgba(102, 126, 234, 0.2)' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom mb={3}>
                  Əlaqə Məlumatları
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  href={`tel:${vehicle.contactNumber}`}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
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
                  <PhoneIcon sx={{ mr: 1 }} />
                  {vehicle.contactNumber}
                </Button>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </>
  );
}

