import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { MdSensors, MdBattery80 } from 'react-icons/md';
import StatusBadge from '../components/StatusBadge';
import { mockSensorData } from '../services/mockData';
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
  const { current, history, sensors } = mockSensorData;

  return (
    <div>
      <motion.div className="page-header" initial="hidden" animate="visible" variants={fadeUp}>
        <div>
          <h1 className="page-title">IoT Sensor Dashboard</h1>
          <p className="page-subtitle">Real-time monitoring of all farm sensors</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <span className="badge badge-success">● 5 Online</span>
          <span className="badge badge-danger">● 1 Offline</span>
        </div>
      </motion.div>

      {/* Gauge Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="page-section">
        {GAUGE_SENSORS.map((s, i) => (
          <motion.div key={s.key} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
            <GaugeCard sensor={s} value={current[s.key]} />
          </motion.div>
        ))}
      </div>

      {/* Line Charts */}
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
            <AreaChart data={history.slice(-12)}>
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
            </AreaChart>
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
