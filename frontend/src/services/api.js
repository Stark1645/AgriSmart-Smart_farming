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
  // POST /api/auth/register
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  // POST /api/auth/login
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  // POST /api/auth/logout
  logout: async () => {
    const res = await api.post('/auth/logout');
    return res.data;
  },
  // GET /api/users/profile
  getProfile: async () => {
    const res = await api.get('/users/profile');
    return res.data;
  },
};

// ==========================================
// 2. Farm Management Services (FarmController)
// ==========================================
export const farmAPI = {
  // GET /api/farms
  getAllFarms: async () => {
    const res = await api.get('/farms');
    return res.data;
  },
  // GET /api/farms/:id
  getFarmById: async (id) => {
    const res = await api.get(`/farms/${id}`);
    return res.data;
  },
  // POST /api/farms
  createFarm: async (farmData) => {
    const res = await api.post('/farms', farmData);
    return res.data;
  },
};

// ==========================================
// 3. IoT Sensor Telemetry (SensorReadingController)
// ==========================================
export const sensorAPI = {
  // GET /api/sensor-data/:farmId
  getTelemetryByFarmId: async (farmId) => {
    const res = await api.get(`/sensor-data/${farmId}`);
    return res.data;
  },
  // GET /api/weather/:farmId
  getWeatherByFarmId: async (farmId) => {
    const res = await api.get(`/weather/${farmId}`);
    return res.data;
  },
};

// ==========================================
// 4. Crop Season Management (CropSeasonController)
// ==========================================
export const cropAPI = {
  // GET /api/crop-seasons/:id
  getCropSeasonById: async (id) => {
    const res = await api.get(`/crop-seasons/${id}`);
    return res.data;
  },
  // GET /api/crop-seasons/farm/:farmId
  getCropSeasonsByFarmId: async (farmId) => {
    const res = await api.get(`/crop-seasons/farm/${farmId}`);
    return res.data;
  },
  // POST /api/crop-seasons
  createCropSeason: async (seasonData) => {
    const res = await api.post('/crop-seasons', seasonData);
    return res.data;
  },
};

// ==========================================
// 5. Input & Recommendations (RecommendationController)
// ==========================================
export const recommendationAPI = {
  // GET /api/recommendations/:seasonId
  getRecommendationsBySeasonId: async (seasonId) => {
    const res = await api.get(`/recommendations/${seasonId}`);
    return res.data;
  },
  // GET /api/market-prices
  getMarketPrices: async () => {
    const res = await api.get('/market-prices');
    return res.data;
  },
  // POST /api/pest-alerts
  createPestAlert: async (alertData) => {
    const res = await api.post('/pest-alerts', alertData);
    return res.data;
  },
};

// ==========================================
// 6. Analytics & Reports (AnalyticsController)
// ==========================================
export const analyticsAPI = {
  // GET /api/analytics/yield/:farmId
  getYieldAnalytics: async (farmId) => {
    const res = await api.get(`/analytics/yield/${farmId}`);
    return res.data;
  },
  // GET /api/analytics/input-cost
  getInputCost: async () => {
    const res = await api.get('/analytics/input-cost');
    return res.data;
  },
  // GET /api/analytics/profitability
  getProfitability: async () => {
    const res = await api.get('/analytics/profitability');
    return res.data;
  },
  // GET /api/stats
  getOverallStats: async () => {
    const res = await api.get('/stats');
    return res.data;
  },
};

// ==========================================
// 7. User Management (UserController)
// ==========================================
export const userAPI = {
  // GET /api/users
  getAllUsers: async () => {
    const res = await api.get('/users');
    return res.data;
  },
  // GET /api/users/:id
  getUserById: async (id) => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },
  // POST /api/users
  createUser: async (userData) => {
    const res = await api.post('/users', userData);
    return res.data;
  },
  // DELETE /api/users/:id
  deleteUser: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
};

// ==========================================
// 8. Health Check Utility
// ==========================================
export const checkBackendHealth = async () => {
  try {
    const res = await api.get('/stats');
    return { status: 'online', data: res.data };
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
};

export default api;
