import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MdWaterDrop, MdPlayArrow, MdStop, MdSchedule } from 'react-icons/md';
import StatusBadge from '../components/StatusBadge';
import { mockIrrigation, mockSensorData } from '../services/mockData';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }) };

export default function PrecisionIrrigation() {
  const [zones, setZones] = useState(mockIrrigation.schedule);
  const moisture = mockSensorData.current.soilMoisture;

  const toggleZone = (id) => {
    setZones(prev => prev.map(z => {
      if (z.id === id) {
        const isRunning = z.status === 'Running';
        return {
          ...z,
          status: isRunning ? 'Scheduled' : 'Running',
          moisture: isRunning ? z.moisture : Math.min(100, z.moisture + 15),
        };
      }
      return z;
    }));
  };

  return (
    <div>
      <motion.div className="page-header" initial="hidden" animate="visible" variants={fadeUp}>
        <div>
          <h1 className="page-title">Precision Irrigation</h1>
          <p className="page-subtitle">Smart water management based on real-time soil moisture data</p>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="stats-grid page-section" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'Current Moisture', value: `${moisture}%`, color: '#1976d2', sub: 'Field A average' },
          { label: 'Water Requirement', value: '380 L/day', color: '#2d7a3a', sub: 'All zones combined' },
          { label: 'Today Used', value: '245 L', color: '#0288d1', sub: '64.5% of daily quota' },
          { label: 'Saved This Week', value: '120 L', color: '#43a047', sub: 'vs. traditional method' },
        ].map((s, i) => (
          <motion.div key={s.label} custom={i} initial="hidden" animate="visible" variants={fadeUp} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: 'var(--font-heading)' }}>{s.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 4 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Moisture Indicator */}
      <motion.div className="card page-section" initial="hidden" animate="visible" variants={fadeUp}>
        <div className="section-header">
          <h3 className="section-title">Current Soil Moisture Status</h3>
          <span className={`badge ${moisture > 60 ? 'badge-success' : moisture > 40 ? 'badge-warning' : 'badge-danger'}`}>
            {moisture > 60 ? 'Adequate' : moisture > 40 ? 'Moderate' : 'Needs Irrigation'}
          </span>
        </div>
        <div style={{ position: 'relative', height: 40 }}>
          <div style={{ height: 20, background: 'linear-gradient(to right, var(--danger) 0%, var(--warning) 40%, var(--success) 70%, var(--info) 100%)', borderRadius: 10 }} />
          <motion.div
            style={{ position: 'absolute', top: 0, width: 20, height: 20, background: 'white', border: '3px solid var(--primary)', borderRadius: '50%', transform: 'translateX(-50%)', boxShadow: 'var(--shadow-md)' }}
            initial={{ left: 0 }}
            animate={{ left: `${moisture}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
            <span>0% — Dry</span><span>40% — Low</span><span>65% — Optimal</span><span>100% — Saturated</span>
          </div>
        </div>
      </motion.div>

      {/* Irrigation Schedule */}
      <div className="charts-grid page-section">
        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="section-header">
            <h3 className="section-title">Irrigation Schedule</h3>
            <span className="badge badge-info"><MdSchedule size={12} /> {zones.length} zones</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {zones.map((zone) => (
              <div key={zone.id} style={{ padding: 14, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: `1.5px solid ${zone.status === 'Running' ? 'var(--primary)' : 'var(--border-light)'}`, transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{zone.zone}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{zone.time} · {zone.duration} min · Next: {zone.nextRun}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <StatusBadge status={zone.status} />
                    {zone.status !== 'Running' ? (
                      <button className="btn btn-primary btn-sm" onClick={() => toggleZone(zone.id)}>
                        <MdPlayArrow size={14} /> Start Valve
                      </button>
                    ) : (
                      <button className="btn btn-danger btn-sm" onClick={() => toggleZone(zone.id)}>
                        <MdStop size={14} /> Stop Valve
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MdWaterDrop size={14} color="#1976d2" />
                  <span style={{ fontSize: 12 }}>Moisture: {zone.moisture}%</span>
                  <div className="progress-bar-track" style={{ flex: 1 }}>
                    <div className="progress-bar-fill" style={{ width: `${zone.moisture}%`, background: zone.moisture > 60 ? 'var(--success)' : 'var(--warning)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="section-header">
            <h3 className="section-title">Weekly Water Usage</h3>
            <span className="badge badge-success">↓ 12% vs last week</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockIrrigation.weeklyUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} unit="L" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Bar dataKey="usage" fill="var(--accent)" radius={[6, 6, 0, 0]} name="Water Used (L)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
