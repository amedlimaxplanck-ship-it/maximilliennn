'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './Hero.module.css';

const roles = [
  'Full Stack Developer',
  'SaaS Panel Uzmanı',
  'CRM Geliştirici',
  'Yazılım Mimarı',
];

function useTypingEffect(words: string[], speed = 80, pause = 1800) {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing');
  const charIdx = useRef(0);

  useEffect(() => {
    const current = words[wordIdx];

    if (phase === 'typing') {
      if (charIdx.current < current.length) {
        const t = setTimeout(() => {
          setDisplay(current.slice(0, charIdx.current + 1));
          charIdx.current++;
        }, speed);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase('deleting'), pause);
        return () => clearTimeout(t);
      }
    }

    if (phase === 'deleting') {
      if (charIdx.current > 0) {
        const t = setTimeout(() => {
          charIdx.current--;
          setDisplay(current.slice(0, charIdx.current));
        }, speed / 2);
        return () => clearTimeout(t);
      } else {
        setWordIdx((i) => (i + 1) % words.length);
        setPhase('typing');
      }
    }
  }, [phase, display, wordIdx, words, speed, pause]);

  return display;
}

export default function Hero() {
  const typed = useTypingEffect(roles);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.hero} id="hero">
      {/* Animated background */}
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />
      <div className={styles.bgGrid} />

      <div className={`container ${styles.content}`}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Müsait — Yeni proje alabiliyorum
        </div>

        <h1 className={styles.title}>
          Yazılım ile İş<br />
          Süreçlerini{' '}
          <span className="gradient-text">Dönüştürüyorum</span>
        </h1>

        <div className={styles.typingRow}>
          <span className={styles.typingLabel}>Ben bir</span>
          <span className={styles.typingText}>{typed}</span>
          <span className={styles.cursor} />
        </div>

        <p className={styles.desc}>
          CRM panelleri, SaaS dashboard'ları ve kurumsal yazılım çözümleri geliştiriyorum.
          Fikrinizi ürüne dönüştürmek için buradayım.
        </p>

        <div className={styles.ctas}>
          <button
            className="btn btn-primary"
            onClick={() => scrollTo('#portfolio')}
            id="hero-cta-portfolio"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Projelerimi Gör
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

      <div className={styles.scrollHint}>
        <div className={styles.scrollMouse}>
          <div className={styles.scrollWheel} />
        </div>
        <span>Aşağı kaydır</span>
      </div>
    </section>
  );
}
