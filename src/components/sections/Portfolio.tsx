'use client';
import { useState, useEffect, useRef } from 'react';
import { getProjects, type Project } from '@/lib/portfolioStore';
import styles from './Portfolio.module.css';
import { FolderOpen, Image as ImageIcon } from 'lucide-react';

const FILTERS = ['Hepsi', 'CRM', 'SaaS', 'Web App', 'Diğer'];

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('Hepsi');
  const [lightbox, setLightbox] = useState<{ imgs: string[]; idx: number } | null>(null);

  useEffect(() => {
    setProjects(getProjects());
    const onStorage = () => setProjects(getProjects());
    window.addEventListener('storage', onStorage);
    window.addEventListener('synthetix:projects-updated', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('synthetix:projects-updated', onStorage);
    };
  }, []);

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
    <section className={`section ${styles.portfolio}`} id="portfolio">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.sectionTag}>Portfolio</div>
          <h2 className={styles.title}>Projelerim</h2>
          <p className={styles.subtitle}>
            Geliştirdiğim yazılımlardan seçmeler. Her biri gerçek bir ihtiyaçtan doğdu.
          </p>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
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

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}><FolderOpen size={48} /></div>
            <p className={styles.emptyText}>Henüz proje eklenmemiş.</p>
            <p className={styles.emptyHint}>Admin panelinden proje ekleyebilirsin.</p>
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
