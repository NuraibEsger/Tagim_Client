import { Container, Typography, Box, Paper } from '@mui/material';
import PublicHeader from '../components/PublicHeader';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';

export default function LandingPage() {
  return (
    <>
      <PublicHeader />
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          pt: 8,
          pb: 8
        }}
      >
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <DirectionsCarFilledIcon
              sx={{
                fontSize: 120,
                color: '#667eea',
                mb: 3,
                animation: 'bounce 2s infinite',
                '@keyframes bounce': {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-20px)' }
                }
              }}
            />
            <Typography
              variant="h2"
              fontWeight="bold"
              gutterBottom
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 2
              }}
            >
              Tagim.az - Maşınlarınızı QR Kod ilə Qoruyun
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
              Maşınlarınızın şüşəsinə yapışdıracağınız QR kod stikerləri ilə maşın sahibinin məlumatlarını 
              asanlıqla paylaşın və əlaqə qurun.
            </Typography>
          </Box>

          {/* Features Section */}
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 4,
              mb: 8
            }}
          >
            <Box>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 4,
                  textAlign: 'center',
                  height: '100%',
                  background: '#fff',
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.2)'
                  }
                }}
              >
                <QrCodeScannerIcon
                  sx={{
                    fontSize: 60,
                    color: '#667eea',
                    mb: 2
                  }}
                />
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  QR Kod Stikerləri
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Maşınlarınızın şüşəsinə yapışdırılacaq dayanıqlı QR kod stikerləri. 
                  QR kodu oxudan hər kəs maşın sahibinin məlumatlarını görə bilər.
                </Typography>
              </Paper>
            </Box>

            <Box>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 4,
                  textAlign: 'center',
                  height: '100%',
                  background: '#fff',
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.2)'
                  }
                }}
              >
                <SecurityIcon
                  sx={{
                    fontSize: 60,
                    color: '#667eea',
                    mb: 2
                  }}
                />
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Təhlükəsizlik
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Yalnız siz tərəfindən seçilmiş məlumatlar görünür. 
                  Şəxsi məlumatlarınız qorunur və yalnız lazım olduqda paylaşılır.
                </Typography>
              </Paper>
            </Box>

            <Box>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 4,
                  textAlign: 'center',
                  height: '100%',
                  background: '#fff',
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.2)'
                  }
                }}
              >
                <SpeedIcon
                  sx={{
                    fontSize: 60,
                    color: '#667eea',
                    mb: 2
                  }}
                />
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Sürətli Əlaqə
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  QR kodu oxudan hər kəs dərhal maşın sahibi ilə əlaqə qura bilər. 
                  Vaxt itirmədən, asanlıqla əlaqə saxlayın.
                </Typography>
              </Paper>
            </Box>
          </Box>

          {/* How It Works */}
          <Paper
            sx={{
              p: 6,
              mt: 20,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom mb={4}>
              Necə İşləyir?
            </Typography>
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
                gap: 4
              }}
            >
              <Box>
                <Typography variant="h3" fontWeight="bold" mb={2}>1</Typography>
                <Typography variant="h6" mb={1}>Qeydiyyat</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Hesab yaradın və maşınlarınızı əlavə edin
                </Typography>
              </Box>
              <Box>
                <Typography variant="h3" fontWeight="bold" mb={2}>2</Typography>
                <Typography variant="h6" mb={1}>QR Kod Alın</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Hər maşın üçün unikal QR kod stikeri alın
                </Typography>
              </Box>
              <Box>
                <Typography variant="h3" fontWeight="bold" mb={2}>3</Typography>
                <Typography variant="h6" mb={1}>Yapışdırın</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  QR kod stikerini maşının şüşəsinə yapışdırın
                </Typography>
              </Box>
              <Box>
                <Typography variant="h3" fontWeight="bold" mb={2}>4</Typography>
                <Typography variant="h6" mb={1}>Paylaşın</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  QR kodu oxudanlar məlumatlarınızı görə bilər
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

