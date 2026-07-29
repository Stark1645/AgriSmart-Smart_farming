import { Link } from 'react-router-dom';
import { MdGrass } from 'react-icons/md';
import { FiGithub, FiMail, FiPhone } from 'react-icons/fi';
import styles from '../styles/Footer.module.css';

export default function Footer() {
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
              Empowering Indian farmers with AI-driven precision agriculture,
              IoT sensors, and real-time analytics for sustainable food production.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialLink}><FiGithub size={16} /></a>
              <a href="mailto:info@agrismart.in" className={styles.socialLink}><FiMail size={16} /></a>
              <a href="tel:+91112345678" className={styles.socialLink}><FiPhone size={16} /></a>
            </div>
          </div>

          <div className={styles.linkGroup}>
            <h4>Platform</h4>
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/farm-management">Farm Management</Link></li>
              <li><Link to="/iot-sensors">IoT Sensors</Link></li>
              <li><Link to="/irrigation">Irrigation</Link></li>
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h4>Tools</h4>
            <ul>
              <li><Link to="/pest-detection">Pest Detection</Link></li>
              <li><Link to="/drone-monitoring">Drone Monitoring</Link></li>
              <li><Link to="/market-prices">Market Prices</Link></li>
              <li><Link to="/reports">Reports</Link></li>
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h4>Support</h4>
            <ul>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Indian Council of Agricultural Research</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© 2026 AgriSmart. University Application Development Project — India.</p>
          <p className={styles.built}>Built with React.js | Precision Agriculture Platform</p>
        </div>
      </div>
    </footer>
  );
}
