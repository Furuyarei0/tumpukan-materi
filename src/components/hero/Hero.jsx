import { motion, useReducedMotion } from "framer-motion";
import tape from "../../assets/props/tape-mustard.webp";
import paperclip from "../../assets/props/paperclip-silver.webp";
import pencil from "../../assets/props/pencil.webp";
import { WEEKDAYS } from "../../lib/config.js";

function formatTime(time) {
  return time.replace(":", ".");
}

export function Hero({ courses, schedules, isLoading, error }) {
  const reduceMotion = useReducedMotion();
  const courseById = new Map(courses.map((course) => [course.id, course]));
  const schedulePreview = [...schedules]
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime))
    .slice(0, 3);

  return (
    <section className="site-section hero-scene" id="home" aria-labelledby="hero-title">
      <div className="section-inner">
        <div className="hero-layout">
          <motion.div
            className="hero-copy"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.5 }}
          >
            <h1 id="hero-title">Materi kelas, rapi di satu tempat.</h1>
            <p>Temukan bahan kuliah, cek tenggat tugas, dan lihat jadwal minggu ini tanpa perlu bertanya ke grup kelas.</p>
            <div className="hero-actions">
              <a className="button-primary" href="#board">Lihat papan tugas</a>
              <a className="button-secondary" href="#deck">Cari materi</a>
            </div>
          </motion.div>

          <motion.div
            className="hero-art"
            role="img"
            aria-label="Ringkasan jadwal kelas minggu ini"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.55, delay: reduceMotion ? 0 : 0.1 }}
          >
            <span className="hero-sheet back" />
            <span className="hero-sheet mid" />
            <div className="hero-sheet front">
              <div className="hero-note">
                {isLoading ? (
                  <div className="hero-note-loading" role="status" aria-label="Memuat jadwal">
                    <span /><span /><span />
                  </div>
                ) : error ? (
                  <div className="hero-mini-empty">
                    <strong>Jadwal belum tersedia</strong>
                    <p>Jadwal belum bisa dimuat. Coba muat ulang halaman.</p>
                  </div>
                ) : schedulePreview.length ? (
                  <>
                    <span className="hero-note-title">Kuliah minggu ini</span>
                    {schedulePreview.map((schedule) => {
                      const course = courseById.get(schedule.courseId);
                      const weekday = WEEKDAYS.find((day) => day.value === schedule.dayOfWeek)?.label;
                      return (
                        <span className="hero-note-row" key={schedule.id}>
                          <span>{weekday} · {course?.name}</span>
                          <small>{formatTime(schedule.startTime)}</small>
                        </span>
                      );
                    })}
                  </>
                ) : (
                  <div className="hero-mini-empty">
                    <strong>Belum ada materi</strong>
                    <p>Materi kelas akan muncul di sini setelah tersedia.</p>
                  </div>
                )}
              </div>
            </div>
            <img className="hero-prop hero-tape" src={tape} alt="" aria-hidden="true" />
            <img className="hero-prop hero-paperclip" src={paperclip} alt="" aria-hidden="true" />
            <img className="hero-prop hero-pencil" src={pencil} alt="" aria-hidden="true" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
