'use client';
import { useState, useEffect, useRef } from 'react';
import { subscribeProjects, saveProject, deleteProject, updateProject, type Project, getTelegramSettings, saveTelegramSettings } from '@/lib/portfolioStore';
import styles from './admin.module.css';
import { Pencil, Plus, FolderOpen, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const CATEGORIES = ['CRM', 'SaaS', 'Web App', 'Diğer'];
const MAX_IMAGES = 3;
const MAX_FILE_MB = 10; // Sıkıştıracağımız için başlangıç limitini yüksek tutabiliriz

/* ─── IMAGE NOTE ────────────────────────────────────────────────
  📐 Önerilen Görsel Boyutu:
  • En-boy oranı: 16:9 (örneğin 1280×720 px veya 1920×1080 px)
  • Minimum: 800×450 px
  • Format: JPG veya PNG
  • Mobil ve masaüstünde en iyi görünüm için bu orana sadık kalın.
  • Resimler otomatik olarak client tarafında sıkıştırılarak veritabanına kaydedilir.
──────────────────────────────────────────────────────────────── */

// HTML Canvas kullanarak görseli sıkıştırır ve yeniden boyutlandırır (maks 1000px genişlik/yükseklik, 0.75 kalite)
function compressImage(file: File, maxWidth = 1000, maxHeight = 1000, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', link: '', category: '', images: [] as string[] });
  const [imgPreviews, setImgPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Telegram state
  const [tgToken, setTgToken] = useState('');
  const [tgChatId, setTgChatId] = useState('');
  const [tgSaving, setTgSaving] = useState(false);

  // Oturum durumunu dinle
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setAuthed(true);
      } else {
        setAuthed(false);
      }
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // Projeleri dinle (Sadece oturum açıkken)
  useEffect(() => {
    if (!authed) return;
    const unsubscribeProjects = subscribeProjects((data) => {
      setProjects(data);
    });
    return () => unsubscribeProjects();
  }, [authed]);

  // Telegram ayarlarını yükle (Sadece oturum açıkken)
  useEffect(() => {
    if (!authed) return;
    async function loadTelegramSettings() {
      try {
        const settings = await getTelegramSettings();
        if (settings) {
          setTgToken(settings.token || '');
          setTgChatId(settings.chatId || '');
        }
      } catch (err) {
        console.error('Telegram ayarları yüklenirken hata oluştu:', err);
      }
    }
    loadTelegramSettings();
  }, [authed]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSaving(true);

    let loginEmail = email.trim();
    if (!loginEmail) {
      setSaving(false);
      return;
    }

    // E-posta formatında değilse arkada otomatik olarak @gmail.com uzantısını ekliyoruz (kullanıcı adı girişi kolaylığı)
    if (!loginEmail.includes('@')) {
      loginEmail = `${loginEmail}@gmail.com`;
    }

    try {
      await signInWithEmailAndPassword(auth, loginEmail, pw);
      setPw('');
      setErrorMsg('');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setErrorMsg('Hatalı kullanıcı adı veya şifre.');
      } else {
        setErrorMsg('Giriş başarısız oldu. Lütfen tekrar deneyin.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showToast('Oturum kapatıldı.');
    } catch (err) {
      console.error(err);
      showToast('Çıkış yapılırken hata oluştu.');
    }
  };

  const handleTgSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setTgSaving(true);
    try {
      await saveTelegramSettings(tgToken.trim(), tgChatId.trim());
      showToast('Telegram ayarları kaydedildi ✓');
    } catch (err) {
      console.error(err);
      showToast('Telegram ayarları kaydedilirken hata oluştu!');
    } finally {
      setTgSaving(false);
    }
  };

  const resetForm = () => {
    setForm({ title: '', description: '', link: '', category: '', images: [] });
    setImgPreviews([]);
    setEditingId(null);
  };

  const handleEdit = (p: Project) => {
    setForm({ title: p.title, description: p.description, link: p.link || '', category: p.category || '', images: p.images });
    setImgPreviews(p.images);
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_IMAGES - form.images.length;
    const toProcess = files.slice(0, remaining);
    const results: string[] = [];

    showToast('Görseller optimize ediliyor...');
    
    for (const file of toProcess) {
      try {
        const compressedB64 = await compressImage(file);
        results.push(compressedB64);
      } catch (err) {
        console.error(err);
        showToast(`"${file.name}" sıkıştırılamadı.`);
      }
    }

    setForm((f) => ({ ...f, images: [...f.images, ...results].slice(0, MAX_IMAGES) }));
    setImgPreviews((p) => [...p, ...results].slice(0, MAX_IMAGES));
    if (fileRef.current) fileRef.current.value = '';
    showToast('Görseller başarıyla eklendi ✓');
  };

  const removeImage = (idx: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
    setImgPreviews((p) => p.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    
    try {
      const data = { title: form.title.trim(), description: form.description.trim(), link: form.link.trim(), category: form.category, images: form.images };
      if (editingId) {
        await updateProject(editingId, data);
        showToast('Proje güncellendi ✓');
      } else {
        await saveProject(data);
        showToast('Proje eklendi ✓');
      }
      resetForm();
    } catch (err) {
      console.error(err);
      showToast('Kaydedilirken hata oluştu!');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      setDeleteConfirm(null);
      showToast('Proje silindi.');
    } catch (err) {
      console.error(err);
      showToast('Silinirken hata oluştu!');
    }
  };

  /* ─── LOADING SCREEN ── */
  if (loading) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginCard} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <span className={styles.loginLogoText}>Yükleniyor...</span>
        </div>
      </div>
    );
  }

  /* ─── LOGIN SCREEN ── */
  if (!authed) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <div className={styles.loginLogo}>
            <span className={styles.loginLogoMark}>S</span>
            <span className={styles.loginLogoText}>Admin Panel</span>
          </div>
          <h1 className={styles.loginTitle}>Giriş Yap</h1>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <input
              type="text"
              className={`${styles.input} ${errorMsg ? styles.inputError : ''}`}
              placeholder="Kullanıcı Adı veya E-posta"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
              autoFocus
              required
            />
            <input
              type="password"
              className={`${styles.input} ${errorMsg ? styles.inputError : ''}`}
              placeholder="Şifre"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setErrorMsg(''); }}
              required
            />
            {errorMsg && <span className={styles.errorMsg}>{errorMsg}</span>}
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
              {saving ? 'Giriş Yapılıyor...' : 'Giriş'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ─── ADMIN SCREEN ── */
  return (
    <div className={styles.adminPage}>
      {toast && <div className={styles.toast}>{toast}</div>}

      {/* Header */}
      <div className={styles.adminHeader}>
        <div className={styles.adminHeaderInner}>
          <div className={styles.adminBrand}>
            <span className={styles.loginLogoMark}>S</span>
            <span className={styles.adminTitle}>Portfolio Admin</span>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="/" className="btn btn-outline" style={{ fontSize: '14px', padding: '8px 18px' }}>← Siteye Dön</a>
            <button onClick={handleLogout} className="btn btn-outline" style={{ fontSize: '14px', padding: '8px 18px', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#ef4444' }}>Çıkış Yap</button>
          </div>
        </div>
      </div>

      <div className={styles.adminBody}>
        {/* ── FORM ── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {editingId ? <><Pencil size={20} /> Projeyi Düzenle</> : <><Plus size={20} /> Yeni Proje Ekle</>}
          </h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.field}>
                <label className={styles.label}>Proje Adı *</label>
                <input
                  className={styles.input}
                  placeholder="Proje adı"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Kategori</label>
                <select
                  className={styles.input}
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  <option value="">Seçiniz</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Proje Linki (opsiyonel)</label>
              <input
                className={styles.input}
                type="url"
                placeholder="https://..."
                value={form.link}
                onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Hakkında</label>
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                placeholder="Proje hakkında kısa açıklama..."
                rows={4}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>

            {/* Image upload */}
            <div className={styles.field}>
              <label className={styles.label}>
                Görseller ({form.images.length}/{MAX_IMAGES})
              </label>
              <div className={styles.imageNote}>
                📐 <strong>Önerilen boyut:</strong> 1280×720 px — 16:9 oran, JPG/PNG, maks {MAX_FILE_MB}MB. 
                Farklı boyutlar otomatik kırpılır; estetik için orana dikkat edin.
              </div>
              <div className={styles.imagePreviews}>
                {imgPreviews.map((src, i) => (
                  <div key={i} className={styles.previewItem}>
                    <img src={src} alt={`Görsel ${i + 1}`} className={styles.previewImg} />
                    <button
                      type="button"
                      className={styles.removeImg}
                      onClick={() => removeImage(i)}
                    >✕</button>
                    <span className={styles.previewNum}>{i + 1}</span>
                  </div>
                ))}
                {form.images.length < MAX_IMAGES && (
                  <button
                    type="button"
                    className={styles.addImageBtn}
                    onClick={() => fileRef.current?.click()}
                  >
                    <span className={styles.addImageIcon}>+</span>
                    <span>Görsel Ekle</span>
                  </button>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
            </div>

            <div className={styles.formActions}>
              {editingId && (
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  İptal
                </button>
              )}
              <button type="submit" className="btn btn-primary" disabled={saving} style={{ minWidth: 140 }}>
                {saving ? 'Kaydediliyor...' : editingId ? 'Güncelle' : 'Projeyi Kaydet'}
              </button>
            </div>
          </form>
        </section>

        {/* ── TELEGRAM SETTINGS ── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Telegram Bildirim Ayarları
          </h2>
          <form onSubmit={handleTgSave} className={styles.form}>
            <div className={styles.imageNote}>
              💬 Sitedeki iletişim formu doldurulduğunda bu Telegram botuna anlık bildirim gidecektir.
            </div>
            <div className={styles.formRow}>
              <div className={styles.field}>
                <label className={styles.label}>Telegram Bot Token</label>
                <input
                  className={styles.input}
                  placeholder="Bot Token (örn: 123456789:ABCdef...)"
                  value={tgToken}
                  onChange={(e) => setTgToken(e.target.value)}
                  type="password"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Telegram Chat ID</label>
                <input
                  className={styles.input}
                  placeholder="Chat ID (örn: 987654321)"
                  value={tgChatId}
                  onChange={(e) => setTgChatId(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.formActions}>
              <button type="submit" className="btn btn-primary" disabled={tgSaving} style={{ minWidth: 140 }}>
                {tgSaving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
              </button>
            </div>
          </form>
        </section>

        {/* ── PROJECTS LIST ── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderOpen size={20} /> Mevcut Projeler ({projects.length})
          </h2>

          {projects.length === 0 ? (
            <div className={styles.emptyList}>Henüz proje eklenmedi.</div>
          ) : (
            <div className={styles.projectList}>
              {projects.map((p) => (
                <div key={p.id} className={styles.projectItem}>
                  <div className={styles.projectThumb}>
                    {p.images[0]
                      ? <img src={p.images[0]} alt={p.title} />
                      : <ImageIcon size={20} className="text-gray-500" />
                    }
                    {p.images.length > 1 && (
                      <span className={styles.imgCount}>+{p.images.length - 1}</span>
                    )}
                  </div>
                  <div className={styles.projectInfo}>
                    <span className={styles.projectName}>{p.title}</span>
                    {p.category && <span className={styles.projectCat}>{p.category}</span>}
                    {p.description && (
                      <span className={styles.projectDesc}>{p.description.slice(0, 80)}{p.description.length > 80 ? '...' : ''}</span>
                    )}
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noopener noreferrer" className={styles.projectLink} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <LinkIcon size={12} /> {p.link.replace(/^https?:\/\//, '').slice(0, 40)}
                      </a>
                    )}
                  </div>
                  <div className={styles.projectActions}>
                    <button className={styles.editBtn} onClick={() => handleEdit(p)}>Düzenle</button>
                    {deleteConfirm === p.id ? (
                      <div className={styles.confirmDelete}>
                        <span>Emin misin?</span>
                        <button className={styles.confirmYes} onClick={() => handleDelete(p.id)}>Evet</button>
                        <button className={styles.confirmNo} onClick={() => setDeleteConfirm(null)}>Hayır</button>
                      </div>
                    ) : (
                      <button className={styles.deleteBtn} onClick={() => setDeleteConfirm(p.id)}>Sil</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
