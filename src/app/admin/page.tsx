'use client';
import { useState, useEffect, useRef } from 'react';
import { getProjects, saveProject, deleteProject, updateProject, type Project } from '@/lib/portfolioStore';
import styles from './admin.module.css';
import { Pencil, Plus, FolderOpen, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

const PASSWORD = 'synthetix2024';
const CATEGORIES = ['CRM', 'SaaS', 'Web App', 'Diğer'];
const MAX_IMAGES = 3;
const MAX_FILE_MB = 4;

/* ─── IMAGE NOTE ────────────────────────────────────────────────
  📐 Önerilen Görsel Boyutu:
  • En-boy oranı: 16:9 (örneğin 1280×720 px veya 1920×1080 px)
  • Minimum: 800×450 px
  • Maksimum dosya boyutu: 4 MB
  • Format: JPG veya PNG
  • Mobil ve masaüstünde en iyi görünüm için bu orana sadık kalın.
  • Farklı boyutlardaki görseller otomatik kırpılır (object-fit: cover).
──────────────────────────────────────────────────────────────── */

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', link: '', category: '', images: [] as string[] });
  const [imgPreviews, setImgPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = () => setProjects(getProjects());

  useEffect(() => {
    if (authed) refresh();
  }, [authed]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === PASSWORD) { setAuthed(true); setPwError(false); }
    else { setPwError(true); }
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

    for (const file of toProcess) {
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        showToast(`"${file.name}" çok büyük — max ${MAX_FILE_MB}MB.`);
        continue;
      }
      const b64 = await toBase64(file);
      results.push(b64);
    }

    setForm((f) => ({ ...f, images: [...f.images, ...results].slice(0, MAX_IMAGES) }));
    setImgPreviews((p) => [...p, ...results].slice(0, MAX_IMAGES));
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeImage = (idx: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
    setImgPreviews((p) => p.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    const data = { title: form.title.trim(), description: form.description.trim(), link: form.link.trim(), category: form.category, images: form.images };
    if (editingId) {
      updateProject(editingId, data);
      showToast('Proje güncellendi ✓');
    } else {
      saveProject(data);
      showToast('Proje eklendi ✓');
    }
    window.dispatchEvent(new Event('synthetix:projects-updated'));
    refresh();
    resetForm();
    setSaving(false);
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    window.dispatchEvent(new Event('synthetix:projects-updated'));
    refresh();
    setDeleteConfirm(null);
    showToast('Proje silindi.');
  };

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
              type="password"
              className={`${styles.input} ${pwError ? styles.inputError : ''}`}
              placeholder="Şifre"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setPwError(false); }}
              autoFocus
            />
            {pwError && <span className={styles.errorMsg}>Yanlış şifre.</span>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Giriş
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
          <a href="/" className="btn btn-outline" style={{ fontSize: '14px', padding: '8px 18px' }}>← Siteye Dön</a>
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
