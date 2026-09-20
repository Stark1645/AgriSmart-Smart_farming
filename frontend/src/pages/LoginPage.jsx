import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEye, FiEyeOff, FiMail, FiLock, FiAlertCircle, FiCheck, FiX } from 'react-icons/fi';
import { MdGrass } from 'react-icons/md';
import { GiWheat } from 'react-icons/gi';
import { useApp } from '../context/AppContext';
import styles from '../styles/AuthPage.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSubmitted(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    try {
      const ok = await login(email, password);
      if (ok) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
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
              <button
                type="button"
                className={styles.forgotLink}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                onClick={() => {
                  setForgotEmail(email);
                  setForgotSubmitted(false);
                  setForgotModal(true);
                }}
              >
                Forgot password?
              </button>
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

      {/* Password Reset Modal */}
      <AnimatePresence>
        {forgotModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: 20,
            }}
            onClick={() => setForgotModal(false)}
          >
            <motion.div
              style={{
                background: 'var(--card, #ffffff)',
                borderRadius: 'var(--radius-xl, 16px)',
                padding: '28px',
                maxWidth: 440,
                width: '100%',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                border: '1px solid var(--border-light, #e2e8f0)',
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    Reset Password
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, margin: 0 }}>
                    Receive password recovery instructions for your farm account
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setForgotModal(false)}
                  style={{ background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <FiX size={18} />
                </button>
              </div>

              {forgotSubmitted ? (
                <div>
                  <div style={{ background: 'var(--success-light, #ecfdf5)', border: '1px solid #a7f3d0', borderRadius: 8, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <FiCheck color="var(--success, #10b981)" size={20} />
                    <span style={{ fontSize: 13, color: 'var(--success, #065f46)', fontWeight: 600 }}>
                      Password reset instructions have been dispatched to <strong>{forgotEmail}</strong>.
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
                    If you do not see the email within 2 minutes, verify your spam folder or reach out to your farm system administrator at support@agrismart.in.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary w-full"
                    onClick={() => setForgotModal(false)}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit}>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="form-label" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                      Registered Email
                    </label>
                    <div className={styles.inputWrap}>
                      <FiMail size={16} className={styles.inputIcon} />
                      <input
                        className={`form-input ${styles.inputWithIcon}`}
                        type="email"
                        required
                        placeholder="farmer@example.com"
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      style={{ flex: 1 }}
                      onClick={() => setForgotModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ flex: 2 }}
                    >
                      Send Instructions
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
