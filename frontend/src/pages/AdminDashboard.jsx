import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FiSearch, FiEdit2, FiTrash2, FiEye, FiCheck, FiUserPlus, FiShield } from 'react-icons/fi';
import { MdAdminPanelSettings, MdPeople, MdGrass, MdSensors } from 'react-icons/md';
import StatusBadge from '../components/StatusBadge';
import { mockUsers, mockAuditLogs, mockSystemStats, mockYieldData } from '../services/mockData';
import styles from '../styles/PageShared.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }) };

// Stable user activity metrics to prevent re-render jitter
const stableUserActivity = [
  { month: 'Jan', users: 112 },
  { month: 'Feb', users: 128 },
  { month: 'Mar', users: 145 },
  { month: 'Apr', users: 162 },
  { month: 'May', users: 189 },
  { month: 'Jun', users: 215 },
  { month: 'Jul', users: 248 },
];

export default function AdminDashboard() {
  const [users, setUsers] = useState(mockUsers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAuditLog, setSelectedAuditLog] = useState(null);
  const [toast, setToast] = useState('');

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'Farmer',
    farms: '1',
    status: 'Active',
  });

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleOpenAdd = () => {
    setUserForm({
      name: '',
      email: '',
      role: 'Farmer',
      farms: '1',
      status: 'Active',
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      farms: user.farms.toString(),
      status: user.status,
    });
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email) return;

    const newUser = {
      id: Date.now(),
      name: userForm.name,
      email: userForm.email,
      role: userForm.role,
      farms: parseInt(userForm.farms) || 0,
      joined: new Date().toISOString().split('T')[0],
      lastLogin: 'Just now',
      status: userForm.status,
    };

    setUsers(prev => [newUser, ...prev]);
    setShowAddModal(false);
    showToastMsg(`User ${newUser.name} created successfully!`);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!userForm.name || !editingUser) return;

    setUsers(prev => prev.map(u => {
      if (u.id === editingUser.id) {
        return {
          ...u,
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
          farms: parseInt(userForm.farms) || u.farms,
          status: userForm.status,
        };
      }
      return u;
    }));

    setEditingUser(null);
    showToastMsg(`User account for ${userForm.name} updated!`);
  };

  const handleDeleteUser = (id, name) => {
    if (window.confirm(`Are you sure you want to deactivate and remove ${name}?`)) {
      setUsers(prev => prev.filter(u => u.id !== id));
      if (selectedUser?.id === id) setSelectedUser(null);
      showToastMsg(`User ${name} removed.`);
    }
  };

  return (
    <div>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={styles.toastBanner}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <FiCheck color="var(--primary)" size={18} />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="page-header" initial="hidden" animate="visible" variants={fadeUp}>
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">System infrastructure overview, user accounts, and security audit logs</p>
        </div>
        <span className="badge badge-danger"><MdAdminPanelSettings size={12} /> System Administrator</span>
      </motion.div>

      {/* System Stats */}
      <div className="stats-grid page-section">
        {[
          { icon: MdPeople, label: 'Registered Users', value: users.length * 900, color: 'accent' },
          { icon: MdGrass, label: 'Active Farms', value: mockSystemStats.activeFarms, color: 'primary' },
          { icon: MdSensors, label: 'Active Sensors', value: `${mockSystemStats.activeSensors}/${mockSystemStats.totalSensors}`, color: 'success' },
          { label: 'System Uptime', value: mockSystemStats.uptime, color: 'success', sub: 'Last 30 days (100% SLA)' },
          { label: 'Alerts Handled', value: mockSystemStats.alertsToday, color: 'warning' },
          { label: 'Telemetry Stream', value: mockSystemStats.dataPoints, color: 'info', sub: 'Real-time sync' },
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
            <div>
              <h3 className="section-title">Monthly Platform Users</h3>
              <p className="section-subtitle">Active platform engagement</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stableUserActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Bar dataKey="users" fill="var(--accent)" radius={[6, 6, 0, 0]} name="Active Users" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="section-header">
            <div>
              <h3 className="section-title">Microservice Infrastructure Health</h3>
              <p className="section-subtitle">Core microservices uptime</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '8px 0' }}>
            {[
              { label: 'Spring Boot REST Gateway', status: '99.9%', color: 'var(--success)' },
              { label: 'PostgreSQL Relational DB', status: '99.7%', color: 'var(--success)' },
              { label: 'MQTT IoT Gateway', status: '98.2%', color: 'var(--success)' },
              { label: 'TensorFlow AI Engine', status: '97.5%', color: 'var(--success)' },
              { label: 'S3 Asset Storage', status: '100%', color: 'var(--success)' },
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
          <div>
            <h3 className="section-title">User Accounts & Roles</h3>
            <p className="section-subtitle">Manage access permissions across the system</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
            <FiUserPlus size={14} /> Add User
          </button>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr><th>User</th><th>Role</th><th>Farms</th><th>Joined</th><th>Last Login</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
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
                      <button className="btn btn-icon btn-ghost" title="View Details" onClick={() => setSelectedUser(u)}><FiEye size={14} /></button>
                      <button className="btn btn-icon btn-ghost" title="Edit User" onClick={() => handleOpenEdit(u)}><FiEdit2 size={14} /></button>
                      <button className="btn btn-icon btn-ghost" title="Delete User" style={{ color: 'var(--danger)' }} onClick={() => handleDeleteUser(u.id, u.name)}><FiTrash2 size={14} /></button>
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
          <div>
            <h3 className="section-title">Security & Audit Logs</h3>
            <p className="section-subtitle">Click an entry to inspect security trace headers</p>
          </div>
          <span className="badge badge-info">{mockAuditLogs.length} recent events</span>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr><th>Time</th><th>Action</th><th>User</th><th>IP Address</th><th>Status</th><th>Inspect</th></tr>
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
                  <td>
                    <button className="btn btn-ghost btn-sm" style={{ padding: '2px 8px', fontSize: 11 }} onClick={() => setSelectedAuditLog(l)}>
                      Details
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <motion.div className={styles.modal} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3>Add User Account</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Provision a new system user profile</p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveAdd} className={styles.modalBody}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" required placeholder="e.g. Jaswinder Kaur" value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input className="form-input" type="email" required placeholder="user@agrismart.in" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">System Role</label>
                  <select className="form-select" value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
                    <option value="Farmer">Farmer</option>
                    <option value="Field Officer">Field Officer</option>
                    <option value="Agricultural Officer">Agricultural Officer</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Farms Assigned</label>
                  <input className="form-input" type="number" value={userForm.farms} onChange={e => setUserForm({ ...userForm, farms: e.target.value })} />
                </div>
              </div>
              <div className="modalFooter">
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Account</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className={styles.modalOverlay} onClick={() => setEditingUser(null)}>
          <motion.div className={styles.modal} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3>Edit User Account</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Modify account attributes for {editingUser.name}</p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setEditingUser(null)}>✕</button>
            </div>
            <form onSubmit={handleSaveEdit} className={styles.modalBody}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" required value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input className="form-input" type="email" required value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">System Role</label>
                  <select className="form-select" value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
                    <option value="Farmer">Farmer</option>
                    <option value="Field Officer">Field Officer</option>
                    <option value="Agricultural Officer">Agricultural Officer</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Account Status</label>
                  <select className="form-select" value={userForm.status} onChange={e => setUserForm({ ...userForm, status: e.target.value })}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modalFooter">
                <button type="button" className="btn btn-ghost" onClick={() => setEditingUser(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className={styles.modalOverlay} onClick={() => setSelectedUser(null)}>
          <motion.div className={styles.modal} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3>{selectedUser.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{selectedUser.email}</p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelectedUser(null)}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 16 }}>
              {[
                ['Role', selectedUser.role],
                ['Status', selectedUser.status],
                ['Farms Assigned', `${selectedUser.farms} farms`],
                ['Member Since', selectedUser.joined],
                ['Last Session', selectedUser.lastLogin],
                ['Account ID', `#USR-${selectedUser.id}`],
              ].map(([k, v]) => (
                <div key={k} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-outline" onClick={() => { const u = selectedUser; setSelectedUser(null); handleOpenEdit(u); }}>
                <FiEdit2 size={14} /> Edit User
              </button>
              <button className="btn btn-primary" onClick={() => setSelectedUser(null)}>Close</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Audit Log Modal */}
      {selectedAuditLog && (
        <div className={styles.modalOverlay} onClick={() => setSelectedAuditLog(null)}>
          <motion.div className={styles.modal} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3>Audit Event: {selectedAuditLog.action}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Recorded {selectedAuditLog.time}</p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelectedAuditLog(null)}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 16 }}>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Originating User</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedAuditLog.user}</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Source IP</div>
                <div style={{ fontSize: 14, fontFamily: 'monospace', fontWeight: 600 }}>{selectedAuditLog.ip}</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Event Outcome</div>
                <StatusBadge status={selectedAuditLog.status} />
              </div>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Protocol</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>HTTPS / TLS 1.3 (JWT Auth)</div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-primary" onClick={() => setSelectedAuditLog(null)}>Close</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
