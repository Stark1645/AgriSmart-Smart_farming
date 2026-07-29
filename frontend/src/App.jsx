import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Dashboard pages
import Dashboard from './pages/Dashboard';
import FarmManagement from './pages/FarmManagement';
import CropPlanning from './pages/CropPlanning';
import IoTSensors from './pages/IoTSensors';
import PrecisionIrrigation from './pages/PrecisionIrrigation';
import FertilizerRecommendation from './pages/FertilizerRecommendation';
import PestDetection from './pages/PestDetection';
import DroneMonitoring from './pages/DroneMonitoring';
import MarketPrices from './pages/MarketPrices';
import YieldAnalytics from './pages/YieldAnalytics';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings';

import './styles/global.css';

export default function App() {
  return (
    <AppProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Dashboard Routes — Protected */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/farm-management" element={<FarmManagement />} />
          <Route path="/crop-planning" element={<CropPlanning />} />
          <Route path="/iot-sensors" element={<IoTSensors />} />
          <Route path="/irrigation" element={<PrecisionIrrigation />} />
          <Route path="/fertilizer" element={<FertilizerRecommendation />} />
          <Route path="/pest-detection" element={<PestDetection />} />
          <Route path="/drone-monitoring" element={<DroneMonitoring />} />
          <Route path="/market-prices" element={<MarketPrices />} />
          <Route path="/yield-analytics" element={<YieldAnalytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  );
}
