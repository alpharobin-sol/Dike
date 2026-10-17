import { facts, site } from '@/content/site';
import Convergence from './Convergence';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <Convergence className={styles.canvas} />
      <div className={styles.body}>
        <p className={`label ${styles.eyebrow}`}>Industrial &amp; defence manufacturing</p>
        <h1 id="hero-title" className={styles.title}>{site.manifesto}</h1>
        <p className={styles.lede}>{site.mission}</p>
        <div className={styles.actions}>
          <a className="btn btn-primary" href="#contact">Talk to us</a>
          <a className="btn btn-secondary" href="#approach">See our approach</a>
        </div>
      </div>
      <div className={styles.strip}>
        <dl className={styles.stripInner}>
          {facts.map((f) => (
            <div key={f.term}>
              <dt className="label">{f.term}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
