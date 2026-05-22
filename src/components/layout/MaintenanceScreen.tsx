'use client';
import styles from './MaintenanceScreen.module.css';
import { Wrench, Settings } from 'lucide-react';

export default function MaintenanceScreen() {
  return (
    <div className={styles.maintenanceOverlay}>
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />
      <div className={styles.bgGrid} />

      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <div className={styles.iconGlow} />
          <Settings size={48} className={styles.mainIcon} />
          <Wrench size={24} className={styles.subIcon} />
        </div>

        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Sistem Güncellemesi
        </div>

        <h1 className={styles.title}>
          Daha İyi Bir Deneyim İçin<br />
          <span className={styles.gradient}>Bakım Modundayız</span>
        </h1>

        <p className={styles.desc}>
          Web sitemizi sizler için güncelliyoruz. Çok yakında yeni özelliklerimiz 
          ve iyileştirilmiş altyapımızla tekrar yayında olacağız. Sabrınız için teşekkürler.
        </p>

        <div className={styles.footerLine}>
          <div className={styles.brandText}>
            maximillien<span className={styles.brandDotText}>.</span>synthetix
          </div>
        </div>
      </div>
    </div>
  );
}
