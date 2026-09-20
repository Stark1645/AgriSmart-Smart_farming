import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiFilter, FiMapPin, FiLayers, FiCheckCircle } from 'react-icons/fi';
import { MdGrass, MdLocationOn, MdWaterDrop } from 'react-icons/md';
import StatusBadge from '../components/StatusBadge';
import { useApp } from '../context/AppContext';
import { farmAPI } from '../services/api';
import styles from '../styles/PageShared.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }) };

const SOIL_TYPES = ['Loamy', 'Clay', 'Sandy', 'Sandy Loam', 'Red Earth', 'Black Soil', 'Alluvial'];
const DISTRICTS = ['Ludhiana', 'Coimbatore', 'Nashik', 'Anand', 'Lucknow', 'Mandya', 'Amritsar', 'Pune', 'Karnal', 'Guntur'];

export default function FarmManagement() {
  const { farms, loadFarms, addFarmToContext, updateFarmInContext, deleteFarmFromContext } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);

  const [form, setForm] = useState({
    farmName: '',
    district: 'Ludhiana',
    totalAreaAcres: '25.0',
    soilType: 'Loamy',
    crops: 'Wheat, Maize',
    lat: '30.9010',
    lng: '75.8573',
  });

  const [editForm, setEditForm] = useState({
    farmName: '',
    district: 'Ludhiana',
    totalAreaAcres: '25.0',
    soilType: 'Loamy',
    status: 'Active',
  });

  const handleOpenEdit = (farm) => {
    setEditingFarm(farm);
    setEditForm({
      farmName: farm.name || farm.farmName || '',
      district: farm.district || 'Ludhiana',
      totalAreaAcres: String(farm.area || farm.totalAreaAcres || '20.0'),
      soilType: farm.soilType || 'Loamy',
      status: farm.status || 'Active',
    });
  };

  const handleUpdateFarm = async (e) => {
    e.preventDefault();
    if (!editingFarm || !editForm.farmName) return;

    setSubmitting(true);
    const updatePayload = {
      farmName: editForm.farmName,
      district: editForm.district,
      totalAreaAcres: parseFloat(editForm.totalAreaAcres) || 10.0,
      soilType: editForm.soilType,
      status: editForm.status.toUpperCase(),
    };

    try {
      if (typeof editingFarm.id === 'number' && editingFarm.id < 10000000000) {
        await farmAPI.updateFarm(editingFarm.id, updatePayload);
      }
    } catch (err) {
      console.warn('Backend update failed, updating locally:', err);
    }

    const updatedFields = {
      name: editForm.farmName,
      farmName: editForm.farmName,
      district: editForm.district,
      area: parseFloat(editForm.totalAreaAcres) || (editingFarm.area || 10),
      totalAreaAcres: parseFloat(editForm.totalAreaAcres) || (editingFarm.totalAreaAcres || 10),
      soilType: editForm.soilType,
      status: editForm.status,
      lastUpdated: 'Just now',
    };

    updateFarmInContext(editingFarm.id, updatedFields);

    if (selected?.id === editingFarm.id) {
      setSelected(prev => ({
        ...prev,
        ...updatedFields,
      }));
    }

    setSubmitting(false);
    setEditingFarm(null);
  };

  const handleDeleteFarm = async (farm) => {
    if (window.confirm(`Are you sure you want to delete ${farm.name}?`)) {
      try {
        if (typeof farm.id === 'number' && farm.id < 10000000000) {
          await farmAPI.deleteFarm(farm.id);
        }
      } catch (err) {
        console.warn('Backend delete failed, removing locally:', err);
      }
      deleteFarmFromContext(farm.id);
      if (selected?.id === farm.id) setSelected(null);
    }
  };

  // Sync live farms from Spring Boot Backend MySQL API
  useEffect(() => {
    loadFarms();
  }, []);

  const handleCreateFarm = async (e) => {
    e.preventDefault();
    if (!form.farmName) return;

    setSubmitting(true);
    const newFarmPayload = {
      farmName: form.farmName,
      district: form.district,
      totalAreaAcres: parseFloat(form.totalAreaAcres) || 10.0,
      soilType: form.soilType,
      lat: parseFloat(form.lat) || 30.9010,
      lng: parseFloat(form.lng) || 75.8573,
      status: 'ACTIVE',
    };

    try {
      // 1. Save into MySQL Database via Spring Boot REST Controller
      const saved = await farmAPI.createFarm(newFarmPayload);
      console.log('Successfully saved new farm into MySQL:', saved);
      
      const newLocalFarm = {
        id: saved?.id || Date.now(),
        name: form.farmName,
        farmName: form.farmName,
        district: form.district,
        area: parseFloat(form.totalAreaAcres) || 10,
        totalAreaAcres: parseFloat(form.totalAreaAcres) || 10,
        soilType: form.soilType,
        status: 'Active',
        crops: form.crops.split(',').map(c => c.trim()),
        moisture: 70,
        gps: `${form.lat}° N, ${form.lng}° E`,
        owner: 'Current Farmer',
        lastUpdated: 'Just now',
      };

      addFarmToContext(newLocalFarm);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowModal(false);
        setForm({
          farmName: '',
          district: 'Ludhiana',
          totalAreaAcres: '25.0',
          soilType: 'Loamy',
          crops: 'Wheat, Maize',
          lat: '30.9010',
          lng: '75.8573',
        });
      }, 1000);
    } catch (err) {
      console.warn('Saved farm locally (Backend fallback):', err);
      const newLocalFarm = {
        id: Date.now(),
        name: form.farmName,
        farmName: form.farmName,
        district: form.district,
        area: parseFloat(form.totalAreaAcres) || 10,
        totalAreaAcres: parseFloat(form.totalAreaAcres) || 10,
        soilType: form.soilType,
        status: 'Active',
        crops: form.crops.split(',').map(c => c.trim()),
        moisture: 70,
        gps: `${form.lat}° N, ${form.lng}° E`,
        owner: 'Current Farmer',
        lastUpdated: 'Just now',
      };
      addFarmToContext(newLocalFarm);
      setShowModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = farms.filter(f =>
    (statusFilter === 'All' || f.status === statusFilter) &&
    (f.name.toLowerCase().includes(search.toLowerCase()) || f.district.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <motion.div className="page-header" initial="hidden" animate="visible" variants={fadeUp}>
        <div>
          <h1 className="page-title">Farm Management</h1>
          <p className="page-subtitle">Manage your registered farms, GIS parcels, and database records</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus size={16} /> Add New Farm
        </button>
      </motion.div>

      {/* Stats Row */}
      <div className="stats-grid page-section" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'Total Farms', value: farms.length, color: '#059669' },
          { label: 'Active', value: farms.filter(f => f.status === 'Active' || f.status === 'ACTIVE').length, color: '#10b981' },
          { label: 'Total Area', value: `${farms.reduce((a, f) => a + (f.area || 0), 0).toFixed(1)} ac`, color: '#3b82f6' },
          { label: 'Avg Moisture', value: `${Math.round(farms.reduce((a, f) => a + (f.moisture || 60), 0) / (farms.length || 1))}%`, color: '#0288d1' },
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
                      {(farm.crops || ['Wheat']).map(c => <span key={c} className="badge badge-primary">{c}</span>)}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <MdWaterDrop size={14} color={(farm.moisture || 60) > 65 ? 'var(--success)' : (farm.moisture || 60) > 45 ? 'var(--warning)' : 'var(--danger)'} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700 }}>{farm.moisture || 60}%</div>
                        <div className="progress-bar-track" style={{ width: 60 }}>
                          <div className="progress-bar-fill" style={{ width: `${farm.moisture || 60}%`, background: (farm.moisture || 60) > 65 ? 'var(--success)' : (farm.moisture || 60) > 45 ? 'var(--warning)' : 'var(--danger)' }} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td><StatusBadge status={farm.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-icon btn-ghost" title="View" onClick={() => setSelected(farm)}><FiEye size={14} /></button>
                      <button className="btn btn-icon btn-ghost" title="Edit" onClick={() => handleOpenEdit(farm)}><FiEdit2 size={14} /></button>
                      <button className="btn btn-icon btn-ghost" title="Delete" style={{ color: 'var(--danger)' }} onClick={() => handleDeleteFarm(farm)}><FiTrash2 size={14} /></button>
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
            <p className="section-subtitle">Geographic overview of all registered farms in India</p>
          </div>
          <span className="badge badge-info">{filtered.length} farms shown</span>
        </div>
        <div className={styles.mapPlaceholder}>
          <div className={styles.mapGrid} />
          {farms.slice(0, 8).map((farm, i) => (
            <div
              key={farm.id}
              className={`${styles.mapPin} ${selected?.id === farm.id ? styles.mapPinActive : ''}`}
              style={{ top: `${20 + (i % 4) * 16}%`, left: `${15 + Math.floor(i / 2) * 18}%`, cursor: 'pointer' }}
              title={`Click to view ${farm.name}`}
              onClick={() => setSelected(farm)}
            >
              <MdLocationOn size={20} />
              <span className={styles.mapPinLabel}>{farm.name}</span>
            </div>
          ))}
          <div className={styles.mapOverlay}>
            <span>🗺 Interactive GIS map integration with MySQL spatial coordinates</span>
          </div>
        </div>
      </motion.div>

      {/* Add New Farm Modal */}
      <AnimatePresence>
        {showModal && (
          <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>Add New Farm (MySQL DB)</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Saves directly to Spring Boot REST API & MySQL Database</p>
                </div>
                <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
              </div>

              {saveSuccess ? (
                <div style={{ padding: '30px 0', textAlign: 'center' }}>
                  <FiCheckCircle size={48} color="var(--primary)" style={{ marginBottom: 12 }} />
                  <h4>Farm Successfully Saved to MySQL!</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Updating farm registry and GIS telemetry...</p>
                </div>
              ) : (
                <form onSubmit={handleCreateFarm} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Farm Name *</label>
                    <input
                      className="form-input"
                      placeholder="e.g. Green Valley Farm"
                      required
                      value={form.farmName}
                      onChange={e => setForm({ ...form, farmName: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group">
                      <label className="form-label">District (India) *</label>
                      <select
                        className="form-select"
                        value={form.district}
                        onChange={e => setForm({ ...form, district: e.target.value })}
                      >
                        {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Total Area (Acres) *</label>
                      <input
                        className="form-input"
                        type="number"
                        step="0.1"
                        placeholder="25.0"
                        required
                        value={form.totalAreaAcres}
                        onChange={e => setForm({ ...form, totalAreaAcres: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group">
                      <label className="form-label">Soil Type</label>
                      <select
                        className="form-select"
                        value={form.soilType}
                        onChange={e => setForm({ ...form, soilType: e.target.value })}
                      >
                        {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Primary Crops</label>
                      <input
                        className="form-input"
                        placeholder="Wheat, Paddy"
                        value={form.crops}
                        onChange={e => setForm({ ...form, crops: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group">
                      <label className="form-label">Latitude</label>
                      <input
                        className="form-input"
                        placeholder="30.9010"
                        value={form.lat}
                        onChange={e => setForm({ ...form, lat: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Longitude</label>
                      <input
                        className="form-input"
                        placeholder="75.8573"
                        value={form.lng}
                        onChange={e => setForm({ ...form, lng: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                    <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={submitting} style={{ flex: 2 }}>
                      {submitting ? 'Saving to Database...' : 'Save Farm to MySQL'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                ['GPS Coordinates', selected.gps],
                ['Owner', selected.owner],
                ['Last Updated', selected.lastUpdated],
                ['Moisture', `${selected.moisture || 65}%`],
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
                {(selected.crops || ['Wheat']).map(c => <span key={c} className="badge badge-primary">{c}</span>)}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Farm Modal */}
      <AnimatePresence>
        {editingFarm && (
          <div className={styles.modalOverlay} onClick={() => setEditingFarm(null)}>
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>Edit Farm (#{editingFarm.id})</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Update farm metadata in Spring Boot REST API & MySQL Database</p>
                </div>
                <button className="btn btn-ghost btn-icon" onClick={() => setEditingFarm(null)}>✕</button>
              </div>

              <form onSubmit={handleUpdateFarm} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
                <div className="form-group">
                  <label className="form-label">Farm Name *</label>
                  <input
                    className="form-input"
                    required
                    value={editForm.farmName}
                    onChange={e => setEditForm({ ...editForm, farmName: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">District *</label>
                    <select
                      className="form-select"
                      value={editForm.district}
                      onChange={e => setEditForm({ ...editForm, district: e.target.value })}
                    >
                      {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Total Area (Acres) *</label>
                    <input
                      className="form-input"
                      type="number"
                      step="0.1"
                      required
                      value={editForm.totalAreaAcres}
                      onChange={e => setEditForm({ ...editForm, totalAreaAcres: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Soil Type</label>
                    <select
                      className="form-select"
                      value={editForm.soilType}
                      onChange={e => setEditForm({ ...editForm, soilType: e.target.value })}
                    >
                      {['Alluvial', 'Black', 'Red', 'Laterite', 'Loamy', 'Sandy', 'Clay'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={editForm.status}
                      onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setEditingFarm(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Update Farm'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
