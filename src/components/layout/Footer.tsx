import styles from './Footer.module.css';

export default function Footer() {

  return (
    <footer className={styles.footer}>
      <div className={styles.glow} />
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <a
              href="https://www.instagram.com/maximilliensynthetix"
              target="_blank"
              rel="noopener noreferrer"
              className={`brand-badge ${styles.logoLink}`}
              aria-label="Instagram"
            >
              <div className="brand-badge-inner">
                <span className="brand-line black">maximillien</span>
                <span className="brand-line blue">synthetix</span>
              </div>
              <span className={styles.instaIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </span>
            </a>
          </div>
          <p className={styles.tagline}>
            Yazılım ile iş süreçlerini dönüştürün.
          </p>
        </div>

        <div className={styles.links}>
          <span className={styles.linksTitle}>Hızlı Erişim</span>
          {[
            ['Hakkında', '#about'],
            ['Hizmetler', '#services'],
            ['Portfolio', '#portfolio'],
            ['İletişim', '#contact'],
          ].map(([label, href]) => (
            <a key={href} href={href} className={styles.link}>{label}</a>
          ))}
        </div>

        <div className={styles.links}>
          <span className={styles.linksTitle}>Hizmetler</span>
          {['CRM Geliştirme', 'SaaS Dashboard', 'API Entegrasyonu', 'MVP Geliştirme'].map((s) => (
            <span key={s} className={styles.linkMuted}>{s}</span>
          ))}
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span className={styles.copy}>© 2024 Maximillien Synthetix. Tüm hakları saklıdır.</span>
      </div>
    </footer>
  );
}
