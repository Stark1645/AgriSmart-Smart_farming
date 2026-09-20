import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MdFlight, MdCamera, MdAirplanemodeActive, MdVideocam, MdLayers } from 'react-icons/md';
import { FiCheck, FiPlus, FiEye, FiMapPin, FiCalendar, FiUser } from 'react-icons/fi';
import StatusBadge from '../components/StatusBadge';
import { mockDrone, mockFarms } from '../services/mockData';
import styles from '../styles/PageShared.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }) };

const DRONE_GALLERY = [
  {
    id: 1,
    label: 'Farm 1 Overview',
    ndvi: 0.72,
    health: 'Good',
    color: '#2e7d32',
    area: 'Block A & B (45 ac)',
    date: '2026-07-12',
    details: 'Healthy canopy density with minimal nitrogen deficiency across central irrigation rows. Chlorophyll absorption is uniform across 92% of the surveyed sector.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&auto=format&fit=crop&q=80',
    resolution: '4K Ultra-Res',
    sensor: 'Sentera Quad Multispectral',
    chlorophyll: '88% optimal',
    crop: 'Wheat & Mustard',
  },
  {
    id: 2,
    label: 'Farm 2 Block A',
    ndvi: 0.68,
    health: 'Fair',
    color: '#7cb342',
    area: 'East Field (28 ac)',
    date: '2026-07-10',
    details: 'Moderate stress detected near perimeter drainage furrow; localized nitrogen top-dressing and drip flushing recommended for Sector 2.',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=900&auto=format&fit=crop&q=80',
    resolution: '4K Multispectral',
    sensor: 'MicaSense RedEdge-P',
    chlorophyll: '74% moderate',
    crop: 'Maize & Soybean',
  },
  {
    id: 3,
    label: 'Tea Estate',
    ndvi: 0.81,
    health: 'Excellent',
    color: '#1b5e20',
    area: 'Terrace Sector 4 (32 ac)',
    date: '2026-07-08',
    details: 'Peak vegetative vigor, dense foliage chlorophyll absorption, and zero moisture stress throughout terraced plantation contours.',
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=900&auto=format&fit=crop&q=80',
    resolution: '5.1K Hasselblad',
    sensor: 'DJI Zenmuse L1 LiDAR',
    chlorophyll: '96% peak',
    crop: 'Highland Tea',
  },
  {
    id: 4,
    label: 'Paddy Fields',
    ndvi: 0.65,
    health: 'Fair',
    color: '#8bc34a',
    area: 'Wetlands Zone C (18 ac)',
    date: '2026-07-05',
    details: 'Water standing levels optimal; weed emergence detected along outer dyke contour. Weed suppression recommended within 48 hours.',
    image: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?w=900&auto=format&fit=crop&q=80',
    resolution: '4K Orthomosaic',
    sensor: 'Parrot Sequoia+',
    chlorophyll: '71% moderate',
    crop: 'Basmati Rice',
  },
];

export default function DroneMonitoring() {
  const [flights, setFlights] = useState(mockDrone.flights);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [toast, setToast] = useState('');
  const [viewMode, setViewMode] = useState('live'); // 'live' | 'ndvi'
  const [flashEffect, setFlashEffect] = useState(false);
  const [telemetry, setTelemetry] = useState({
    altitude: 122.4,
    speed: 18.2,
    battery: 86,
    satellites: 18,
    gimbalPitch: -45,
  });
  const [modalViewMode, setModalViewMode] = useState('rgb'); // 'rgb' | 'ndvi'

  useEffect(() => {
    if (viewMode !== 'live') return;
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        altitude: +(120 + Math.sin(Date.now() / 2000) * 4).toFixed(1),
        speed: +(18 + Math.cos(Date.now() / 1500) * 1.8).toFixed(1),
        battery: Math.max(12, +(prev.battery - 0.02).toFixed(1)),
        satellites: 18,
        gimbalPitch: -45,
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [viewMode]);

  const handleCaptureSnapshot = () => {
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 220);
    showToastMsg(`High-Res 4K Frame captured at ${telemetry.altitude}m AGL (${telemetry.speed} km/h). Logged to surveillance records.`);
  };

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

      {/* NDVI Map & Live Surveillance Feed + Gallery */}
      <div className="charts-grid page-section">
        {/* Live Drone Camera Feed / Multispectral NDVI */}
        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="section-header">
            <div>
              <h3 className="section-title">
                {viewMode === 'live' ? 'Live Drone 4K Surveillance Feed' : 'Multispectral NDVI Aerial Survey'}
              </h3>
              <p className="section-subtitle">
                {viewMode === 'live' ? 'Real-time telemetry stream · DJI Matrice 300 RTK' : 'Orthomosaic vegetative reflectance index'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 6, background: 'var(--bg-secondary)', padding: 3, borderRadius: 'var(--radius-md)' }}>
              <button
                type="button"
                className={`btn btn-sm ${viewMode === 'live' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '4px 10px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
                onClick={() => setViewMode('live')}
              >
                <MdVideocam size={14} /> Live Feed
              </button>
              <button
                type="button"
                className={`btn btn-sm ${viewMode === 'ndvi' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '4px 10px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
                onClick={() => setViewMode('ndvi')}
              >
                <MdLayers size={14} /> NDVI Map
              </button>
            </div>
          </div>

          <div className={styles.droneFeedContainer}>
            {/* Real Aerial Drone Photography */}
            <img
              src="https://images.unsplash.com/photo-1592417817098-8f3d6ef23995?w=1200&auto=format&fit=crop&q=80"
              alt="Live Drone Aerial View"
              className={styles.droneFeedImg}
              style={{
                filter: viewMode === 'ndvi' ? 'contrast(1.35) saturate(1.8)' : 'contrast(1.05)',
                transform: viewMode === 'live' ? 'scale(1.04)' : 'scale(1)',
              }}
            />

            {/* Multispectral false-color heatmap overlay when in NDVI mode */}
            {viewMode === 'ndvi' && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(211,47,47,0.55) 0%, rgba(245,124,0,0.45) 20%, rgba(251,192,45,0.4) 40%, rgba(124,179,66,0.55) 60%, rgba(46,125,50,0.7) 80%, rgba(27,94,32,0.8) 100%)',
                  mixBlendMode: 'multiply',
                  pointerEvents: 'none',
                }}
              />
            )}

            {/* Flash Effect when snapshot captured */}
            {flashEffect && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.85)', zIndex: 10, transition: 'opacity 0.2s' }} />
            )}

            {/* Live Scanline Sweep */}
            {viewMode === 'live' && <div className={styles.droneScanline} />}

            {/* Targeting Reticle & Crosshairs */}
            {viewMode === 'live' && (
              <div className={styles.droneReticle}>
                <div style={{ position: 'absolute', top: -16, fontSize: 9, color: '#4ade80', fontWeight: 800, whiteSpace: 'nowrap', textShadow: '0 1px 2px black' }}>
                  TARGET: SECTOR 4A
                </div>
              </div>
            )}

            {/* HUD Overlays */}
            <div className={styles.droneFeedHud}>
              {/* Top HUD Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {viewMode === 'live' && <span className={styles.liveRecDot} />}
                  <span>{viewMode === 'live' ? 'LIVE 4K · 60 FPS' : 'MULTISPECTRAL REDEDGE'}</span>
                  <span style={{ margin: '0 8px', opacity: 0.6 }}>|</span>
                  <span style={{ color: '#86efac' }}>DJI Matrice 300 RTK</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', padding: '3px 8px', borderRadius: 6 }}>
                  <span>🔋 {telemetry.battery}%</span>
                  <span>📡 5.8GHz</span>
                  <span>🛰 18 SATS</span>
                </div>
              </div>

              {/* Bottom HUD Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 11, textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
                <div style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', padding: '5px 8px', borderRadius: 6 }}>
                  <div style={{ fontWeight: 700, color: '#86efac' }}>
                    ALT: {telemetry.altitude}m AGL · SPD: {telemetry.speed} km/h
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>
                    GPS: 30.9010° N, 75.8573° E · GIMBAL: {telemetry.gimbalPitch}°
                  </div>
                </div>

                <div className={styles.droneFeedInteractive}>
                  {viewMode === 'live' ? (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ padding: '5px 12px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
                      onClick={handleCaptureSnapshot}
                    >
                      <MdCamera size={14} /> Capture Snapshot
                    </button>
                  ) : (
                    <div className={styles.ndviLabel} style={{ position: 'static', padding: '5px 10px', margin: 0 }}>
                      <span>🔴 Low</span><span>🟡 Med</span><span>🟢 Good</span><span>🌿 High</span>
                    </div>
                  )}
                </div>
              </div>
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
            <ComposedChart data={mockDrone.ndviData}>
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
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Drone Gallery with Real Aerial Imagery */}
      <motion.div className="card page-section" initial="hidden" animate="visible" variants={fadeUp}>
        <div className="section-header">
          <div>
            <h3 className="section-title">Crop Health Map Gallery</h3>
            <p className="section-subtitle">Click any aerial sector map to inspect diagnostic metrics & telemetry</p>
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
              style={{
                border: '1.5px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                cursor: 'pointer',
                background: 'var(--card)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => { setSelectedGallery(g); setModalViewMode('rgb'); }}
            >
              <div style={{ height: 140, position: 'relative', overflow: 'hidden', background: g.color }}>
                <img
                  src={g.image}
                  alt={g.label}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 40%, rgba(0,0,0,0.7) 100%)' }} />

                <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', borderRadius: 6, padding: '2px 7px', fontSize: 10, color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MdCamera size={11} color="var(--primary-light)" /> {g.resolution.split(' ')[0]}
                </div>

                <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', borderRadius: 6, padding: '3px 8px', fontSize: 11, color: '#4ade80', fontWeight: 800 }}>
                  NDVI {g.ndvi}
                </div>

                <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', color: 'white' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>{g.crop}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.2)', padding: '1px 5px', borderRadius: 4 }}>{g.sensor.split(' ')[0]}</span>
                </div>
              </div>

              <div style={{ padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{g.label}</div>
                  <StatusBadge status={g.health} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{g.area}</div>
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

      {/* Gallery Detail Modal with Real Aerial Photo & Mode Toggle */}
      {selectedGallery && (
        <div className={styles.modalOverlay} onClick={() => setSelectedGallery(null)}>
          <motion.div
            className={styles.modal}
            style={{ maxWidth: 640 }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <h3>{selectedGallery.label} — Aerial Inspection</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                  {selectedGallery.area} · Captured {selectedGallery.date} · {selectedGallery.sensor}
                </p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelectedGallery(null)}>✕</button>
            </div>

            {/* High-Res Aerial Image Viewer */}
            <div style={{ position: 'relative', height: 260, borderRadius: 12, overflow: 'hidden', marginTop: 16, background: '#0f172a' }}>
              <img
                src={selectedGallery.image}
                alt={selectedGallery.label}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: modalViewMode === 'ndvi' ? 'contrast(1.4) saturate(1.8)' : 'none',
                }}
              />

              {modalViewMode === 'ndvi' && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(211,47,47,0.55) 0%, rgba(245,124,0,0.45) 20%, rgba(251,192,45,0.4) 40%, rgba(124,179,66,0.55) 60%, rgba(46,125,50,0.7) 80%, rgba(27,94,32,0.8) 100%)',
                    mixBlendMode: 'multiply',
                  }}
                />
              )}

              {/* Mode Toggle Pills in Modal */}
              <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => setModalViewMode('rgb')}
                  style={{
                    background: modalViewMode === 'rgb' ? 'var(--primary)' : 'rgba(0,0,0,0.65)',
                    color: 'white',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  RGB Visual
                </button>
                <button
                  type="button"
                  onClick={() => setModalViewMode('ndvi')}
                  style={{
                    background: modalViewMode === 'ndvi' ? 'var(--primary)' : 'rgba(0,0,0,0.65)',
                    color: 'white',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  NDVI Scan
                </button>
              </div>

              <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', borderRadius: 6, padding: '4px 10px', fontSize: 12, color: '#4ade80', fontWeight: 800 }}>
                NDVI {selectedGallery.ndvi}
              </div>

              <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', padding: '6px 12px', borderRadius: 8, fontSize: 11, color: 'white' }}>
                <span><strong>Crop:</strong> {selectedGallery.crop}</span>
                <span><strong>Chlorophyll:</strong> {selectedGallery.chlorophyll}</span>
                <span><strong>Sensor:</strong> {selectedGallery.sensor.split(' ')[0]}</span>
              </div>
            </div>

            <div style={{ marginTop: 16, background: 'var(--bg-secondary)', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
                Surveillance Diagnostics & Agronomist Guidance
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>
                {selectedGallery.details}
              </p>
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
