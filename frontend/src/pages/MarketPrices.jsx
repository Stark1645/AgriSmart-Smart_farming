import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiSearch } from 'react-icons/fi';
import { mockMarketPrices, mockMarketTrends } from '../services/mockData';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }) };

export default function MarketPrices() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', ...new Set(mockMarketPrices.map(p => p.category))];
  const filtered = mockMarketPrices.filter(p =>
    (category === 'All' || p.category === category) &&
    p.crop.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <motion.div className="page-header" initial="hidden" animate="visible" variants={fadeUp}>
        <div>
          <h1 className="page-title">Market Price Dashboard</h1>
          <p className="page-subtitle">Live crop prices from major Indian markets · Updated daily</p>
        </div>
        <span className="badge badge-success">● Live Data</span>
      </motion.div>

      {/* Summary Cards */}
      <div className="stats-grid page-section">
        {[
          { label: 'Highest Price', value: 'Mustard', sub: '₹5,450/quintal ↑15', color: '#e53935' },
          { label: 'Best Performer', value: 'Tomato', sub: '+5% this week', color: '#2d7a3a' },
          { label: 'Price Alert', value: 'Red Onion', sub: '₹22/kg ↓1.5', color: '#fb8c00' },
          { label: 'Markets Tracked', value: '8', sub: 'Across India', color: '#1976d2' },
        ].map((s, i) => (
          <motion.div key={s.label} custom={i} initial="hidden" animate="visible" variants={fadeUp} className="card">
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: 'var(--font-heading)' }}>{s.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 4 }}>{s.label}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Price Table */}
      <motion.div className="card page-section" initial="hidden" animate="visible" variants={fadeUp}>
        <div className="section-header">
          <h3 className="section-title">Current Market Prices</h3>
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-secondary)', border: '1.5px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '8px 14px', flex: 1 }}>
            <FiSearch size={15} color="var(--text-muted)" />
            <input style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13 }} placeholder="Search crop…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {categories.map(c => (
              <button key={c} className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr><th>Crop</th><th>Market</th><th>Price (INR)</th><th>Unit</th><th>Change</th><th>Category</th></tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <motion.tr key={p.id} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
                  <td style={{ fontWeight: 700, fontSize: 14 }}>{p.crop}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{p.market}</td>
                  <td style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{p.price}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>/{p.unit}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: p.trend === 'up' ? 'var(--success)' : 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
                      {p.trend === 'up' ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
                      {p.trend === 'up' ? '+' : ''}{p.change}
                    </div>
                  </td>
                  <td><span className="badge badge-primary">{p.category}</span></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="charts-grid page-section">
        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="section-header">
            <h3 className="section-title">Weekly Price Trends</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={mockMarketTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Legend />
              <Line type="monotone" dataKey="rice" stroke="#2d7a3a" strokeWidth={2} dot={false} name="Rice" />
              <Line type="monotone" dataKey="tomato" stroke="#e53935" strokeWidth={2} dot={false} name="Tomato" />
              <Line type="monotone" dataKey="onion" stroke="#fb8c00" strokeWidth={2} dot={false} name="Onion" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="section-header">
            <h3 className="section-title">Monthly Comparison</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={mockMarketTrends.slice(-4)}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Legend />
              <Bar dataKey="rice" fill="#2d7a3a" radius={[4,4,0,0]} name="Rice" />
              <Bar dataKey="tomato" fill="#e53935" radius={[4,4,0,0]} name="Tomato" />
              <Bar dataKey="chilli" fill="#fb8c00" radius={[4,4,0,0]} name="Chilli" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
