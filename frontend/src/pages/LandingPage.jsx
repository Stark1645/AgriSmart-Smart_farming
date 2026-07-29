import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MdSensors, MdWaterDrop, MdBugReport, MdFlight,
  MdBarChart, MdCloud, MdGrass, MdVerified
} from 'react-icons/md';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { GiWheat, GiPlantSeed, GiFarmTractor } from 'react-icons/gi';
import styles from '../styles/LandingPage.module.css';

const features = [
  { icon: MdSensors,   color: '#2d7a3a', title: 'IoT Sensor Network', desc: 'Real-time monitoring of soil moisture, temperature, pH, and NPK levels across your entire farm.' },
  { icon: MdWaterDrop, color: '#1976d2', title: 'Precision Irrigation', desc: 'AI-driven irrigation scheduling based on crop needs, weather, and live sensor data.' },
  { icon: MdBugReport, color: '#fb8c00', title: 'Pest & Disease AI', desc: 'Upload crop photos and get instant disease detection with treatment recommendations.' },
  { icon: MdFlight,    color: '#7b1fa2', title: 'Drone Monitoring', desc: 'NDVI mapping and crop health surveillance through autonomous drone inspections.' },
  { icon: MdBarChart,  color: '#0288d1', title: 'Yield Analytics', desc: 'Comprehensive reports on yield, revenue, expenses, and seasonal comparisons.' },
  { icon: MdCloud,     color: '#00897b', title: 'Weather Integration', desc: 'Hyper-local weather forecasting integrated with planting and irrigation schedules.' },
];

const benefits = [
  'Increase crop yield by up to 35%',
  'Reduce water usage by 40% with smart irrigation',
  'Early pest detection saves up to 25% of crop loss',
  'Real-time market prices for better selling decisions',
  'Automated fertilizer recommendations by crop stage',
  'Drone NDVI mapping for precision inputs',
];

const stats = [
  { value: '5,400+', label: 'Registered Farmers', icon: GiFarmTractor },
  { value: '12,800', label: 'Hectares Monitored', icon: MdGrass },
  { value: '98.4%', label: 'Sensor Uptime', icon: MdSensors },
  { value: '35%',   label: 'Average Yield Increase', icon: GiWheat },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' } }),
};

export default function LandingPage() {
  return (
    <div className={styles.page}>
      {/* ---- Hero ---- */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.heroCircle1} />
          <div className={styles.heroCircle2} />
          <div className={styles.heroGrid} />
        </div>
        <div className="container">
          <div className={styles.heroContent}>
            <motion.div className={styles.heroText} initial="hidden" animate="visible" variants={fadeUp}>
              <span className={styles.heroPill}>
                <GiPlantSeed size={14} /> Precision Agriculture Platform
              </span>
              <h1 className={styles.heroTitle}>
                Smart Farming for<br />
                <span className={styles.heroGradient}>India's Future</span>
              </h1>
              <p className={styles.heroDesc}>
                AgriSmart combines IoT sensors, AI-powered analytics, and drone monitoring
                to help farmers make smarter decisions, increase yield, and reduce costs.
              </p>
              <div className={styles.heroCta}>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started Free <FiArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Sign In to Dashboard
                </Link>
              </div>
              <div className={styles.heroTrust}>
                <MdVerified size={16} style={{ color: 'var(--primary)' }} />
                <span>Backed by the Indian Council of Agricultural Research (ICAR)</span>
              </div>
            </motion.div>

            {/* Illustration card */}
            <motion.div
              className={styles.heroVisual}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
            >
              <div className={styles.dashMockup}>
                <div className={styles.mockHeader}>
                  <div className={styles.mockDots}>
                    <span /><span /><span />
                  </div>
                  <span className={styles.mockTitle}>Farm Dashboard — Live</span>
                </div>
                <div className={styles.mockStats}>
                  {[
                    { l: 'Soil Moisture', v: '68%', c: '#2d7a3a', w: 68 },
                    { l: 'Temperature',   v: '29°C', c: '#1976d2', w: 55 },
                    { l: 'Crop Health',   v: 'Good', c: '#43a047', w: 82 },
                    { l: 'Water Usage',   v: '450L',  c: '#0288d1', w: 45 },
                  ].map((s) => (
                    <div key={s.l} className={styles.mockStatRow}>
                      <div className={styles.mockStatMeta}>
                        <span>{s.l}</span>
                        <span style={{ color: s.c }}>{s.v}</span>
                      </div>
                      <div className={styles.mockStatBar}>
                        <motion.div
                          className={styles.mockStatFill}
                          style={{ background: s.c }}
                          initial={{ width: 0 }}
                          animate={{ width: `${s.w}%` }}
                          transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.mockSensors}>
                  {[
                    { l: 'NPK', v: '42/28/35', status: 'online' },
                    { l: 'pH',  v: '6.8',       status: 'online' },
                    { l: 'Rain',v: '12mm',      status: 'warning' },
                  ].map(s => (
                    <div key={s.l} className={styles.mockSensor}>
                      <span className={`${styles.sensorDot} ${styles[s.status]}`} />
                      <span className={styles.sensorL}>{s.l}</span>
                      <span className={styles.sensorV}>{s.v}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.mockAlert}>
                  <MdBugReport size={14} color="#fb8c00" />
                  <span>Pest alert detected — Block A</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---- Stats ---- */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className={styles.statItem}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <s.icon size={28} style={{ color: 'var(--primary-light)' }} />
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Features ---- */}
      <section className={styles.featuresSection}>
        <div className="container">
          <motion.div className={styles.sectionHead} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className={styles.sectionTag}>Platform Features</span>
            <h2>Everything You Need to Farm Smarter</h2>
            <p>A complete precision agriculture platform built for modern Indian farmers.</p>
          </motion.div>
          <div className={styles.featuresGrid}>
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className={styles.featureCard}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
              >
                <div className={styles.featureIcon} style={{ background: f.color + '18', color: f.color }}>
                  <f.icon size={28} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Benefits ---- */}
      <section className={styles.benefitsSection}>
        <div className="container">
          <div className={styles.benefitsGrid}>
            <motion.div className={styles.benefitsText} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <span className={styles.sectionTag}>Why AgriSmart?</span>
              <h2>Proven Results for Indian Farmers</h2>
              <p>Our platform is designed in collaboration with the ICAR and leading agricultural research institutions.</p>
              <ul className={styles.benefitsList}>
                {benefits.map((b) => (
                  <li key={b}>
                    <FiCheckCircle size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-flex' }}>
                Start Your Free Trial <FiArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div
              className={styles.benefitsVisual}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.benefitsCard}>
                <div className={styles.benefitsCardHeader}>
                  <GiWheat size={24} color="var(--primary)" />
                  <span>Seasonal Yield Comparison</span>
                </div>
                {[
                  { crop: 'Rice', before: 58, after: 82 },
                  { crop: 'Vegetables', before: 62, after: 88 },
                  { crop: 'Maize', before: 55, after: 78 },
                  { crop: 'Tea', before: 70, after: 91 },
                ].map((r) => (
                  <div key={r.crop} className={styles.compRow}>
                    <span className={styles.compLabel}>{r.crop}</span>
                    <div className={styles.compBars}>
                      <div className={styles.compBarWrap}>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Before</span>
                        <div className={styles.compTrack}>
                          <motion.div className={styles.compFill} style={{ background: 'var(--border)', width: `${r.before}%` }}
                            initial={{ width: 0 }} whileInView={{ width: `${r.before}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} />
                        </div>
                        <span className={styles.compPct}>{r.before}%</span>
                      </div>
                      <div className={styles.compBarWrap}>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>After</span>
                        <div className={styles.compTrack}>
                          <motion.div className={styles.compFill} style={{ background: 'var(--primary)', width: `${r.after}%` }}
                            initial={{ width: 0 }} whileInView={{ width: `${r.after}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }} />
                        </div>
                        <span className={styles.compPct} style={{ color: 'var(--primary)', fontWeight: 700 }}>{r.after}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className={styles.ctaSection}>
        <div className="container">
          <motion.div
            className={styles.ctaCard}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.ctaBg} />
            <GiWheat size={48} style={{ color: 'rgba(255,255,255,0.2)', position: 'relative', zIndex: 1 }} />
            <h2 style={{ position: 'relative', zIndex: 1 }}>Ready to Transform Your Farm?</h2>
            <p style={{ position: 'relative', zIndex: 1 }}>Join thousands of farmers using AgriSmart to boost productivity and profitability.</p>
            <div className={styles.ctaBtns} style={{ position: 'relative', zIndex: 1 }}>
              <Link to="/register" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary)', fontWeight: 700 }}>
                Get Started Free <FiArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)' }}>
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
