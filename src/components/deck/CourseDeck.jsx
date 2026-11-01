import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CourseCard } from "./CourseCard.jsx";
import { CourseSearch } from "./CourseSearch.jsx";

function wrapIndex(index, length) {
  return length ? (index + length) % length : 0;
}

export function CourseDeck({ courses, isLoading, error, onOpenCourse, onOpenSearchMaterial, interactionEnabled = true, isAdmin = false, onAddCourse, onEditCourse, onDeleteCourse }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const [query, setQuery] = useState("");
  const suppressTap = useRef(false);
  const reduceMotion = useReducedMotion();
  const count = courses.length;

  useEffect(() => {
    if (activeIndex >= count && count) setActiveIndex(0);
  }, [activeIndex, count]);

  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", updateViewportWidth);
    return () => window.removeEventListener("resize", updateViewportWidth);
  }, []);

  useEffect(() => {
    function handleArrow(event) {
      if (!interactionEnabled) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (event.target instanceof HTMLElement && event.target.closest("input, textarea, select, [contenteditable='true']")) return;
      if (!count) return;
      event.preventDefault();
      setActiveIndex((index) => wrapIndex(index + (event.key === "ArrowRight" ? 1 : -1), count));
    }

    window.addEventListener("keydown", handleArrow);
    return () => window.removeEventListener("keydown", handleArrow);
  }, [count, interactionEnabled]);

  function move(direction) {
    if (interactionEnabled && count > 1) setActiveIndex((index) => wrapIndex(index + direction, count));
  }

  function getPosition(index) {
    let depth = index - activeIndex;
    if (depth > count / 2) depth -= count;
    if (depth < -count / 2) depth += count;
    return {
      depth,
      offset: depth * (viewportWidth < 640 ? 74 : 136),
      scale: 1 - Math.abs(depth) * 0.075,
      rotate: depth === 0 ? 0 : depth * (depth > 0 ? 2 : -2),
    };
  }

  return (
    <section className="site-section deck-scene" id="deck" aria-labelledby="deck-title">
      <div className="section-inner deck-inner">
        <div className="section-heading deck-heading">
          <div>
            <h2 id="deck-title">Pilih mata kuliah</h2>
          </div>
          <p>Buka folder untuk melihat materi yang tersedia.</p>
          {isAdmin && <button type="button" className="admin-text-button" onClick={onAddCourse}>Tambah mata kuliah</button>}
        </div>
        {!isLoading && !error && count > 0 && (
          <CourseSearch
            value={query}
            onChange={setQuery}
            onOpenCourse={onOpenCourse}
            onOpenMaterial={onOpenSearchMaterial}
          />
        )}
        <div className="deck-stage" aria-label="Tumpukan kartu mata kuliah">
          {isLoading ? (
            <div className="deck-loading" role="status">Memuat mata kuliah…</div>
          ) : error ? (
            <div className="deck-empty deck-error" role="alert">Mata kuliah belum bisa dimuat. Coba muat ulang halaman.</div>
          ) : count === 0 ? (
            <div className="deck-empty">
              <strong>Belum ada mata kuliah</strong>
              <p>Folder mata kuliah akan tampil di sini setelah tersedia.</p>
              {isAdmin && <button type="button" className="button-primary" onClick={onAddCourse}>Tambah mata kuliah</button>}
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {courses.map((course, index) => {
                const position = getPosition(index);
                if (Math.abs(position.depth) > 2) return null;
                return (
                  <CourseCard
                    key={course.id}
                    course={course}
                    position={position}
                    layoutId={`course-card-${course.id}`}
                    interactionEnabled={interactionEnabled}
                    onOpen={() => {
                      if (suppressTap.current) {
                        suppressTap.current = false;
                        return;
                      }
                      onOpenCourse(course.id);
                    }}
                    onPointerDown={() => { suppressTap.current = false; }}
                    onDragEnd={(_, info) => {
                      if (Math.abs(info.offset.x) > 5) suppressTap.current = true;
                      if (info.offset.x > 76) move(-1);
                      if (info.offset.x < -76) move(1);
                    }}
                  />
                );
              })}
            </AnimatePresence>
          )}
        </div>
        {count > 0 && !isLoading && !error && (
          <div className="deck-controls">
            <button type="button" className="deck-arrow" onClick={() => move(-1)} aria-label="Mata kuliah sebelumnya">
              <ArrowLeft size={20} aria-hidden="true" />
            </button>
            <span aria-live="polite">{activeIndex + 1} / {count}</span>
            <button type="button" className="deck-arrow" onClick={() => move(1)} aria-label="Mata kuliah berikutnya">
              <ArrowRight size={20} aria-hidden="true" />
            </button>
          </div>
        )}
        {isAdmin && count > 0 && !isLoading && !error && (
          <div className="deck-admin-actions">
            <span>{courses[activeIndex]?.name}</span>
            <button type="button" className="admin-text-button" onClick={() => onEditCourse(courses[activeIndex])}>Ubah mata kuliah</button>
            <button type="button" className="admin-text-button danger" onClick={() => onDeleteCourse(courses[activeIndex])}>Hapus</button>
          </div>
        )}
        {!reduceMotion && count > 0 && (
          <p className="deck-hint">
            <span className="deck-hint-desktop">Seret kartu atau tekan ← → untuk menjelajah.</span>
            <span className="deck-hint-mobile">Geser kartu untuk menjelajah.</span>
          </p>
        )}
      </div>
    </section>
  );
}
