'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

const navItems = [
  { label: 'Hakkında', href: '#about' },
  { label: 'Hizmetler', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Süreç', href: '#process' },
  { label: 'İletişim', href: '#contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={`brand-badge ${styles.logo}`}>
          <div className="brand-badge-inner">
            <span className="brand-line black">maximillien</span>
            <span className="brand-line blue">synthetix</span>
          </div>
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          {navItems.map((item) => (
            <button
              key={item.href}
              className={styles.navLink}
              onClick={() => handleNav(item.href)}
            >
              {item.label}
            </button>
          ))}
          <button
            className={`btn btn-primary ${styles.navCta}`}
            onClick={() => handleNav('#contact')}
          >
            Teklif Al
          </button>
        </nav>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`${styles.bar} ${menuOpen ? styles.bar1Open : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.bar2Open : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.bar3Open : ''}`} />
        </button>
      </div>
      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)} />}
    </header>
  );
}
