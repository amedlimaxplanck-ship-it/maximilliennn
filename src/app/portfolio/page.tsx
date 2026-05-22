'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { subscribeProjects, type Project } from '@/lib/portfolioStore';
import styles from '@/components/sections/Portfolio.module.css';
import { FolderOpen, Image as ImageIcon } from 'lucide-react';

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('Hepsi');
  const [lightbox, setLightbox] = useState<{ imgs: string[]; idx: number } | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeProjects((data) => {
      setProjects(data);
    });
    return () => unsubscribe();
  }, []);

  // Sadece ekli olan projelerin kategorilerini filtre butonu olarak göster (boş kalmaması için)
  const categoriesInUse = Array.from(new Set(projects.map((p) => p.category).filter(Boolean))) as string[];
  const FILTERS = ['Hepsi', ...categoriesInUse];

  const filtered = filter === 'Hepsi'
    ? projects
    : projects.filter((p) => p.category === filter);

  const openLightbox = (imgs: string[], idx: number) => setLightbox({ imgs, idx });
  const closeLightbox = () => setLightbox(null);

  const nextImg = () => {
    if (!lightbox) return;
    setLightbox({ ...lightbox, idx: (lightbox.idx + 1) % lightbox.imgs.length });
  };
  const prevImg = () => {
    if (!lightbox) return;
    setLightbox({ ...lightbox, idx: (lightbox.idx - 1 + lightbox.imgs.length) % lightbox.imgs.length });
  };

  return (
    <>
      <Header />
      <main style={{ minHeight: '100dvh', paddingTop: '100px' }}>
        <section className={`section ${styles.portfolio}`} style={{ paddingBottom: '120px' }}>
          <div className="container">
            <a href="/" className={styles.backLink}>
              ← Ana Sayfaya Dön
            </a>

            <div className={styles.header} style={{ textAlign: 'left', marginBottom: '40px' }}>
              <div className={styles.sectionTag}>Tüm Çalışmalarımız</div>
              <h1 className={styles.title} style={{ fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-1px' }}>
                Portfolyo
              </h1>
              <p className={styles.subtitle} style={{ margin: '0', maxWidth: '600px' }}>
                Geliştirdiğimiz tüm özgün çözümler ve dijital ürünler. Projeleri filtreleyerek inceleyebilirsiniz.
              </p>
            </div>

            {/* Dinamik Filtreler */}
            {projects.length > 0 && FILTERS.length > 1 && (
              <div className={styles.filters} style={{ justifyContent: 'flex-start', marginBottom: '32px' }}>
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}><FolderOpen size={48} /></div>
                <p className={styles.emptyText}>Bu kategoride henüz proje bulunmuyor.</p>
              </div>
            ) : (
              <div className={styles.grid}>
                {filtered.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onImageClick={(idx) => openLightbox(project.images, idx)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Lightbox */}
          {lightbox && (
            <div className={styles.lightbox} onClick={closeLightbox}>
              <button className={styles.lightboxClose} onClick={closeLightbox}>✕</button>
              <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                <img
                  src={lightbox.imgs[lightbox.idx]}
                  alt="Proje görseli"
                  className={styles.lightboxImg}
                />
                {lightbox.imgs.length > 1 && (
                  <>
                    <button className={`${styles.lightboxNav} ${styles.lightboxPrev}`} onClick={prevImg}>‹</button>
                    <button className={`${styles.lightboxNav} ${styles.lightboxNext}`} onClick={nextImg}>›</button>
                    <div className={styles.lightboxDots}>
                      {lightbox.imgs.map((_, i) => (
                        <button
                          key={i}
                          className={`${styles.lightboxDot} ${i === lightbox.idx ? styles.lightboxDotActive : ''}`}
                          onClick={() => setLightbox({ ...lightbox, idx: i })}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

function ProjectCard({ project, onImageClick }: { project: Project; onImageClick: (idx: number) => void }) {
  const [imgIdx, setImgIdx] = useState(0);

  return (
    <article className={styles.card}>
      {/* Image area */}
      <div className={styles.imageArea}>
        {project.images.length > 0 ? (
          <>
            <img
              src={project.images[imgIdx]}
              alt={project.title}
              className={styles.cardImg}
              onClick={() => onImageClick(imgIdx)}
            />
            {/* Thumbnails row */}
            {project.images.length > 1 && (
              <div className={styles.thumbRow}>
                {project.images.map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.thumb} ${i === imgIdx ? styles.thumbActive : ''}`}
                    onClick={() => setImgIdx(i)}
                  >
                    <img src={img} alt={`Görsel ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
            <button className={styles.expandBtn} onClick={() => onImageClick(imgIdx)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
              </svg>
            </button>
          </>
        ) : (
          <div className={styles.imagePlaceholder}>
            <ImageIcon size={40} />
          </div>
        )}

        {project.category && (
          <span className={styles.categoryBadge}>{project.category}</span>
        )}
      </div>

      {/* Info */}
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{project.title}</h3>
        {project.description && (
          <p className={styles.cardDesc}>{project.description}</p>
        )}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cardLink}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Projeyi Görüntüle
          </a>
        )}
      </div>
    </article>
  );
}
