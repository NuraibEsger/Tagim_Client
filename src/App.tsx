import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './components/Dashboard';
import VehicleDetailPage from './pages/VehicleDetailPage';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';
import PublicVehiclePage from './pages/PublicVehiclePage';
import ActivateTagPage from './pages/ActivateTagPage';
import TagQrGenerator from './pages/TagQrGenerator';
import ScanPage from './pages/ScanPage';

function App() {
  return (
    <BrowserRouter>
      {/* Bildirişlər üçün Toaster komponenti */}
      <Toaster position="top-center" reverseOrder={false} />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/t/:id" element={<PublicVehiclePage />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          localStorage.getItem('token') ? <Dashboard /> : <Navigate to="/login" />
        } />
        
        {/* Avtomobil detalları səhifəsi (admin) */}
        <Route path="/vehicle/:id" element={
          localStorage.getItem('token') ? <VehicleDetailPage /> : <Navigate to="/login" />
        } />
        
        <Route path="/profile" element={
          localStorage.getItem('token') ? <ProfilePage /> : <Navigate to="/login" />
        } />

        <Route path="/activateTag" element={
          localStorage.getItem('token') ? <ActivateTagPage /> : <Navigate to="/login" />
        } />

        <Route path="/scanpage/:code" element={
          localStorage.getItem('token') ? <ScanPage /> : <Navigate to="/login" />
        } />

        <Route path="/tagGenerator" element={
          <TagQrGenerator uniqueCode="TAG-KH1MPQ84" />
          } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;