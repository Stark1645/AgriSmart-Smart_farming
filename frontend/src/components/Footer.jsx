import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdGrass } from 'react-icons/md';
import { FiGithub, FiMail, FiPhone, FiX, FiExternalLink, FiCheckCircle, FiShield, FiFileText, FiHelpCircle } from 'react-icons/fi';
import styles from '../styles/Footer.module.css';

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null);

  const MODAL_CONTENT = {
    docs: {
      title: 'AgriSmart Documentation',
      icon: FiFileText,
      body: (
        <div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 12 }}>
            AgriSmart is an end-to-end precision agriculture architecture powered by Spring Boot, MySQL, and React.
          </p>
          <ul style={{ fontSize: 13, lineHeight: 1.8, paddingLeft: 18, color: 'var(--text-secondary)', marginBottom: 16 }}>
            <li><strong>IoT Integration:</strong> Real-time soil telemetry (moisture, temperature, pH, NPK).</li>
            <li><strong>AI Pest Detection:</strong> Automated convolutional image classification for crop pathogens.</li>
            <li><strong>Precision Irrigation:</strong> Dynamic zone valve control with moisture threshold triggers.</li>
            <li><strong>Farm GIS:</strong> Georeferenced parcel mapping with cadastral survey boundaries.</li>
          </ul>
          <a
            href="https://github.com/Stark1645/AgriSmart-Smart_farming#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            View GitHub Readme <FiExternalLink size={14} />
          </a>
        </div>
      ),
    },
    privacy: {
      title: 'Data & Privacy Policy',
      icon: FiShield,
      body: (
        <div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 12 }}>
            Your farm data belongs to you. AgriSmart adheres to strict data minimization, zero unauthorized data brokering, and encrypted cloud storage protocols.
          </p>
          <ul style={{ fontSize: 13, lineHeight: 1.8, paddingLeft: 18, color: 'var(--text-secondary)' }}>
            <li><strong>Spatial Privacy:</strong> Exact farm GPS coordinates are encrypted and accessible solely by verified farm owners and assigned agronomists.</li>
            <li><strong>Telemetry Retention:</strong> Sensor telemetry is aggregated into 15-minute intervals for long-term trend analysis.</li>
            <li><strong>Image Processing:</strong> Drone & crop diagnostic photos are scanned locally or on dedicated inference servers without third-party harvesting.</li>
          </ul>
        </div>
      ),
    },
    terms: {
      title: 'Terms of Service',
      icon: FiCheckCircle,
      body: (
        <div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 12 }}>
            By using AgriSmart, you agree to our standard precision agriculture software usage terms:
          </p>
          <ul style={{ fontSize: 13, lineHeight: 1.8, paddingLeft: 18, color: 'var(--text-secondary)' }}>
            <li><strong>Advisory Disclaimers:</strong> Fertilizer recommendations and pest detections are AI-driven decision supports; always cross-verify with local agricultural extension officers before applying controlled pesticides.</li>
            <li><strong>System Availability:</strong> Core telemetry ingestion operates with a target 99.9% uptime SLA.</li>
            <li><strong>Fair Use:</strong> Drone telemetry and automated valve triggers operate within configured safety thresholds.</li>
          </ul>
        </div>
      ),
    },
    support: {
      title: 'Support & ICAR Agronomy Guidelines',
      icon: FiHelpCircle,
      body: (
        <div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 12 }}>
            AgriSmart recommendations follow guidelines compiled by the Indian Council of Agricultural Research (ICAR) and state agriculture universities.
          </p>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Emergency Agronomy Helpline</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>📞 Toll-Free Kisan Call Centre: 1800-180-1551 (6 AM - 10 PM)</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>✉ Platform Helpdesk: support@agrismart.in</div>
          </div>
          <a
            href="https://icar.org.in"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            Visit ICAR Official Portal <FiExternalLink size={14} />
          </a>
        </div>
      ),
    },
  };

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>
          <div className={styles.brand}>
            <div className={styles.brandLogo}>
              <MdGrass size={20} />
              <span>AgriSmart</span>
            </div>
            <p className={styles.brandDesc}>
              Smart Farming and Precision Agriculture Management System.
              Empowering farmers with IoT sensor integration, AI disease detection, and yield analytics.
            </p>
            <div className={styles.socials}>
              <a
                href="https://github.com/Stark1645/AgriSmart-Smart_farming"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                title="GitHub Repository"
              >
                <FiGithub size={16} />
              </a>
              <a href="mailto:support@agrismart.in" className={styles.socialLink} title="Email"><FiMail size={16} /></a>
              <a href="tel:+91112345678" className={styles.socialLink} title="Phone"><FiPhone size={16} /></a>
            </div>
          </div>

          <div className={styles.linkGroup}>
            <h4>Platform</h4>
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/farm">My Farm</Link></li>
              <li><Link to="/crop-planning">Crop Planning</Link></li>
              <li><Link to="/iot-sensors">IoT Sensors</Link></li>
              <li><Link to="/irrigation">Precision Irrigation</Link></li>
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h4>Tools & Advisory</h4>
            <ul>
              <li><Link to="/fertilizer">Fertilizer Advisory</Link></li>
              <li><Link to="/pest-detection">Pest & Disease AI</Link></li>
              <li><Link to="/drone-monitoring">Drone Surveillance</Link></li>
              <li><Link to="/market-prices">Mandi Prices</Link></li>
              <li><Link to="/reports">Reports & Exports</Link></li>
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h4>Support & Legal</h4>
            <ul>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('docs')}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', font: 'inherit', cursor: 'pointer' }}
                >
                  Documentation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('privacy')}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', font: 'inherit', cursor: 'pointer' }}
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('terms')}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', font: 'inherit', cursor: 'pointer' }}
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('support')}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', font: 'inherit', cursor: 'pointer' }}
                >
                  Support & ICAR Guidelines
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© 2024 Smart Farming and Precision Agriculture Management System. All rights reserved.</p>
          <p className={styles.built}>Built with Spring Boot & React.js | Precision Agriculture Platform</p>
        </div>
      </div>

      {/* Interactive Modal */}
      {activeModal && MODAL_CONTENT[activeModal] && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20,
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            style={{
              background: 'var(--card, #ffffff)',
              borderRadius: 'var(--radius-xl, 16px)',
              padding: '24px 28px',
              maxWidth: 520,
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
              border: '1px solid var(--border-light, #e2e8f0)',
              color: 'var(--text-primary)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--border-light)', paddingBottom: 12 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)' }}>
                {activeModal === 'docs' && <FiFileText color="var(--primary)" />}
                {activeModal === 'privacy' && <FiShield color="var(--primary)" />}
                {activeModal === 'terms' && <FiCheckCircle color="var(--primary)" />}
                {activeModal === 'support' && <FiHelpCircle color="var(--primary)" />}
                {MODAL_CONTENT[activeModal].title}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                style={{ background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <FiX size={18} />
              </button>
            </div>
            {MODAL_CONTENT[activeModal].body}
            <div style={{ marginTop: 20, textAlign: 'right' }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setActiveModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
