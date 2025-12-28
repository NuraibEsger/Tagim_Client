import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper, Card, CardContent, Chip, Skeleton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Navbar from '../components/Navbar';
import AddVehicleDialog from '../components/AddVehicleDialog';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import { vehicleService } from '../services/vehicleService';
import type { Vehicle } from '../services/vehicleService';
import toast from 'react-hot-toast';
import PaletteIcon from '@mui/icons-material/Palette';
import PhoneIcon from '@mui/icons-material/Phone';

export default function Dashboard() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehicleService.getAll();
      setVehicles(data);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Maşınları yükləmək mümkün olmadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        {/* Başlıq və Düymə */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={5}
          sx={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            p: 3,
            borderRadius: 3,
            border: '1px solid rgba(102, 126, 234, 0.2)'
          }}
        >
          <Box>
            <Typography 
              variant="h4" 
              fontWeight="bold"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 0.5
              }}
            >
            Avtomobillərim
          </Typography>
            <Typography variant="body2" color="text.secondary">
              {vehicles.length} {vehicles.length === 1 ? 'avtomobil' : 'avtomobil'}
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setIsModalOpen(true)}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
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
            Maşın Əlavə Et
          </Button>
        </Box>

        {/* Avtomobillər Siyahısı */}
        {loading ? (
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 3 
            }}
          >
            {[1, 2, 3].map((i) => (
              <Card key={i} variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Skeleton variant="rectangular" height={40} sx={{ mb: 2, borderRadius: 2 }} />
                  <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="70%" />
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : vehicles.length === 0 ? (
        <Paper 
          variant="outlined" 
            sx={{ 
              p: 8, 
              textAlign: 'center', 
              borderRadius: 4, 
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
              border: '2px dashed rgba(102, 126, 234, 0.3)'
            }}
        >
            <DirectionsCarFilledIcon 
              sx={{ 
                fontSize: 80, 
                color: '#ccc', 
                mb: 2,
                opacity: 0.5
              }} 
            />
            <Typography variant="h5" color="text.secondary" gutterBottom fontWeight="bold">
              Hələ heç bir maşın əlavə etməmisiniz
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Yuxarıdakı düymə ilə ilk maşınınızı əlavə edin
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setIsModalOpen(true)}
              sx={{
                borderColor: '#667eea',
                color: '#667eea',
                '&:hover': {
                  borderColor: '#764ba2',
                  background: 'rgba(102, 126, 234, 0.1)'
                }
              }}
            >
              İlk Maşını Əlavə Et
            </Button>
        </Paper>
        ) : (
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 3 
            }}
          >
            {vehicles.map((vehicle) => (
              <Card 
                key={vehicle.id}
                variant="outlined" 
                onClick={() => navigate(`/vehicle/${vehicle.id}`)}
                sx={{ 
                  borderRadius: 3,
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(102, 126, 234, 0.02) 100%)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    transform: 'scaleX(0)',
                    transition: 'transform 0.3s ease'
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.2)',
                    borderColor: '#667eea',
                    '&::before': {
                      transform: 'scaleX(1)'
                    }
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" mb={2.5}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        mr: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <DirectionsCarFilledIcon sx={{ fontSize: 28, color: '#fff' }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                        {vehicle.make} {vehicle.model}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Chip 
                    label={vehicle.licensePlate} 
                    sx={{ 
                      mb: 2.5,
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      height: 32,
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      color: '#667eea'
                    }}
                  />
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PaletteIcon sx={{ fontSize: 18, color: '#667eea' }} />
                      <Typography variant="body2" color="text.secondary">
                        <strong>Rəng:</strong> {vehicle.color || 'Məlumat yoxdur'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon sx={{ fontSize: 18, color: '#667eea' }} />
                      <Typography variant="body2" color="text.secondary">
                        <strong>Əlaqə:</strong> {vehicle.contactNumber || 'Məlumat yoxdur'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* Modal Pəncərə */}
        <AddVehicleDialog 
          open={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onVehicleAdded={fetchVehicles}
        />
      </Container>
    </>
  );
}