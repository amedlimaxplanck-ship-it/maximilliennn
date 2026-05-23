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
              <svg viewBox="0 0 200 200" className={styles.rotatingLogo}>
                <defs>
                  {/* Dairesel metin yolu */}
                  <path id="textCircle" d="M 100, 100 m -65, 0 a 65,65 0 1,1 130,0 a 65,65 0 1,1 -130,0" />
                  {/* Geometrik çekirdek için degrade renkler */}
                  <linearGradient id="coreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                {/* Dış kesikli halka */}
                <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="1" strokeDasharray="4,4" />
                
                {/* 3D Geometrik Küp Çekirdek */}
                <g className={styles.centerIcon}>
                  <polygon points="100,62 133,81 133,119 100,138 67,119 67,81" fill="none" stroke="url(#coreGradient)" strokeWidth="2.5" />
                  <line x1="100" y1="100" x2="100" y2="62" stroke="url(#coreGradient)" strokeWidth="1.5" strokeOpacity="0.8" />
                  <line x1="100" y1="100" x2="133" y2="119" stroke="url(#coreGradient)" strokeWidth="1.5" strokeOpacity="0.8" />
                  <line x1="100" y1="100" x2="67" y2="119" stroke="url(#coreGradient)" strokeWidth="1.5" strokeOpacity="0.8" />
                  <circle cx="100" cy="100" r="5" fill="#ffffff" />
                </g>

                {/* Dönen Metin */}
                <text className={styles.circleText}>
                  <textPath href="#textCircle" startOffset="0%">
                    maximillien • synthetix • software studio •
                  </textPath>
                </text>
              </svg>
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
            CRM panellerinden {"SaaS dashboard'larına"}, MVP geliştirmeden API entegrasyonlarına
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
