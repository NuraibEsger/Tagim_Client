import { useState } from 'react';
import { 
  Container, Paper, Typography, TextField, Button, Box, Link 
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import LoginIcon from '@mui/icons-material/Login';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const data = await authService.login({ email, password });
      
      localStorage.setItem('token', data.token);
      
      toast.success('Xoş gəldiniz!');
      navigate('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Giriş uğursuz oldu.';
      toast.error(message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'moveBackground 20s linear infinite',
          '@keyframes moveBackground': {
            '0%': { transform: 'translate(0, 0)' },
            '100%': { transform: 'translate(50px, 50px)' }
          }
        }
      }}
    >
      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper 
          elevation={24} 
          sx={{ 
            p: 5, 
            width: '100%', 
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)'
            }
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <DirectionsCarFilledIcon 
              sx={{ 
                fontSize: 60, 
                color: '#667eea',
                mb: 2,
                animation: 'bounce 2s infinite',
                '@keyframes bounce': {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-10px)' }
                }
              }} 
            />
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              gutterBottom
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
          Daxil Ol
        </Typography>
            <Typography variant="body2" color="text.secondary">
          Tagim hesabınıza giriş edin
        </Typography>
          </Box>

        <Box component="form" noValidate autoComplete="off">
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <EmailIcon sx={{ color: '#667eea', mr: 1 }} />
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
            label="Şifrə"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <LockIcon sx={{ color: '#667eea', mr: 1 }} />
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

          <Button 
            fullWidth 
            variant="contained" 
            size="large" 
              startIcon={<LoginIcon />}
              sx={{ 
                mt: 4, 
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            onClick={handleLogin}
          >
            Giriş Et
          </Button>

            <Box textAlign="center" mt={3}>
              <Link 
                component={RouterLink} 
                to="/register" 
                variant="body2"
                sx={{
                  color: '#667eea',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: '#764ba2'
                  },
                  transition: 'color 0.3s ease'
                }}
              >
              Hesabınız yoxdur? Qeydiyyatdan keçin
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
    </Box>
  );
}