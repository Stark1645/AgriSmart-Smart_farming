import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiMapPin, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdGrass, MdAgriculture } from 'react-icons/md';
import { GiFarmTractor, GiWheat } from 'react-icons/gi';
import { useApp } from '../context/AppContext';
import styles from '../styles/AuthPage.module.css';

const ROLES = [
  { id: 'farmer', label: 'Farmer', desc: 'Own & manage farms', icon: GiFarmTractor },
  { id: 'field_officer', label: 'Field Officer', desc: 'Supervise multiple farms', icon: MdGrass },
  { id: 'agri_officer', label: 'Agricultural Officer', desc: 'Government department', icon: MdAgriculture },
  { id: 'extension_officer', label: 'Extension Officer', desc: 'Support & advisory', icon: GiWheat },
];

const SOIL_TYPES = ['Loamy', 'Clay', 'Sandy', 'Sandy Loam', 'Red Earth', 'Peat', 'Silt'];
const DISTRICTS = ['Ludhiana', 'Nashik', 'Anand', 'Coimbatore', 'Lucknow', 'Mandya', 'Amritsar', 'Pune', 'Rajkot', 'Karnal', 'Guntur', 'Bathinda'];

const STEPS = ['Personal Info', 'Select Role', 'Farm Details'];

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [showPw, setShowPw] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    role: '',
    farmName: '', district: '', area: '', soilType: '', gps: '',
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const canNext = () => {
    if (step === 0) return form.name && form.email && form.phone && form.password;
    if (step === 1) return form.role;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitted(true);
    setLoading(false);
    login(form.email, form.password);
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  if (submitted) {
    return (
      <div className={styles.page}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, padding: 40 }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <FiCheckCircle size={72} color="var(--success)" />
          </motion.div>
          <h2 style={{ fontSize: 28, fontWeight: 800 }}>Account Created!</h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
            Welcome to AgriSmart, {form.name.split(' ')[0]}! Redirecting to your dashboard…
          </p>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Illustration side */}
      <div className={styles.illustrationSide}>
        <div className={styles.illustrationBg} />
        <div className={styles.illustrationContent}>
          <div className={styles.illBrand}><MdGrass size={28} /><span>AgriSmart</span></div>
          <h2 className={styles.illTitle}>Join India's<br />Smart Farming Revolution</h2>
          <p className={styles.illDesc}>Create your free account and start monitoring your farms with IoT sensors, AI analytics, and precision irrigation.</p>
          <div className={styles.illStats}>
            {[{ v: 'Free', l: 'Forever' }, { v: '5 min', l: 'Setup' }, { v: '24/7', l: 'Support' }].map(s => (
              <div key={s.l} className={styles.illStat}>
                <span className={styles.illStatV}>{s.v}</span>
                <span className={styles.illStatL}>{s.l}</span>
              </div>
            ))}
          </div>
          {[
            '✓ Connect unlimited IoT sensors',
            '✓ AI-powered crop recommendations',
            '✓ Real-time weather alerts',
            '✓ Market price dashboard',
          ].map(t => (
            <div key={t} style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 10, display: 'flex', gap: 10 }}>
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* Form side */}
      <div className={styles.formSide}>
        <motion.div className={styles.formCard} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className={styles.formHeader}>
            <h1>Create Account</h1>
            <p>Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
          </div>

          {/* Step Indicator */}
          <div className={styles.stepIndicator}>
            {STEPS.map((s, i) => (
              <div key={s} className={styles.stepItem} style={{ flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                <div className={`${styles.stepCircle} ${i < step ? styles.done : ''} ${i === step ? styles.active : ''}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`${styles.stepLabel} ${i === step ? styles.active : ''} ${i < step ? styles.done : ''}`}>{s}</span>
                {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${i < step ? styles.done : ''}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Step 0 — Personal Info */}
              {step === 0 && (
                <div className={styles.form}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <div className={styles.inputWrap}>
                      <FiUser size={16} className={styles.inputIcon} />
                      <input className={`form-input ${styles.inputWithIcon}`} placeholder="John Perera" value={form.name} onChange={e => update('name', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <div className={styles.inputWrap}>
                      <FiMail size={16} className={styles.inputIcon} />
                      <input className={`form-input ${styles.inputWithIcon}`} type="email" placeholder="you@example.com" value={form.email} onChange={e => update('email', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <div className={styles.inputWrap}>
                      <FiPhone size={16} className={styles.inputIcon} />
                      <input className={`form-input ${styles.inputWithIcon}`} placeholder="+94 77 123 4567" value={form.phone} onChange={e => update('phone', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className={styles.inputWrap}>
                      <FiLock size={16} className={styles.inputIcon} />
                      <input className={`form-input ${styles.inputWithIcon}`} type={showPw ? 'text' : 'password'} placeholder="Minimum 8 characters" value={form.password} onChange={e => update('password', e.target.value)} />
                      <button type="button" className={styles.pwToggle} onClick={() => setShowPw(v => !v)}>
                        {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1 — Role */}
              {step === 1 && (
                <div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
                    Select your role to personalize your dashboard and features.
                  </p>
                  <div className={styles.rolesGrid}>
                    {ROLES.map(r => (
                      <div
                        key={r.id}
                        className={`${styles.roleCard} ${form.role === r.id ? styles.selected : ''}`}
                        onClick={() => update('role', r.id)}
                      >
                        <r.icon size={28} color={form.role === r.id ? 'var(--primary)' : 'var(--text-muted)'} />
                        <h4>{r.label}</h4>
                        <p>{r.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 — Farm Details */}
              {step === 2 && (
                <div className={styles.form}>
                  <div className="form-group">
                    <label className="form-label">Farm Name</label>
                    <input className="form-input" placeholder="Green Valley Farm" value={form.farmName} onChange={e => update('farmName', e.target.value)} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className="form-group">
                      <label className="form-label">District</label>
                      <select className="form-select" value={form.district} onChange={e => update('district', e.target.value)}>
                        <option value="">Select District</option>
                        {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Area (acres)</label>
                      <input className="form-input" type="number" placeholder="45.5" value={form.area} onChange={e => update('area', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Soil Type</label>
                    <select className="form-select" value={form.soilType} onChange={e => update('soilType', e.target.value)}>
                      <option value="">Select Soil Type</option>
                      {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">GPS Coordinates (optional)</label>
                    <div className={styles.inputWrap}>
                      <FiMapPin size={16} className={styles.inputIcon} />
                      <input className={`form-input ${styles.inputWithIcon}`} placeholder="6.9271° N, 79.8612° E" value={form.gps} onChange={e => update('gps', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className={styles.formNav} style={{ marginTop: 24 }}>
            {step > 0 && (
              <button className="btn btn-ghost btn-outline" onClick={() => setStep(s => s - 1)} style={{ flex: 1 }}>
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
              >
                Continue →
              </button>
            ) : (
              <motion.button
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={handleSubmit}
                disabled={loading}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? <span className={styles.loadingSpinner} /> : 'Create My Account'}
              </motion.button>
            )}
          </div>

          <div className={styles.formFooter}>
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
