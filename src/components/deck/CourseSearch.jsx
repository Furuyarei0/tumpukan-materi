import { BookOpen, FileText, Search, X } from "lucide-react";
import { WHATSAPP_URL } from "../../lib/config.js";
import { useCourseSearch } from "../../hooks/useCourseSearch.js";

export function CourseSearch({ value, onChange, onOpenCourse, onOpenMaterial }) {
  const { results, isLoading, error, normalizedQuery } = useCourseSearch(value);
  const hasResults = results.courses.length > 0 || results.materials.length > 0;

  return (
    <div className="course-search-wrap">
      <div className="course-search" role="search">
        <Search size={19} aria-hidden="true" />
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Cari mata kuliah atau materi"
          aria-label="Cari mata kuliah atau materi"
          aria-controls="course-search-results"
          aria-expanded={Boolean(normalizedQuery)}
          autoComplete="off"
        />
        {value && (
          <button type="button" className="course-search-clear" onClick={() => onChange("")} aria-label="Hapus pencarian">
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      {normalizedQuery && (
        <div className="course-search-results" id="course-search-results" aria-live="polite">
          {isLoading ? (
            <p className="search-status" role="status">Mencari materi…</p>
          ) : error ? (
            <p className="search-status search-error" role="alert">Pencarian belum bisa dimuat. Coba lagi sebentar.</p>
          ) : hasResults ? (
            <>
              {results.courses.length > 0 && (
                <section className="search-result-group" aria-labelledby="course-results-heading">
                  <h3 id="course-results-heading">Mata kuliah</h3>
                  {results.courses.map((course) => (
                    <button className="search-result" key={course.id} type="button" onClick={() => onOpenCourse(course.id)}>
                      <BookOpen size={18} aria-hidden="true" />
                      <span>{course.name}</span>
                    </button>
                  ))}
                </section>
              )}
              {results.materials.length > 0 && (
                <section className="search-result-group" aria-labelledby="material-results-heading">
                  <h3 id="material-results-heading">Materi</h3>
                  {results.materials.map((material) => (
                    <button
                      className="search-result"
                      key={material.id}
                      type="button"
                      onClick={() => onOpenMaterial(material)}
                    >
                      <FileText size={18} aria-hidden="true" />
                      <span>
                        <strong>{material.title}</strong>
                        <small>{material.courseName}</small>
                      </span>
                    </button>
                  ))}
                </section>
              )}
            </>
          ) : (
            <div className="search-empty">
              <p>Tidak ada materi yang cocok. Coba kata lain atau minta materi yang kamu cari.</p>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Minta materi</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
