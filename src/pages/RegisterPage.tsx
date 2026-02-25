import { useState } from 'react';
import {
  Typography, TextField, Button, Box, Link
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';

// Shared style constants
const CYAN = '#06b6d4';
const VIOLET = '#8b5cf6';
const BG_DARK = '#0f172a';
const CARD_BG = 'rgba(15, 23, 42, 0.7)';
const BORDER_COLOR = 'rgba(255,255,255,0.08)';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#e2e8f0',
    '& fieldset': {
      borderColor: 'rgba(255,255,255,0.12)',
      transition: 'border-color 0.3s, box-shadow 0.3s',
    },
    '&:hover fieldset': {
      borderColor: CYAN,
    },
    '&.Mui-focused fieldset': {
      borderColor: CYAN,
      boxShadow: `0 0 12px ${CYAN}44`,
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255,255,255,0.5)',
    '&.Mui-focused': { color: CYAN },
  },
};

// Floating shape component
const FloatingShape = ({
  size, top, left, delay, color, shape,
}: {
  size: number; top: string; left: string; delay: string; color: string; shape: 'circle' | 'square';
}) => (
  <Box
    sx={{
      position: 'absolute',
      width: size,
      height: size,
      top,
      left,
      borderRadius: shape === 'circle' ? '50%' : '6px',
      background: `${color}18`,
      border: `1px solid ${color}30`,
      animation: 'floatShape 8s ease-in-out infinite',
      animationDelay: delay,
      '@keyframes floatShape': {
        '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
        '50%': { transform: 'translateY(-30px) rotate(15deg)' },
      },
    }}
  />
);

export default function RegisterPage() {
  const navigate = useNavigate();

  // Form məlumatları
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await authService.register(formData);
      toast.success('Qeydiyyat uğurludur! İndi giriş edin.');
      navigate('/login');
    } catch (error: any) {
      // Backend-dən gələn validasiya xətalarını göstərək
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err: any) => {
          toast.error(`${err.field}: ${err.error}`);
        });
      } else {
        toast.error('Xəta baş verdi.');
      }
    }
  };

  const fields = [
    { label: 'Ad Soyad', name: 'fullName', type: 'text', icon: <PersonIcon sx={{ color: CYAN, mr: 1, fontSize: 20 }} /> },
    { label: 'Email', name: 'email', type: 'text', icon: <EmailIcon sx={{ color: CYAN, mr: 1, fontSize: 20 }} /> },
    { label: 'Nömrə', name: 'phoneNumber', type: 'text', icon: <PhoneIcon sx={{ color: CYAN, mr: 1, fontSize: 20 }} /> },
    { label: 'Şifrə', name: 'password', type: 'password', icon: <LockIcon sx={{ color: CYAN, mr: 1, fontSize: 20 }} /> },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: BG_DARK,
        fontFamily: '"Inter", "Roboto", sans-serif',
      }}
    >
      {/* ───── Left decorative panel ───── */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: `radial-gradient(ellipse at 30% 50%, ${VIOLET}15 0%, transparent 70%)`,
        }}
      >
        {/* Floating shapes */}
        <FloatingShape size={60} top="15%" left="20%" delay="0s" color={CYAN} shape="square" />
        <FloatingShape size={40} top="25%" left="65%" delay="1s" color={VIOLET} shape="circle" />
        <FloatingShape size={80} top="60%" left="15%" delay="2s" color={CYAN} shape="circle" />
        <FloatingShape size={50} top="70%" left="70%" delay="0.5s" color={VIOLET} shape="square" />
        <FloatingShape size={30} top="45%" left="80%" delay="3s" color={CYAN} shape="square" />
        <FloatingShape size={45} top="85%" left="45%" delay="1.5s" color={VIOLET} shape="circle" />

        {/* Brand block */}
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <DirectionsCarFilledIcon
            sx={{
              fontSize: 100,
              color: CYAN,
              mb: 3,
              filter: `drop-shadow(0 0 30px ${CYAN}60)`,
              animation: 'pulse 3s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)', filter: `drop-shadow(0 0 30px ${CYAN}60)` },
                '50%': { transform: 'scale(1.05)', filter: `drop-shadow(0 0 50px ${CYAN}90)` },
              },
            }}
          />
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              background: `linear-gradient(135deg, ${CYAN}, ${VIOLET})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Tagim
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.45)', maxWidth: 280 }}>
            Avtomobilinizi qeyd edin, idarə edin və qoruyun
          </Typography>
        </Box>
      </Box>

      {/* ───── Right form panel ───── */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, sm: 5 },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 420,
            p: { xs: 4, sm: 5 },
            borderRadius: 4,
            background: CARD_BG,
            backdropFilter: 'blur(24px)',
            border: `1px solid ${BORDER_COLOR}`,
            boxShadow: `0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 ${BORDER_COLOR}`,
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            {/* Mobile-only brand icon */}
            <DirectionsCarFilledIcon
              sx={{
                display: { xs: 'block', md: 'none' },
                fontSize: 48,
                color: CYAN,
                mx: 'auto',
                mb: 1,
              }}
            />
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                background: `linear-gradient(135deg, ${CYAN}, ${VIOLET})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Qeydiyyat
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
              Yeni hesab yaradın
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form">
            {fields.map((field) => (
              <TextField
                key={field.name}
                fullWidth
                label={field.label}
                name={field.name}
                type={field.type}
                margin="normal"
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                InputProps={{
                  startAdornment: field.icon,
                }}
                sx={inputSx}
              />
            ))}

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<PersonAddIcon />}
              sx={{
                mt: 4,
                mb: 2,
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem',
                background: `linear-gradient(135deg, ${CYAN}, ${VIOLET})`,
                boxShadow: `0 4px 20px ${CYAN}40`,
                border: 'none',
                '&:hover': {
                  background: `linear-gradient(135deg, ${VIOLET}, ${CYAN})`,
                  boxShadow: `0 6px 28px ${CYAN}60`,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
              onClick={handleRegister}
            >
              Qeydiyyatdan Keç
            </Button>

            <Box textAlign="center" mt={3}>
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  '&:hover': {
                    color: CYAN,
                  },
                  transition: 'color 0.3s ease',
                }}
              >
                Artıq hesabınız var?{' '}
                <Box component="span" sx={{ color: CYAN, fontWeight: 600 }}>
                  Giriş edin
                </Box>
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}