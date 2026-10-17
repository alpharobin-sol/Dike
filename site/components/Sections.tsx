import { areas, nav, phases, principles, problems, site, steps } from '@/content/site';
import styles from './Sections.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

function Head({ id, eyebrow, title, lede }: { id: string; eyebrow: string; title: string; lede?: string }) {
  return (
    <div className={styles.head}>
      <div>
        <p className={`label ${styles.eyebrow}`}>{eyebrow}</p>
        <h2 id={id} className={styles.title}>{title}</h2>
      </div>
      {lede && <p className={styles.lede}>{lede}</p>}
    </div>
  );
}

export function Problem() {
  return (
    <section className={styles.section} aria-labelledby="problem-title">
      <div className={styles.wrap}>
        <Head id="problem-title" eyebrow="The problem" title="Three connected problems" />
        <div className={styles.cards}>
          {problems.map((p) => (
            <article key={p.title} className={styles.card}>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardText}>{p.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Approach() {
  return (
    <section id="approach" className={styles.statement} aria-labelledby="approach-title">
      <div className={styles.wrap}>
        <p className={`label ${styles.statementEyebrow}`}>Our answer</p>
        <h2 id="approach-title" className={styles.statementTitle}>A manufacturer first.</h2>
        <p className={styles.statementText}>Recycled material is how we build. Testing decides where it goes.</p>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section className={styles.section} aria-labelledby="process-title">
      <div className={styles.wrap}>
        <Head
          id="process-title"
          eyebrow="How it works"
          title="From waste stream to qualified part"
          lede="We start with partners at every stage, and bring a stage in-house only where owning it pays."
        />
        <ol className={styles.steps}>
          {steps.map((s, i) => (
            <li key={s.title} className={styles.card}>
              <span className={styles.num}>{pad(i + 1)}</span>
              <h3 className={styles.cardTitle}>{s.title}</h3>
              <p className={styles.cardText}>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Build() {
  return (
    <section id="build" className={styles.section} aria-labelledby="build-title">
      <div className={styles.wrap}>
        <Head
          id="build-title"
          eyebrow="What we build"
          title="Three areas, in order"
          lede="Every product is validated before we commit capital. Some will need metals, virgin polymers or specialist composites."
        />
        <div className={styles.cards}>
          {areas.map((a, i) => (
            <article key={a.title} className={styles.card}>
              <span className={`label ${styles.pill} ${i === 0 ? styles.pillNow : i === 1 ? styles.pillNext : ''}`}>{a.stage}</span>
              <h3 className={styles.cardTitle}>{a.title}</h3>
              <p className={styles.cardText}>{a.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Principles() {
  return (
    <section className={styles.section} aria-labelledby="principles-title">
      <div className={styles.wrap}>
        <Head id="principles-title" eyebrow="How we work" title="Proof before promises" />
        <ul className={styles.rows}>
          {principles.map((p) => (
            <li key={p.title}>
              <h3 className={styles.rowTitle}>{p.title}</h3>
              <p className={styles.rowText}>{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Roadmap() {
  return (
    <section id="roadmap" className={styles.section} aria-labelledby="roadmap-title">
      <div className={styles.wrap}>
        <Head
          id="roadmap-title"
          eyebrow="Roadmap"
          title="Five phases, proof first"
          lede="Milestones, not dates. Each phase starts when the one before it is proven."
        />
        <ol className={styles.phases}>
          {phases.map((p, i) => (
            <li key={p.title} className={i === 0 ? styles.current : undefined}>
              <span className={`label ${styles.phaseNum}`}>Phase {i + 1}</span>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardText}>{p.text}</p>
              {i === 0 && <span className={`label ${styles.pill} ${styles.pillNow}`}>We are here</span>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Company() {
  return (
    <section id="company" className={styles.section} aria-labelledby="company-title">
      <div className={`${styles.wrap} ${styles.origin}`}>
        <div>
          <p className={`label ${styles.eyebrow}`}>The name</p>
          <h2 id="company-title" className={styles.originName}>Dike</h2>
          <p className={styles.say}>{site.pronunciation}</p>
        </div>
        <div className={styles.originText}>
          <p>Igbo for brave, strong.</p>
          <p>
            Our shield is the D of Dike turned on its side. Its ridges and its bronze come from the Igbo-Ukwu
            castings, made more than a thousand years ago.
          </p>
          <p className={styles.founder}>Founded by {site.founder}.</p>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const { email, x, linkedin } = site.contact;
  return (
    <section id="contact" className={styles.contact} aria-labelledby="contact-title">
      <div className={styles.wrap}>
        <p className={`label ${styles.eyebrow}`}>Talk to us</p>
        <h2 id="contact-title" className={styles.contactTitle}>Working on a part, a material or a supply problem?</h2>
        <p className={styles.lede}>We’d like to hear about it. Investors and partners are welcome too.</p>
        <div className={styles.contactRow}>
          <a className="btn btn-primary" href={`mailto:${email}`}>{email}</a>
          {x && <a className="btn btn-secondary" href={x}>X</a>}
          {linkedin && <a className="btn btn-secondary" href={linkedin}>LinkedIn</a>}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.wrap} ${styles.footerInner}`}>
        <div className={styles.footerBrand}>
          <img src="/logo/dike-horizontal-on-dark.svg" alt="Dike Industries" width={140} height={50} />
          <p className={styles.footerTag}>{site.tagline}</p>
        </div>
        <nav className={styles.footerNav} aria-label="Footer">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
          <a href="#contact">Contact</a>
        </nav>
        <p className={`label ${styles.footerMeta}`}>
          © {new Date().getFullYear()} {site.name} · {site.pronunciation}
        </p>
      </div>
    </footer>
  );
}
