import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { TIME_ZONE, WEEKDAYS } from "../../lib/config.js";
import { expandScheduleWeek, formatJakartaDate, getJakartaDate } from "../../lib/schedule-utils.js";

function getTodayInJakarta() {
  const day = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, weekday: "short" }).format(new Date());
  return ({ Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 })[day];
}

function getTimeInJakarta() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date());
}

function ScheduleLine({ schedule, course, showDay = false, isAdmin, onEdit, onDelete, onDeleteSchedule }) {
  const weekday = schedule.date
    ? new Intl.DateTimeFormat("id-ID", { timeZone: TIME_ZONE, weekday: "long" }).format(new Date(`${schedule.date}T12:00:00+07:00`))
    : WEEKDAYS.find((day) => day.value === schedule.dayOfWeek)?.label;
  const statusLabel = {
    cancelled: "Dibatalkan",
    rescheduled: `Pindah dari ${formatJakartaDate(schedule.originalDate, { day: "numeric", month: "short" })}`,
    extra: "Tambahan",
  }[schedule.kind];

  return (
    <article className={`schedule-line ${schedule.kind === "cancelled" ? "schedule-line-cancelled" : ""}`}>
      <span className="schedule-time">{schedule.startTime}–{schedule.endTime}</span>
      <div className="schedule-line-details">
        <strong>{course?.name ?? "Mata kuliah"}</strong>
        <span>{[showDay && weekday, schedule.room].filter(Boolean).join(" · ")}</span>
        {statusLabel && <span className="schedule-change-label">{statusLabel}{schedule.note ? ` · ${schedule.note}` : ""}</span>}
      </div>
      {isAdmin && schedule.scheduleId && (
        <span className="schedule-admin-actions">
          <button type="button" className="admin-text-button" onClick={() => onEdit(schedule.scheduleId)}>Ubah</button>
          <button type="button" className="admin-text-button danger" onClick={() => onDeleteSchedule(schedule.scheduleId)}>Hapus</button>
        </span>
      )}
      {isAdmin && schedule.kind !== "regular" && onDelete && (
        <button type="button" className="admin-text-button danger" onClick={() => onDelete(schedule.id)}>Hapus</button>
      )}
    </article>
  );
}

function WeekSchedule({ events, courseById, isAdmin, onEdit, onDelete, onDeleteSchedule }) {
  const groups = WEEKDAYS.map((day) => {
    const items = events.filter((event) => {
      const eventDay = event.date
        ? new Date(`${event.date}T12:00:00+07:00`).getDay() || 7
        : event.dayOfWeek;
      return eventDay === day.value;
    });
    return { ...day, items };
  }).filter((day) => day.items.length);

  if (!groups.length) return <p className="schedule-empty">Jadwal belum diisi.</p>;

  return (
    <div className="week-schedule">
      {groups.map((day) => (
        <section className="week-day" key={day.value} aria-label={`Jadwal ${day.label}`}>
          <h3>{day.label}</h3>
          <div className="schedule-lines">
            {day.items.map((schedule) => (
              <ScheduleLine
                key={schedule.id}
                schedule={schedule}
                course={courseById.get(schedule.courseId)}
                showDay
                isAdmin={isAdmin}
                onEdit={onEdit}
                onDelete={onDelete}
                onDeleteSchedule={onDeleteSchedule}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function SchedulePanel({
  schedules,
  scheduleChanges = [],
  courses,
  isLoading,
  error,
  isAdmin = false,
  onAddSchedule,
  onEditSchedule,
  onDeleteSchedule,
  onAddScheduleChange,
  onDeleteScheduleChange,
}) {
  const [view, setView] = useState("today");
  const today = getTodayInJakarta();
  const todayDate = getJakartaDate();
  const time = getTimeInJakarta();
  const courseById = useMemo(() => new Map(courses.map((course) => [course.id, course])), [courses]);
  const events = useMemo(() => expandScheduleWeek(schedules, scheduleChanges), [schedules, scheduleChanges]);
  const nextWeekEvents = useMemo(
    () => expandScheduleWeek(schedules, scheduleChanges, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
    [schedules, scheduleChanges],
  );
  const todaysEvents = events.filter((schedule) => schedule.date === todayDate);
  const upcoming = [...events, ...nextWeekEvents].find((item) => item.kind !== "cancelled" && (item.date > todayDate || (item.date === todayDate && item.startTime > time)));
  const next = upcoming;

  return (
    <section className="schedule-sheet" aria-labelledby="schedule-title">
      <div className="panel-heading">
        <div>
          <span className="panel-icon"><CalendarDays size={18} aria-hidden="true" /></span>
          <h2 id="schedule-title">Jadwal kuliah</h2>
        </div>
        <span className="schedule-timezone">WIB</span>
      </div>
      {isAdmin && (
        <div className="schedule-admin-toolbar">
          <button type="button" className="admin-text-button" onClick={onAddSchedule}>Ubah mingguan</button>
          <button type="button" className="admin-text-button" onClick={onAddScheduleChange}>Perubahan tanggal</button>
        </div>
      )}
      <div className="schedule-tabs" role="tablist" aria-label="Tampilan jadwal">
        <button type="button" role="tab" aria-selected={view === "today"} onClick={() => setView("today")}>Hari ini</button>
        <button type="button" role="tab" aria-selected={view === "week"} onClick={() => setView("week")}>Minggu ini</button>
      </div>
      {isLoading ? (
        <div className="schedule-skeleton" aria-label="Memuat jadwal"><span /><span /><span /></div>
      ) : error ? (
        <p className="inline-error" role="alert">Jadwal belum bisa dimuat. Coba muat ulang halaman.</p>
      ) : schedules.length === 0 && !scheduleChanges.length ? (
        <div className="schedule-empty-block">
          <p>Jadwal belum diisi.</p>
          {isAdmin && <button type="button" className="admin-text-button" onClick={onAddSchedule}>Tambah jadwal</button>}
        </div>
      ) : view === "week" ? (
        <WeekSchedule events={events} courseById={courseById} isAdmin={isAdmin} onEdit={onEditSchedule} onDelete={onDeleteScheduleChange} onDeleteSchedule={onDeleteSchedule} />
      ) : (
        <div className="today-schedule">
          <p className="schedule-day-name">{WEEKDAYS.find((day) => day.value === today)?.label}</p>
          {todaysEvents.length ? (
            <div className="schedule-lines">
              {todaysEvents.map((schedule) => (
                <ScheduleLine key={schedule.id} schedule={schedule} course={courseById.get(schedule.courseId)} isAdmin={isAdmin} onEdit={onEditSchedule} onDelete={onDeleteScheduleChange} onDeleteSchedule={onDeleteSchedule} />
              ))}
            </div>
          ) : next ? (
            <div className="schedule-lines">
              <p className="schedule-empty">Tidak ada kuliah hari ini. Kuliah berikutnya:</p>
              <ScheduleLine schedule={next} course={courseById.get(next.courseId)} showDay isAdmin={isAdmin} onEdit={onEditSchedule} onDelete={onDeleteScheduleChange} onDeleteSchedule={onDeleteSchedule} />
            </div>
          ) : (
            <p className="schedule-empty">Tidak ada kuliah hari ini.</p>
          )}
          {todaysEvents.length > 0 && next && (
            <div className="next-class">
              <span><Clock3 size={15} aria-hidden="true" /> Kuliah berikutnya</span>
              <ScheduleLine schedule={next} course={courseById.get(next.courseId)} showDay isAdmin={isAdmin} onEdit={onEditSchedule} onDelete={onDeleteScheduleChange} onDeleteSchedule={onDeleteSchedule} />
              <ArrowRight className="next-arrow" size={17} aria-hidden="true" />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
