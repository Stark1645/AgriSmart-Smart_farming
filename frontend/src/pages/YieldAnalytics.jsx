import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { mockYieldData, mockSeasonalData, mockRadarData } from '../services/mockData';
import { formatCurrency } from '../utils/helpers';
import StatCard from '../components/StatCard';
import { MdBarChart, MdTrendingUp, MdAttachMoney, MdShowChart } from 'react-icons/md';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }) };

export default function YieldAnalytics() {
  const totalRevenue = mockYieldData.reduce((a, d) => a + d.revenue, 0);
  const totalExpenses = mockYieldData.reduce((a, d) => a + d.expenses, 0);
  const totalProfit = mockYieldData.reduce((a, d) => a + d.profit, 0);
  const totalYield = mockYieldData.reduce((a, d) => a + d.yield, 0);

  return (
    <div>
      <motion.div className="page-header" initial="hidden" animate="visible" variants={fadeUp}>
        <div>
          <h1 className="page-title">Yield Analytics</h1>
          <p className="page-subtitle">Comprehensive farm performance and financial analytics</p>
        </div>
        <span className="badge badge-primary">Year 2026</span>
      </motion.div>

      {/* Summary Stats */}
      <div className="stats-grid page-section">
        {[
          { icon: MdBarChart, label: 'Total Yield', value: `${(totalYield/1000).toFixed(1)}T`, color: 'primary', trend: 14, trendUp: true },
          { icon: MdAttachMoney, label: 'Total Revenue', value: `INR ${(totalRevenue/1000000).toFixed(1)}M`, color: 'success', trend: 18, trendUp: true },
          { icon: MdTrendingUp, label: 'Total Expenses', value: `INR ${(totalExpenses/1000000).toFixed(1)}M`, color: 'warning', trend: 5, trendUp: false },
          { icon: MdShowChart, label: 'Net Profit', value: `INR ${(totalProfit/1000000).toFixed(1)}M`, color: 'accent', trend: 22, trendUp: true },
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
    </div>
  );
}
