import { useMemo } from "react";
import { CalendarClock, Clock3, Send } from "lucide-react";
import { OverlayShell } from "../ui/OverlayShell.jsx";
import { getDeadlineStatus } from "../../lib/deadline.js";
import { splitLinks } from "../../lib/linkify.js";

function formatDeadline(deadline) {
  if (!deadline) return "Belum ditentukan";
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(deadline));
}

export function TaskDetailOverlay({ open, onClose, task, isAdmin = false, onOpenCourse, onEdit, onDelete }) {
  const titleId = useMemo(() => `task-title-${task?.id ?? "missing"}`, [task?.id]);
  const deadlineStatus = getDeadlineStatus(task?.deadline);
  const description = task?.description || "Tidak ada keterangan tambahan.";
  return (
    <OverlayShell open={open} onClose={onClose} titleId={titleId} layoutId={task ? `task-note-${task.id}` : undefined} panelClassName="task-detail-panel">
      {task ? (
        <div className="task-detail-content">
          {task.courseName && <button type="button" className="task-course task-course-link" onClick={() => task.courseId && onOpenCourse?.(task.courseId)}>{task.courseName}</button>}
          <h2 id={titleId}>{task.title}</h2>
          <div className="task-deadline-full">
            <CalendarClock size={19} aria-hidden="true" />
            <span>{task.deadline ? `${formatDeadline(task.deadline)} WIB` : "Belum ditentukan"}</span>
            <span className={`deadline-chip ${deadlineStatus.tone}`}>{deadlineStatus.label}</span>
          </div>
          <div className="task-description">
            <h3>Detail tugas</h3>
            <p>{splitLinks(description).map((part, index) => part.type === "link"
              ? <a href={part.href} target="_blank" rel="noopener noreferrer" key={index}>{part.value}</a>
              : <span key={index}>{part.value}</span>)}</p>
          </div>
          <div className="task-submission">
            <h3>Cara pengumpulan</h3>
            <p>{task.submissionMethod || "Belum ada informasi pengumpulan."}</p>
          </div>
          {(task.createdAt || task.updatedAt) && (
            <p className="task-updated">
              {task.createdAt && `Dibuat ${formatDeadline(task.createdAt)}`}
              {task.updatedAt && ` · Diperbarui ${formatDeadline(task.updatedAt)}`}
            </p>
          )}
          {isAdmin && (
            <div className="task-admin-actions">
              <button type="button" className="button-secondary" onClick={() => onEdit?.(task.id)}>Ubah</button>
              <button type="button" className="button-secondary" onClick={() => onDelete?.(task.id)}>Hapus</button>
            </div>
          )}
        </div>
      ) : (
        <div className="overlay-empty">
          <span className="empty-file"><Clock3 size={25} aria-hidden="true" /></span>
          <h2 id={titleId}>Tugas tidak ditemukan</h2>
          <p>Catatan ini mungkin sudah dihapus atau belum tersedia.</p>
          <button type="button" className="button-secondary" onClick={onClose}><Send size={16} aria-hidden="true" /> Kembali ke papan</button>
        </div>
      )}
    </OverlayShell>
  );
}
