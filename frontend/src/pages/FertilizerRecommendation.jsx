import { motion } from 'framer-motion';
import { MdBiotech, MdCheckCircle, MdPending, MdSchedule } from 'react-icons/md';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import StatusBadge from '../components/StatusBadge';
import { mockFertilizer } from '../services/mockData';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }) };

const npkData = [
  { subject: 'Nitrogen', A: 42, fullMark: 100 },
  { subject: 'Phosphorus', A: 28, fullMark: 100 },
  { subject: 'Potassium', A: 35, fullMark: 100 },
  { subject: 'Calcium', A: 60, fullMark: 100 },
  { subject: 'Magnesium', A: 45, fullMark: 100 },
  { subject: 'Sulfur', A: 30, fullMark: 100 },
];

export default function FertilizerRecommendation() {
  return (
    <div>
      <motion.div className="page-header" initial="hidden" animate="visible" variants={fadeUp}>
        <div>
          <h1 className="page-title">Fertilizer Recommendations</h1>
          <p className="page-subtitle">AI-driven nutrient recommendations based on soil analysis and crop stage</p>
        </div>
        <button className="btn btn-primary"><MdBiotech size={16} /> Get New Analysis</button>
      </motion.div>

      {/* NPK Cards */}
      <div className="stats-grid page-section" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {[
          { label: 'Nitrogen (N)', value: '42', unit: 'mg/kg', optimal: '30–60', color: '#2d7a3a', status: 'Optimal', icon: '🌿' },
          { label: 'Phosphorus (P)', value: '28', unit: 'mg/kg', optimal: '20–40', color: '#1976d2', status: 'Optimal', icon: '💧' },
          { label: 'Potassium (K)', value: '35', unit: 'mg/kg', optimal: '25–50', color: '#f57c00', status: 'Optimal', icon: '🌾' },
        ].map((n, i) => (
          <motion.div key={n.label} custom={i} initial="hidden" animate="visible" variants={fadeUp} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 24 }}>{n.icon}</div>
              <span className="badge badge-success">{n.status}</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: n.color, fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{n.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{n.unit}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{n.label}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Optimal: {n.optimal} {n.unit}</div>
            <div className="progress-bar-track" style={{ marginTop: 10 }}>
              <motion.div className="progress-bar-fill" style={{ background: n.color }}
                initial={{ width: 0 }} animate={{ width: `${parseInt(n.value)}%` }} transition={{ duration: 1 }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recommendations Table + Radar */}
      <div className="charts-grid page-section">
        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="section-header">
            <h3 className="section-title">Nutrient Profile</h3>
            <span className="badge badge-primary">Current Season</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={npkData}>
              <PolarGrid stroke="var(--border-light)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
              <PolarRadiusAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
              <Radar name="Current" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="section-header">
            <h3 className="section-title">Scheduled Applications</h3>
            <span className="badge badge-warning"><MdPending size={12} /> 2 pending</span>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr><th>Crop</th><th>Fertilizer</th><th>Qty</th><th>Date</th><th>Priority</th><th>Status</th></tr>
              </thead>
              <tbody>
                {mockFertilizer.map((f, i) => (
                  <motion.tr key={f.id} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
                    <td style={{ fontSize: 13, fontWeight: 600 }}>{f.crop}</td>
                    <td style={{ fontSize: 13 }}>{f.type}</td>
                    <td style={{ fontSize: 13, fontWeight: 600 }}>{f.quantity} {f.unit}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{f.date}</td>
                    <td>
                      <span className={`badge ${f.priority === 'High' ? 'badge-danger' : f.priority === 'Medium' ? 'badge-warning' : 'badge-success'}`}>
                        {f.priority}
                      </span>
                    </td>
                    <td><StatusBadge status={f.status} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
