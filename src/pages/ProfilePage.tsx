import { useEffect, useState } from 'react';
import { 
  Box, Container, Paper, Typography, Avatar, Button, Chip, Link,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton
} from '@mui/material';
import Navbar from '../components/Navbar';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUserFromToken } from '../services/authService';
import { profileService } from '../services/profileService';
import toast from 'react-hot-toast';

type SocialLink = { platform: string; url: string };
type ProfileOverrides = { name?: string; phone?: string; imageUrl?: string; socialLinks?: SocialLink[] };

export default function ProfilePage() {
  const user = getUserFromToken();
  const email = user?.email || 'email mövcud deyil';

  const [overrides, setOverrides] = useState<ProfileOverrides>({});
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLinks, setEditLinks] = useState<SocialLink[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('userProfileOverrides');
      if (stored) {
        const parsed: ProfileOverrides = JSON.parse(stored);
        setOverrides(parsed);
      }
    } catch {
      /* ignore parse errors */
    }
  }, []);
  const name = overrides.name || user?.name || 'İstifadəçi';
  const phone = overrides.phone || user?.phone || 'Telefon mövcud deyil';
  const socialLinks: SocialLink[] = overrides.socialLinks || [];
  const profileImageUrl = overrides.imageUrl || '';


  const openEditDialog = () => {
    setEditName(overrides.name || user?.name || '');
    setEditPhone(overrides.phone || user?.phone || '');
    setEditLinks([...socialLinks]);
    setEditOpen(true);
  };

  const saveOverrides = () => {
    const cleanLinks = editLinks
      .filter((l) => l.platform.trim() && l.url.trim())
      .map((l) => ({ platform: l.platform.trim(), url: l.url.trim() }));

    const cleanPhone = editPhone.replace(/\s/g, '');

    const next: ProfileOverrides = {
      name: editName.trim(),
      phone: cleanPhone,
      socialLinks: cleanLinks
    };

    const putPayload = {
      fullName: next.name || name,
      phoneNumber: next.phone || phone,
      socialLinks: cleanLinks
    };

    setSaving(true);
    profileService.updateProfile(putPayload)
      .then(() => {
        localStorage.setItem('userProfileOverrides', JSON.stringify(next));
        setOverrides(next);
        setEditOpen(false);
        toast.success('Məlumatlar yeniləndi');
      })
      .catch((error: any) => {
        toast.error(error?.response?.data?.detail || 'Yeniləmə alınmadı');
        console.error(error);
      })
      .finally(() => setSaving(false));
  };

  const addLink = () => setEditLinks((prev) => [...prev, { platform: '', url: '' }]);
  const removeLink = (idx: number) => setEditLinks((prev) => prev.filter((_, i) => i !== idx));
  const updateLink = (idx: number, key: keyof SocialLink, value: string) =>
    setEditLinks((prev) => prev.map((l, i) => i === idx ? { ...l, [key]: value } : l));

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const imageUrl = await profileService.uploadProfileImage(file);

      const next: ProfileOverrides = {
        ...overrides,
        imageUrl,
      };

      localStorage.setItem('userProfileOverrides', JSON.stringify(next));
      setOverrides(next);
      toast.success('Profil şəkli yeniləndi');
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.detail || 'Şəkli yükləmək mümkün olmadı');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 4, mb: 6 }}>
        <Paper
          sx={{
            p: 4,
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)'
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="center" gap={2.5}>
            <Box position="relative">
              <Avatar
                src={profileImageUrl || undefined}
                sx={{
                  width: 96,
                  height: 96,
                  fontSize: 32,
                  fontWeight: 'bold',
                  background: profileImageUrl
                    ? 'transparent'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                {!profileImageUrl && name.charAt(0).toUpperCase()}
              </Avatar>
              <Button
                component="label"
                size="small"
                variant="outlined"
                sx={{
                  mt: 1,
                  fontSize: '0.75rem'
                }}
              >
                {uploadingImage ? 'Yüklənir...' : 'Şəkli dəyiş'}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
            </Box>
            <Box textAlign="center">
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {email}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {phone}
              </Typography>
            </Box>

            <Box display="flex" gap={2} width="100%" mt={1}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<EditIcon />}
                onClick={openEditDialog}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': { background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' }
                }}
              >
                Məlumatları Yenilə
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
              >
                Çıxış
              </Button>
            </Box>

            {/* Sosial Şəbəkələr */}
            <Box width="100%">
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Sosial şəbəkələr
              </Typography>
              {socialLinks.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Hələ sosial link əlavə edilməyib.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {socialLinks.map((item, idx) => (
                    <Chip
                      key={idx}
                      label={item.platform}
                      component={Link}
                      href={item.url}
                      target="_blank"
                      clickable
                      sx={{ background: 'rgba(102,126,234,0.1)', borderColor: 'rgba(102,126,234,0.3)' }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Məlumatları Yenilə</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={3} sx={{ mt: 1 }}>
            <TextField
              label="Ad Soyad"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Adınızı daxil edin"
              fullWidth
            />
            <TextField
              label="Telefon"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              placeholder="+994..."
              fullWidth
            />

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" fontWeight="bold">Sosial linklər</Typography>
              <Button startIcon={<AddIcon />} onClick={addLink} size="small">
                Əlavə et
              </Button>
            </Box>

            {editLinks.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Hələ link əlavə edilməyib.
              </Typography>
            )}

            <Box display="flex" flexDirection="column" gap={2}>
              {editLinks.map((link, idx) => (
                <Box key={idx} display="grid" gridTemplateColumns="1fr 1fr auto" gap={1}>
                  <TextField
                    label="Platforma"
                    value={link.platform}
                    onChange={(e) => updateLink(idx, 'platform', e.target.value)}
                  />
                  <TextField
                    label="URL"
                    value={link.url}
                    onChange={(e) => updateLink(idx, 'url', e.target.value)}
                  />
                  <IconButton onClick={() => removeLink(idx)} aria-label="Sil">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} color="inherit">Ləğv et</Button>
          <Button variant="contained" onClick={saveOverrides} disabled={saving}>
            {saving ? 'Yüklənir...' : 'Yadda saxla'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

