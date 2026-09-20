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
              Smart Farming and Precision Agriculture Management System.
              Empowering farmers with IoT sensor integration, AI disease detection, and yield analytics.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialLink} title="GitHub"><FiGithub size={16} /></a>
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
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Support & ICAR Guidelines</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© 2024 Smart Farming and Precision Agriculture Management System. All rights reserved.</p>
          <p className={styles.built}>Built with Spring Boot & React.js | Precision Agriculture Platform</p>
        </div>
      </div>
    </footer>
  );
}
