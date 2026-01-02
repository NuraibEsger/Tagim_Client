import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { 
  Box, 
  Paper, 
  Typography, 
  CircularProgress, 
  Button, 
  Stack 
} from '@mui/material';

// İkonlar
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AppSettingsAltIcon from '@mui/icons-material/AppSettingsAlt';

// Enum (Backend ilə eyni)
const TagScanStatus = {
  NotFound: 0,
  Active: 1,
  ReadyToActivate: 2
} as const;

type TagScanStatus = typeof TagScanStatus[keyof typeof TagScanStatus];

interface ScanResponse {
  status: TagScanStatus;
  uniqueCode: string;
  vehiclePublicId?: string; 
}

// UI üçün statuslar
type ViewState = 'scanning' | 'success_active' | 'success_new' | 'error';

export default function ScanPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  
  const [viewState, setViewState] = useState<ViewState>('scanning');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!code) {
      setViewState('error');
      setErrorMessage('QR Kod tapılmadı.');
      return;
    }

    const scanTag = async () => {
      try {
        // Minimum 800ms gözləmə əlavə edirik ki, istifadəçi animasiyanı görsün (UX üçün)
        const minLoadingTime = new Promise(resolve => setTimeout(resolve, 800));
        const request = axiosClient.get<ScanResponse>(`/Tags/scan/${code}`);

        // Həm sorğunun, həm də vaxtın bitməsini gözləyirik
        const [response] = await Promise.all([request, minLoadingTime]);
        const data = response.data;

        if (data.status === TagScanStatus.Active) {
            setViewState('success_active');
            
            // 1.5 saniyə sonra maşın səhifəsinə yönləndiririk
            setTimeout(() => {
                navigate(`/t/${data.vehiclePublicId || ''}`, { 
                    state: { vehiclePublicId: data.vehiclePublicId || '' },
                    replace: true 
                });
            }, 1500);
        } 
        else if (data.status === TagScanStatus.ReadyToActivate) {
            setViewState('success_new');

            // 1.5 saniyə sonra aktivasiya səhifəsinə yönləndiririk
            setTimeout(() => {
                navigate(`/activateTag?code=${data.uniqueCode}`, { replace: true });
            }, 1500);
        } 
        else {
            setViewState('error');
            setErrorMessage("Bu QR kod sistemdə qeydiyyatdan keçməyib.");
        }

      } catch (err: any) {
        setViewState('error');
        setErrorMessage(err?.response?.data?.detail || "Sistem xətası baş verdi. İnternet əlaqənizi yoxlayın.");
      }
    };

    scanTag();
  }, [code, navigate]);

  // --- RENDER HİSSƏSİ ---

  const renderContent = () => {
    switch (viewState) {
      case 'scanning':
        return (
          <>
            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
              <CircularProgress size={80} sx={{ color: '#667eea' }} />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <QrCodeScannerIcon sx={{ fontSize: 30, color: '#667eea' }} />
              </Box>
            </Box>
            <Typography variant="h6" color="text.secondary">
              QR Kod yoxlanılır...
            </Typography>
          </>
        );

      case 'success_active':
        return (
          <>
            <CheckCircleIcon sx={{ fontSize: 80, color: '#4CAF50', mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Maşın Tapıldı!
            </Typography>
            <Stack direction="row" alignItems="center" gap={1} sx={{ color: 'text.secondary', mt: 1 }}>
                <DirectionsCarIcon />
                <Typography>Profilə yönləndirilirsiniz...</Typography>
            </Stack>
          </>
        );

      case 'success_new':
        return (
          <>
            <AppSettingsAltIcon sx={{ fontSize: 80, color: '#2196F3', mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Yeni Stiker!
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Aktivləşdirmə səhifəsinə keçid edilir...
            </Typography>
          </>
        );

      case 'error':
        return (
          <>
            <ErrorOutlineIcon sx={{ fontSize: 80, color: '#f44336', mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" color="error" gutterBottom>
              Xəta
            </Typography>
            <Typography color="text.secondary" align="center" sx={{ mb: 4 }}>
              {errorMessage}
            </Typography>
            <Button 
                variant="outlined" 
                color="primary" 
                onClick={() => navigate('/')}
            >
                Ana Səhifəyə Qayıt
            </Button>
          </>
        );
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          borderRadius: 4,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: 300,
          justifyContent: 'center'
        }}
      >
        {renderContent()}
      </Paper>
    </Box>
  );
}