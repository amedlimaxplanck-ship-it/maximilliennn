import styles from './About.module.css';
import { Rocket } from 'lucide-react';

const techs = [
  'Next.js', 'React', 'TypeScript', 'Node.js',
  'PostgreSQL', 'Prisma', 'REST API', 'GraphQL',
  'Tailwind', 'Docker', 'Figma', 'Git',
];

export default function About() {
  return (
    <section className={`section ${styles.about}`} id="about">
      <div className={`container ${styles.inner}`}>
        <div className={styles.left}>
          <div className={styles.imageWrap}>
            <div className={styles.imagePlaceholder}>
              <div className={styles.typewriterWrapper}>
                <span className={`${styles.typewriterLine} ${styles.black}`}>maximillien</span>
                <span className={`${styles.typewriterLine} ${styles.blue}`}>synthetix</span>
              </div>
              <div className={styles.imageRing} />
            </div>
            <div className={styles.imageGlow} />
            <div className={styles.floatBadge}>
              <Rocket size={16} />
              <span>Full Stack</span>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.sectionTag}>Hakkında</div>
          <h2 className={styles.title}>
            Yazılım ile değer<br />
            <span className="gradient-text">üreten çözümler</span>
          </h2>
          <p className={styles.text}>
            Maximillien Synthetix, iş süreçlerini dijitalleştiren, ölçeklenebilir
            SaaS ürünleri ve kurumsal yazılım çözümleri geliştirmektedir. Her projede
            teknik mükemmeliyet ve kullanıcı deneyimi en üst düzeyde ön planda tutulur.
          </p>
          <p className={styles.text}>
            CRM panellerinden SaaS dashboard'larına, MVP geliştirmeden API entegrasyonlarına
            kadar geniş bir yelpazede profesyonel çözümler sunulmaktadır. Fikirleri
            gerçeğe dönüştürmek üzere uçtan uca mühendislik hizmeti sağlanır.
          </p>

          <div className={styles.techGrid}>
            {techs.map((t) => (
              <span key={t} className={styles.techBadge}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
