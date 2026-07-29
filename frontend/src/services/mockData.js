// ============================================
// AGRISMART — Comprehensive Mock Data Service
// ============================================

export const mockFarms = [
  { id: 1, name: 'Green Valley Farm', district: 'Ludhiana', area: 45.5, soilType: 'Loamy', status: 'Active', crops: ['Wheat', 'Maize'], moisture: 68, gps: '30.9010° N, 75.8573° E', owner: 'Rajesh Patel', lastUpdated: '2026-07-12' },
  { id: 2, name: 'Sunrise Paddy Fields', district: 'Nashik', area: 32.0, soilType: 'Clay', status: 'Active', crops: ['Paddy', 'Vegetables'], moisture: 72, gps: '19.9975° N, 73.7898° E', owner: 'Ramesh Sharma', lastUpdated: '2026-07-11' },
  { id: 3, name: 'Hill Country Estate', district: 'Coimbatore', area: 88.3, soilType: 'Sandy Loam', status: 'Inactive', crops: ['Cotton', 'Potatoes'], moisture: 55, gps: '11.0168° N, 76.9558° E', owner: 'Vikram Singh', lastUpdated: '2026-07-10' },
  { id: 4, name: 'Lakeside Agri Plot', district: 'Anand', area: 20.7, soilType: 'Sandy', status: 'Active', crops: ['Mustard', 'Paddy'], moisture: 60, gps: '22.5645° N, 72.9289° E', owner: 'Amit Kumar', lastUpdated: '2026-07-13' },
  { id: 5, name: 'Northern Plains Farm', district: 'Lucknow', area: 67.2, soilType: 'Red Earth', status: 'Active', crops: ['Onion', 'Chilli'], moisture: 45, gps: '26.8467° N, 80.9462° E', owner: 'Priya Nair', lastUpdated: '2026-07-12' },
  { id: 6, name: 'Mandya Sugarcane Farm', district: 'Mandya', area: 39.8, soilType: 'Loamy', status: 'Active', crops: ['Sugarcane', 'Tomato'], moisture: 70, gps: '12.5218° N, 76.8951° E', owner: 'Suresh Joshi', lastUpdated: '2026-07-11' },
];

export const mockCrops = [
  { id: 1, farmId: 1, name: 'Wheat (Kalyansona)', variety: 'Kalyansona', sowingDate: '2026-05-01', harvestDate: '2026-08-15', expectedYield: 4200, progress: 72, status: 'Growing', area: 18, health: 'Good', stage: 'Flowering' },
  { id: 2, farmId: 1, name: 'Maize (Pioneer)', variety: 'Pioneer 3253', sowingDate: '2026-04-15', harvestDate: '2026-07-20', expectedYield: 3800, progress: 90, status: 'Ready', area: 12, health: 'Excellent', stage: 'Maturity' },
  { id: 3, farmId: 2, name: 'Paddy (Basmati)', variety: 'Basmati 370', sowingDate: '2026-05-10', harvestDate: '2026-08-25', expectedYield: 3500, progress: 60, status: 'Growing', area: 20, health: 'Good', stage: 'Tillering' },
  { id: 4, farmId: 2, name: 'Tomato', variety: 'T245', sowingDate: '2026-06-01', harvestDate: '2026-09-01', expectedYield: 8000, progress: 40, status: 'Growing', area: 5, health: 'Fair', stage: 'Vegetative' },
  { id: 5, farmId: 3, name: 'Cotton (Bt Cotton)', variety: 'Bt Cotton-2', sowingDate: '2026-01-01', harvestDate: '2026-12-31', expectedYield: 12000, progress: 55, status: 'Perennial', area: 60, health: 'Good', stage: 'Boll Development' },
  { id: 6, farmId: 4, name: 'Mustard (Pusa Bold)', variety: 'Pusa Bold', sowingDate: '2026-02-15', harvestDate: '2026-11-15', expectedYield: 15000, progress: 35, status: 'Growing', area: 10, health: 'Excellent', stage: 'Flowering' },
];

export const mockSensorData = {
  current: {
    soilMoisture: 68,
    temperature: 29.4,
    humidity: 74,
    soilPH: 6.8,
    nitrogen: 42,
    phosphorus: 28,
    potassium: 35,
    rainfall: 12.5,
  },
  history: Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    soilMoisture: 60 + Math.random() * 20,
    temperature: 26 + Math.random() * 6,
    humidity: 65 + Math.random() * 20,
    soilPH: 6.5 + Math.random() * 0.5,
    rainfall: Math.random() > 0.7 ? Math.random() * 5 : 0,
  })),
  sensors: [
    { id: 'S001', name: 'Field A — Soil Moisture', type: 'Soil Moisture', value: 68, unit: '%', status: 'Online', battery: 87, location: 'Block A' },
    { id: 'S002', name: 'Field B — Temperature', type: 'Temperature', value: 29.4, unit: '°C', status: 'Online', battery: 72, location: 'Block B' },
    { id: 'S003', name: 'Greenhouse — Humidity', type: 'Humidity', value: 74, unit: '%', status: 'Warning', battery: 45, location: 'Greenhouse' },
    { id: 'S004', name: 'Field A — Soil pH', type: 'Soil pH', value: 6.8, unit: 'pH', status: 'Online', battery: 91, location: 'Block A' },
    { id: 'S005', name: 'Field C — NPK', type: 'NPK', value: '42/28/35', unit: 'mg/kg', status: 'Offline', battery: 12, location: 'Block C' },
    { id: 'S006', name: 'Main — Rainfall', type: 'Rainfall', value: 12.5, unit: 'mm', status: 'Online', battery: 80, location: 'Station 1' },
  ],
};

export const mockWeather = {
  current: { temp: 29, condition: 'Partly Cloudy', humidity: 74, wind: 12, uv: 6, feelsLike: 32 },
  forecast: [
    { day: 'Mon', high: 31, low: 24, icon: '☀️', rain: 10 },
    { day: 'Tue', high: 29, low: 23, icon: '🌤', rain: 30 },
    { day: 'Wed', high: 27, low: 22, icon: '🌧', rain: 80 },
    { day: 'Thu', high: 28, low: 22, icon: '🌦', rain: 50 },
    { day: 'Fri', high: 30, low: 24, icon: '⛅', rain: 20 },
    { day: 'Sat', high: 32, low: 25, icon: '☀️', rain: 5 },
    { day: 'Sun', high: 31, low: 24, icon: '☀️', rain: 10 },
  ],
};

export const mockYieldData = [
  { month: 'Jan', yield: 3200, revenue: 128000, expenses: 48000, profit: 80000 },
  { month: 'Feb', yield: 2800, revenue: 112000, expenses: 42000, profit: 70000 },
  { month: 'Mar', yield: 3600, revenue: 144000, expenses: 52000, profit: 92000 },
  { month: 'Apr', yield: 4100, revenue: 164000, expenses: 58000, profit: 106000 },
  { month: 'May', yield: 3900, revenue: 156000, expenses: 55000, profit: 101000 },
  { month: 'Jun', yield: 4500, revenue: 180000, expenses: 62000, profit: 118000 },
  { month: 'Jul', yield: 4200, revenue: 168000, expenses: 59000, profit: 109000 },
  { month: 'Aug', yield: 3800, revenue: 152000, expenses: 54000, profit: 98000 },
  { month: 'Sep', yield: 4600, revenue: 184000, expenses: 65000, profit: 119000 },
  { month: 'Oct', yield: 5000, revenue: 200000, expenses: 70000, profit: 130000 },
  { month: 'Nov', yield: 4300, revenue: 172000, expenses: 60000, profit: 112000 },
  { month: 'Dec', yield: 3700, revenue: 148000, expenses: 53000, profit: 95000 },
];

export const mockWaterUsage = [
  { week: 'Week 1', usage: 450, required: 500, saved: 50 },
  { week: 'Week 2', usage: 380, required: 420, saved: 40 },
  { week: 'Week 3', usage: 520, required: 510, saved: -10 },
  { week: 'Week 4', usage: 410, required: 450, saved: 40 },
  { week: 'Week 5', usage: 360, required: 400, saved: 40 },
  { week: 'Week 6', usage: 480, required: 490, saved: 10 },
];

export const mockCropDistribution = [
  { name: 'Wheat', value: 35, color: '#2d7a3a' },
  { name: 'Vegetables', value: 25, color: '#4caf50' },
  { name: 'Cotton', value: 20, color: '#81c784' },
  { name: 'Mustard', value: 12, color: '#1976d2' },
  { name: 'Other', value: 8, color: '#fb8c00' },
];

export const mockMarketPrices = [
  { id: 1, crop: 'Wheat', market: 'Ludhiana', price: 2125, unit: 'quintal', change: +25.0, trend: 'up', category: 'Cereals' },
  { id: 2, crop: 'Paddy', market: 'Anand', price: 2040, unit: 'quintal', change: -10.0, trend: 'down', category: 'Cereals' },
  { id: 3, crop: 'Tomato', market: 'Nashik', price: 45, unit: 'kg', change: +5.0, trend: 'up', category: 'Vegetables' },
  { id: 4, crop: 'Red Onion', market: 'Nashik', price: 22, unit: 'kg', change: -1.5, trend: 'down', category: 'Vegetables' },
  { id: 5, crop: 'Green Chilli', market: 'Lucknow', price: 65, unit: 'kg', change: +4.0, trend: 'up', category: 'Spices' },
  { id: 6, crop: 'Mustard', market: 'Anand', price: 5450, unit: 'quintal', change: +15.0, trend: 'up', category: 'Oilseeds' },
  { id: 7, crop: 'Sugarcane', market: 'Mandya', price: 315, unit: 'tonne', change: +2.0, trend: 'up', category: 'Sugar' },
  { id: 8, crop: 'Maize', market: 'Coimbatore', price: 1960, unit: 'quintal', change: -5.5, trend: 'down', category: 'Cereals' },
];

export const mockMarketTrends = [
  { month: 'Jan', rice: 1980, tomato: 35, onion: 18, chilli: 50 },
  { month: 'Feb', rice: 2000, tomato: 38, onion: 19, chilli: 52 },
  { month: 'Mar', rice: 2010, tomato: 32, onion: 17, chilli: 55 },
  { month: 'Apr', rice: 2030, tomato: 45, onion: 15, chilli: 58 },
  { month: 'May', rice: 2025, tomato: 40, onion: 20, chilli: 60 },
  { month: 'Jun', rice: 2035, tomato: 42, onion: 21, chilli: 62 },
  { month: 'Jul', rice: 2040, tomato: 45, onion: 22, chilli: 65 },
];

export const mockNotifications = [
  { id: 1, type: 'weather', title: 'Heavy Rain Alert', message: 'Heavy rainfall expected in Ludhiana district tomorrow. Secure crops.', time: '2 mins ago', severity: 'danger', read: false },
  { id: 2, type: 'pest', title: 'Pest Detected', message: 'Fall Armyworm detected in Field A. Immediate action required.', time: '1 hour ago', severity: 'danger', read: false },
  { id: 3, type: 'irrigation', title: 'Irrigation Due', message: 'Block B requires irrigation. Soil moisture at 42%.', time: '3 hours ago', severity: 'warning', read: false },
  { id: 4, type: 'harvest', title: 'Harvest Reminder', message: 'Maize (Pioneer) in Farm 1 is ready for harvest. Expected yield: 3,800 kg.', time: '1 day ago', severity: 'success', read: true },
  { id: 5, type: 'system', title: 'Sensor Offline', message: 'Sensor S005 (Field C NPK) is offline. Check battery level.', time: '2 days ago', severity: 'warning', read: true },
  { id: 6, type: 'weather', title: 'Favorable Weather', message: 'Next 5 days show ideal conditions for wheat sowing.', time: '2 days ago', severity: 'success', read: true },
  { id: 7, type: 'irrigation', title: 'Irrigation Completed', message: 'Automated irrigation cycle completed for Block A. 450L used.', time: '3 days ago', severity: 'info', read: true },
  { id: 8, type: 'harvest', title: 'Crop Stage Update', message: 'Paddy (Basmati) has reached tillering stage. Apply top dressing.', time: '4 days ago', severity: 'info', read: true },
];

export const mockIrrigation = {
  schedule: [
    { id: 1, zone: 'Block A — Wheat', time: '06:00 AM', duration: 45, status: 'Completed', nextRun: 'Tomorrow 06:00 AM', moisture: 68 },
    { id: 2, zone: 'Block B — Maize', time: '08:00 AM', duration: 30, status: 'Running', nextRun: 'Today 06:00 PM', moisture: 42 },
    { id: 3, zone: 'Block C — Vegetables', time: '05:00 PM', duration: 20, status: 'Scheduled', nextRun: 'Today 05:00 PM', moisture: 55 },
    { id: 4, zone: 'Greenhouse', time: '07:00 AM', duration: 15, status: 'Completed', nextRun: 'Tomorrow 07:00 AM', moisture: 72 },
  ],
  weeklyUsage: [
    { day: 'Mon', usage: 1200 }, { day: 'Tue', usage: 950 }, { day: 'Wed', usage: 1400 },
    { day: 'Thu', usage: 800 }, { day: 'Fri', usage: 1100 }, { day: 'Sat', usage: 1300 }, { day: 'Sun', usage: 700 },
  ],
};

export const mockFertilizer = [
  { id: 1, crop: 'Wheat (Kalyansona)', type: 'Urea (N)', quantity: 45, unit: 'kg/acre', date: '2026-07-15', status: 'Pending', stage: 'Tillering', priority: 'High' },
  { id: 2, crop: 'Maize (Pioneer)', type: 'NPK 17:17:17', quantity: 35, unit: 'kg/acre', date: '2026-07-18', status: 'Approved', stage: 'Vegetative', priority: 'Medium' },
  { id: 3, crop: 'Paddy (Basmati)', type: 'DAP', quantity: 25, unit: 'kg/acre', date: '2026-07-20', status: 'Pending', stage: 'Basal', priority: 'High' },
  { id: 4, crop: 'Tomato', type: 'Potassium Sulphate', quantity: 20, unit: 'kg/acre', date: '2026-07-22', status: 'Applied', stage: 'Flowering', priority: 'Low' },
  { id: 5, crop: 'Vegetables', type: 'Compost', quantity: 100, unit: 'kg/acre', date: '2026-07-25', status: 'Approved', stage: 'All', priority: 'Medium' },
];

export const mockPestDetection = {
  recent: [
    { id: 1, crop: 'Wheat', disease: 'Rust (Puccinia graminis)', severity: 'High', confidence: 94.2, date: '2026-07-12', treatment: 'Apply Propiconazole 25% EC @ 1ml/L', image: null },
    { id: 2, crop: 'Tomato', disease: 'Early Blight (Alternaria solani)', severity: 'Medium', confidence: 87.5, date: '2026-07-10', treatment: 'Apply Mancozeb 75% WP @ 2g/L', image: null },
    { id: 3, crop: 'Maize', disease: 'Fall Armyworm (Spodoptera frugiperda)', severity: 'High', confidence: 96.1, date: '2026-07-08', treatment: 'Apply Chlorpyrifos @ 2ml/L', image: null },
  ],
};

export const mockDrone = {
  flights: [
    { id: 1, date: '2026-07-12', area: 'Farm 1 — Full', duration: '45 min', coverage: 45.5, ndvi: 0.72, status: 'Completed', pilot: 'Auto' },
    { id: 2, date: '2026-07-10', area: 'Farm 2 — Block A', duration: '22 min', coverage: 18.0, ndvi: 0.68, status: 'Completed', pilot: 'Auto' },
    { id: 3, date: '2026-07-08', area: 'Farm 3 — Cotton Estate', duration: '65 min', coverage: 60.0, ndvi: 0.81, status: 'Completed', pilot: 'Manual' },
  ],
  ndviData: Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
    ndvi: 0.55 + Math.random() * 0.3,
    health: Math.floor(65 + Math.random() * 25),
  })),
};

export const mockUsers = [
  { id: 1, name: 'Rajesh Patel', email: 'rajesh@agrismart.in', role: 'Farmer', status: 'Active', farms: 2, joined: '2026-01-15', lastLogin: '2026-07-13' },
  { id: 2, name: 'Ramesh Sharma', email: 'ramesh@agrismart.in', role: 'Farmer', status: 'Active', farms: 1, joined: '2026-02-20', lastLogin: '2026-07-12' },
  { id: 3, name: 'Priya Nair', email: 'priya@agrismart.in', role: 'Field Officer', status: 'Active', farms: 8, joined: '2026-01-01', lastLogin: '2026-07-13' },
  { id: 4, name: 'Dr. Suresh Joshi', email: 'suresh@icar.gov.in', role: 'Agricultural Officer', status: 'Active', farms: 0, joined: '2026-01-01', lastLogin: '2026-07-10' },
  { id: 5, name: 'Amit Kumar', email: 'amit@agrismart.in', role: 'Extension Officer', status: 'Inactive', farms: 0, joined: '2026-03-10', lastLogin: '2026-06-01' },
  { id: 6, name: 'Ananya Rao', email: 'ananya@agrismart.in', role: 'Farmer', status: 'Active', farms: 3, joined: '2026-04-05', lastLogin: '2026-07-11' },
];

export const mockAuditLogs = [
  { id: 1, action: 'User Login', user: 'Rajesh Patel', ip: '192.168.1.45', time: '2026-07-13 09:32:15', status: 'Success' },
  { id: 2, action: 'Farm Added', user: 'Ramesh Sharma', ip: '192.168.1.67', time: '2026-07-13 08:45:00', status: 'Success' },
  { id: 3, action: 'Sensor Data Sync', user: 'System', ip: 'localhost', time: '2026-07-13 08:00:00', status: 'Success' },
  { id: 4, action: 'Failed Login', user: 'unknown@mail.com', ip: '203.94.12.88', time: '2026-07-12 23:11:42', status: 'Failed' },
  { id: 5, action: 'Report Exported', user: 'Priya Nair', ip: '192.168.1.90', time: '2026-07-12 17:20:33', status: 'Success' },
  { id: 6, action: 'Crop Updated', user: 'Rajesh Patel', ip: '192.168.1.45', time: '2026-07-12 14:05:17', status: 'Success' },
];

export const mockSystemStats = {
  totalUsers: 142,
  activeFarms: 89,
  totalSensors: 346,
  activeSensors: 312,
  dataPoints: '1.2M',
  uptime: '99.8%',
  alertsToday: 12,
  reportsGenerated: 47,
};

export const mockSeasonalData = [
  { season: 'Rabi 2024', rice: 3800, maize: 3200, vegetables: 7200, tea: 11000 },
  { season: 'Kharif 2024', rice: 4200, maize: 3600, vegetables: 8100, tea: 11500 },
  { season: 'Rabi 2025', rice: 3600, maize: 3400, vegetables: 7800, tea: 11800 },
  { season: 'Kharif 2025', rice: 4500, maize: 3900, vegetables: 8600, tea: 12000 },
  { season: 'Rabi 2026', rice: 4200, maize: 4100, vegetables: 9000, tea: 12400 },
];

export const mockRadarData = [
  { subject: 'Yield', A: 85, B: 70, fullMark: 100 },
  { subject: 'Water Use', A: 78, B: 85, fullMark: 100 },
  { subject: 'Soil Health', A: 72, B: 68, fullMark: 100 },
  { subject: 'Pest Mgmt', A: 88, B: 75, fullMark: 100 },
  { subject: 'Fertilizer', A: 65, B: 80, fullMark: 100 },
  { subject: 'Profit', A: 80, B: 72, fullMark: 100 },
];
