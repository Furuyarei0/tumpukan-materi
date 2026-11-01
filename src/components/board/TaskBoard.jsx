import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SchedulePanel } from "../schedule/SchedulePanel.jsx";
import { getDeadlineStatus } from "../../lib/deadline.js";

function TaskEmptyState() {
  return (
    <div className="task-empty" aria-live="polite">
      <span className="task-empty-rule" />
      <p>Belum ada tugas. Kalau ada tugas baru, catatannya akan muncul di sini.</p>
      <span className="task-empty-rule" />
    </div>
  );
}

function TaskCard({ task, onOpen }) {
  const deadlineStatus = getDeadlineStatus(task.deadline);
  return (
    <motion.button className="task-note" type="button" onClick={() => onOpen(task.id)} layoutId={`task-note-${task.id}`}>
      <span className="task-note-top">
        <span className="task-course">{task.courseName}</span>
        <span className={`deadline-chip ${deadlineStatus.tone}`}>{deadlineStatus.label}</span>
      </span>
      <strong>{task.title}</strong>
      <span className="task-method">{task.submissionMethod}</span>
      <ArrowUpRight size={17} aria-hidden="true" />
    </motion.button>
  );
}

export function TaskBoard({ tasks, tasksLoading, tasksError, onOpenTask, courses, schedules, scheduleChanges, scheduleLoading, scheduleError, isAdmin = false, onAddTask, onAddSchedule, onEditSchedule, onDeleteSchedule, onAddScheduleChange, onDeleteScheduleChange }) {
  const [mobileView, setMobileView] = useState("tasks");
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  return (
    <section className="site-section board-scene" id="board" aria-labelledby="board-title">
      <div className="section-inner">
        <div className="section-heading board-heading">
          <div>
            <h2 id="board-title">Papan kelas</h2>
            <p>Tugas dan jadwal minggu ini, tersusun di satu tempat.</p>
          </div>
          <a className="text-link" href="#deck">Lihat materi <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
        <div className="mobile-board-tabs" role="tablist" aria-label="Bagian papan kelas">
          <button type="button" role="tab" aria-selected={mobileView === "tasks"} onClick={() => setMobileView("tasks")}>Tugas</button>
          <button type="button" role="tab" aria-selected={mobileView === "schedule"} onClick={() => setMobileView("schedule")}>Jadwal</button>
        </div>
        <div className="board-columns">
          <div className={`task-board-column ${mobileView === "tasks" ? "mobile-active" : ""}`}>
            <div className="board-subheading">
              <h3>Tugas dan tenggat</h3>
              <span>{sortedTasks.length ? `${sortedTasks.length} catatan` : "Papan tugas"}</span>
              {isAdmin && <button type="button" className="admin-text-button" onClick={onAddTask}>Tambah tugas</button>}
            </div>
            {tasksLoading ? (
              <div className="task-loading" role="status">Memuat papan tugas…</div>
            ) : tasksError ? (
              <p className="inline-error" role="alert">Tugas belum bisa dimuat. Coba muat ulang halaman.</p>
            ) : sortedTasks.length ? (
              <div className="task-notes">
                {sortedTasks.map((task) => <TaskCard key={task.id} task={task} onOpen={onOpenTask} />)}
              </div>
            ) : <TaskEmptyState />}
          </div>
          <div className={`schedule-column ${mobileView === "schedule" ? "mobile-active" : ""}`}>
            <SchedulePanel
              schedules={schedules}
              scheduleChanges={scheduleChanges}
              courses={courses}
              isLoading={scheduleLoading}
              error={scheduleError}
              isAdmin={isAdmin}
              onAddSchedule={onAddSchedule}
              onEditSchedule={onEditSchedule}
              onDeleteSchedule={onDeleteSchedule}
              onAddScheduleChange={onAddScheduleChange}
              onDeleteScheduleChange={onDeleteScheduleChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
