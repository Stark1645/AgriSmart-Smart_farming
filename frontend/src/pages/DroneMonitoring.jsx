import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MdFlight, MdCamera } from 'react-icons/md';
import StatusBadge from '../components/StatusBadge';
import { mockDrone } from '../services/mockData';
import styles from '../styles/PageShared.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }) };

const DRONE_GALLERY = [
  { label: 'Farm 1 Overview', ndvi: 0.72, health: 'Good', color: '#2e7d32' },
  { label: 'Farm 2 Block A', ndvi: 0.68, health: 'Fair', color: '#7cb342' },
  { label: 'Tea Estate', ndvi: 0.81, health: 'Excellent', color: '#1b5e20' },
  { label: 'Paddy Fields', ndvi: 0.65, health: 'Fair', color: '#8bc34a' },
];

export default function DroneMonitoring() {
  return (
    <div>
      <motion.div className="page-header" initial="hidden" animate="visible" variants={fadeUp}>
        <div>
          <h1 className="page-title">Drone Monitoring</h1>
          <p className="page-subtitle">NDVI analysis, crop health mapping, and aerial inspection</p>
        </div>
        <button className="btn btn-primary"><MdFlight size={16} /> Schedule Flight</button>
      </motion.div>

      {/* Stats */}
      <div className="stats-grid page-section" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'Total Flights', value: '23', color: '#2d7a3a' },
          { label: 'Area Covered', value: '123.5 ac', color: '#1976d2' },
          { label: 'Avg NDVI', value: '0.72', color: '#43a047' },
          { label: 'Health Score', value: '74%', color: '#0288d1' },
        ].map((s, i) => (
          <motion.div key={s.label} custom={i} initial="hidden" animate="visible" variants={fadeUp} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: 'var(--font-heading)' }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* NDVI Map + Gallery */}
      <div className="charts-grid page-section">
        {/* NDVI Heatmap */}
        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="section-header">
            <h3 className="section-title">NDVI Heat Map</h3>
            <span className="badge badge-success">Latest: 2026-07-12</span>
          </div>
          <div className={styles.ndviPlaceholder}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
              {[0, 1, 2, 3].map(row => (
                <div key={row} style={{ flex: 1, display: 'flex' }}>
                  {[0, 1, 2, 3, 4].map(col => (
                    <div key={col} style={{
                      flex: 1,
                      background: `hsl(${100 + (row * 5 + col * 3) * 4}deg, ${60 + row * 8}%, ${25 + col * 6}%)`,
                      opacity: 0.9,
                    }} />
                  ))}
                </div>
              ))}
            </div>
            <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.6)', borderRadius: 8, padding: '6px 12px', color: 'white', fontSize: 12, fontWeight: 700 }}>
              Farm 1 — NDVI Index: 0.72
            </div>
            <div className={styles.ndviLabel}>
              <span>🔴 Low</span><span>🟡 Med</span><span>🟢 Good</span><span>🌿 High</span>
            </div>
          </div>
        </motion.div>

        {/* NDVI Trend */}
        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="section-header">
            <h3 className="section-title">NDVI Trend — 2026</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={mockDrone.ndviData}>
              <defs>
                <linearGradient id="ndviGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis domain={[0.4, 1.0]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Area type="monotone" dataKey="ndvi" stroke="var(--primary)" fill="url(#ndviGrad)" strokeWidth={2} name="NDVI Index" />
              <Line type="monotone" dataKey="health" stroke="var(--accent)" strokeWidth={2} dot={false} name="Health Score %" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Drone Gallery */}
      <motion.div className="card page-section" initial="hidden" animate="visible" variants={fadeUp}>
        <div className="section-header">
          <h3 className="section-title">Crop Health Map Gallery</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {DRONE_GALLERY.map((g, i) => (
            <motion.div key={g.label} custom={i} initial="hidden" animate="visible" variants={fadeUp}
              style={{ border: '1.5px solid var(--border-light)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', cursor: 'pointer' }}
              whileHover={{ scale: 1.02 }}>
              <div style={{ height: 140, background: `linear-gradient(135deg, ${g.color}dd, ${g.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <MdCamera size={32} color="rgba(255,255,255,0.6)" />
                <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', borderRadius: 6, padding: '3px 8px', fontSize: 11, color: 'white', fontWeight: 700 }}>
                  NDVI {g.ndvi}
                </div>
              </div>
              <div style={{ padding: 12, background: 'var(--card)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{g.label}</div>
                <StatusBadge status={g.health} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Inspection History */}
      <motion.div className="card page-section" initial="hidden" animate="visible" variants={fadeUp}>
        <div className="section-header">
          <h3 className="section-title">Inspection History</h3>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr><th>Date</th><th>Area</th><th>Duration</th><th>Coverage</th><th>NDVI</th><th>Pilot</th><th>Status</th></tr>
            </thead>
            <tbody>
              {mockDrone.flights.map((f, i) => (
                <tr key={f.id}>
                  <td style={{ fontSize: 13 }}>{f.date}</td>
                  <td style={{ fontSize: 13, fontWeight: 600 }}>{f.area}</td>
                  <td style={{ fontSize: 13 }}>{f.duration}</td>
                  <td style={{ fontSize: 13 }}>{f.coverage} acres</td>
                  <td style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{f.ndvi}</td>
                  <td><span className="badge badge-info">{f.pilot}</span></td>
                  <td><StatusBadge status={f.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
