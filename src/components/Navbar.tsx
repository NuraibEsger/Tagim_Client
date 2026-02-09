import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LogoutIcon from '@mui/icons-material/Logout';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import { logout } from '../store/slices/authSlice';
import type { RootState } from '../store/store';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const avatarText = user?.name?.[0]?.toUpperCase?.() || 'U';
  let profileImageUrl: string | undefined;

  try {
    const stored = localStorage.getItem('userProfileOverrides');
    if (stored) {
      const parsed = JSON.parse(stored) as { imageUrl?: string };
      profileImageUrl = parsed.imageUrl;
    }
  } catch {
    profileImageUrl = undefined;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Box
          onClick={() => navigate('/dashboard')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <DirectionsCarFilledIcon sx={{ fontSize: 32, mr: 1.5 }} />
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Tagim.az
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton
            onClick={handleProfile}
            sx={{
              p: 0.5,
              borderRadius: 999,
              background: 'rgba(255, 255, 255, 0.12)',
              '&:hover': { background: 'rgba(255, 255, 255, 0.2)', transform: 'translateY(-1px)' },
              transition: 'all 0.2s ease'
            }}
          >
            <Avatar
              src={profileImageUrl || undefined}
              sx={{
                width: 36,
                height: 36,
                background: profileImageUrl
                  ? 'transparent'
                  : 'linear-gradient(135deg, #fff 0%, #e0e7ff 100%)',
                color: profileImageUrl ? undefined : '#4c51bf',
                fontWeight: profileImageUrl ? undefined : 'bold'
              }}
            >
              {!profileImageUrl && avatarText}
            </Avatar>
          </IconButton>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Çıxış
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}