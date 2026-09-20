import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdBiotech, MdCheckCircle, MdPending, MdFilterList } from 'react-icons/md';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import StatusBadge from '../components/StatusBadge';
import { mockFertilizer } from '../services/mockData';
import { recommendationAPI, cropAPI } from '../services/api';

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
  const [recommendations, setRecommendations] = useState(mockFertilizer);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    loadSeasons();
  }, []);

  useEffect(() => {
    loadRecommendations(selectedSeasonId);
  }, [selectedSeasonId]);

  const loadSeasons = async () => {
    try {
      const data = await cropAPI.getAllCropSeasons();
      if (Array.isArray(data) && data.length > 0) {
        setSeasons(data);
        if (!selectedSeasonId) setSelectedSeasonId(data[0].id);
      }
    } catch (e) {
      console.warn('Backend crop seasons offline, using fallback:', e);
    }
  };

  const loadRecommendations = async (seasonId) => {
    try {
      const list = await recommendationAPI.getRecommendationsBySeasonId(seasonId);
      if (Array.isArray(list) && list.length > 0) {
        const liveItems = list.map((r, idx) => ({
          id: `live-rec-${r.id || idx + 1}`,
          crop: r.cropName || (seasons.find(s => s.id === seasonId)?.cropType) || 'Wheat (HD-2967)',
          type: r.recommendationType || 'Fertilizer',
          quantity: r.recommendedQuantity || '25 kg/acre',
          unit: '',
          date: r.recommendedDate ? String(r.recommendedDate) : new Date().toISOString().split('T')[0],
          priority: r.recommendationType === 'FERTILISER' ? 'High' : 'Medium',
          status: (r.status || 'Scheduled').charAt(0).toUpperCase() + (r.status || 'scheduled').slice(1).toLowerCase(),
        }));
        setRecommendations([...liveItems, ...mockFertilizer.slice(liveItems.length)]);
        setIsLive(true);
      }
    } catch (e) {
      console.warn('Backend recommendations offline, using fallback cache:', e);
    }
  };

  const handleGetAnalysis = async () => {
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 1200));
    await loadRecommendations(selectedSeasonId);
    setAnalyzing(false);
  };

  return (
    <div>
      <motion.div className="page-header" initial="hidden" animate="visible" variants={fadeUp}>
        <div>
          <h1 className="page-title">Fertilizer Recommendations</h1>
          <p className="page-subtitle">AI-driven nutrient recommendations based on soil analysis and crop stage</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {seasons.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-card)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <MdFilterList size={16} color="var(--text-muted)" />
              <select
                value={selectedSeasonId}
                onChange={(e) => setSelectedSeasonId(Number(e.target.value))}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, outline: 'none', cursor: 'pointer' }}
              >
                {seasons.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.cropType ? `${s.cropType} (${s.seasonName || `Season #${s.id}`})` : `Season #${s.id}`}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button className="btn btn-primary" onClick={handleGetAnalysis} disabled={analyzing}>
            {analyzing ? <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <MdBiotech size={16} />}
            {analyzing ? 'Analyzing...' : 'Get New Analysis'}
          </button>
        </div>
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
            <span className="badge badge-primary">{isLive ? 'Live Sensor Baseline' : 'Current Season'}</span>
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
            <span className="badge badge-warning"><MdPending size={12} /> {recommendations.filter(r => r.status?.toLowerCase().includes('pending') || r.status?.toLowerCase().includes('scheduled')).length} pending</span>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr><th>Crop</th><th>Fertilizer</th><th>Qty</th><th>Date</th><th>Priority</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recommendations.map((f, i) => (
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
