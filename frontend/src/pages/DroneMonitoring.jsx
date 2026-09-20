import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MdFlight, MdCamera, MdAirplanemodeActive } from 'react-icons/md';
import { FiCheck, FiPlus, FiEye, FiMapPin, FiCalendar, FiUser } from 'react-icons/fi';
import StatusBadge from '../components/StatusBadge';
import { mockDrone, mockFarms } from '../services/mockData';
import styles from '../styles/PageShared.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }) };

const DRONE_GALLERY = [
  { label: 'Farm 1 Overview', ndvi: 0.72, health: 'Good', color: '#2e7d32', area: 'Block A & B (45 ac)', date: '2026-07-12', details: 'Healthy canopy density with minimal nitrogen deficiency.' },
  { label: 'Farm 2 Block A', ndvi: 0.68, health: 'Fair', color: '#7cb342', area: 'East Field (28 ac)', date: '2026-07-10', details: 'Moderate stress detected near perimeter drainage furrow.' },
  { label: 'Tea Estate', ndvi: 0.81, health: 'Excellent', color: '#1b5e20', area: 'Terrace Sector 4 (32 ac)', date: '2026-07-08', details: 'Peak chlorophyll reflection and strong vegetative vigor.' },
  { label: 'Paddy Fields', ndvi: 0.65, health: 'Fair', color: '#8bc34a', area: 'Wetlands Zone C (18 ac)', date: '2026-07-05', details: 'Water standing levels optimal; weed emergence detected at sector edge.' },
];

export default function DroneMonitoring() {
  const [flights, setFlights] = useState(mockDrone.flights);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [toast, setToast] = useState('');

  const [flightForm, setFlightForm] = useState({
    area: 'Green Valley — Block B',
    date: new Date().toISOString().split('T')[0],
    duration: '25 min',
    coverage: '35',
    pilot: 'Amrik Singh',
    altitude: '120m AGL',
    sensor: 'Multispectral RedEdge',
  });

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleScheduleFlight = (e) => {
    e.preventDefault();
    const newFlight = {
      id: Date.now(),
      date: flightForm.date,
      area: flightForm.area,
      duration: flightForm.duration,
      coverage: parseFloat(flightForm.coverage) || 30,
      ndvi: 0.74,
      pilot: flightForm.pilot,
      status: 'Scheduled',
    };

    setFlights(prev => [newFlight, ...prev]);
    setShowFlightModal(false);
    showToastMsg(`Drone flight mission scheduled for ${newFlight.area}!`);
  };

  const totalCovered = flights.reduce((a, f) => a + (Number(f.coverage) || 0), 0);

  return (
    <div>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={styles.toastBanner}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <FiCheck color="var(--primary)" size={18} />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="page-header" initial="hidden" animate="visible" variants={fadeUp}>
        <div>
          <h1 className="page-title">Drone Monitoring</h1>
          <p className="page-subtitle">NDVI analysis, crop health mapping, and aerial multispectral inspection</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowFlightModal(true)}>
          <MdFlight size={16} /> Schedule Flight
        </button>
      </motion.div>

      {/* Stats */}
      <div className="stats-grid page-section" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'Total Flights', value: flights.length, color: '#2d7a3a' },
          { label: 'Area Covered', value: `${totalCovered.toFixed(1)} ac`, color: '#1976d2' },
          { label: 'Avg NDVI Index', value: '0.72', color: '#43a047' },
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
            <div>
              <h3 className="section-title">NDVI Heat Map</h3>
              <p className="section-subtitle">Multispectral aerial survey</p>
            </div>
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
              <span>🔴 Low (0.2–0.4)</span><span>🟡 Med (0.4–0.6)</span><span>🟢 Good (0.6–0.8)</span><span>🌿 High (0.8+)</span>
            </div>
          </div>
        </motion.div>

        {/* NDVI Trend */}
        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="section-header">
            <div>
              <h3 className="section-title">NDVI Trend — 2026</h3>
              <p className="section-subtitle">Monthly vegetative progression</p>
            </div>
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
          <div>
            <h3 className="section-title">Crop Health Map Gallery</h3>
            <p className="section-subtitle">Click any aerial sector map to inspect diagnostic metrics</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {DRONE_GALLERY.map((g, i) => (
            <motion.div
              key={g.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              style={{ border: '1.5px solid var(--border-light)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', cursor: 'pointer' }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedGallery(g)}
            >
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
          <div>
            <h3 className="section-title">Inspection & Flight History</h3>
            <p className="section-subtitle">Logged autonomous surveillance missions</p>
          </div>
          <span className="badge badge-info">{flights.length} flights logged</span>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr><th>Date</th><th>Survey Area</th><th>Duration</th><th>Coverage</th><th>NDVI</th><th>Pilot</th><th>Status</th></tr>
            </thead>
            <tbody>
              {flights.map((f, i) => (
                <motion.tr key={f.id} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
                  <td style={{ fontSize: 13 }}>{f.date}</td>
                  <td style={{ fontSize: 13, fontWeight: 600 }}>{f.area}</td>
                  <td style={{ fontSize: 13 }}>{f.duration}</td>
                  <td style={{ fontSize: 13 }}>{f.coverage} acres</td>
                  <td style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{f.ndvi}</td>
                  <td><span className="badge badge-info">{f.pilot}</span></td>
                  <td><StatusBadge status={f.status} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Schedule Flight Modal */}
      {showFlightModal && (
        <div className={styles.modalOverlay} onClick={() => setShowFlightModal(false)}>
          <motion.div className={styles.modal} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3>Schedule Drone Mission</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Plan an autonomous aerial multispectral crop inspection</p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowFlightModal(false)}>✕</button>
            </div>
            <form onSubmit={handleScheduleFlight} className={styles.modalBody}>
              <div className="form-group">
                <label className="form-label">Flight Target Area *</label>
                <select className="form-select" value={flightForm.area} onChange={e => setFlightForm({ ...flightForm, area: e.target.value })}>
                  {mockFarms.map(f => <option key={f.id} value={`${f.name} — ${f.district}`}>{f.name} ({f.district})</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Mission Date</label>
                  <input className="form-input" type="date" value={flightForm.date} onChange={e => setFlightForm({ ...flightForm, date: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Coverage (acres)</label>
                  <input className="form-input" type="number" value={flightForm.coverage} onChange={e => setFlightForm({ ...flightForm, coverage: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Assigned Pilot</label>
                  <select className="form-select" value={flightForm.pilot} onChange={e => setFlightForm({ ...flightForm, pilot: e.target.value })}>
                    <option value="Amrik Singh">Amrik Singh (Certified)</option>
                    <option value="Vikram Rao">Vikram Rao (Certified)</option>
                    <option value="Autonomous AI Grid">Autonomous AI Grid</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Sensor Payload</label>
                  <select className="form-select" value={flightForm.sensor} onChange={e => setFlightForm({ ...flightForm, sensor: e.target.value })}>
                    <option value="Multispectral RedEdge">Multispectral RedEdge</option>
                    <option value="Thermal IR Canopy">Thermal IR Canopy</option>
                    <option value="RGB 4K Ultra-Res">RGB 4K Ultra-Res</option>
                  </select>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowFlightModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Authorize & Schedule Mission</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Gallery Detail Modal */}
      {selectedGallery && (
        <div className={styles.modalOverlay} onClick={() => setSelectedGallery(null)}>
          <motion.div className={styles.modal} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3>{selectedGallery.label}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{selectedGallery.area} · Captured {selectedGallery.date}</p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelectedGallery(null)}>✕</button>
            </div>
            <div style={{ height: 180, background: `linear-gradient(135deg, ${selectedGallery.color}, #1b5e20)`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 16 }}>
              <div style={{ textAlign: 'center', color: 'white' }}>
                <MdAirplanemodeActive size={42} style={{ opacity: 0.8 }} />
                <div style={{ fontSize: 18, fontWeight: 800, marginTop: 6 }}>NDVI Score: {selectedGallery.ndvi}</div>
                <StatusBadge status={selectedGallery.health} />
              </div>
            </div>
            <div style={{ marginTop: 16, background: 'var(--bg-secondary)', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Surveillance Diagnostics</div>
              <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>{selectedGallery.details}</p>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-primary" onClick={() => setSelectedGallery(null)}>Close</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
