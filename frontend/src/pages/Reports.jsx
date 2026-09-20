import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiFilter, FiFileText, FiCheck, FiPrinter } from 'react-icons/fi';
import { MdPictureAsPdf, MdTableChart } from 'react-icons/md';
import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { mockYieldData } from '../services/mockData';
import { useApp } from '../context/AppContext';
import styles from '../styles/PageShared.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }) };

export default function Reports() {
  const { farms } = useApp();
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-07-13');
  const [reportType, setReportType] = useState('yield');
  const [selectedFarm, setSelectedFarm] = useState('All Farms');
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState(mockYieldData.slice(0, 7));
  const [toast, setToast] = useState('');

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 800));

    // Filter or adjust data dynamically based on date range
    const fromMonth = new Date(dateFrom).getMonth();
    const toMonth = new Date(dateTo).getMonth();
    const startIndex = Math.max(0, Math.min(fromMonth, mockYieldData.length - 1));
    const endIndex = Math.max(startIndex + 1, Math.min(toMonth + 1, mockYieldData.length));
    const filtered = mockYieldData.slice(startIndex, endIndex);

    setReportData(filtered.length > 0 ? filtered : mockYieldData.slice(0, 7));
    setGenerating(false);
    showToastMsg(`${reportType.toUpperCase()} report compiled for ${selectedFarm} (${filtered.length} records).`);
  };

  const handleExport = (format) => {
    if (format === 'Export PDF') {
      showToastMsg('Preparing clean PDF report document...');
      setTimeout(() => {
        window.print();
      }, 300);
      return;
    }

    // CSV / Excel export
    const headers = ['Month', 'Yield (kg)', 'Revenue (INR)', 'Expenses (INR)', 'Profit (INR)'];
    const rows = reportData.map(d => [d.month, d.yield, d.revenue, d.expenses, d.profit]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const ext = format === 'Export Excel' ? 'csv' : 'csv';
    link.setAttribute('download', `AgriSmart_${reportType}_report_${dateFrom}_to_${dateTo}.${ext}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToastMsg(`Downloaded ${reportType} report as ${format.replace('Export ', '')}.`);
  };

  return (
    <div>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`${styles.toastBanner} no-print`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <FiCheck color="var(--primary)" size={18} />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="page-header no-print" initial="hidden" animate="visible" variants={fadeUp}>
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Generate, filter and export farm performance reports</p>
        </div>
      </motion.div>

      {/* Filters & Export */}
      <motion.div className="card page-section no-print" initial="hidden" animate="visible" variants={fadeUp}>
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
            <select className="form-select" style={{ minWidth: 160 }} value={selectedFarm} onChange={e => setSelectedFarm(e.target.value)}>
              <option value="All Farms">All Farms</option>
              {farms.map(f => (
                <option key={f.id} value={f.farmName || f.name}>
                  {f.name || f.farmName} ({f.district} — {f.area || f.totalAreaAcres} ac)
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleGenerateReport} disabled={generating}>
            {generating ? <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <FiFilter size={15} />}
            {generating ? 'Compiling...' : 'Generate Report'}
          </button>
        </div>
      </motion.div>

      {/* Export Buttons */}
      <motion.div className="card page-section no-print" initial="hidden" animate="visible" variants={fadeUp}>
        <div className="section-header">
          <h3 className="section-title">Export Options</h3>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: 'Export PDF', icon: MdPictureAsPdf, color: '#e53935', desc: 'Printable report document' },
            { label: 'Export Excel', icon: MdTableChart, color: '#2d7a3a', desc: 'Spreadsheet format (.csv)' },
            { label: 'Export CSV', icon: FiFileText, color: '#1976d2', desc: 'Raw data export (.csv)' },
          ].map((btn) => (
            <motion.button
              key={btn.label}
              className="btn btn-outline"
              style={{ gap: 10, color: btn.color, borderColor: btn.color, background: btn.color + '10' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExport(btn.label)}
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

      {/* Official Printable Report Header & KPIs (Only visible during print/PDF export) */}
      <div className="print-only" style={{ display: 'none', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2.5px solid #2d7a3a', paddingBottom: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 24 }}>🌾</span>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1b5e20', margin: 0, fontFamily: 'sans-serif' }}>
                AgriSmart Farm Intelligence
              </h1>
            </div>
            <p style={{ fontSize: 12, color: '#4b5563', margin: '4px 0 0 0' }}>
              Smart Farming & Precision Agriculture Management System — Performance Audit
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ display: 'inline-block', background: '#e8f5e9', color: '#1b5e20', fontWeight: 800, fontSize: 11, padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase' }}>
              Official Export
            </span>
            <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>
              Generated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 12, background: '#f9fafb', padding: 10, borderRadius: 6, border: '1px solid #e5e7eb', fontSize: 11 }}>
          <div><strong>Target Farm:</strong> {selectedFarm}</div>
          <div><strong>Report Type:</strong> <span style={{ textTransform: 'capitalize' }}>{reportType} Analytics</span></div>
          <div><strong>Period:</strong> {dateFrom} → {dateTo}</div>
          <div><strong>Dataset:</strong> {reportData.length} Months Tracked</div>
        </div>

        {/* Printable Summary KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 12 }}>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '8px 12px', background: '#fff' }}>
            <div style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>Total Yield</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1b5e20' }}>
              {(reportData.reduce((a, d) => a + (d.yield || 0), 0)).toLocaleString()} kg
            </div>
          </div>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '8px 12px', background: '#fff' }}>
            <div style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>Gross Revenue</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0369a1' }}>
              INR {(reportData.reduce((a, d) => a + (d.revenue || 0), 0)).toLocaleString()}
            </div>
          </div>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '8px 12px', background: '#fff' }}>
            <div style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>Total Expenses</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#b91c1c' }}>
              INR {(reportData.reduce((a, d) => a + (d.expenses || 0), 0)).toLocaleString()}
            </div>
          </div>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '8px 12px', background: '#fff' }}>
            <div style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>Net Profit</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#15803d' }}>
              INR {(reportData.reduce((a, d) => a + (d.profit || 0), 0)).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Report Preview Charts */}
      <div className="charts-grid page-section">
        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="section-header">
            <h3 className="section-title">Yield Report Preview</h3>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{dateFrom} — {dateTo}</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={reportData}>
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
            <LineChart data={reportData}>
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
              {reportData.map((d, i) => (
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
