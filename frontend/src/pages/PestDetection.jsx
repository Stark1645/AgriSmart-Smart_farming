import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiImage, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { MdBugReport, MdCheckCircle } from 'react-icons/md';
import { mockPestDetection } from '../services/mockData';
import { recommendationAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }) };

export default function PestDetection() {
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [recentDetections, setRecentDetections] = useState(mockPestDetection.recent);
  const [alertNotice, setAlertNotice] = useState('');
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setResult(null);
    setAlertNotice('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const analyze = async () => {
    setAnalyzing(true);
    setAlertNotice('');
    await new Promise(r => setTimeout(r, 1800));
    const detected = mockPestDetection.recent[0];
    setResult(detected);

    try {
      const alertPayload = {
        crop: detected.crop || 'Wheat',
        disease: detected.disease,
        confidence: detected.confidence,
        severity: detected.severity,
        treatment: detected.treatment,
        timestamp: new Date().toISOString(),
      };
      const apiRes = await recommendationAPI.createPestAlert(alertPayload);
      if (apiRes) {
        setAlertNotice(`Alert #${apiRes.alertId || 'REGISTERED'} logged to central crop advisory database.`);
      }
    } catch (e) {
      console.warn('Could not register pest alert to backend, recorded locally:', e);
    }

    const newEntry = {
      id: `live-alert-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      crop: detected.crop,
      disease: detected.disease,
      confidence: detected.confidence,
      severity: detected.severity,
      treatment: detected.treatment,
    };
    setRecentDetections(prev => [newEntry, ...prev]);
    setAnalyzing(false);
  };

  return (
    <div>
      <motion.div className="page-header" initial="hidden" animate="visible" variants={fadeUp}>
        <div>
          <h1 className="page-title">Pest & Disease Detection</h1>
          <p className="page-subtitle">Upload crop images for AI-powered disease identification and treatment guidance</p>
        </div>
        <span className="badge badge-success">● AI Engine Active</span>
      </motion.div>

      {alertNotice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: 'var(--success-light)', border: '1px solid #c8e6c9', borderRadius: 'var(--radius-md)', padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <FiCheckCircle color="var(--success)" size={18} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--success)' }}>{alertNotice}</span>
        </motion.div>
      )}

      <div className="charts-grid page-section">
        {/* Upload */}
        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp}>
          <h3 className="section-title" style={{ marginBottom: 16 }}>Upload Crop Image</h3>
          <div
            style={{ border: `2px dashed ${preview ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius-lg)', padding: 32, textAlign: 'center', background: 'var(--bg-secondary)', cursor: 'pointer', transition: 'all 0.2s', minHeight: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="Preview" style={{ maxHeight: 200, borderRadius: 8, objectFit: 'cover', width: '100%' }} />
            ) : (
              <>
                <FiUploadCloud size={48} color="var(--text-muted)" />
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Drop image here or click to browse</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Supports JPG, PNG, WEBP — Max 10MB</div>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
          <motion.button
            className="btn btn-primary w-full"
            style={{ marginTop: 16, justifyContent: 'center' }}
            onClick={analyze}
            disabled={!preview || analyzing}
            whileTap={{ scale: 0.98 }}
          >
            {analyzing ? (
              <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Analyzing…</>
            ) : (
              <><MdBugReport size={18} /> Detect Disease</>
            )}
          </motion.button>
          {!preview && (
            <button className="btn btn-outline w-full" style={{ marginTop: 8, justifyContent: 'center' }} onClick={() => { setPreview('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'); }}>
              <FiImage size={16} /> Use Sample Image
            </button>
          )}
        </motion.div>

        {/* Result */}
        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp}>
          <h3 className="section-title" style={{ marginBottom: 16 }}>Detection Result</h3>
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ background: 'var(--danger-light)', border: '1px solid #ffcdd2', borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                    <FiAlertTriangle size={18} color="var(--danger)" />
                    <span style={{ fontWeight: 700, color: 'var(--danger)', fontSize: 15 }}>{result.disease}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{ background: 'white', borderRadius: 8, padding: 10 }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Confidence</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--danger)' }}>{result.confidence}%</div>
                    </div>
                    <div style={{ background: 'white', borderRadius: 8, padding: 10 }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Severity</div>
                      <div style={{ marginTop: 4 }}><span className={`badge ${result.severity === 'High' ? 'badge-danger' : 'badge-warning'}`}>{result.severity}</span></div>
                    </div>
                  </div>
                </div>
                <div className="progress-bar-track" style={{ marginBottom: 6, height: 10 }}>
                  <motion.div className="progress-bar-fill" style={{ background: 'var(--danger)' }}
                    initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }} transition={{ duration: 1 }} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Detection confidence</div>
                <div style={{ background: 'var(--success-light)', border: '1px solid #c8e6c9', borderRadius: 'var(--radius-md)', padding: 14 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                    <MdCheckCircle size={16} color="var(--success)" />
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--success)' }}>Recommended Treatment</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>{result.treatment}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
                <MdBugReport size={48} style={{ opacity: 0.3 }} />
                <p style={{ marginTop: 12 }}>Upload and analyze an image to see detection results</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Recent detections */}
      <motion.div className="card page-section" initial="hidden" animate="visible" variants={fadeUp}>
        <div className="section-header">
          <h3 className="section-title">Recent Detections</h3>
          <span className="badge badge-danger">{recentDetections.length} recorded cases</span>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr><th>Date</th><th>Crop</th><th>Disease Detected</th><th>Confidence</th><th>Severity</th><th>Treatment</th></tr>
            </thead>
            <tbody>
              {recentDetections.map((d, i) => (
                <motion.tr key={d.id} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.date}</td>
                  <td style={{ fontWeight: 600 }}>{d.crop}</td>
                  <td style={{ fontSize: 13 }}>{d.disease}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar-track" style={{ width: 60 }}>
                        <div className="progress-bar-fill" style={{ width: `${d.confidence}%`, background: 'var(--danger)' }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{d.confidence}%</span>
                    </div>
                  </td>
                  <td><span className={`badge ${d.severity === 'High' ? 'badge-danger' : 'badge-warning'}`}>{d.severity}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{d.treatment}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
