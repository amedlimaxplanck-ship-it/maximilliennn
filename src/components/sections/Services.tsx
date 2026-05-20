import styles from './Services.module.css';

const services = [
  {
    icon: '🖥️',
    title: 'CRM Panel Geliştirme',
    desc: 'Müşteri ilişkilerini ve satış süreçlerini yönetmek için özel CRM sistemleri. Tam entegre, ölçeklenebilir.',
  },
  {
    icon: '📊',
    title: 'SaaS Dashboard',
    desc: 'Verilerinizi anlık takip edebileceğiniz, kullanıcı dostu SaaS panel ve dashboard çözümleri.',
  },
  {
    icon: '🔌',
    title: 'API & Backend',
    desc: 'RESTful ve GraphQL API geliştirme, üçüncü parti entegrasyonlar ve güçlü backend mimarileri.',
  },
  {
    icon: '🎨',
    title: 'UI/UX Tasarım',
    desc: 'Kullanıcı odaklı, modern arayüz tasarımları. Figma prototipler ve pixel-perfect kodlama.',
  },
  {
    icon: '⚙️',
    title: 'Kurumsal Yazılım',
    desc: 'İş süreçlerinize özel ERP, stok yönetimi, raporlama ve otomasyon sistemleri.',
  },
  {
    icon: '🚀',
    title: 'MVP Geliştirme',
    desc: 'Fikrinizi hızla pazara çıkarın. Hızlı prototipleme ve minimum viable product geliştirme.',
  },
];

export default function Services() {
  return (
    <section className={`section ${styles.services}`} id="services">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.sectionTag}>Hizmetler</div>
          <h2 className={styles.title}>
            Ne Yapıyorum?
          </h2>
          <p className={styles.subtitle}>
            Yazılım projelerinizin her aşamasında yanınızda oluyorum —
            fikirden ürüne kadar.
          </p>
        </div>

        <div className={styles.grid}>
          {services.map((s, i) => (
            <div key={s.title} className={styles.card} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className={styles.cardGlow} />
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
          ))}
        </div>
      </div>
    </section>
  );
}
