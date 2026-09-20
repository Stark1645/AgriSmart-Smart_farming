import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  MdGrass, MdSensors, MdWaterDrop, MdBarChart,
  MdBugReport, MdFlight, MdAddCircle, MdCloud
} from 'react-icons/md';
import { FiTrendingUp, FiArrowRight, FiPlus, FiBell } from 'react-icons/fi';
import { GiPlantSeed, GiWheat } from 'react-icons/gi';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import {
  mockYieldData, mockWaterUsage, mockCropDistribution,
  mockNotifications, mockWeather, mockCrops
} from '../services/mockData';
import { formatNumber, formatCurrency } from '../utils/helpers';
import styles from '../styles/Dashboard.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

const MONTHS = mockYieldData.slice(-6);

const quickActions = [
  { label: 'Register Farm', icon: MdGrass, path: '/farm-management', color: 'var(--primary)' },
  { label: 'Add Crop', icon: GiPlantSeed, path: '/crop-planning', color: 'var(--accent)' },
  { label: 'View Sensors', icon: MdSensors, path: '/iot-sensors', color: 'var(--warning)' },
  { label: 'Get Recommendations', icon: MdBarChart, path: '/fertilizer', color: 'var(--success)' },
];

export default function Dashboard() {
  const { user, farms } = useApp();
  const navigate = useNavigate();

  const unreadNotifs = mockNotifications.filter(n => !n.read).slice(0, 4);
  const activeCrops = mockCrops.filter(c => c.status === 'Growing').length;
  const totalFarms = farms.length;
  const avgMoisture = farms.length > 0
    ? Math.round(farms.reduce((a, f) => a + (f.moisture || 65), 0) / farms.length)
    : 65;

  return (
    <div>
      {/* ---- Header ---- */}
      <motion.div className="page-header" initial="hidden" animate="visible" variants={fadeUp}>
        <div>
          <h1 className="page-title">
            Good Morning, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="page-subtitle">
            Here's what's happening on your farms today — {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/farm-management')}>
          <FiPlus size={16} /> Add Farm
        </button>
      </motion.div>

      {/* ---- Stats Grid ---- */}
      <div className="stats-grid page-section">
        {[
          { icon: MdGrass, label: 'Total Farms', value: totalFarms, sub: '4 active, 2 inactive', color: 'primary', trend: 12, trendUp: true },
          { icon: GiPlantSeed, label: 'Active Crops', value: activeCrops, sub: '3 approaching harvest', color: 'success', trend: 8, trendUp: true },
          { icon: MdCloud, label: 'Temperature', value: `${mockWeather.current.temp}°C`, sub: `Humidity ${mockWeather.current.humidity}%`, color: 'accent' },
          { icon: MdWaterDrop, label: 'Avg Soil Moisture', value: `${avgMoisture}%`, sub: 'Optimal: 60–75%', color: 'info', trend: 3, trendUp: true },
          { icon: FiBell, label: "Today's Alerts", value: unreadNotifs.length, sub: '2 urgent, 2 warnings', color: 'warning', trend: 25, trendUp: false },
        ].map((s, i) => (
          <motion.div key={s.label} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* ---- Quick Actions ---- */}
      <div className="page-section">
        <div className="section-header">
          <h2 className="section-title">Quick Actions</h2>
        </div>
        <div className={styles.quickActions}>
          {quickActions.map((a, i) => (
            <motion.button
              key={a.label}
              className={styles.quickAction}
              onClick={() => navigate(a.path)}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className={styles.qaIcon} style={{ background: a.color + '18', color: a.color }}>
                <a.icon size={24} />
              </div>
              <span className={styles.qaLabel}>{a.label}</span>
              <FiArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
            </motion.button>
          ))}
        </div>
      </div>

      {/* ---- Charts Row 1 ---- */}
      <div className="charts-grid page-section">
        {/* Yield & Revenue Chart */}
        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <div className="section-header">
            <div>
              <h3 className="section-title">Crop Yield & Revenue</h3>
              <p className="section-subtitle">Last 6 months performance</p>
            </div>
            <span className="badge badge-success">+14.2% vs last period</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={MONTHS}>
              <defs>
                <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Legend />
              <Area type="monotone" dataKey="yield" stroke="var(--primary)" fill="url(#yieldGrad)" strokeWidth={2} name="Yield (kg)" dot={false} />
              <Area type="monotone" dataKey="revenue" stroke="var(--accent)" fill="url(#revenueGrad)" strokeWidth={2} name="Revenue (INR)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Crop Distribution */}
        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
          <div className="section-header">
            <div>
              <h3 className="section-title">Crop Distribution</h3>
              <p className="section-subtitle">By area allocation</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={mockCropDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {mockCropDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {mockCropDistribution.map(c => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: c.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, flex: 1, color: 'var(--text-primary)' }}>{c.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ---- Charts Row 2 ---- */}
      <div className="charts-grid page-section">
        {/* Water Usage */}
        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <div className="section-header">
            <div>
              <h3 className="section-title">Water Usage</h3>
              <p className="section-subtitle">Actual vs Required (liters)</p>
            </div>
            <span className="badge badge-info">8.2% saved this month</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockWaterUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Legend />
              <Bar dataKey="required" fill="var(--border)" name="Required (L)" radius={[4,4,0,0]} />
              <Bar dataKey="usage" fill="var(--accent)" name="Used (L)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Profit Trend */}
        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
          <div className="section-header">
            <div>
              <h3 className="section-title">Profit Trend</h3>
              <p className="section-subtitle">Monthly profit in INR</p>
            </div>
            <span className="badge badge-success">+22% YoY</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHS}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <Tooltip formatter={(v) => `₹ ${formatNumber(v)}`} contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Line type="monotone" dataKey="profit" stroke="var(--success)" strokeWidth={2.5} dot={{ fill: 'var(--success)', r: 4 }} name="Profit" />
              <Line type="monotone" dataKey="expenses" stroke="var(--danger)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ---- Bottom Row: Notifications + Weather + Activity ---- */}
      <div className={styles.bottomGrid}>
        {/* Notifications */}
        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <div className="section-header">
            <h3 className="section-title">Recent Alerts</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/notifications')}>View all</button>
          </div>
          <div className={styles.notifList}>
            {unreadNotifs.map(n => (
              <div key={n.id} className={styles.notifItem}>
                <div className={`${styles.notifDot} ${styles[n.severity]}`} />
                <div className={styles.notifContent}>
                  <p className={styles.notifTitle}>{n.title}</p>
                  <p className={styles.notifMsg}>{n.message}</p>
                  <span className={styles.notifTime}>{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weather Widget */}
        <motion.div className={`card ${styles.weatherCard}`} initial="hidden" animate="visible" variants={fadeUp} custom={1}>
          <div className="section-header">
            <h3 className="section-title">Weather</h3>
            <span className="badge badge-info">{user?.district ? `${user.district}` : 'Ludhiana, Punjab'}</span>
          </div>
          <div className={styles.weatherCurrent}>
            <div className={styles.weatherBig}>
              <span className={styles.weatherEmoji}>⛅</span>
              <span className={styles.weatherTemp}>{mockWeather.current.temp}°C</span>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{mockWeather.current.condition}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Feels like {mockWeather.current.feelsLike}°C</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>💧 {mockWeather.current.humidity}%</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>🌬 {mockWeather.current.wind} km/h</span>
              </div>
            </div>
          </div>
          <div className={styles.forecast}>
            {mockWeather.forecast.slice(0, 5).map(d => (
              <div key={d.day} className={styles.forecastDay}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.day}</span>
                <span style={{ fontSize: 18 }}>{d.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{d.high}°</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.low}°</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Farm Summary */}
        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp} custom={2}>
          <div className="section-header">
            <h3 className="section-title">Farm Summary</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/farm-management')}>Manage</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {farms.slice(0, 5).map(farm => (
              <div key={farm.id} className={styles.farmRow}>
                <div className={styles.farmIcon}><MdGrass size={16} /></div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{farm.name || farm.farmName}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{farm.district} · {farm.area || farm.totalAreaAcres} acres</p>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, textAlign: 'right', marginBottom: 4 }}>
                    💧 {farm.moisture || 65}%
                  </div>
                  <div className="progress-bar-track" style={{ width: 60 }}>
                    <div className="progress-bar-fill" style={{ width: `${farm.moisture || 65}%`, background: (farm.moisture || 65) > 65 ? 'var(--success)' : (farm.moisture || 65) > 45 ? 'var(--warning)' : 'var(--danger)' }} />
                  </div>
                </div>
              </div>
            ))}
            {farms.length === 0 && (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>No registered farms found.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
