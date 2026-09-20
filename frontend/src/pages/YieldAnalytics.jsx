import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { mockYieldData, mockSeasonalData, mockRadarData } from '../services/mockData';
import { analyticsAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';
import StatCard from '../components/StatCard';
import { MdBarChart, MdTrendingUp, MdAttachMoney, MdShowChart, MdFilterList } from 'react-icons/md';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }) };

export default function YieldAnalytics() {
  const { farms } = useApp();
  const [profitability, setProfitability] = useState(null);
  const [inputCost, setInputCost] = useState(null);
  const [yieldData, setYieldData] = useState(null);
  const [selectedFarmId, setSelectedFarmId] = useState(() => (farms && farms.length > 0 ? farms[0].id : 101));
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (farms && farms.length > 0 && !farms.some(f => f.id === selectedFarmId)) {
      setSelectedFarmId(farms[0].id);
    }
  }, [farms]);

  useEffect(() => {
    if (selectedFarmId) {
      loadAnalytics(selectedFarmId);
    }
  }, [selectedFarmId]);

  const loadAnalytics = async (farmId) => {
    try {
      const [profRes, costRes, yieldRes] = await Promise.allSettled([
        analyticsAPI.getProfitability(),
        analyticsAPI.getInputCost(),
        analyticsAPI.getYieldAnalytics(farmId),
      ]);

      let liveActive = false;
      if (profRes.status === 'fulfilled' && profRes.value) {
        setProfitability(profRes.value);
        liveActive = true;
      }
      if (costRes.status === 'fulfilled' && costRes.value) {
        setInputCost(costRes.value);
        liveActive = true;
      }
      if (yieldRes.status === 'fulfilled' && yieldRes.value) {
        setYieldData(yieldRes.value);
        liveActive = true;
      }
      setIsLive(liveActive);
    } catch (err) {
      console.warn('Backend analytics service unreachable, utilizing cached analytics:', err);
    }
  };

  const defaultRev = mockYieldData.reduce((a, d) => a + d.revenue, 0);
  const defaultExp = mockYieldData.reduce((a, d) => a + d.expenses, 0);
  const defaultProf = mockYieldData.reduce((a, d) => a + d.profit, 0);
  const defaultYld = mockYieldData.reduce((a, d) => a + d.yield, 0);

  const totalRevenue = profitability?.gross_revenue_inr ?? defaultRev;
  const totalExpenses = profitability?.total_input_cost_inr ?? inputCost?.total_input_cost_inr ?? defaultExp;
  const totalProfit = profitability?.net_profit_inr ?? defaultProf;
  const totalYield = yieldData?.total_expected_yield_kg ? Number(yieldData.total_expected_yield_kg) : defaultYld;

  return (
    <div>
      <motion.div className="page-header" initial="hidden" animate="visible" variants={fadeUp}>
        <div>
          <h1 className="page-title">Yield Analytics</h1>
          <p className="page-subtitle">Comprehensive farm performance and financial analytics</p>
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
                    {f.name || f.farmName || `Farm #${f.id}`} ({f.district} — {f.area || f.totalAreaAcres} ac)
                  </option>
                ))}
              </select>
            </div>
          )}
          <span className={`badge ${isLive ? 'badge-success' : 'badge-primary'}`}>
            {isLive ? '● Live API Data' : 'Year 2026'}
          </span>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="stats-grid page-section">
        {[
          { icon: MdBarChart, label: 'Total Yield', value: `${(totalYield / 1000).toFixed(1)}T`, color: 'primary', trend: 14, trendUp: true },
          { icon: MdAttachMoney, label: 'Total Revenue', value: `INR ${(totalRevenue / 1000000).toFixed(1)}M`, color: 'success', trend: profitability?.profit_margin_percent ? Math.round(profitability.profit_margin_percent) : 18, trendUp: true },
          { icon: MdTrendingUp, label: 'Total Expenses', value: `INR ${(totalExpenses / 1000000).toFixed(1)}M`, color: 'warning', trend: 5, trendUp: false },
          { icon: MdShowChart, label: 'Net Profit', value: `INR ${(totalProfit / 1000000).toFixed(1)}M`, color: 'accent', trend: 22, trendUp: true },
        ].map((s, i) => (
          <motion.div key={s.label} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Revenue & Expenses */}
      <div className="charts-grid page-section">
        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="section-header">
            <h3 className="section-title">Revenue vs Expenses</h3>
            <span className="badge badge-success">+22% profit YoY</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={mockYieldData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--danger)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip formatter={(v) => `₹ ${(v/1000).toFixed(0)}K`} contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="var(--success)" fill="url(#revGrad)" strokeWidth={2} name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="var(--danger)" fill="url(#expGrad)" strokeWidth={2} name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="section-header">
            <h3 className="section-title">Monthly Yield (kg)</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={mockYieldData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Bar dataKey="yield" fill="var(--primary)" radius={[6,6,0,0]} name="Yield (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Seasonal + Radar */}
      <div className="charts-grid page-section">
        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="section-header">
            <h3 className="section-title">Seasonal Comparison (kg/ha)</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={mockSeasonalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="season" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Legend />
              <Bar dataKey="rice" fill="#2d7a3a" radius={[4,4,0,0]} name="Rice" />
              <Bar dataKey="maize" fill="#fb8c00" radius={[4,4,0,0]} name="Maize" />
              <Bar dataKey="vegetables" fill="#1976d2" radius={[4,4,0,0]} name="Vegetables" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="section-header">
            <h3 className="section-title">Performance Radar</h3>
            <span className="badge badge-info">Current vs Target</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={mockRadarData}>
              <PolarGrid stroke="var(--border-light)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
              <PolarRadiusAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
              <Radar name="Current" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.2} />
              <Radar name="Target" dataKey="B" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.1} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Profit Trend */}
      <motion.div className="card page-section" initial="hidden" animate="visible" variants={fadeUp}>
        <div className="section-header">
          <h3 className="section-title">Profit Trend — Full Year</h3>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={mockYieldData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
            <Tooltip formatter={(v) => `₹ ${(v/1000).toFixed(0)}K`} contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
            <Line type="monotone" dataKey="profit" stroke="var(--success)" strokeWidth={2.5} dot={{ fill: 'var(--success)', r: 4 }} name="Net Profit" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Input Cost Breakdown */}
      {inputCost && (
        <motion.div className="card page-section" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="section-header">
            <h3 className="section-title">Input Cost Allocation</h3>
            <span className="badge badge-warning">Total: INR {(inputCost.total_input_cost_inr || 120000).toLocaleString()}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { label: 'Fertilizer & Nutrients', val: inputCost.fertilizer_cost_inr || 45000, color: 'var(--primary)' },
              { label: 'High-Yield Seeds', val: inputCost.seed_cost_inr || 28000, color: 'var(--accent)' },
              { label: 'Drip & Irrigation', val: inputCost.irrigation_cost_inr || 15000, color: 'var(--info)' },
              { label: 'Labor & Operations', val: inputCost.labour_cost_inr || 32000, color: 'var(--warning)' },
            ].map((c) => {
              const total = inputCost.total_input_cost_inr || 120000;
              const pct = Math.round((c.val / total) * 100);
              return (
                <div key={c.label} style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: 14, border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{c.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: c.color }}>{pct}%</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-heading)', marginBottom: 8 }}>
                    ₹ {c.val.toLocaleString()}
                  </div>
                  <div className="progress-bar-track" style={{ height: 6 }}>
                    <div className="progress-bar-fill" style={{ width: `${pct}%`, background: c.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
