import styles from './Process.module.css';
import { Search, PenTool, Zap, Rocket } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: <Search size={24} />,
    title: 'Keşif & Analiz',
    desc: 'İhtiyaçlar, hedefler ve mevcut iş süreçleri derinlemesine analiz edilerek projenin kapsamı netleştirilir.',
  },
  {
    num: '02',
    icon: <PenTool size={24} />,
    title: 'Tasarım & Prototip',
    desc: 'Figma ile modern ve interaktif prototipler hazırlanır. Onay sonrasında geliştirme aşamasına geçiş sağlanır.',
  },
  {
    num: '03',
    icon: <Zap size={24} />,
    title: 'Geliştirme',
    desc: 'Temiz, ölçeklenebilir ve bakımı kolay kodlama standartları uygulanır. Düzenli güncellemeler ile süreç şeffaf olarak raporlanır.',
  },
  {
    num: '04',
    icon: <Rocket size={24} />,
    title: 'Teslim & Destek',
    desc: 'Proje başarıyla canlıya alınır. Teslimat sonrası teknik destek ve ihtiyaçlar doğrultusunda güncelleme hizmetleri sunulmaktadır.',
  },
];

export default function Process() {
  return (
    <section className={`section ${styles.process}`} id="process">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.sectionTag}>Çalışma Süreci</div>
          <h2 className={styles.title}>İşleyiş Süreci</h2>
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
