import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { MdGrass } from 'react-icons/md';
import { GiWheat } from 'react-icons/gi';
import { useApp } from '../context/AppContext';
import styles from '../styles/AuthPage.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('kamal@agrismart.lk');
  const [password, setPassword] = useState('password123');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200));
    const ok = login(email, password);
    if (ok) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      {/* Left — Illustration */}
      <div className={styles.illustrationSide}>
        <div className={styles.illustrationBg} />
        <div className={styles.illustrationContent}>
          <div className={styles.illBrand}>
            <MdGrass size={28} />
            <span>AgriSmart</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <h2 className={styles.illTitle}>
              Precision Agriculture<br />for Modern Farmers
            </h2>
            <p className={styles.illDesc}>
              Monitor your farms, sensors, and crops in real-time.
              Make data-driven decisions for maximum yield.
            </p>
          </motion.div>
          <div className={styles.illStats}>
            {[
              { v: '5,400+', l: 'Farmers' },
              { v: '35%', l: 'Yield Boost' },
              { v: '40%', l: 'Water Saved' },
            ].map(s => (
              <div key={s.l} className={styles.illStat}>
                <span className={styles.illStatV}>{s.v}</span>
                <span className={styles.illStatL}>{s.l}</span>
              </div>
            ))}
          </div>
          <div className={styles.illBadges}>
            <div className={styles.illBadge}><GiWheat size={14} /> Smart Irrigation</div>
            <div className={styles.illBadge}>IoT Sensors</div>
            <div className={styles.illBadge}>AI Pest Detection</div>
            <div className={styles.illBadge}>Yield Analytics</div>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className={styles.formSide}>
        <motion.div
          className={styles.formCard}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.formHeader}>
            <h1>Welcome Back</h1>
            <p>Sign in to your AgriSmart account</p>
          </div>

          {error && (
            <motion.div
              className={styles.errorBanner}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <FiAlertCircle size={16} /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className={styles.inputWrap}>
                <FiMail size={16} className={styles.inputIcon} />
                <input
                  className={`form-input ${styles.inputWithIcon}`}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className={styles.inputWrap}>
                <FiLock size={16} className={styles.inputIcon} />
                <input
                  className={`form-input ${styles.inputWithIcon}`}
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button type="button" className={styles.pwToggle} onClick={() => setShowPw(v => !v)}>
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div className={styles.formOptions}>
              <label className={styles.checkLabel}>
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                <span>Remember me</span>
              </label>
              <a href="#" className={styles.forgotLink}>Forgot password?</a>
            </div>

            <motion.button
              type="submit"
              className={`btn btn-primary w-full ${styles.submitBtn}`}
              disabled={loading}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className={styles.loadingSpinner} />
              ) : 'Sign In to Dashboard'}
            </motion.button>
          </form>

          <div className={styles.demoNote}>
            <strong>Demo:</strong> Use any email/password to sign in
          </div>

          <div className={styles.formFooter}>
            Don't have an account? <Link to="/register">Create one free</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
