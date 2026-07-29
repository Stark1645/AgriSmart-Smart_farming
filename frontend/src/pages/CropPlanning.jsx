import { motion } from 'framer-motion';
import { GiPlantSeed } from 'react-icons/gi';
import { FiCalendar, FiTarget, FiTrendingUp } from 'react-icons/fi';
import StatusBadge from '../components/StatusBadge';
import { mockCrops } from '../services/mockData';
import styles from '../styles/PageShared.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }) };

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function CropPlanning() {
  return (
    <div>
      <motion.div className="page-header" initial="hidden" animate="visible" variants={fadeUp}>
        <div>
          <h1 className="page-title">Crop Planning</h1>
          <p className="page-subtitle">Manage crop schedules, timelines, and yield forecasts</p>
        </div>
        <button className="btn btn-primary"><GiPlantSeed size={16} /> Add Crop</button>
      </motion.div>

      {/* Crop Cards */}
      <div className="cards-grid page-section">
        {mockCrops.map((crop, i) => (
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
                <div className={styles.cropMetaVal}>{crop.expectedYield.toLocaleString()} kg</div>
              </div>
              <div className={styles.cropMetaItem}>
                <div className={styles.cropMetaKey}><FiTrendingUp size={10} /> Stage</div>
                <div className={styles.cropMetaVal}>{crop.stage}</div>
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Progress</span>
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
            <StatusBadge status={crop.status} />
          </motion.div>
        ))}
      </div>

      {/* Crop Calendar */}
      <motion.div className="card page-section" initial="hidden" animate="visible" variants={fadeUp}>
        <div className="section-header">
          <h3 className="section-title">Crop Calendar — 2026</h3>
          <span className="badge badge-primary">{mockCrops.length} crops tracked</span>
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
              {mockCrops.map((crop, ci) => {
                const startMonth = new Date(crop.sowingDate).getMonth();
                const endMonth = new Date(crop.harvestDate).getMonth();
                return (
                  <tr key={crop.id}>
                    <td style={{ padding: '8px 12px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-light)' }}>
                      {crop.name}
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
            Growing period
          </div>
        </div>
      </motion.div>
    </div>
  );
}
