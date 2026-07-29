import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiFilter } from 'react-icons/fi';
import { MdGrass, MdLocationOn, MdWaterDrop } from 'react-icons/md';
import StatusBadge from '../components/StatusBadge';
import { mockFarms } from '../services/mockData';
import styles from '../styles/PageShared.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }) };

export default function FarmManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filtered = mockFarms.filter(f =>
    (statusFilter === 'All' || f.status === statusFilter) &&
    (f.name.toLowerCase().includes(search.toLowerCase()) || f.district.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <motion.div className="page-header" initial="hidden" animate="visible" variants={fadeUp}>
        <div>
          <h1 className="page-title">Farm Management</h1>
          <p className="page-subtitle">Manage your registered farms, view details and GIS mapping</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus size={16} /> Add New Farm
        </button>
      </motion.div>

      {/* Stats Row */}
      <div className="stats-grid page-section" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'Total Farms', value: mockFarms.length, color: '#2d7a3a' },
          { label: 'Active', value: mockFarms.filter(f => f.status === 'Active').length, color: '#43a047' },
          { label: 'Total Area', value: `${mockFarms.reduce((a, f) => a + f.area, 0).toFixed(1)} ac`, color: '#1976d2' },
          { label: 'Avg Moisture', value: `${Math.round(mockFarms.reduce((a, f) => a + f.moisture, 0) / mockFarms.length)}%`, color: '#0288d1' },
        ].map((s, i) => (
          <motion.div key={s.label} custom={i} initial="hidden" animate="visible" variants={fadeUp} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: 'var(--font-heading)' }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="card page-section">
        <div className={styles.tableToolbar}>
          <div className={styles.searchWrap}>
            <FiSearch size={16} />
            <input placeholder="Search farms by name or district…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className={styles.filters}>
            <FiFilter size={15} />
            {['All', 'Active', 'Inactive'].map(s => (
              <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setStatusFilter(s)}>{s}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Farm Name</th>
                <th>District</th>
                <th>Area (acres)</th>
                <th>Soil Type</th>
                <th>Crops</th>
                <th>Moisture</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((farm, i) => (
                <motion.tr key={farm.id} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{farm.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, background: 'var(--primary-50)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MdGrass size={16} color="var(--primary)" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{farm.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <MdLocationOn size={11} /> {farm.gps}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13 }}>{farm.district}</td>
                  <td style={{ fontSize: 13, fontWeight: 600 }}>{farm.area}</td>
                  <td style={{ fontSize: 13 }}>{farm.soilType}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {farm.crops.map(c => <span key={c} className="badge badge-primary">{c}</span>)}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <MdWaterDrop size={14} color={farm.moisture > 65 ? 'var(--success)' : farm.moisture > 45 ? 'var(--warning)' : 'var(--danger)'} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700 }}>{farm.moisture}%</div>
                        <div className="progress-bar-track" style={{ width: 60 }}>
                          <div className="progress-bar-fill" style={{ width: `${farm.moisture}%`, background: farm.moisture > 65 ? 'var(--success)' : farm.moisture > 45 ? 'var(--warning)' : 'var(--danger)' }} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td><StatusBadge status={farm.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-icon btn-ghost" title="View" onClick={() => setSelected(farm)}><FiEye size={14} /></button>
                      <button className="btn btn-icon btn-ghost" title="Edit"><FiEdit2 size={14} /></button>
                      <button className="btn btn-icon btn-ghost" title="Delete" style={{ color: 'var(--danger)' }}><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GIS Map Placeholder */}
      <motion.div className="card page-section" initial="hidden" animate="visible" variants={fadeUp}>
        <div className="section-header">
          <div>
            <h3 className="section-title">GIS Farm Map</h3>
            <p className="section-subtitle">Geographic overview of all registered farms</p>
          </div>
          <span className="badge badge-info">{filtered.length} farms shown</span>
        </div>
        <div className={styles.mapPlaceholder}>
          <div className={styles.mapGrid} />
          {mockFarms.map((farm, i) => (
            <div
              key={farm.id}
              className={`${styles.mapPin} ${selected?.id === farm.id ? styles.mapPinActive : ''}`}
              style={{ top: `${20 + i * 12}%`, left: `${15 + i * 13}%` }}
              title={farm.name}
            >
              <MdLocationOn size={20} />
              <span className={styles.mapPinLabel}>{farm.name}</span>
            </div>
          ))}
          <div className={styles.mapOverlay}>
            <span>🗺 Interactive GIS map integration ready</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Connect Google Maps or Leaflet API for live mapping</span>
          </div>
        </div>
      </motion.div>

      {/* Farm Detail Modal */}
      {selected && (
        <div className={styles.modalOverlay} onClick={() => setSelected(null)}>
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <h3>{selected.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{selected.district} · {selected.area} acres</p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
              {[
                ['Soil Type', selected.soilType],
                ['GPS', selected.gps],
                ['Owner', selected.owner],
                ['Last Updated', selected.lastUpdated],
                ['Moisture', `${selected.moisture}%`],
                ['Status', selected.status],
              ].map(([k, v]) => (
                <div key={k} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Crops</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {selected.crops.map(c => <span key={c} className="badge badge-primary">{c}</span>)}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
