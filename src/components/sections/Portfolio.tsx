'use client';
import { useState, useEffect, useRef } from 'react';
import { subscribeProjects, type Project } from '@/lib/portfolioStore';
import styles from './Portfolio.module.css';
import { FolderOpen, Image as ImageIcon } from 'lucide-react';

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState<{ imgs: string[]; idx: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeProjects((data) => {
      setProjects(data);
      setActiveIndex(0);
    });
    return () => unsubscribe();
  }, []);

  const displayedProjects = projects.slice(0, 3);

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % displayedProjects.length);
  };

  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + displayedProjects.length) % displayedProjects.length);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientX;
      touchEndRef.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartRef.current !== null) {
        const currentX = e.touches[0].clientX;
        const diffX = Math.abs(touchStartRef.current - currentX);
        touchEndRef.current = currentX;
        // If movement is horizontal, prevent page scroll
        if (diffX > 8) {
          if (e.cancelable) {
            e.preventDefault();
          }
        }
      }
    };

    const handleTouchEnd = () => {
      const start = touchStartRef.current;
      const end = touchEndRef.current;
      if (start !== null && end !== null) {
        const distance = start - end;
        const minSwipeDistance = 50;
        if (distance > minSwipeDistance) {
          nextCard();
        } else if (distance < -minSwipeDistance) {
          prevCard();
        }
      }
      touchStartRef.current = null;
      touchEndRef.current = null;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [displayedProjects.length]);

  const getCardStyle = (index: number) => {
    const total = displayedProjects.length;
    if (total === 1) {
      return {
        transform: 'none',
        opacity: 1,
        zIndex: 2,
      };
    }

    let diff = index - activeIndex;

    // Normalise loop diff
    if (diff < -1) diff += total;
    if (diff > 1) diff -= total;

    if (diff === 0) {
      return {
        transform: 'rotateY(0deg) translate3d(0, 0, 0) scale(1)',
        opacity: 1,
        zIndex: 3,
        cursor: 'default',
      };
    } else if (diff === 1) {
      return {
        transform: 'var(--carousel-right-transform, rotateY(-30deg) translate3d(32%, 0, -100px) scale(0.85))',
        opacity: 0.45,
        zIndex: 1,
        cursor: 'pointer',
      };
    } else if (diff === -1) {
      return {
        transform: 'var(--carousel-left-transform, rotateY(30deg) translate3d(-32%, 0, -100px) scale(0.85))',
        opacity: 0.45,
        zIndex: 1,
        cursor: 'pointer',
      };
    }

    return {
      transform: 'translate3d(0, 0, -200px) scale(0.7)',
      opacity: 0,
      zIndex: 0,
    };
  };

  const handleCardClick = (e: React.MouseEvent, index: number) => {
    if (index !== activeIndex) {
      e.preventDefault();
      e.stopPropagation();
      setActiveIndex(index);
    }
  };

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
          <h2 className={styles.title}>Projeler</h2>
          <p className={styles.subtitle}>
            Geliştirilen yazılım çözümlerinden seçmeler. Her biri gerçek bir ihtiyaca yönelik tasarlandı.
          </p>
        </div>

        {/* Carousel / Card List */}
        {displayedProjects.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}><FolderOpen size={48} /></div>
            <p className={styles.emptyText}>Henüz proje eklenmemiş.</p>
            <p className={styles.emptyHint}>Admin panelinden proje ekleyebilirsin.</p>
          </div>
        ) : (
          <>
            <div
              ref={containerRef}
              className={styles.carouselContainer}
            >
              {displayedProjects.map((project, idx) => (
                <div
                  key={project.id}
                  className={`${styles.carouselCardWrapper} ${idx === activeIndex ? styles.carouselActiveCard : ''}`}
                  style={getCardStyle(idx)}
                  onClickCapture={(e) => handleCardClick(e, idx)}
                >
                  <ProjectCard
                    project={project}
                    onImageClick={(imgIdx) => openLightbox(project.images, imgIdx)}
                  />
                </div>
              ))}

              {displayedProjects.length > 1 && (
                <div className={styles.carouselNav}>
                  <button className={styles.navArrow} onClick={prevCard}>‹</button>
                  <button className={styles.navArrow} onClick={nextCard}>›</button>
                </div>
              )}
            </div>

            {projects.length > 3 && (
              <div className={styles.moreContainer}>
                <a href="/portfolio" className="btn btn-outline">
                  Tüm Projeleri Gör →
                </a>
              </div>
            )}
          </>
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
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const isLong = project.description && project.description.length > 120;

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
          <>
            <p className={`${styles.cardDesc} ${isDescExpanded ? styles.cardDescExpanded : ''}`}>
              {project.description}
            </p>
            {isLong && (
              <button
                type="button"
                className={styles.readMoreBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDescExpanded(!isDescExpanded);
                }}
              >
                {isDescExpanded ? 'Daha Az' : 'Daha Fazla...'}
              </button>
            )}
          </>
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
