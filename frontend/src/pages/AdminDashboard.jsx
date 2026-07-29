import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FiSearch, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { MdAdminPanelSettings, MdPeople, MdGrass, MdSensors } from 'react-icons/md';
import StatusBadge from '../components/StatusBadge';
import { mockUsers, mockAuditLogs, mockSystemStats, mockYieldData } from '../services/mockData';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }) };

export default function AdminDashboard() {
  return (
    <div>
      <motion.div className="page-header" initial="hidden" animate="visible" variants={fadeUp}>
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">System overview, user management, and audit logs</p>
        </div>
        <span className="badge badge-danger"><MdAdminPanelSettings size={12} /> Administrator</span>
      </motion.div>

      {/* System Stats */}
      <div className="stats-grid page-section">
        {[
          { icon: MdPeople, label: 'Total Users', value: mockSystemStats.totalUsers, color: 'accent' },
          { icon: MdGrass, label: 'Active Farms', value: mockSystemStats.activeFarms, color: 'primary' },
          { icon: MdSensors, label: 'Active Sensors', value: `${mockSystemStats.activeSensors}/${mockSystemStats.totalSensors}`, color: 'success' },
          { label: 'System Uptime', value: mockSystemStats.uptime, color: 'success', sub: 'Last 30 days' },
          { label: 'Alerts Today', value: mockSystemStats.alertsToday, color: 'warning' },
          { label: 'Data Points', value: mockSystemStats.dataPoints, color: 'info', sub: 'Total collected' },
        ].map((s, i) => (
          <motion.div key={s.label} custom={i} initial="hidden" animate="visible" variants={fadeUp} className="card" style={{ textAlign: 'center' }}>
            {s.icon && <s.icon size={24} style={{ color: `var(--${s.color})`, marginBottom: 8 }} />}
            <div style={{ fontSize: 26, fontWeight: 800, color: `var(--${s.color})`, fontFamily: 'var(--font-heading)' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{s.label}</div>
            {s.sub && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.sub}</div>}
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid page-section">
        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="section-header">
            <h3 className="section-title">User Activity (Monthly)</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockYieldData.slice(0, 7).map(d => ({ ...d, users: Math.floor(80 + Math.random() * 60) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Bar dataKey="users" fill="var(--accent)" radius={[6,6,0,0]} name="Active Users" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="section-header">
            <h3 className="section-title">System Health</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '8px 0' }}>
            {[
              { label: 'API Server', status: '99.9%', color: 'var(--success)' },
              { label: 'Database', status: '99.7%', color: 'var(--success)' },
              { label: 'IoT Gateway', status: '98.2%', color: 'var(--success)' },
              { label: 'ML Engine', status: '95.1%', color: 'var(--warning)' },
              { label: 'File Storage', status: '100%', color: 'var(--success)' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{s.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.status}</span>
                <div className="progress-bar-track" style={{ width: 80 }}>
                  <div className="progress-bar-fill" style={{ width: s.status, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* User Management */}
      <motion.div className="card page-section" initial="hidden" animate="visible" variants={fadeUp}>
        <div className="section-header">
          <h3 className="section-title">User Management</h3>
          <button className="btn btn-primary btn-sm">+ Add User</button>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr><th>User</th><th>Role</th><th>Farms</th><th>Joined</th><th>Last Login</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {mockUsers.map((u, i) => (
                <motion.tr key={u.id} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                        {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-primary">{u.role}</span></td>
                  <td style={{ fontSize: 13, fontWeight: 600 }}>{u.farms}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.joined}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.lastLogin}</td>
                  <td><StatusBadge status={u.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-icon btn-ghost"><FiEye size={14} /></button>
                      <button className="btn btn-icon btn-ghost"><FiEdit2 size={14} /></button>
                      <button className="btn btn-icon btn-ghost" style={{ color: 'var(--danger)' }}><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Audit Logs */}
      <motion.div className="card page-section" initial="hidden" animate="visible" variants={fadeUp}>
        <div className="section-header">
          <h3 className="section-title">Audit Logs</h3>
          <span className="badge badge-info">{mockAuditLogs.length} recent entries</span>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr><th>Time</th><th>Action</th><th>User</th><th>IP Address</th><th>Status</th></tr>
            </thead>
            <tbody>
              {mockAuditLogs.map((l, i) => (
                <motion.tr key={l.id} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{l.time}</td>
                  <td style={{ fontSize: 13, fontWeight: 600 }}>{l.action}</td>
                  <td style={{ fontSize: 13 }}>{l.user}</td>
                  <td style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{l.ip}</td>
                  <td>
                    <span className={`badge ${l.status === 'Success' ? 'badge-success' : 'badge-danger'}`}>
                      {l.status}
                    </span>
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
