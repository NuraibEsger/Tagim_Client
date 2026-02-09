import { useEffect, useState } from 'react';
import {
  Box, Container, Paper, Typography, Avatar, Button, Chip, Link,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, CircularProgress
} from '@mui/material';
import Navbar from '../components/Navbar';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { profileService } from '../services/profileService'; // Service-də getProfile olmalıdır
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

// Tipləri dəqiqləşdiririk
type SocialLink = { platformName: string; url: string; isVisible?: boolean }; // Backend DTO ilə eyni olmalıdır

interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
  profileImageUrl?: string;
  socialLinks: SocialLink[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Edit State-ləri
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLinks, setEditLinks] = useState<SocialLink[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // 1. Səhifə açılanda Databazadan ən son məlumatı çək
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // Bu metod backend-dəki GET /api/users/profile endpoint-nə getməlidir
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (error) {
      console.error(error);
      toast.error('Profil məlumatlarını yükləmək mümkün olmadı');
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = () => {
    if (!profile) return;
    setEditName(profile.fullName || '');
    setEditPhone(profile.phoneNumber || '');
    // Referansı qırmaq üçün kopyalayırıq
    setEditLinks(profile.socialLinks.map(link => ({ ...link })) || []);
    setEditOpen(true);
  };

  const saveProfile = async () => {
    // Validasiya
    const cleanLinks = editLinks
      .filter((l) => l.platformName.trim() && l.url.trim())
      .map((l) => ({ platformName: l.platformName.trim(), url: l.url.trim(), isVisible: true }));

    const putPayload = {
      fullName: editName.trim(),
      phoneNumber: editPhone.trim(),
      socialMedia: cleanLinks
    };

    setSaving(true);
    try {
      await profileService.updateProfile(putPayload);
      toast.success('Məlumatlar yeniləndi');
      setEditOpen(false);

      // Vacib hissə: Uğurlu olduqdan sonra datanı yenidən çəkirik (və ya state-i əl ilə yeniləyirik)
      fetchProfileData();
      // Və ya sadəcə: setProfile({ ...profile!, ...putPayload });
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Yeniləmə alınmadı');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // Şəkil yükləmə
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const imageUrl = await profileService.uploadProfileImage(file);

      // State-i yeniləyirik ki, şəkil dərhal görünsün
      if (profile) {
        setProfile({ ...profile, profileImageUrl: imageUrl });
      }
      toast.success('Profil şəkli yeniləndi');
    } catch (error: any) {
      toast.error('Şəkli yükləmək mümkün olmadı');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  // Helper funksiyalar
  const addLink = () => setEditLinks((prev) => [...prev, { platformName: '', url: '' }]);
  const removeLink = (idx: number) => setEditLinks((prev) => prev.filter((_, i) => i !== idx));
  const updateLink = (idx: number, key: keyof SocialLink, value: string) =>
    setEditLinks((prev) => prev.map((l, i) => i === idx ? { ...l, [key]: value } : l));

  if (loading) {
    return (
      <>
        <Navbar />
        <Container sx={{ mt: 10, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  if (!profile) return null; // Və ya error mesajı

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 4, mb: 6 }}>
        <Paper sx={{ p: 4, borderRadius: 4 /* ... styles */ }}>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2.5}>

            {/* Avatar Section */}
            <Box position="relative">
              <Avatar
                src={profile.profileImageUrl}
                sx={{ width: 96, height: 96, fontSize: 32, bgcolor: '#667eea' }}
              >
                {!profile.profileImageUrl && profile.fullName?.charAt(0).toUpperCase()}
              </Avatar>
              <Button component="label" size="small" variant="outlined" sx={{ mt: 1 }}>
                {uploadingImage ? 'Yüklənir...' : 'Şəkli dəyiş'}
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </Button>
            </Box>

            {/* Info Section */}
            <Box textAlign="center">
              <Typography variant="h5" fontWeight="bold">{profile.fullName}</Typography>
              <Typography variant="body1" color="text.secondary">{profile.email}</Typography>
              <Typography variant="body2" color="text.secondary">{profile.phoneNumber}</Typography>
            </Box>

            {/* Buttons */}
            <Box display="flex" gap={2} width="100%" mt={1}>
              <Button fullWidth variant="contained" startIcon={<EditIcon />} onClick={openEditDialog}>
                Məlumatları Yenilə
              </Button>
              <Button fullWidth variant="outlined" startIcon={<LogoutIcon />} onClick={() => {
                dispatch(logout());
                window.location.href = '/login';
              }}>
                Çıxış
              </Button>
            </Box>

            {/* Social Links Display */}
            <Box width="100%">
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Sosial şəbəkələr</Typography>
              {!profile.socialLinks?.length ? (
                <Typography variant="body2" color="text.secondary">Hələ sosial link əlavə edilməyib.</Typography>
              ) : (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {profile.socialLinks.map((item, idx) => (
                    <Chip
                      key={idx}
                      label={item.platformName}
                      component={Link}
                      href={item.url}
                      target="_blank"
                      clickable
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Edit Dialog (field adlarını state-ə uyğunlaşdırın) */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Məlumatları Yenilə</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={3} mt={1}>
            <TextField label="Ad Soyad" value={editName} onChange={(e) => setEditName(e.target.value)} fullWidth />
            <TextField label="Telefon" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} fullWidth />

            {/* Link Edit Loop */}
            {editLinks.map((link, idx) => (
              <Box key={idx} display="flex" gap={1}>
                <TextField label="Platforma" value={link.platformName} onChange={(e) => updateLink(idx, 'platformName', e.target.value)} />
                <TextField label="URL" value={link.url} onChange={(e) => updateLink(idx, 'url', e.target.value)} fullWidth />
                <IconButton onClick={() => removeLink(idx)}><DeleteIcon /></IconButton>
              </Box>
            ))}
            <Button startIcon={<AddIcon />} onClick={addLink}>Əlavə et</Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Ləğv et</Button>
          <Button variant="contained" onClick={saveProfile} disabled={saving}>Yadda saxla</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}