import styles from './Process.module.css';

const steps = [
  {
    num: '01',
    icon: '🔍',
    title: 'Keşif & Analiz',
    desc: 'İhtiyaçlarınızı, hedeflerinizi ve mevcut süreçlerinizi derinlemesine analiz ediyorum. Projenin kapsamını netleştiriyoruz.',
  },
  {
    num: '02',
    icon: '🎨',
    title: 'Tasarım & Prototip',
    desc: 'Figma ile interaktif prototipler hazırlıyorum. Onayladıktan sonra geliştirme aşamasına geçiyoruz.',
  },
  {
    num: '03',
    icon: '⚡',
    title: 'Geliştirme',
    desc: 'Temiz, ölçeklenebilir ve bakımı kolay kod yazıyorum. Düzenli güncellemeler ile sizi süreçten haberdar ediyorum.',
  },
  {
    num: '04',
    icon: '🚀',
    title: 'Teslim & Destek',
    desc: 'Projeyi canlıya alıyoruz. Teslim sonrası teknik destek ve gerektiğinde güncelleme hizmeti sunuyorum.',
  },
];

export default function Process() {
  return (
    <section className={`section ${styles.process}`} id="process">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.sectionTag}>Çalışma Süreci</div>
          <h2 className={styles.title}>Nasıl Çalışıyorum?</h2>
          <p className={styles.subtitle}>
            Şeffaf, organize ve sonuç odaklı bir süreç.
          </p>
        </div>

        <div className={styles.steps}>
          {steps.map((step, i) => (
            <div key={step.num} className={styles.step}>
              <div className={styles.stepLeft}>
                <div className={styles.numWrap}>
                  <span className={styles.num}>{step.num}</span>
                </div>
                {i < steps.length - 1 && <div className={styles.connector} />}
              </div>
              <div className={styles.stepRight}>
                <div className={styles.stepCard}>
                  <div className={styles.stepGlow} />
                  <span className={styles.stepIcon}>{step.icon}</span>
                  <div className={styles.stepContent}>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDesc}>{step.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
