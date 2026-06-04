'use client';
import { useState } from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      className={styles.hero} 
      id="hero"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Arka Plan Efektleri */}
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />
      <div className={styles.bgGrid} />
      <div className={styles.bgLaptops}>
        <img src="/hero-laptops.png" alt="" />
      </div>

      {/* İnteraktif Cursor Glow Spotlight */}
      <div 
        className={styles.mouseGlow} 
        style={{ 
          left: `${mousePos.x}px`, 
          top: `${mousePos.y}px`,
          opacity: isHovered ? 1 : 0
        }} 
      />

      <div className={`container ${styles.content}`}>
        <div className={styles.heroLeft}>
          <h1 className={styles.title}>
            Fikirlerinizi Dijital<br />
            <span className="gradient-text">Ürünlere Dönüştürün.</span>
          </h1>

          <p className={styles.desc}>
            CRM panelleri, SaaS platformları ve kurumsal yazılımlar için yüksek 
            performanslı, modern ve ölçeklenebilir web çözümleri geliştiriyoruz.
          </p>

          <div className={styles.ctas}>
            <button
              className="btn btn-primary"
              onClick={() => scrollTo('#portfolio')}
              id="hero-cta-portfolio"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Projeleri İncele
            </button>
            <button
              className="btn btn-outline"
              onClick={() => scrollTo('#contact')}
              id="hero-cta-contact"
            >
              İletişime Geç
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>

          <div className={styles.stats}>
            {[
              { n: '50+', label: 'Tamamlanan Proje' },
              { n: '5+', label: 'Yıl Deneyim' },
              { n: '30+', label: 'Mutlu Müşteri' },
            ].map((s) => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statNum}>{s.n}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.mockupContainer}>
            {/* Laptop Mockup */}
            <div className={styles.laptopMockup}>
              <div className={styles.laptopScreen}>
                <div className={styles.laptopHeader}>
                  <div className={styles.mockupDots}>
                    <span className={styles.mockupDot} style={{ background: '#ff5f56' }} />
                    <span className={styles.mockupDot} style={{ background: '#ffbd2e' }} />
                    <span className={styles.mockupDot} style={{ background: '#27c93f' }} />
                  </div>
                  <div className={styles.mockupBar}>maxsynthetix.com/dashboard</div>
                </div>
                <div className={styles.laptopBody}>
                  <video
                    src="/hero-showcase.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className={styles.mockupVideo}
                  />
                </div>
              </div>
              <div className={styles.laptopBase} />
            </div>

            {/* Phone Mockup */}
            <div className={styles.phoneMockup}>
              <div className={styles.phoneScreen}>
                <div className={styles.phoneSpeaker} />
                <div className={styles.phoneDynamicIsland} />
                <div className={styles.phoneBody}>
                  <video
                    src="/hero-mobile-showcase.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className={styles.mockupVideo}
                  />
                </div>
              </div>
              <div className={styles.phoneVolumeBtn} />
              <div className={styles.phonePowerBtn} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <div className={styles.scrollMouse}>
          <div className={styles.scrollWheel} />
        </div>
        <span>Aşağı kaydır</span>
      </div>
    </section>
  );
}
