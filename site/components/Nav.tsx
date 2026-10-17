'use client';

import { useEffect, useState } from 'react';
import { nav } from '@/content/site';
import styles from './Nav.module.css';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <a href="#top" className={styles.logo} aria-label="Dike Industries, back to top">
          <img src="/logo/dike-horizontal-on-dark.svg" alt="Dike Industries" width={112} height={40} />
        </a>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
        <nav id="nav-menu" className={`${styles.menu} ${open ? styles.open : ''}`} aria-label="Main">
          {nav.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a className={styles.cta} href="#contact" onClick={() => setOpen(false)}>
            Talk to us
          </a>
        </nav>
      </div>
    </header>
  );
}
