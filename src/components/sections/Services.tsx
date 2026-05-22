import styles from './Services.module.css';
import { Monitor, BarChart, Plug, Palette, Settings, Rocket } from 'lucide-react';

const services = [
  {
    icon: <Monitor size={24} />,
    title: 'CRM Panel Geliştirme',
    desc: 'Müşteri ilişkilerini ve satış süreclerini yönetmek için özel CRM sistemleri. Tam entegre, ölçeklenebilir.',
    image: '/service-crm.png',
  },
  {
    icon: <BarChart size={24} />,
    title: 'SaaS Dashboard',
    desc: 'Verilerinizi anlık takip edebileceğiniz, kullanıcı dostu SaaS panel ve dashboard çözümleri.',
    image: '/service-saas.png',
  },
  {
    icon: <Plug size={24} />,
    title: 'API & Backend',
    desc: 'RESTful ve GraphQL API geliştirme, üçüncü parti entegrasyonlar ve güçlü backend mimarileri.',
    image: '/service-api.png',
  },
  {
    icon: <Palette size={24} />,
    title: 'UI/UX Tasarım',
    desc: 'Kullanıcı odaklı, modern arayüz tasarımları. Figma prototipler ve pixel-perfect kodlama.',
    image: '/service-uiux.png',
  },
  {
    icon: <Settings size={24} />,
    title: 'Kurumsal Yazılım',
    desc: 'İş süreçlerinize özel ERP, stok yönetimi, raporlama ve otomasyon sistemleri.',
    image: '/service-enterprise.png',
  },
  {
    icon: <Rocket size={24} />,
    title: 'MVP Geliştirme',
    desc: 'Fikrinizi hızla pazara çıkarın. Hızlı prototipleme ve minimum viable product geliştirme.',
    image: '/service-mvp.png',
  },
];

export default function Services() {
  return (
    <section className={`section ${styles.services}`} id="services">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.sectionTag}>Hizmetler</div>
          <h2 className={styles.title}>
            Hizmet Alanları
          </h2>
          <p className={styles.subtitle}>
            Yazılım projelerinin her aşamasında profesyonel destek sunulmaktadır —
            fikirden ürüne kadar.
          </p>
        </div>

        <div className={styles.grid}>
          {services.map((s, i) => (
            <div key={s.title} className={styles.card} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className={styles.cardGlow} />
              <div className={styles.cardImageWrap}>
                <img src={s.image} alt={s.title} className={styles.cardImage} loading="lazy" />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.iconWrap}>
                  <span className={styles.icon}>{s.icon}</span>
                </div>
                <h3 className={styles.cardTitle}>{s.title}</h3>
                <p className={styles.cardDesc}>{s.desc}</p>
                <div className={styles.cardArrow}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
