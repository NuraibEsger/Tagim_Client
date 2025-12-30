import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  MenuItem, 
  CircularProgress 
} from '@mui/material';
import axiosClient from '../api/axiosClient';
import { vehicleService, type Vehicle } from '../services/vehicleService'; // Düzgün yolu yoxla
import toast from 'react-hot-toast';

export default function ActivateTagPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL-dən ?code=XYZ gəlirsə onu avtomatik götürürük
  const [uniqueCode, setUniqueCode] = useState(searchParams.get('code') || '');
  
  // Burada vehicle.id saxlayacağıq (Backend-ə publicId kimi gedəcək)
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  
  // State tipini vehicleService-dən gələn 'Vehicle' edirik
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [activating, setActivating] = useState(false);

  // 1. Səhifə açılanda istifadəçinin maşınlarını vehicleService ilə gətiririk
  useEffect(() => {
    async function fetchMyVehicles() {
      try {
        setLoading(true);
        // vehicleService.getAll() artıq normalizeVehicle edib qaytarır
        const data = await vehicleService.getAll();
        setVehicles(data);
      } catch (err) {
        console.error(err);
        toast.error("Maşınlarınızı yükləyə bilmədik.");
      } finally {
        setLoading(false);
      }
    }
    fetchMyVehicles();
  }, []);

  // 2. Aktivləşdirmə düyməsi sıxılanda
  const handleActivate = async () => {
    if (!uniqueCode || !selectedVehicleId) {
      toast.error("Zəhmət olmasa kod daxil edin və maşın seçin.");
      return;
    }

    try {
      setActivating(true);
      
      // Aktivləşdirmə üçün hələ ki xüsusi service metodu yoxdursa, 
      // birbaşa axios və ya yeni service metodu yaza bilərsən.
      // Hazırda olduğu kimi saxlayırıq:
      await axiosClient.post('/Tags/activate', {
        uniqueCode: uniqueCode,
        vehiclePublicId: selectedVehicleId
      });

      toast.success("Təbrik edirik! Stiker aktivləşdirildi.");
      navigate('/dashboard'); 
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Xəta baş verdi.");
    } finally {
      setActivating(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
          Stikeri Aktivləşdir
        </Typography>
        
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
          
          {/* Stiker Kodu */}
          <TextField
            label="Stiker Kodu (Unique Code)"
            value={uniqueCode}
            onChange={(e) => setUniqueCode(e.target.value)}
            fullWidth
            placeholder="Məs: A1B2C3"
          />

          {/* Maşın Seçimi */}
          <TextField
            select
            label="Hansı maşına yapışdırırsınız?"
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            fullWidth
            disabled={loading}
          >
            {vehicles.map((v) => (
              // vehicleService-dəki Vehicle interface-də 'id' var. 
              // Əgər backend publicId-ni 'id' kimi qaytarırsa, bu düzdür.
              <MenuItem key={v.id} value={v.id}>
                {v.make} {v.model} - {v.licensePlate}
              </MenuItem>
            ))}
            
            {!loading && vehicles.length === 0 && (
              <MenuItem disabled value="">
                Sizin maşınınız yoxdur. Əvvəlcə maşın əlavə edin.
              </MenuItem>
            )}
          </TextField>

          <Button 
            variant="contained" 
            size="large" 
            onClick={handleActivate}
            disabled={activating || loading || vehicles.length === 0}
            sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            {activating ? <CircularProgress size={24} color="inherit" /> : "Aktivləşdir"}
          </Button>

        </Box>
      </Paper>
    </Container>
  );
}