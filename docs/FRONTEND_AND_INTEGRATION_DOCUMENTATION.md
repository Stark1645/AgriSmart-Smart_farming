# AgriSmart — Smart Farming & Precision Agriculture System
## Frontend & Integration Review Documentation

---

**Course / Subject:** Application Development Project  
**Review Type:** Frontend & Integration Review  
**Date of Review:** Tuesday, 8th September  
**Project Title:** AgriSmart — Smart Farming & Precision Agriculture System  
**Frontend Framework:** ReactJS 19 (Vite Build Tool)  
**Backend Framework:** Spring Boot 3.x (RESTful Web Services)  
**Database:** MySQL 8.x (Spring Data JPA / Hibernate)  
**HTTP Client:** Axios with Request & Response Interceptors  

---

## Executive Summary & System Overview

**AgriSmart** is an advanced full-stack Smart Farming and Precision Agriculture web platform designed to empower modern farmers, agricultural officers, and farm managers with real-time IoT monitoring, crop planning, precision irrigation scheduling, automated fertilizer recommendations, AI-driven pest detection, and yield profitability analytics.

### Full-Stack Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                              CLIENT TIER (ReactJS 19)                             |
|                                                                                   |
|  +---------------------+   +-----------------------+   +-----------------------+  |
|  |     Pages / UI      |   |   Custom Components   |   |   Context State Store |  |
|  | (Dashboard, Farms,  |   | (Navbar, Sidebar,     |   | (AppContext, Theme,   |  |
|  |  Sensors, Analytics)|   |  StatCards, Badges)   |   |  Session User Auth)   |  |
|  +----------+----------+   +-----------+-----------+   +-----------+-----------+  |
|             |                          |                           |              |
|             +--------------------------+---------------------------+              |
|                                        |                                          |
|                                        v                                          |
|                      +----------------------------------+                         |
|                      |  Axios API Client Layer (api.js) |                         |
|                      |  - Request Auth Interceptor      |                         |
|                      |  - Error Handling Interceptor    |                         |
|                      |  - Base URL: localhost:8080/api  |                         |
|                      +-----------------+----------------+                         |
+----------------------------------------|------------------------------------------+
                                         | HTTP REST (JSON)
                                         v
+-----------------------------------------------------------------------------------+
|                            SERVER TIER (Spring Boot 3)                            |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | REST Controllers: AuthController, FarmController, SensorReadingController,  |  |
|  | CropSeasonController, RecommendationController, AnalyticsController, User  |  |
|  +-------------------------------------+---------------------------------------+  |
|                                        |                                          |
|                                        v                                          |
|  +-----------------------------------------------------------------------------+  |
|  | Service Layer: Business Logic, Security Validation, Advisory Rules Engine   |  |
|  +-------------------------------------+---------------------------------------+  |
|                                        |                                          |
|                                        v                                          |
|  +-----------------------------------------------------------------------------+  |
|  | Data Access Layer: Spring Data JPA Repositories & Entity Models             |  |
|  +-------------------------------------+---------------------------------------+  |
+----------------------------------------|------------------------------------------+
                                         | JDBC / SQL
                                         v
+-----------------------------------------------------------------------------------+
|                            DATABASE TIER (MySQL 8.x)                              |
|                                                                                   |
|  Tables: users, farms, sensor_readings, crop_seasons, input_recommendations      |
+-----------------------------------------------------------------------------------+
```

---

# SECTION 1: FRONTEND DOCUMENTATION (ReactJS)

---

## 1.1 Project Directory & Folder Structure

The frontend is structured using modular React best practices with separate directories for reusable UI components, full-page views, context state, REST services, custom hooks, layouts, and CSS modules.

```
frontend/
├── .env                              # Environment variables (API Base URL)
├── .env.example                      # Example environment configuration
├── index.html                        # Application entry HTML template & Google Fonts
├── package.json                      # NPM dependencies & project scripts
├── vite.config.js                    # Vite build configuration
├── public/                           # Static public assets
│   ├── favicon.svg                   # Brand favicon
│   └── hero-farm.jpg                 # Public imagery
└── src/
    ├── main.jsx                      # React 19 root mounting & BrowserRouter
    ├── App.jsx                       # Master routing table & AppProvider context
    ├── components/                   # Reusable UI component library
    │   ├── Navbar.jsx                # Top header bar with quick stats & user profile
    │   ├── Sidebar.jsx               # Collapsible multi-link navigation sidebar
    │   ├── Footer.jsx                # Public landing footer
    │   ├── StatCard.jsx              # Reusable metric & KPI indicator card
    │   └── StatusBadge.jsx           # Dynamic badge for status indicators
    ├── pages/                        # Application view components (18 pages)
    │   ├── LandingPage.jsx           # Public showcase page
    │   ├── LoginPage.jsx             # Secure authentication page
    │   ├── RegisterPage.jsx          # New user registration page
    │   ├── Dashboard.jsx             # Farmer command center overview
    │   ├── FarmManagement.jsx        # Farm GIS profile & zone manager
    │   ├── IoTSensors.jsx            # Live telemetry gauges & sensor trends
    │   ├── CropPlanning.jsx          # Crop cycle & harvest scheduler
    │   ├── PrecisionIrrigation.jsx   # Soil moisture & valve automation
    │   ├── FertilizerRecommendation.jsx # NPK soil deficiency recommendations
    │   ├── PestDetection.jsx         # Pest & disease image diagnosis
    │   ├── DroneMonitoring.jsx       # Aerial drone survey & NDVI mapping
    │   ├── MarketPrices.jsx          # Live Mandi commodity market prices
    │   ├── YieldAnalytics.jsx        # Yield forecasting & ROI charts
    │   ├── Reports.jsx               # Exportable PDF/CSV farm reports
    │   ├── Notifications.jsx         # Real-time alert notifications
    │   ├── AdminDashboard.jsx        # System administration & user audit
    │   ├── UserProfile.jsx           # Profile details & farm settings
    │   └── Settings.jsx              # System preferences & unit toggles
    ├── layouts/                      # Layout wrappers
    │   ├── PublicLayout.jsx          # Layout wrapper for public pages
    │   └── DashboardLayout.jsx       # Layout wrapper for authenticated dashboard
    ├── context/                      # State management
    │   └── AppContext.jsx            # Global state context for user, theme & alerts
    ├── services/                     # Backend API & Axios integration
    │   ├── api.js                    # Configured Axios instance & REST client functions
    │   └── mockData.js               # Mock data fallback for offline demo
    └── styles/                       # CSS design system & modules
        ├── variables.css             # Color tokens, typography & shadow variables
        ├── global.css                # Base reset, typography & responsive utility classes
        ├── Navbar.module.css         # Navbar scoped styles
        ├── Sidebar.module.css        # Sidebar scoped styles
        ├── AuthPage.module.css       # Login & register page scoped styles
        ├── Dashboard.module.css      # Dashboard layout scoped styles
        └── PageShared.module.css     # Shared table & card module styles
```

> **[SCREENSHOT 1: Folder Structure]**  
> *Place the screenshot of the VS Code Explorer sidebar showing `frontend/`, `src/`, `public/`, `node_modules/`, `components/`, `pages/`, `services/`, `styles/` here.*  
> ```
> +-------------------------------------------------------+
> |                                                       |
> |       [ PASTE SCREENSHOT 1: FOLDER STRUCTURE HERE ]   |
> |                                                       |
> +-------------------------------------------------------+
> ```

---

## 1.2 Entry HTML (`index.html`)

The entry HTML template includes responsive viewport settings, SEO metadata, Google Fonts preconnect (`Inter` and `Outfit` typography), and the `#root` container where React attaches.

**File Location:** `frontend/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Smart Farming and Precision Agriculture Management System - Empowering farmers with AI-driven insights and IoT technology" />
    <title>AgriSmart — Smart Farming & Precision Agriculture</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

> **[SCREENSHOT 2: Entry HTML (`index.html`)]**  
> ```
> +-------------------------------------------------------+
> |                                                       |
> |       [ PASTE SCREENSHOT 2: index.html CODE HERE ]    |
> |                                                       |
> +-------------------------------------------------------+
> ```

---

## 1.3 Routing Architecture (`main.jsx` & `App.jsx`)

The routing layer uses `react-router-dom` (v7) with nested layout routes, protecting dashboard routes and gracefully redirecting invalid URLs.

### 1.3.1 Application Bootstrap (`src/main.jsx`)
Mounts the root React component using `createRoot` and wraps the app with `BrowserRouter`.

**File Location:** `frontend/src/main.jsx`

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

### 1.3.2 Master Routing Table (`src/App.jsx`)

**File Location:** `frontend/src/App.jsx`

```jsx
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

        {/* Dashboard Routes — Authenticated */}
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

        {/* Wildcard Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  );
}
```

> **[SCREENSHOT 3: Routing Setup (`App.jsx` & `main.jsx`)]**  
> ```
> +-------------------------------------------------------+
> |                                                       |
> |       [ PASTE SCREENSHOT 3: App.jsx ROUTING HERE ]    |
> |                                                       |
> +-------------------------------------------------------+
> ```

---

## 1.4 Reusable Component Architecture (`src/components/`)

### 1.4.1 Reusable Component Summary Table

| Component Name | File Path | Functional Responsibility |
| :--- | :--- | :--- |
| **Navbar** | `src/components/Navbar.jsx` | Top header, backend connectivity badge, live alerts count, quick profile pill & theme toggle |
| **Sidebar** | `src/components/Sidebar.jsx` | Responsive navigation with active route highlights, collapse state, and section groupings |
| **StatCard** | `src/components/StatCard.jsx` | Dynamic KPI card featuring metric value, icon, change percentage indicator, and trend tag |
| **StatusBadge** | `src/components/StatusBadge.jsx` | Status color-coded badge (`Optimal`, `Warning`, `Critical`, `Active`, `Completed`) |
| **Footer** | `src/components/Footer.jsx` | Public landing footer with system quick links, newsletter signup, and copyright notice |

### 1.4.2 Component Code Sample: `Navbar.jsx`

**File Location:** `frontend/src/components/Navbar.jsx`

```jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiMenu, FiBell, FiMoon, FiSun, FiSearch, FiChevronDown, 
  FiUser, FiSettings, FiLogOut, FiActivity 
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { checkBackendHealth } from '../services/api';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  const { toggleSidebar, theme, toggleTheme, user, logout, notifications } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const navigate = useNavigate();

  useEffect(() => {
    checkBackendHealth().then(res => {
      setBackendStatus(res.status === 'online' ? 'online' : 'offline');
    });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.leftSection}>
        <button className={styles.iconBtn} onClick={toggleSidebar} title="Toggle Sidebar">
          <FiMenu size={20} />
        </button>
        <div className={styles.searchBar}>
          <FiSearch size={16} className={styles.searchIcon} />
          <input type="text" placeholder="Search farms, sensors, crops..." />
        </div>
      </div>

      <div className={styles.rightSection}>
        {/* Backend Connectivity Status Indicator */}
        <div className={`${styles.statusPill} ${styles[backendStatus]}`}>
          <FiActivity size={14} />
          <span>Spring Boot: {backendStatus.toUpperCase()}</span>
        </div>

        <button className={styles.iconBtn} onClick={toggleTheme} title="Toggle Dark/Light Mode">
          {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        <Link to="/notifications" className={styles.iconBtn} title="Notifications">
          <FiBell size={18} />
          {notifications > 0 && <span className={styles.badge}>{notifications}</span>}
        </Link>

        {/* User Profile Pill */}
        <div className={styles.userMenu}>
          <button className={styles.profileBtn} onClick={() => setDropdownOpen(v => !v)}>
            <div className={styles.avatar}>{user?.name?.charAt(0) || 'U'}</div>
            <span className={styles.userName}>{user?.name || 'Farmer Kamal'}</span>
            <FiChevronDown size={14} />
          </button>
          {dropdownOpen && (
            <div className={styles.dropdown}>
              <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                <FiUser size={15} /> My Profile
              </Link>
              <Link to="/settings" onClick={() => setDropdownOpen(false)}>
                <FiSettings size={15} /> Settings
              </Link>
              <div className={styles.divider} />
              <button onClick={handleLogout} className={styles.logoutBtn}>
                <FiLogOut size={15} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
```

> **[SCREENSHOT 4: Components (`Navbar.jsx`, `Sidebar.jsx`, `StatCard.jsx`)]**  
> ```
> +-------------------------------------------------------+
> |                                                       |
> |       [ PASTE SCREENSHOT 4: COMPONENTS CODE HERE ]    |
> |                                                       |
> +-------------------------------------------------------+
> ```

---

## 1.5 Page Architecture (`src/pages/`)

### 1.5.1 Page Modules Summary Table

| Page Name | File Path | Key Features & Modules |
| :--- | :--- | :--- |
| **LoginPage** | `src/pages/LoginPage.jsx` | Email/password validation, demo auto-fill, error banner, Axios auth hook |
| **RegisterPage** | `src/pages/RegisterPage.jsx` | 3-step registration (Personal, Farm Profile, Security), multi-select crops |
| **Dashboard** | `src/pages/Dashboard.jsx` | Real-time weather, quick farm stats, IoT telemetry overview, quick action buttons |
| **FarmManagement** | `src/pages/FarmManagement.jsx` | Multi-farm GIS switcher, farm creation modal, soil type & zone mapping |
| **IoTSensors** | `src/pages/IoTSensors.jsx` | Soil moisture, temperature, humidity, NPK gauges, battery level indicators |
| **CropPlanning** | `src/pages/CropPlanning.jsx` | Active crop cycles, sowing date, expected harvest date, growth progress |
| **PrecisionIrrigation** | `src/pages/PrecisionIrrigation.jsx`| Automated water scheduling, zone valve toggles, water conservation metrics |
| **FertilizerRecommendation** | `src/pages/FertilizerRecommendation.jsx` | Soil nutrient analysis, tailored NPK application schedules |
| **PestDetection** | `src/pages/PestDetection.jsx` | AI image diagnosis, risk level tagging, treatment recommendation |
| **YieldAnalytics** | `src/pages/YieldAnalytics.jsx` | Yield performance trends, cost breakdown, seasonal profit projections |

### 1.5.2 Page Code Sample: `FarmManagement.jsx`

**File Location:** `frontend/src/pages/FarmManagement.jsx`

```jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiMapPin, FiLayers, FiMaximize2, FiCheckCircle } from 'react-icons/fi';
import { farmAPI } from '../services/api';
import styles from '../styles/PageShared.module.css';

export default function FarmManagement() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    farmName: '',
    location: '',
    totalAreaAcres: '',
    soilType: 'Loamy',
  });

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      setLoading(true);
      const data = await farmAPI.getAllFarms();
      setFarms(data);
    } catch (err) {
      console.warn('Backend unavailable, using initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFarm = async (e) => {
    e.preventDefault();
    try {
      await farmAPI.createFarm(formData);
      setShowModal(false);
      loadFarms();
    } catch (err) {
      console.error('Failed to create farm:', err);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Farm GIS Management</h1>
          <p className={styles.pageSubtitle}>Register, monitor, and configure your farm parcels and zones</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus size={16} /> Add New Farm
        </button>
      </div>

      <div className={styles.cardsGrid}>
        {farms.map((farm) => (
          <motion.div key={farm.id} className={styles.card} whileHover={{ y: -4 }}>
            <div className={styles.cardHeader}>
              <h3>{farm.farmName}</h3>
              <span className="badge badge-success"><FiCheckCircle size={12} /> Active</span>
            </div>
            <div className={styles.cardBody}>
              <p><FiMapPin /> {farm.location}</p>
              <p><FiMaximize2 /> {farm.totalAreaAcres} Acres</p>
              <p><FiLayers /> Soil: {farm.soilType}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

> **[SCREENSHOT 5: Pages (`Dashboard.jsx`, `FarmManagement.jsx`, `LoginPage.jsx`)]**  
> ```
> +-------------------------------------------------------+
> |                                                       |
> |       [ PASTE SCREENSHOT 5: PAGES CODE HERE ]         |
> |                                                       |
> +-------------------------------------------------------+
> ```

---

## 1.6 CSS & Design System (`src/styles/`)

The design system uses CSS Custom Properties (CSS variables) with dark/light theme switching, fluid responsive layouts, and scoped CSS Modules to prevent style collisions.

### 1.6.1 Design Tokens (`src/styles/variables.css`)

**File Location:** `frontend/src/styles/variables.css`

```css
:root {
  /* Emerald Green Agricultural Theme */
  --color-primary-50: #ecfdf5;
  --color-primary-100: #d1fae5;
  --color-primary-500: #10b981;
  --color-primary-600: #059669;
  --color-primary-700: #047857;

  /* Accent Amber & Earthy Tones */
  --color-accent-amber: #f59e0b;
  --color-accent-blue: #3b82f6;
  --color-accent-red: #ef4444;

  /* Typography */
  --font-family-body: 'Inter', system-ui, sans-serif;
  --font-family-heading: 'Outfit', system-ui, sans-serif;

  /* Light Theme Surfaces */
  --bg-app: #f8fafc;
  --bg-card: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border-color: #e2e8f0;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --radius-md: 10px;
  --radius-lg: 16px;
}

[data-theme='dark'] {
  --bg-app: #0b1320;
  --bg-card: #131f32;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --border-color: #1e2d44;
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
}
```

### 1.6.2 Global Stylesheet (`src/styles/global.css`)

**File Location:** `frontend/src/styles/global.css`

```css
@import './variables.css';

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family-body);
  background-color: var(--bg-app);
  color: var(--text-main);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-heading);
  font-weight: 700;
  color: var(--text-main);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500));
  color: #ffffff;
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--color-primary-700), var(--color-primary-600));
  transform: translateY(-1px);
}
```

> **[SCREENSHOT 6: CSS & Design System (`variables.css`, `global.css`)]**  
> ```
> +-------------------------------------------------------+
> |                                                       |
> |       [ PASTE SCREENSHOT 6: CSS FILES CODE HERE ]     |
> |                                                       |
> +-------------------------------------------------------+
> ```

---

# SECTION 2: INTEGRATION DOCUMENTATION (React + Spring Boot + MySQL)

---

## 2.1 Environment Configuration (`.env`)

The frontend dynamically loads backend endpoints through Vite environment variables, allowing seamless switching between local development (`localhost:8080/api`) and production deployment.

**File Location:** `frontend/.env`

```ini
# AgriSmart Frontend Environment Configuration
# Spring Boot Backend API Base URL
VITE_API_BASE_URL=http://localhost:8080/api

# Application Details
VITE_APP_NAME=AgriSmart
VITE_APP_VERSION=1.0.0
```

> **[SCREENSHOT 7: Environment Configuration (`.env`)]**  
> ```
> +-------------------------------------------------------+
> |                                                       |
> |       [ PASTE SCREENSHOT 7: .env FILE CODE HERE ]     |
> |                                                       |
> +-------------------------------------------------------+
> ```

---

## 2.2 Axios Integration Layer (`src/services/api.js`)

The `api.js` file serves as the centralized HTTP abstraction layer. It configures the Axios instance, defines request interceptors for JWT Bearer authentication, implements response interceptors for uniform error handling, and exposes strongly-typed service objects matching each Spring Boot REST controller.

**File Location:** `frontend/src/services/api.js`

```javascript
import axios from 'axios';

// Environment-configured Base URL with fallback to Spring Boot default (port 8080)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Pre-configured Axios Instance for Spring Boot Backend API communication
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach JWT / Session Auth Token
api.interceptors.request.use(
  (config) => {
    const authData = sessionStorage.getItem('agrismart_auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (e) {
        console.warn('Failed to parse auth token:', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Uniform error handling & logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      data: error.response?.data || null,
    };
    console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, customError);
    return Promise.reject(customError);
  }
);

// ==========================================
// 1. Authentication Services (AuthController)
// ==========================================
export const authAPI = {
  register: async (userData) => (await api.post('/auth/register', userData)).data,
  login: async (credentials) => (await api.post('/auth/login', credentials)).data,
  logout: async () => (await api.post('/auth/logout')).data,
  getProfile: async () => (await api.get('/users/profile')).data,
};

// ==========================================
// 2. Farm Management Services (FarmController)
// ==========================================
export const farmAPI = {
  getAllFarms: async () => (await api.get('/farms')).data,
  getFarmById: async (id) => (await api.get(`/farms/${id}`)).data,
  createFarm: async (farmData) => (await api.post('/farms', farmData)).data,
};

// ==========================================
// 3. IoT Sensor Telemetry (SensorReadingController)
// ==========================================
export const sensorAPI = {
  getTelemetryByFarmId: async (farmId) => (await api.get(`/sensor-data/${farmId}`)).data,
  getWeatherByFarmId: async (farmId) => (await api.get(`/weather/${farmId}`)).data,
};

// ==========================================
// 4. Crop Season Management (CropSeasonController)
// ==========================================
export const cropAPI = {
  getCropSeasonById: async (id) => (await api.get(`/crop-seasons/${id}`)).data,
  getCropSeasonsByFarmId: async (farmId) => (await api.get(`/crop-seasons/farm/${farmId}`)).data,
  createCropSeason: async (seasonData) => (await api.post('/crop-seasons', seasonData)).data,
};

// ==========================================
// 5. Input & Recommendations (RecommendationController)
// ==========================================
export const recommendationAPI = {
  getRecommendationsBySeasonId: async (seasonId) => (await api.get(`/recommendations/${seasonId}`)).data,
  getMarketPrices: async () => (await api.get('/market-prices')).data,
  createPestAlert: async (alertData) => (await api.post('/pest-alerts', alertData)).data,
};

// ==========================================
// 6. Analytics & Reports (AnalyticsController)
// ==========================================
export const analyticsAPI = {
  getYieldAnalytics: async (farmId) => (await api.get(`/analytics/yield/${farmId}`)).data,
  getInputCost: async () => (await api.get('/analytics/input-cost')).data,
  getProfitability: async () => (await api.get('/analytics/profitability')).data,
  getOverallStats: async () => (await api.get('/stats')).data,
};

// ==========================================
// 7. User Management (UserController)
// ==========================================
export const userAPI = {
  getAllUsers: async () => (await api.get('/users')).data,
  getUserById: async (id) => (await api.get(`/users/${id}`)).data,
  createUser: async (userData) => (await api.post('/users', userData)).data,
  deleteUser: async (id) => (await api.delete(`/users/${id}`)).data,
};
```

> **[SCREENSHOT 8: Axios Implementation & Interceptors (`services/api.js`)]**  
> ```
> +-------------------------------------------------------+
> |                                                       |
> |       [ PASTE SCREENSHOT 8: api.js AXIOS CODE HERE ]  |
> |                                                       |
> +-------------------------------------------------------+
> ```

---

## 2.3 Spring Boot REST Controllers & Endpoints Specification Matrix

The table below documents the full integration contract between React Axios client calls, Spring Boot `@RestController` classes, and MySQL database tables.

| # | React Axios Service Method | HTTP Method | REST Endpoint | Spring Boot Controller | Target MySQL Table | Description |
| :- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `authAPI.register(user)` | `POST` | `/api/auth/register` | `AuthController.java` | `users` | Creates user account with BCrypt hashed password |
| 2 | `authAPI.login(creds)` | `POST` | `/api/auth/login` | `AuthController.java` | `users` | Authenticates credentials & returns JWT token |
| 3 | `authAPI.logout()` | `POST` | `/api/auth/logout` | `AuthController.java` | `users` | Invalidates current user session |
| 4 | `authAPI.getProfile()` | `GET` | `/api/users/profile` | `AuthController.java` | `users` | Retrieves authenticated user profile |
| 5 | `farmAPI.getAllFarms()` | `GET` | `/api/farms` | `FarmController.java` | `farms` | Fetches all registered farms for user |
| 6 | `farmAPI.getFarmById(id)` | `GET` | `/api/farms/{id}` | `FarmController.java` | `farms` | Fetches specific farm GIS details |
| 7 | `farmAPI.createFarm(data)` | `POST` | `/api/farms` | `FarmController.java` | `farms` | Inserts new farm parcel and soil type |
| 8 | `sensorAPI.getTelemetryByFarmId(id)` | `GET` | `/api/sensor-data/{farmId}` | `SensorReadingController.java` | `sensor_readings` | Fetches live soil moisture, temp, and NPK data |
| 9 | `sensorAPI.getWeatherByFarmId(id)` | `GET` | `/api/weather/{farmId}` | `SensorReadingController.java` | `sensor_readings` | Fetches microclimate weather advisory |
| 10 | `cropAPI.getCropSeasonsByFarmId(id)` | `GET` | `/api/crop-seasons/farm/{id}` | `CropSeasonController.java` | `crop_seasons` | Fetches crop cycles and growth stages |
| 11 | `cropAPI.createCropSeason(data)` | `POST` | `/api/crop-seasons` | `CropSeasonController.java` | `crop_seasons` | Schedules new crop season sowing/harvest |
| 12 | `recommendationAPI.getRecommendationsBySeasonId(id)` | `GET` | `/api/recommendations/{seasonId}` | `RecommendationController.java` | `input_recommendations` | Calculates precision irrigation & fertilizer dosages |
| 13 | `recommendationAPI.getMarketPrices()` | `GET` | `/api/market-prices` | `RecommendationController.java` | — | Fetches Mandi market commodity rates |
| 14 | `recommendationAPI.createPestAlert(data)` | `POST` | `/api/pest-alerts` | `RecommendationController.java` | `pest_alerts` | Logs AI pest detection report |
| 15 | `analyticsAPI.getYieldAnalytics(farmId)` | `GET` | `/api/analytics/yield/{farmId}` | `AnalyticsController.java` | `crop_seasons` | Yield forecasting and historical comparison |
| 16 | `analyticsAPI.getOverallStats()` | `GET` | `/api/stats` | `AnalyticsController.java` | Multiple | System-wide statistics for farms, users, devices |

---

## 2.4 Spring Boot Controller Counterparts Sample

### 2.4.1 `AuthController.java` (Authentication & Security)

**File Location:** `backend/src/main/java/com/examly/springapp/controller/AuthController.java`

```java
package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Authentication Controller", description = "User registration, authentication and session management")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Operation(summary = "User Registration (FR1)")
    @PostMapping("/auth/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User created = authService.registerUser(user);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @Operation(summary = "User Login & Session (FR2)")
    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        Map<String, Object> result = authService.loginUser(credentials.get("email"), credentials.get("password"));
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "User Logout")
    @PostMapping("/auth/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of("message", "Successfully logged out and token invalidated"));
    }

    @Operation(summary = "Get Logged-in User Profile")
    @GetMapping("/users/profile")
    public ResponseEntity<User> getProfile() {
        return ResponseEntity.ok(authService.getProfile());
    }
}
```

### 2.4.2 `FarmController.java` (Farm GIS Lifecycle)

**File Location:** `backend/src/main/java/com/examly/springapp/controller/FarmController.java`

```java
package com.examly.springapp.controller;

import com.examly.springapp.model.Farm;
import com.examly.springapp.service.FarmService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Farm Management Controller", description = "Farm registration, GIS mapping, and farm lifecycle management")
public class FarmController {

    @Autowired
    private FarmService farmService;

    @Operation(summary = "Get All Farms (FR4)")
    @GetMapping("/farms")
    public ResponseEntity<List<Farm>> getAllFarms() {
        return ResponseEntity.ok(farmService.getAllFarms());
    }

    @Operation(summary = "Get Farm By ID")
    @GetMapping("/farms/{id}")
    public ResponseEntity<Farm> getFarmById(@PathVariable Long id) {
        return ResponseEntity.ok(farmService.getFarmById(id));
    }

    @Operation(summary = "Register New Farm (FR4)")
    @PostMapping("/farms")
    public ResponseEntity<Farm> createFarm(@RequestBody Farm farm) {
        Farm created = farmService.createFarm(farm);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
```

> **[SCREENSHOT 9: Spring Boot Controllers (`AuthController.java`, `FarmController.java`)]**  
> ```
> +-------------------------------------------------------+
> |                                                       |
> |       [ PASTE SCREENSHOT 9: CONTROLLERS CODE HERE ]   |
> |                                                       |
> +-------------------------------------------------------+
> ```

---

## 2.5 MySQL Database Configuration & Connection

**File Location:** `backend/src/main/resources/application.properties`

```properties
# Server Port Configuration
server.port=8080

# Spring Application Name
spring.application.name=smart-farming-backend

# Database Configuration (MySQL 8.x)
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/smart_farming?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Swagger / OpenAPI UI Configuration
springdoc.swagger-ui.path=/swagger-ui/index.html
springdoc.api-docs.path=/v3/api-docs
```

> **[SCREENSHOT 10: Backend Database Properties (`application.properties`)]**  
> ```
> +-------------------------------------------------------+
> |                                                       |
> |   [ PASTE SCREENSHOT 10: application.properties HERE ]|
> |                                                       |
> +-------------------------------------------------------+
> ```

---

# SECTION 3: STEP-BY-STEP SCREENSHOT CAPTURE CHECKLIST

Use this checklist to ensure all screenshots required for the **Tuesday, 8th September Review** are captured and embedded:

| # | Item to Capture | File / Screen to Open | Recommended Window Size / Layout |
| :- | :--- | :--- | :--- |
| [ ] 1 | **Folder Structure** | VS Code Explorer sidebar with `frontend/src`, `public`, `node_modules` expanded | Explorer pane only (Ctrl+B) |
| [ ] 2 | **Entry HTML** | `frontend/index.html` | Full editor view |
| [ ] 3 | **Routing Setup** | `frontend/src/App.jsx` & `src/main.jsx` | Split editor view |
| [ ] 4 | **Components** | `src/components/Navbar.jsx` & `Sidebar.jsx` | Split editor view |
| [ ] 5 | **Reusable UI Elements** | `src/components/StatCard.jsx` & `StatusBadge.jsx` | Split editor view |
| [ ] 6 | **Public & Auth Pages** | `src/pages/LandingPage.jsx` & `LoginPage.jsx` | Split editor view |
| [ ] 7 | **Dashboard Page** | `src/pages/Dashboard.jsx` | Full editor view |
| [ ] 8 | **Farm Management Page** | `src/pages/FarmManagement.jsx` | Full editor view |
| [ ] 9 | **IoT Sensors Page** | `src/pages/IoTSensors.jsx` | Full editor view |
| [ ] 10 | **Crop Planning Page** | `src/pages/CropPlanning.jsx` | Full editor view |
| [ ] 11 | **CSS Design Variables** | `src/styles/variables.css` | Full editor view |
| [ ] 12 | **Global CSS Styles** | `src/styles/global.css` | Full editor view |
| [ ] 13 | **CSS Module Styles** | `src/styles/AuthPage.module.css` / `Navbar.module.css` | Split editor view |
| [ ] 14 | **Environment Config** | `frontend/.env` & `frontend/.env.example` | Split editor view |
| [ ] 15 | **Axios API Client Layer** | `frontend/src/services/api.js` (Interceptors & Services) | Full editor view |
| [ ] 16 | **Spring Boot Auth Controller** | `backend/.../controller/AuthController.java` | Full editor view |
| [ ] 17 | **Spring Boot Farm Controller** | `backend/.../controller/FarmController.java` | Full editor view |
| [ ] 18 | **Spring Boot Sensor Controller**| `backend/.../controller/SensorReadingController.java` | Full editor view |
| [ ] 19 | **MySQL Application Properties** | `backend/src/main/resources/application.properties` | Full editor view |
| [ ] 20 | **Live Running UI in Browser** | Browser view of `http://localhost:5173/dashboard` | Full browser window |

---

## Tips for the Review Presentation

1. **Keep Both Frontend & Backend Running**:
   - Backend terminal: `mvn spring-boot:run` (runs on `http://localhost:8080`)
   - Frontend terminal: `npm run dev` (runs on `http://localhost:5173`)
2. **Swagger UI Verification**:
   - Open `http://localhost:8080/swagger-ui/index.html` in a separate tab to showcase the live REST API documentation.
3. **Print / PDF Preparation**:
   - Convert this document into PDF or Word with high-resolution screenshots in the designated placeholders.
   - Keep a printed spiral-bound or stapled copy ready as instructed by the faculty.
