import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { MdSensors, MdBattery80, MdFilterList, MdCloudQueue } from 'react-icons/md';
import StatusBadge from '../components/StatusBadge';
import { mockSensorData } from '../services/mockData';
import { sensorAPI, farmAPI } from '../services/api';
import styles from '../styles/PageShared.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }) };

const GAUGE_SENSORS = [
  { key: 'soilMoisture', label: 'Soil Moisture', unit: '%', min: 0, max: 100, optimal: [60, 80], color: '#1976d2' },
  { key: 'temperature', label: 'Temperature', unit: '°C', min: 0, max: 50, optimal: [25, 35], color: '#f57c00' },
  { key: 'humidity', label: 'Humidity', unit: '%', min: 0, max: 100, optimal: [60, 85], color: '#00897b' },
  { key: 'soilPH', label: 'Soil pH', unit: 'pH', min: 0, max: 14, optimal: [6, 7.5], color: '#7b1fa2' },
  { key: 'nitrogen', label: 'Nitrogen (N)', unit: 'mg/kg', min: 0, max: 100, optimal: [30, 60], color: '#2d7a3a' },
  { key: 'phosphorus', label: 'Phosphorus (P)', unit: 'mg/kg', min: 0, max: 100, optimal: [20, 40], color: '#e53935' },
  { key: 'potassium', label: 'Potassium (K)', unit: 'mg/kg', min: 0, max: 100, optimal: [25, 50], color: '#fb8c00' },
  { key: 'rainfall', label: 'Rainfall', unit: 'mm', min: 0, max: 50, optimal: [5, 20], color: '#0288d1' },
];

function GaugeCard({ sensor, value }) {
  const pct = Math.min(100, Math.max(0, ((value - sensor.min) / (sensor.max - sensor.min)) * 100));
  const inOptimal = value >= sensor.optimal[0] && value <= sensor.optimal[1];
  const circumference = 2 * Math.PI * 38;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <motion.div className={styles.gaugeCard} whileHover={{ y: -4 }}>
      <div className={styles.gaugeCircle}>
        <svg viewBox="0 0 100 100" width="100" height="100">
          <circle cx="50" cy="50" r="38" fill="none" stroke="var(--border-light)" strokeWidth="8" />
          <motion.circle
            cx="50" cy="50" r="38" fill="none"
            stroke={inOptimal ? sensor.color : (value < sensor.optimal[0] ? 'var(--warning)' : 'var(--danger)')}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className={styles.gaugeValue}>
          <span className={styles.gaugeNum} style={{ color: sensor.color }}>{value}</span>
          <span className={styles.gaugeUnit}>{sensor.unit}</span>
        </div>
      </div>
      <div className={styles.gaugeName}>{sensor.label}</div>
      <div className={styles.gaugeSub}>
        {inOptimal ? '✓ Optimal' : value < sensor.optimal[0] ? '↓ Low' : '↑ High'}
      </div>
      <div className="progress-bar-track" style={{ marginTop: 8, height: 4 }}>
        <motion.div className="progress-bar-fill" style={{ background: sensor.color }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }} />
      </div>
    </motion.div>
  );
}

export default function IoTSensors() {
  const { current: defaultCurrent, history, sensors: defaultSensors } = mockSensorData;
  const [current, setCurrent] = useState(defaultCurrent);
  const [sensors, setSensors] = useState(defaultSensors);
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(1);
  const [weather, setWeather] = useState(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    loadFarms();
  }, []);

  useEffect(() => {
    loadSensorTelemetry(selectedFarmId);
  }, [selectedFarmId]);

  const loadFarms = async () => {
    try {
      const data = await farmAPI.getAllFarms();
      if (Array.isArray(data) && data.length > 0) {
        setFarms(data);
        if (!selectedFarmId) setSelectedFarmId(data[0].id);
      }
    } catch (e) {
      console.warn('Could not fetch farm list for sensors:', e);
    }
  };

  const loadSensorTelemetry = async (farmId) => {
    try {
      const [readingsRes, weatherRes] = await Promise.allSettled([
        sensorAPI.getTelemetryByFarmId(farmId),
        sensorAPI.getWeatherByFarmId(farmId),
      ]);

      let liveActive = false;
      let updatedCurrent = { ...defaultCurrent };

      if (weatherRes.status === 'fulfilled' && weatherRes.value) {
        setWeather(weatherRes.value);
        if (weatherRes.value.temperature) updatedCurrent.temperature = weatherRes.value.temperature;
        if (weatherRes.value.humidity) updatedCurrent.humidity = weatherRes.value.humidity;
        if (weatherRes.value.rainfall_mm) updatedCurrent.rainfall = weatherRes.value.rainfall_mm;
        liveActive = true;
      }

      if (readingsRes.status === 'fulfilled' && Array.isArray(readingsRes.value) && readingsRes.value.length > 0) {
        liveActive = true;
        const liveReadings = readingsRes.value;
        liveReadings.forEach(r => {
          const type = (r.sensorType || '').toLowerCase();
          const val = Number(r.value);
          if (type.includes('moist')) updatedCurrent.soilMoisture = val;
          else if (type.includes('temp')) updatedCurrent.temperature = val;
          else if (type.includes('humid')) updatedCurrent.humidity = val;
          else if (type.includes('ph')) updatedCurrent.soilPH = val;
          else if (type.includes('nitro')) updatedCurrent.nitrogen = val;
          else if (type.includes('phos')) updatedCurrent.phosphorus = val;
          else if (type.includes('potas')) updatedCurrent.potassium = val;
        });

        // Merge backend readings into sensor table
        const liveSensors = liveReadings.map((r, idx) => ({
          id: `SNS-LIVE-${r.id || idx + 1}`,
          name: `${r.sensorType} Node`,
          type: r.sensorType,
          value: Number(r.value),
          unit: r.unit || '',
          location: `Plot #${r.farmId || farmId}`,
          battery: 95,
          status: r.alertTriggered ? 'Warning' : 'Online',
        }));
        setSensors([...liveSensors, ...defaultSensors.slice(liveSensors.length)]);
      }

      setCurrent(updatedCurrent);
      setIsLive(liveActive);
    } catch (e) {
      console.warn('Backend sensor telemetry offline, using default sensor cache:', e);
    }
  };

  return (
    <div>
      <motion.div className="page-header" initial="hidden" animate="visible" variants={fadeUp}>
        <div>
          <h1 className="page-title">IoT Sensor Dashboard</h1>
          <p className="page-subtitle">Real-time monitoring of all farm sensors & environmental telemetry</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {farms.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-card)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <MdFilterList size={16} color="var(--text-muted)" />
              <select
                value={selectedFarmId}
                onChange={(e) => setSelectedFarmId(Number(e.target.value))}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, outline: 'none', cursor: 'pointer' }}
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.farmName || f.name || `Farm #${f.id}`}
                  </option>
                ))}
              </select>
            </div>
          )}
          <span className={`badge ${isLive ? 'badge-success' : 'badge-primary'}`}>
            {isLive ? '● Live Sensor Stream' : '● 5 Online'}
          </span>
        </div>
      </motion.div>

      {/* Weather Advisory Banner if available */}
      {weather && (
        <motion.div
          initial="hidden" animate="visible" variants={fadeUp}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MdCloudQueue size={22} color="var(--info)" />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Local Microclimate Advisory:</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{weather.forecast} ({weather.condition || 'Partly Cloudy'})</span>
          </div>
          <span className="badge badge-info">{weather.temperature}°C · {weather.humidity}% Humidity</span>
        </motion.div>
      )}

      {/* Gauge Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="page-section">
        {GAUGE_SENSORS.map((s, i) => (
          <motion.div key={s.key} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
            <GaugeCard sensor={s} value={current[s.key] ?? defaultCurrent[s.key]} />
          </motion.div>
        ))}
      </div>

      {/* Line & Composed Charts */}
      <div className="charts-grid page-section">
        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="section-header">
            <h3 className="section-title">24h — Moisture & Temperature</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={history.slice(-12)}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Legend />
              <Line type="monotone" dataKey="soilMoisture" stroke="#1976d2" strokeWidth={2} dot={false} name="Moisture %" />
              <Line type="monotone" dataKey="temperature" stroke="#f57c00" strokeWidth={2} dot={false} name="Temp °C" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="section-header">
            <h3 className="section-title">24h — Humidity & Rainfall</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={history.slice(-12)}>
              <defs>
                <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00897b" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#00897b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Legend />
              <Area type="monotone" dataKey="humidity" stroke="#00897b" fill="url(#humGrad)" strokeWidth={2} name="Humidity %" />
              <Line type="monotone" dataKey="rainfall" stroke="#0288d1" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Rainfall mm" />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Sensor Status Table */}
      <motion.div className="card page-section" initial="hidden" animate="visible" variants={fadeUp}>
        <div className="section-header">
          <h3 className="section-title">Sensor Status</h3>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr><th>Sensor ID</th><th>Name</th><th>Type</th><th>Current Value</th><th>Location</th><th>Battery</th><th>Status</th></tr>
            </thead>
            <tbody>
              {sensors.map((s, i) => (
                <motion.tr key={s.id} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{s.id}</td>
                  <td style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</td>
                  <td><span className="badge badge-info">{s.type}</span></td>
                  <td style={{ fontWeight: 700, fontSize: 14 }}>{s.value} {s.unit}</td>
                  <td style={{ fontSize: 13 }}>{s.location}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MdBattery80 size={16} color={s.battery > 50 ? 'var(--success)' : s.battery > 20 ? 'var(--warning)' : 'var(--danger)'} />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{s.battery}%</span>
                    </div>
                  </td>
                  <td><StatusBadge status={s.status} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
