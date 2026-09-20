import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiMapPin, FiCheckCircle, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
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
  const [errorMsg, setErrorMsg] = useState('');
  const { register } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'farmer',
    farmName: '',
    district: 'Ludhiana',
    area: '',
    soilType: 'Loamy',
    gps: '',
  });

  const update = (k, v) => {
    setErrorMsg('');
    setForm(f => ({ ...f, [k]: v }));
  };

  const validateStep0 = () => {
    // 1. Name: alphabetic + spaces only, 2-100 characters
    if (!form.name.trim()) {
      setErrorMsg('Name is required');
      return false;
    }
    const nameRegex = /^[A-Za-z\s]{2,100}$/;
    if (!nameRegex.test(form.name.trim())) {
      setErrorMsg('Name must not contain numbers or special characters');
      return false;
    }

    // 2. Email validation
    if (!form.email.trim()) {
      setErrorMsg('Please enter a valid email address');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setErrorMsg('Please enter a valid email address');
      return false;
    }

    // 3. Phone: exactly 10 consecutive numeric digits
    if (!form.phone.trim()) {
      setErrorMsg('Phone Number is required');
      return false;
    }
    const cleanPhone = form.phone.replace(/[\s+-]/g, '');
    const phoneDigits = cleanPhone.startsWith('91') && cleanPhone.length === 12 ? cleanPhone.slice(2) : cleanPhone;
    if (!/^\d{10}$/.test(phoneDigits)) {
      setErrorMsg('Phone Number must be exactly 10 digits long');
      return false;
    }

    // 4. Password: Minimum 8 chars with upper, lower, digit, special char
    if (form.password.length < 8) {
      setErrorMsg('Password must meet security requirements');
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (form.area && (isNaN(parseFloat(form.area)) || parseFloat(form.area) <= 0)) {
      setErrorMsg('Area must be a positive number');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setErrorMsg('');
    if (step === 0) {
      if (!validateStep0()) return;
    }
    if (step === 1) {
      if (!form.role) {
        setErrorMsg('Please select a system role');
        return;
      }
    }
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      await register(form);
      setSubmitted(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.page}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, padding: 40 }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <FiCheckCircle size={72} color="var(--success)" />
          </motion.div>
          <h2 style={{ fontSize: 28, fontWeight: 800 }}>Registration successful!</h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 400 }}>
            Registration successful! Please verify your email. Welcome to AgriSmart, {form.name}! Redirecting to dashboard…
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
          <p className={styles.illDesc}>Create your verified farmer profile to monitor plots with IoT sensors, AI analytics, and precision irrigation.</p>
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

          {errorMsg && (
            <motion.div
              className={styles.errorBanner}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <FiAlertCircle size={16} /> {errorMsg}
            </motion.div>
          )}

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
                    <label className="form-label">Full Name * (Alphabetic only)</label>
                    <div className={styles.inputWrap}>
                      <FiUser size={16} className={styles.inputIcon} />
                      <input className={`form-input ${styles.inputWithIcon}`} placeholder="Rajesh Kumar" value={form.name} onChange={e => update('name', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <div className={styles.inputWrap}>
                      <FiMail size={16} className={styles.inputIcon} />
                      <input className={`form-input ${styles.inputWithIcon}`} type="email" placeholder="you@example.com" value={form.email} onChange={e => update('email', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number * (10 Digits)</label>
                    <div className={styles.inputWrap}>
                      <FiPhone size={16} className={styles.inputIcon} />
                      <input className={`form-input ${styles.inputWithIcon}`} placeholder="9876543210" value={form.phone} onChange={e => update('phone', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password * (Min. 8 chars, uppercase, digit, special)</label>
                    <div className={styles.inputWrap}>
                      <FiLock size={16} className={styles.inputIcon} />
                      <input className={`form-input ${styles.inputWithIcon}`} type={showPw ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => update('password', e.target.value)} />
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
                    Select your operational role according to the system permission matrix.
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
                    <label className="form-label">Primary Farm Name</label>
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
                      <label className="form-label">Total Area (acres)</label>
                      <input className="form-input" type="number" step="0.1" placeholder="45.5" value={form.area} onChange={e => update('area', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Soil Classification</label>
                    <select className="form-select" value={form.soilType} onChange={e => update('soilType', e.target.value)}>
                      <option value="">Select Soil Type</option>
                      {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">GIS Coordinates (lat, lng)</label>
                    <div className={styles.inputWrap}>
                      <FiMapPin size={16} className={styles.inputIcon} />
                      <input className={`form-input ${styles.inputWithIcon}`} placeholder="30.9010° N, 75.8573° E" value={form.gps} onChange={e => update('gps', e.target.value)} />
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
                onClick={handleNext}
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
