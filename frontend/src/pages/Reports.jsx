import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FiDownload, FiFileText, FiFilter } from 'react-icons/fi';
import { MdPictureAsPdf, MdTableChart } from 'react-icons/md';
import { mockYieldData } from '../services/mockData';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }) };

export default function Reports() {
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-07-13');
  const [reportType, setReportType] = useState('yield');

  return (
    <div>
      <motion.div className="page-header" initial="hidden" animate="visible" variants={fadeUp}>
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Generate, filter and export farm performance reports</p>
        </div>
      </motion.div>

      {/* Filters & Export */}
      <motion.div className="card page-section" initial="hidden" animate="visible" variants={fadeUp}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group">
            <label className="form-label">Report Type</label>
            <select className="form-select" style={{ minWidth: 160 }} value={reportType} onChange={e => setReportType(e.target.value)}>
              <option value="yield">Yield Report</option>
              <option value="financial">Financial Report</option>
              <option value="sensor">Sensor Report</option>
              <option value="irrigation">Irrigation Report</option>
              <option value="pest">Pest Detection Report</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">From Date</label>
            <input className="form-input" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">To Date</label>
            <input className="form-input" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Farm</label>
            <select className="form-select" style={{ minWidth: 160 }}>
              <option>All Farms</option>
              <option>Green Valley Farm</option>
              <option>Sunrise Paddy Fields</option>
            </select>
          </div>
          <button className="btn btn-primary"><FiFilter size={15} /> Generate Report</button>
        </div>
      </motion.div>

      {/* Export Buttons */}
      <motion.div className="card page-section" initial="hidden" animate="visible" variants={fadeUp}>
        <div className="section-header">
          <h3 className="section-title">Export Options</h3>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: 'Export PDF', icon: MdPictureAsPdf, color: '#e53935', desc: 'Full report with charts' },
            { label: 'Export Excel', icon: MdTableChart, color: '#2d7a3a', desc: 'Spreadsheet format' },
            { label: 'Export CSV', icon: FiFileText, color: '#1976d2', desc: 'Raw data export' },
          ].map((btn, i) => (
            <motion.button
              key={btn.label}
              className="btn btn-outline"
              style={{ gap: 10, color: btn.color, borderColor: btn.color, background: btn.color + '10' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <btn.icon size={18} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700 }}>{btn.label}</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>{btn.desc}</div>
              </div>
              <FiDownload size={14} style={{ marginLeft: 'auto' }} />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Report Preview Charts */}
      <div className="charts-grid page-section">
        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="section-header">
            <h3 className="section-title">Yield Report Preview</h3>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Jan 2026 — Jul 2026</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={mockYieldData.slice(0, 7)}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Bar dataKey="yield" fill="var(--primary)" radius={[6, 6, 0, 0]} name="Yield (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="section-header">
            <h3 className="section-title">Financial Summary</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={mockYieldData.slice(0, 7)}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip formatter={v => `₹ ${(v / 1000).toFixed(0)}K`} contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke="var(--success)" strokeWidth={2} name="Revenue" />
              <Line type="monotone" dataKey="profit" stroke="var(--accent)" strokeWidth={2} name="Profit" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="expenses" stroke="var(--danger)" strokeWidth={2} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Data Table Preview */}
      <motion.div className="card page-section" initial="hidden" animate="visible" variants={fadeUp}>
        <div className="section-header">
          <h3 className="section-title">Data Table Preview</h3>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr><th>Month</th><th>Yield (kg)</th><th>Revenue (INR)</th><th>Expenses (INR)</th><th>Profit (INR)</th><th>Profit Margin</th></tr>
            </thead>
            <tbody>
              {mockYieldData.slice(0, 7).map((d, i) => (
                <motion.tr key={d.month} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
                  <td style={{ fontWeight: 700 }}>{d.month}</td>
                  <td>{d.yield.toLocaleString()}</td>
                  <td>{d.revenue.toLocaleString()}</td>
                  <td>{d.expenses.toLocaleString()}</td>
                  <td style={{ fontWeight: 700, color: 'var(--success)' }}>{d.profit.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar-track" style={{ width: 60 }}>
                        <div className="progress-bar-fill" style={{ width: `${Math.round((d.profit / d.revenue) * 100)}%`, background: 'var(--success)' }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{Math.round((d.profit / d.revenue) * 100)}%</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
