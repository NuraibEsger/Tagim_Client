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
// Digər importların yanına əlavə edin
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LanguageIcon from '@mui/icons-material/Language'; // Web sayt üçün
import { IconButton, Tooltip } from '@mui/material'; // Tooltip və IconButton lazımdır

interface SocialMediaLink {
  platformName: string;
  url: string;
}

interface PublicVehicle {
  make: string;
  model: string;
  licensePlate: string;
  color: string;
  contactNumber: string;
  vehicleImageUrl?: string;
  imageUrl?: string;
  userFullName: string;
  userProfilePictureUrl: string;
  socialMediaLinks: SocialMediaLink[];
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
      <Box sx={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={40} sx={{ color: '#667eea' }} />
      </Box>
    );
  }

  if (!vehicle) {
    return (
      <Box sx={{ minHeight: '100vh', background: '#f5f5f5', p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, textAlign: 'center', width: '100%' }}>
          <DirectionsCarFilledIcon sx={{ fontSize: 60, color: '#bdbdbd', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Avtomobil tapılmadı
          </Typography>
        </Paper>
      </Box>
    );
  }

  const getPlatformIcon = (platformName: string) => {
    const name = platformName.toLowerCase();
    switch (name) {
      case 'instagram': return <InstagramIcon />;
      case 'facebook': return <FacebookIcon />;
      case 'linkedin': return <LinkedInIcon />;
      case 'twitter': case 'x': return <TwitterIcon />;
      case 'telegram': return <TelegramIcon />;
      case 'whatsapp': return <WhatsAppIcon />;
      case 'youtube': return <YouTubeIcon />;
      default: return <LanguageIcon />;
    }
  };

  const getPlatformColor = (platformName: string) => {
    const name = platformName.toLowerCase();
    switch (name) {
      case 'instagram': return '#E1306C';
      case 'facebook': return '#1877F2';
      case 'linkedin': return '#0077B5';
      case 'twitter': return '#1DA1F2';
      case 'whatsapp': return '#25D366';
      case 'youtube': return '#FF0000';
      case 'telegram': return '#0088cc';
      default: return '#667eea';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#f8f9fa', pb: 10 }}>
      {/* 1. Hero / Header Image - Full Width */}
      <Box
        sx={{
          height: '35vh',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          background: vehicle.imageUrl ? '#000' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        {vehicle.imageUrl ? (
          <Box
            component="img"
            src={vehicle.imageUrl}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.9
            }}
          />
        ) : (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DirectionsCarFilledIcon sx={{ fontSize: 80, color: 'rgba(255,255,255,0.3)' }} />
          </Box>
        )}

        {/* Overlay Gradient at bottom for text readability */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)'
          }}
        />

        <Box sx={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
          <Chip
            label={vehicle.licensePlate}
            sx={{
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              fontWeight: 'bold',
              mb: 1,
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          />
          <Typography variant="h4" fontWeight="800" color="#fff" sx={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            {vehicle.make} {vehicle.model}
          </Typography>
        </Box>
      </Box>

      {/* 2. Content Container - Overlapping Card Style */}
      <Container maxWidth="sm" sx={{ mt: -3, position: 'relative', zIndex: 2, px: 2 }}>

        {/* Driver Card */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 4,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Box
              component="img"
              src={vehicle.userProfilePictureUrl || "https://ui-avatars.com/api/?name=" + (vehicle.userFullName || "Driver") + "&background=random"}
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #f8f9fa'
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 16,
                height: 16,
                background: '#4caf50',
                borderRadius: '50%',
                border: '2px solid #fff'
              }}
            />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 600, letterSpacing: 0.5 }}>
              Sürücü
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {vehicle.userFullName || "İstifadəçi"}
            </Typography>
          </Box>
        </Paper>

        {/* Vehicle Specs Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, background: '#fff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, color: '#667eea' }}>
              <ConfirmationNumberIcon fontSize="small" />
              <Typography variant="caption" fontWeight="bold">Nömrə</Typography>
            </Box>
            <Typography variant="body1" fontWeight="600">{vehicle.licensePlate}</Typography>
          </Paper>

          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, background: '#fff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, color: '#667eea' }}>
              <PaletteIcon fontSize="small" />
              <Typography variant="caption" fontWeight="bold">Rəng</Typography>
            </Box>
            <Typography variant="body1" fontWeight="600">{vehicle.color || "-"}</Typography>
          </Paper>
        </Box>

        {/* Social Media Links */}
        {vehicle.socialMediaLinks && vehicle.socialMediaLinks.length > 0 && (
          <Box mb={4}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ px: 1 }}>Sosial Hesablar</Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {vehicle.socialMediaLinks.map((social, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    background: '#fff',
                    color: getPlatformColor(social.platformName),
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    width: 50,
                    height: 50,
                    '&:hover': { transform: 'translateY(-2px)' }
                  }}
                >
                  {getPlatformIcon(social.platformName)}
                </IconButton>
              ))}
            </Box>
          </Box>
        )}

      </Container>

      {/* Sticky Bottom Call Action */}
      <Paper
        elevation={10}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          background: '#fff',
          zIndex: 100
        }}
      >
        <Button
          fullWidth
          variant="contained"
          size="large"
          href={`tel:${vehicle.contactNumber}`}
          sx={{
            borderRadius: 3,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', // Green gradient for call
            boxShadow: '0 4px 15px rgba(56, 239, 125, 0.4)'
          }}
          startIcon={<PhoneIcon />}
        >
          Zəng Et
        </Button>
      </Paper>
    </Box>
  );
}

