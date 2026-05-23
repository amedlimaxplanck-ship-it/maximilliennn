'use client';
import { useState } from 'react';
import styles from './Contact.module.css';
import { Zap, Globe, MessageCircle, CheckCircle, Mail, Phone, Instagram } from 'lucide-react';

const PROJECT_TYPES = [
  'CRM Panel', 'SaaS Dashboard', 'API Geliştirme',
  'Web Uygulaması', 'MVP', 'Diğer',
];

export default function Contact() {
  const [contactMethod, setContactMethod] = useState<'email' | 'whatsapp' | 'instagram'>('email');
  const [form, setForm] = useState({
    name: '', contactValue: '', type: '', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.contactValue || !form.message) return;
    setStatus('sending');
    try {
      const payload = {
        name: form.name,
        contactMethod,
        contactValue: form.contactValue,
        type: form.type,
        message: form.message,
      };
      const response = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setStatus('sent');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section className={`section ${styles.contact}`} id="contact">
      <div className="container">
        <div className={styles.inner}>
          {/* Left */}
          <div className={styles.left}>
            <div className={styles.sectionTag}>İletişim</div>
            <h2 className={styles.title}>
              Projenizi hayata<br />
              <span className="gradient-text">geçirelim</span>
            </h2>
            <p className={styles.desc}>
              Yeni bir proje mi başlatmak istiyorsunuz? Mevcut sisteminizi geliştirmek mi
              istiyorsunuz? Her türlü soru ve proje teklifleri için iletişime geçilebilir.
            </p>

            <div className={styles.infoCards}>
              <div className={styles.infoCard}>
                <span className={styles.infoIcon}><Zap size={22} /></span>
                <div>
                  <span className={styles.infoLabel}>Yanıt Süresi</span>
                  <span className={styles.infoValue}>24 saat içinde</span>
                </div>
              </div>
              <div className={styles.infoCard}>
                <span className={styles.infoIcon}><Globe size={22} /></span>
                <div>
                  <span className={styles.infoLabel}>Çalışma Bölgesi</span>
                  <span className={styles.infoValue}>Türkiye & Global</span>
                </div>
              </div>
              <div className={styles.infoCard}>
                <span className={styles.infoIcon}><MessageCircle size={22} /></span>
                <div>
                  <span className={styles.infoLabel}>Dil</span>
                  <span className={styles.infoValue}>Türkçe & English</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className={styles.right}>
            <div className={styles.formCard}>
              <div className={styles.formGlow} />
              {status === 'sent' ? (
                <div className={styles.successState}>
                  <div className={styles.successIcon}><CheckCircle size={56} className="text-green-500" /></div>
                  <h3 className={styles.successTitle}>Mesajınız iletildi!</h3>
                  <p className={styles.successDesc}>
                    En kısa sürede geri dönüş sağlanacaktır. Teşekkür ederiz!
                  </p>
                  <button className="btn btn-outline" onClick={() => { setStatus('idle'); setForm({ name: '', contactValue: '', type: '', message: '' }); setContactMethod('email'); }}>
                    Yeni Mesaj
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="contact-name">Adınız Soyadınız *</label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        className={styles.input}
                        placeholder="Adınız Soyadınız"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>İletişim Tercihi *</label>
                      <div className={styles.methodSelector}>
                        <button
                          type="button"
                          className={`${styles.methodBtn} ${contactMethod === 'email' ? styles.methodActive : ''}`}
                          onClick={() => { setContactMethod('email'); setForm(f => ({ ...f, contactValue: '' })); }}
                        >
                          <Mail size={15} />
                          <span>E-posta</span>
                        </button>
                        <button
                          type="button"
                          className={`${styles.methodBtn} ${contactMethod === 'whatsapp' ? styles.methodActive : ''}`}
                          onClick={() => { setContactMethod('whatsapp'); setForm(f => ({ ...f, contactValue: '' })); }}
                        >
                          <Phone size={15} />
                          <span>WhatsApp</span>
                        </button>
                        <button
                          type="button"
                          className={`${styles.methodBtn} ${contactMethod === 'instagram' ? styles.methodActive : ''}`}
                          onClick={() => { setContactMethod('instagram'); setForm(f => ({ ...f, contactValue: '' })); }}
                        >
                          <Instagram size={15} />
                          <span>Instagram</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="contact-value">
                      {contactMethod === 'email' && 'E-posta Adresiniz *'}
                      {contactMethod === 'whatsapp' && 'WhatsApp Telefon Numaranız *'}
                      {contactMethod === 'instagram' && 'Instagram Kullanıcı Adınız *'}
                    </label>
                    <input
                      id="contact-value"
                      name="contactValue"
                      type={contactMethod === 'email' ? 'email' : contactMethod === 'whatsapp' ? 'tel' : 'text'}
                      className={styles.input}
                      placeholder={
                        contactMethod === 'email' ? 'ornek@mail.com' :
                        contactMethod === 'whatsapp' ? '+90 5xx xxx xx xx' :
                        '@kullaniciadi'
                      }
                      value={form.contactValue}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="contact-type">Proje Türü</label>
                    <select
                      id="contact-type"
                      name="type"
                      className={styles.input}
                      value={form.type}
                      onChange={handleChange}
                    >
                      <option value="">Seçiniz</option>
                      {PROJECT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="contact-message">Mesajınız</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      className={`${styles.input} ${styles.textarea}`}
                      placeholder="Projeniz hakkında kısaca bilgi verin..."
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      required
                    />
                  </div>

                  {status === 'error' && (
                    <span className={styles.errorMsg}>
                      Mesaj gönderilemedi. Lütfen ayarları kontrol edin ve tekrar deneyin.
                    </span>
                  )}

                  <button
                    type="submit"
                    className={`btn btn-primary ${styles.submitBtn}`}
                    disabled={status === 'sending'}
                    id="contact-submit"
                  >
                    {status === 'sending' ? (
                      <>
                        <span className={styles.spinner} />
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        Mesaj Gönder
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"/>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
