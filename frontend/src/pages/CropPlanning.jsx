import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GiPlantSeed } from 'react-icons/gi';
import { FiCalendar, FiTarget, FiTrendingUp, FiPlus, FiEdit2, FiTrash2, FiEye, FiCheck } from 'react-icons/fi';
import StatusBadge from '../components/StatusBadge';
import { mockCrops, mockFarms } from '../services/mockData';
import { cropAPI } from '../services/api';
import styles from '../styles/PageShared.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }) };

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const STAGES = ['Sowing', 'Vegetative', 'Flowering', 'Grain Filling', 'Ripening', 'Harvest Ready', 'Harvested'];

export default function CropPlanning() {
  const [crops, setCrops] = useState(mockCrops);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [toast, setToast] = useState('');

  const [cropForm, setCropForm] = useState({
    name: '',
    variety: '',
    farmId: 1,
    sowingDate: '2026-03-01',
    harvestDate: '2026-08-15',
    expectedYield: 5000,
    stage: 'Vegetative',
    progress: 45,
    health: 'Good',
    status: 'Growing',
  });

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleOpenAdd = () => {
    setCropForm({
      name: '',
      variety: '',
      farmId: 1,
      sowingDate: '2026-03-01',
      harvestDate: '2026-08-15',
      expectedYield: 5000,
      stage: 'Vegetative',
      progress: 40,
      health: 'Good',
      status: 'Growing',
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (crop) => {
    setEditingCrop(crop);
    setCropForm({
      name: crop.name,
      variety: crop.variety,
      farmId: crop.farmId,
      sowingDate: crop.sowingDate,
      harvestDate: crop.harvestDate,
      expectedYield: crop.expectedYield,
      stage: crop.stage,
      progress: crop.progress,
      health: crop.health,
      status: crop.status,
    });
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!cropForm.name) return;

    const newCrop = {
      id: Date.now(),
      name: cropForm.name,
      variety: cropForm.variety || 'Hybrid',
      farmId: parseInt(cropForm.farmId) || 1,
      sowingDate: cropForm.sowingDate,
      harvestDate: cropForm.harvestDate,
      expectedYield: parseInt(cropForm.expectedYield) || 4000,
      stage: cropForm.stage,
      progress: parseInt(cropForm.progress) || 30,
      health: cropForm.health,
      status: cropForm.status,
    };

    setCrops(prev => [newCrop, ...prev]);
    setShowAddModal(false);
    showToastMsg(`Crop "${newCrop.name}" added to planning schedule!`);

    try {
      cropAPI.createCropSeason({
        farmId: newCrop.farmId || 1,
        cropName: newCrop.name,
        variety: newCrop.variety,
        sowingDate: newCrop.sowingDate,
        expectedHarvest: newCrop.harvestDate,
        areaAcres: 10,
        status: (newCrop.status || 'GROWING').toUpperCase(),
        actualYieldKg: newCrop.expectedYield,
      }).catch(err => console.warn('Crop backend sync:', err));
    } catch (e) {}
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!cropForm.name || !editingCrop) return;

    setCrops(prev => prev.map(c => {
      if (c.id === editingCrop.id) {
        return {
          ...c,
          name: cropForm.name,
          variety: cropForm.variety,
          farmId: parseInt(cropForm.farmId) || c.farmId,
          sowingDate: cropForm.sowingDate,
          harvestDate: cropForm.harvestDate,
          expectedYield: parseInt(cropForm.expectedYield) || c.expectedYield,
          stage: cropForm.stage,
          progress: parseInt(cropForm.progress) || c.progress,
          health: cropForm.health,
          status: cropForm.status,
        };
      }
      return c;
    }));

    setEditingCrop(null);
    showToastMsg(`Crop "${cropForm.name}" schedule updated!`);
  };

  const handleDeleteCrop = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from planning?`)) {
      setCrops(prev => prev.filter(c => c.id !== id));
      if (selectedCrop?.id === id) setSelectedCrop(null);
      showToastMsg(`Crop "${name}" removed.`);
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
          <h1 className="page-title">Crop Planning</h1>
          <p className="page-subtitle">Manage crop schedules, timelines, and yield forecasts</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <GiPlantSeed size={16} /> Add Crop
        </button>
      </motion.div>

      {/* Crop Cards */}
      <div className="cards-grid page-section">
        {crops.map((crop, i) => (
          <motion.div key={crop.id} custom={i} initial="hidden" animate="visible" variants={fadeUp} className={styles.cropCard}>
            <div className={styles.cropHeader}>
              <div>
                <div className={styles.cropName}>{crop.name}</div>
                <div className={styles.cropDetail}>{crop.variety} · Farm #{crop.farmId}</div>
              </div>
              <StatusBadge status={crop.health} />
            </div>
            <div className={styles.cropMeta}>
              <div className={styles.cropMetaItem}>
                <div className={styles.cropMetaKey}><FiCalendar size={10} /> Sowing</div>
                <div className={styles.cropMetaVal}>{crop.sowingDate}</div>
              </div>
              <div className={styles.cropMetaItem}>
                <div className={styles.cropMetaKey}><FiCalendar size={10} /> Harvest</div>
                <div className={styles.cropMetaVal}>{crop.harvestDate}</div>
              </div>
              <div className={styles.cropMetaItem}>
                <div className={styles.cropMetaKey}><FiTarget size={10} /> Expected Yield</div>
                <div className={styles.cropMetaVal}>{(Number(crop.expectedYield) || 0).toLocaleString()} kg</div>
              </div>
              <div className={styles.cropMetaItem}>
                <div className={styles.cropMetaKey}><FiTrendingUp size={10} /> Stage</div>
                <div className={styles.cropMetaVal}>{crop.stage}</div>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Growth Progress</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{crop.progress}%</span>
              </div>
              <div className="progress-bar-track">
                <motion.div
                  className="progress-bar-fill"
                  style={{ background: crop.progress > 75 ? 'var(--success)' : crop.progress > 40 ? 'var(--primary)' : 'var(--warning)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${crop.progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border-light)' }}>
              <StatusBadge status={crop.status} />
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-icon btn-ghost" title="View Details" onClick={() => setSelectedCrop(crop)}><FiEye size={14} /></button>
                <button className="btn btn-icon btn-ghost" title="Edit Crop" onClick={() => handleOpenEdit(crop)}><FiEdit2 size={14} /></button>
                <button className="btn btn-icon btn-ghost" title="Delete Crop" style={{ color: 'var(--danger)' }} onClick={() => handleDeleteCrop(crop.id, crop.name)}><FiTrash2 size={14} /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Crop Calendar */}
      <motion.div className="card page-section" initial="hidden" animate="visible" variants={fadeUp}>
        <div className="section-header">
          <h3 className="section-title">Crop Calendar — 2026</h3>
          <span className="badge badge-primary">{crops.length} crops scheduled</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
            <thead>
              <tr>
                <th style={{ padding: '8px 12px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, textAlign: 'left', width: 160 }}>Crop</th>
                {MONTHS.map(m => (
                  <th key={m} style={{ padding: '8px 4px', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center' }}>{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {crops.map((crop) => {
                const sDate = new Date(crop.sowingDate);
                const hDate = new Date(crop.harvestDate);
                const startMonth = isNaN(sDate.getTime()) ? 2 : sDate.getMonth();
                const endMonth = isNaN(hDate.getTime()) ? 7 : hDate.getMonth();
                return (
                  <tr key={crop.id}>
                    <td style={{ padding: '8px 12px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-light)' }}>
                      {crop.name} <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({crop.variety})</span>
                    </td>
                    {MONTHS.map((m, mi) => {
                      const active = mi >= startMonth && mi <= endMonth;
                      const isStart = mi === startMonth;
                      const isEnd = mi === endMonth;
                      return (
                        <td key={m} style={{ padding: '8px 2px', borderBottom: '1px solid var(--border-light)' }}>
                          {active && (
                            <div style={{
                              height: 24,
                              background: `linear-gradient(90deg, var(--primary), var(--primary-light))`,
                              opacity: 0.85,
                              borderRadius: isStart ? '12px 0 0 12px' : isEnd ? '0 12px 12px 0' : 0,
                              marginLeft: isStart ? 2 : 0,
                              marginRight: isEnd ? 2 : 0,
                            }} />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 24, height: 10, background: 'linear-gradient(90deg, var(--primary), var(--primary-light))', borderRadius: 5 }} />
            Active growing period
          </div>
        </div>
      </motion.div>

      {/* Add Crop Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <motion.div className={styles.modal} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3>Add New Crop Plan</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Schedule planting, growth milestones, and yield targets</p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveAdd} className={styles.modalBody}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Crop Name *</label>
                  <input className="form-input" required placeholder="e.g. Basmati Rice" value={cropForm.name} onChange={e => setCropForm({ ...cropForm, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Variety *</label>
                  <input className="form-input" required placeholder="e.g. Pusa-1121" value={cropForm.variety} onChange={e => setCropForm({ ...cropForm, variety: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Farm Plot</label>
                  <select className="form-select" value={cropForm.farmId} onChange={e => setCropForm({ ...cropForm, farmId: e.target.value })}>
                    {mockFarms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Target Yield (kg)</label>
                  <input className="form-input" type="number" value={cropForm.expectedYield} onChange={e => setCropForm({ ...cropForm, expectedYield: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Sowing Date</label>
                  <input className="form-input" type="date" value={cropForm.sowingDate} onChange={e => setCropForm({ ...cropForm, sowingDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Estimated Harvest Date</label>
                  <input className="form-input" type="date" value={cropForm.harvestDate} onChange={e => setCropForm({ ...cropForm, harvestDate: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Current Stage</label>
                  <select className="form-select" value={cropForm.stage} onChange={e => setCropForm({ ...cropForm, stage: e.target.value })}>
                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Progress ({cropForm.progress}%)</label>
                  <input className="form-input" type="range" min="0" max="100" value={cropForm.progress} onChange={e => setCropForm({ ...cropForm, progress: e.target.value })} />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Schedule Crop</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Crop Modal */}
      {editingCrop && (
        <div className={styles.modalOverlay} onClick={() => setEditingCrop(null)}>
          <motion.div className={styles.modal} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3>Edit Crop Schedule</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Update growth parameters for {editingCrop.name}</p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setEditingCrop(null)}>✕</button>
            </div>
            <form onSubmit={handleSaveEdit} className={styles.modalBody}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Crop Name *</label>
                  <input className="form-input" required value={cropForm.name} onChange={e => setCropForm({ ...cropForm, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Variety *</label>
                  <input className="form-input" required value={cropForm.variety} onChange={e => setCropForm({ ...cropForm, variety: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Target Yield (kg)</label>
                  <input className="form-input" type="number" value={cropForm.expectedYield} onChange={e => setCropForm({ ...cropForm, expectedYield: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Current Stage</label>
                  <select className="form-select" value={cropForm.stage} onChange={e => setCropForm({ ...cropForm, stage: e.target.value })}>
                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Sowing Date</label>
                  <input className="form-input" type="date" value={cropForm.sowingDate} onChange={e => setCropForm({ ...cropForm, sowingDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Harvest Date</label>
                  <input className="form-input" type="date" value={cropForm.harvestDate} onChange={e => setCropForm({ ...cropForm, harvestDate: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Progress: {cropForm.progress}%</label>
                <input className="form-input" type="range" min="0" max="100" value={cropForm.progress} onChange={e => setCropForm({ ...cropForm, progress: e.target.value })} />
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className="btn btn-ghost" onClick={() => setEditingCrop(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* View Crop Detail Modal */}
      {selectedCrop && (
        <div className={styles.modalOverlay} onClick={() => setSelectedCrop(null)}>
          <motion.div className={styles.modal} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3>{selectedCrop.name} ({selectedCrop.variety})</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Farm Plot #{selectedCrop.farmId} · {selectedCrop.stage}</p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelectedCrop(null)}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
              {[
                ['Sowing Date', selectedCrop.sowingDate],
                ['Harvest Date', selectedCrop.harvestDate],
                ['Expected Yield', `${(Number(selectedCrop.expectedYield) || 0).toLocaleString()} kg`],
                ['Health Status', selectedCrop.health],
                ['Growth Stage', selectedCrop.stage],
                ['Progress', `${selectedCrop.progress}%`],
              ].map(([k, v]) => (
                <div key={k} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-outline" onClick={() => { const c = selectedCrop; setSelectedCrop(null); handleOpenEdit(c); }}>
                <FiEdit2 size={14} /> Edit Crop
              </button>
              <button className="btn btn-primary" onClick={() => setSelectedCrop(null)}>Close</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
