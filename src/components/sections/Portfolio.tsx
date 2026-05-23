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
  
  // Drag states and refs for continuous gesture tracking
  const [dragProgress, setDragProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const dragProgressRef = useRef(0);
  const nextCardRef = useRef<() => void>(() => {});
  const prevCardRef = useRef<() => void>(() => {});

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

  // Keep callback refs updated to prevent stale closures in event listeners
  useEffect(() => {
    nextCardRef.current = nextCard;
    prevCardRef.current = prevCard;
  });

  // Track if screen is mobile to apply mobile-optimized 3D transform metrics
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Event listeners for tracking continuous touch gesture on mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientX;
      dragProgressRef.current = 0;
      setIsDragging(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartRef.current !== null) {
        const currentX = e.touches[0].clientX;
        const diffX = currentX - touchStartRef.current;
        const containerWidth = container.offsetWidth || 300;
        
        // Convert pixel drag to progress ratio (clamped between -1.1 and 1.1)
        const progress = Math.max(-1.1, Math.min(1.1, diffX / (containerWidth * 0.5)));
        dragProgressRef.current = progress;
        setDragProgress(progress);

        // Prevent vertical scrolling if swipe is primarily horizontal
        if (Math.abs(diffX) > 8) {
          if (e.cancelable) {
            e.preventDefault();
          }
        }
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      const progress = dragProgressRef.current;
      
      dragProgressRef.current = 0;
      setDragProgress(0);

      const swipeThreshold = 0.25;
      if (progress < -swipeThreshold) {
        nextCardRef.current();
      } else if (progress > swipeThreshold) {
        prevCardRef.current();
      }

      touchStartRef.current = null;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const getCardStyle = (index: number) => {
    const total = displayedProjects.length;
    if (total === 0) return {};
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

    // Add continuous drag progress to normal diff
    let pos = diff + dragProgress;
    if (pos < -1.5) pos += total;
    if (pos > 1.5) pos -= total;

    const absPos = Math.abs(pos);

    // Apply mobile-optimized limits
    const maxTranslateX = isMobile ? 18 : 32; // percent
    const maxTranslateZ = isMobile ? -120 : -150; // px
    const maxRotateY = isMobile ? -25 : -30; // deg
    const maxScale = isMobile ? 0.8 : 0.82; // target scale

    let zIndex = 1;
    let opacity = 0.45;
    let scale = maxScale;
    let translateX = 0;
    let translateZ = maxTranslateZ;
    let rotateY = 0;

    // Center card gets higher z-index dynamically
    if (absPos < 0.5) {
      zIndex = 3;
    } else {
      zIndex = 1;
    }

    // Interpolate values continuously based on pos
    if (absPos <= 1) {
      opacity = 1 - absPos * (1 - 0.45);
      scale = 1 - absPos * (1 - maxScale);
      translateX = pos * maxTranslateX;
      translateZ = absPos * maxTranslateZ;
      rotateY = pos * maxRotateY;
    } else {
      const d = absPos - 1; // 0 to 0.5
      const progressToOut = d / 0.5; // 0 to 1
      opacity = 0.45 * (1 - progressToOut);
      scale = maxScale - progressToOut * (maxScale - 0.7);
      
      const fromX = (pos > 0 ? 1 : -1) * maxTranslateX;
      translateX = fromX * (1 - progressToOut);
      translateZ = maxTranslateZ - progressToOut * 50;
      rotateY = (pos > 0 ? 1 : -1) * maxRotateY * (1 - progressToOut);
    }

    const transition = isDragging 
      ? 'none' 
      : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1)';

    return {
      transform: `rotateY(${rotateY}deg) translate3d(${translateX}%, 0, ${translateZ}px) scale(${scale})`,
      opacity: Math.max(0, Math.min(1, opacity)),
      zIndex,
      transition,
      cursor: diff === 0 ? 'default' : 'pointer',
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
