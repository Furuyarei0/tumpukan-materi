import { useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, Bell, BookOpen, CalendarDays, ClipboardList, FileText, Inbox, LogOut } from "lucide-react";
import { WEEKDAYS } from "../../lib/config.js";
import { formatJakartaDate } from "../../lib/schedule-utils.js";
import logo from "../../assets/logo/logo.svg";
import { AdminLogin } from "./AdminLogin.jsx";
import { AdminNotifications } from "./AdminNotifications.jsx";

const MENU = [
  { id: "inbox", label: "Kiriman masuk", icon: Inbox },
  { id: "materials", label: "Materi", icon: FileText },
  { id: "courses", label: "Mata kuliah", icon: BookOpen },
  { id: "tasks", label: "Mading", icon: ClipboardList },
  { id: "schedules", label: "Jadwal", icon: CalendarDays },
  { id: "notifications", label: "Notifikasi", icon: Bell },
];

function PageTitle({ title, action, children }) {
  return (
    <div className="admin-page-title">
      <div><h2>{title}</h2>{children && <p>{children}</p>}</div>
      {action && <button type="button" className="button-primary" onClick={action.onClick}>{action.label}</button>}
    </div>
  );
}

function EmptyList({ children }) {
  return <p className="admin-empty-list">{children}</p>;
}

function TaskSummary({ task, courseName }) {
  return <><strong>{task.title}</strong><span>{courseName || "Tanpa mata kuliah"} · {task.deadline ? `${formatJakartaDate(task.deadline, { day: "numeric", month: "short", year: "numeric" })} WIB` : "Tanpa deadline"}</span></>;
}

function CourseSummary({ course }) {
  return <><strong>{course.name}</strong><span>{course.lecturer || "Dosen belum diisi"} · {course.credits ? `${course.credits} SKS` : "SKS belum diisi"}</span></>;
}

function ScheduleSummary({ schedule, courseName }) {
  return <><strong>{courseName}</strong><span>{WEEKDAYS.find((day) => day.value === schedule.dayOfWeek)?.label} · {schedule.startTime}–{schedule.endTime} · {schedule.room || "Ruangan belum diisi"}</span></>;
}

function AdminRows({ rows, render, onEdit, onDelete }) {
  if (!rows.length) return <EmptyList>Belum ada data di bagian ini.</EmptyList>;
  return <div className="admin-row-list">{rows.map((row) => (
    <article className="admin-row" key={row.id}>
      <div className="admin-row-copy">{render(row)}</div>
      <div className="admin-row-actions">
        <button type="button" className="admin-text-button" onClick={() => onEdit(row)}>Ubah</button>
        <button type="button" className="admin-text-button danger" onClick={() => onDelete(row)}>Hapus</button>
      </div>
    </article>
  ))}</div>;
}

function PendingMaterial({ material, courses, onApprove, onEdit, onReject }) {
  const [title, setTitle] = useState(material.title);
  const [courseId, setCourseId] = useState(material.courseId);
  const courseName = courses.find((course) => course.id === material.courseId)?.name ?? "Mata kuliah tidak ditemukan";
  return (
    <article className="approval-entry">
      <div className="approval-file-preview">
        {material.mimeType === "application/pdf" ? (
          <>
            <iframe title={`Pratinjau ${material.title}`} src={`${material.url}#toolbar=0&navpanes=0`} />
            <a className="approval-full-link" href={material.url} target="_blank" rel="noopener noreferrer">
              Buka PDF di tab baru <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </>
        ) : (
          <a className="button-secondary" href={material.url} target="_blank" rel="noopener noreferrer">
            Buka file <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        )}
      </div>
      <div className="approval-entry-fields">
        <p className="approval-submitter">{courseName}{material.submittedBy ? ` · ${material.submittedBy}` : ""}</p>
        <label className="admin-field">Judul materi
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label className="admin-field">Mata kuliah
          <select value={courseId} onChange={(event) => setCourseId(event.target.value)}>
            {courses.map((course) => <option value={course.id} key={course.id}>{course.name}</option>)}
          </select>
        </label>
        <div className="admin-form-actions">
          <button type="button" className="button-secondary danger-button" onClick={() => onReject(material)}>Tolak</button>
          <button type="button" className="button-secondary" onClick={() => onEdit(material, title, courseId)}>Simpan edit</button>
          <button type="button" className="button-primary" onClick={() => onApprove(material, title, courseId)}>Setujui</button>
        </div>
      </div>
    </article>
  );
}

export function AdminWorkspace({
  isAdmin,
  signIn,
  onLogout,
  section,
  onSelect,
  data,
  onCreate,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onUpdatePending,
  onBack,
  isLoading,
  authLoading = false,
  isSimulated = false,
  authError = null,
  onPasswordReset,
}) {
  const [actionError, setActionError] = useState("");
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const courseById = useMemo(() => new Map(data.courses.map((course) => [course.id, course.name])), [data.courses]);
  const activeSection = section === "dashboard" || MENU.some((item) => item.id === section) ? section : "dashboard";

  if (authLoading) {
    return <main className="admin-workspace"><p className="admin-empty-list" role="status">Memeriksa sesi admin…</p></main>;
  }
  if (!isAdmin) return <AdminLogin onSignIn={signIn} onPasswordReset={onPasswordReset} onBack={onBack} />;

  const menuItem = MENU.find((item) => item.id === activeSection) ?? null;
  const pending = data.materials.filter((material) => material.status === "pending");
  const nearTasks = data.tasks.filter((task) => task.deadline && new Date(task.deadline).getTime() >= Date.now())
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 5);
  const goTo = (item) => {
    setIsAdminMenuOpen(false);
    onSelect(item);
  };

  async function runAction(action, ...args) {
    setActionError("");
    try {
      await action(...args);
    } catch (error) {
      setActionError(error.message || "Perubahan belum bisa dilakukan. Coba lagi.");
    }
  }

  const listSection = {
    courses: <AdminRows rows={data.courses} render={(course) => <CourseSummary course={course} />} onEdit={(row) => onEdit("course", row)} onDelete={(row) => onDelete("course", row)} />,
    tasks: <AdminRows rows={data.tasks} render={(task) => <TaskSummary task={task} courseName={courseById.get(task.courseId)} />} onEdit={(row) => onEdit("task", row)} onDelete={(row) => onDelete("task", row)} />,
    materials: <AdminRows rows={data.materials.filter((material) => material.status === "approved")} render={(material) => <><strong>{material.title}</strong><span>{courseById.get(material.courseId) || "Mata kuliah tidak ditemukan"} · {material.fileName}</span></>} onEdit={(row) => onEdit("material", row)} onDelete={(row) => onDelete("material", row)} />,
    schedules: <div className="admin-schedule-list">
      <AdminRows rows={data.schedules} render={(schedule) => <ScheduleSummary schedule={schedule} courseName={courseById.get(schedule.courseId) || "Mata kuliah tidak ditemukan"} />} onEdit={(row) => onEdit("schedule", row)} onDelete={(row) => onDelete("schedule", row)} />
      <PageTitle title="Perubahan tanggal tertentu" action={{ label: "Tambah perubahan", onClick: () => onCreate("scheduleChange") }} />
      <AdminRows rows={data.scheduleChanges} render={(change) => <><strong>{{ cancelled: "Dibatalkan", rescheduled: "Dipindahkan", extra: "Kuliah tambahan" }[change.kind]}</strong><span>{courseById.get(change.courseId)} · {change.originalDate ? `Asal ${change.originalDate}` : ""}{change.newDate ? ` · ${change.newDate}` : ""}{change.note ? ` · ${change.note}` : ""}</span></>} onEdit={(row) => onEdit("scheduleChange", row)} onDelete={(row) => onDelete("scheduleChange", row)} />
    </div>,
  }[activeSection];

  return (
    <main className={`admin-workspace ${activeSection === "notifications" ? "admin-workspace-compact" : ""}`}>
      <header className="admin-topbar">
        <button type="button" className="admin-brand" onClick={onBack} aria-label="Kembali ke beranda">
          <img src={logo} alt="" />
        </button>
        <span className="admin-simulation-label">{isSimulated ? "Mode admin simulasi" : "Mode admin"}</span>
        <button type="button" className="admin-logout" onClick={onLogout}><LogOut size={17} aria-hidden="true" /> Keluar</button>
      </header>
      <div className={`admin-layout ${activeSection === "notifications" ? "admin-layout-compact" : ""}`}>
        <button
          type="button"
          className="admin-mobile-menu"
          aria-expanded={isAdminMenuOpen}
          aria-controls="admin-menu"
          onClick={() => setIsAdminMenuOpen((isOpen) => !isOpen)}
        >
          Menu admin
        </button>
        <aside id="admin-menu" className={`admin-sidebar ${isAdminMenuOpen ? "mobile-open" : ""}`} aria-label="Menu admin">
          <button type="button" aria-current={activeSection === "dashboard" ? "page" : undefined} className={`admin-nav-link ${activeSection === "dashboard" ? "active" : ""}`} onClick={() => goTo("dashboard")}>Ringkasan</button>
          {MENU.map(({ id, label, icon: Icon }) => (
            <button type="button" aria-current={activeSection === id ? "page" : undefined} className={`admin-nav-link ${activeSection === id ? "active" : ""}`} key={id} onClick={() => goTo(id)}>
              <Icon size={18} aria-hidden="true" />{label}{id === "inbox" && pending.length > 0 && <span className="admin-count">{pending.length}</span>}
            </button>
          ))}
          <button type="button" className="admin-back-link" onClick={onBack}><ArrowLeft size={16} aria-hidden="true" /> Lihat halaman publik</button>
        </aside>
        <section className="admin-canvas">
          {isLoading ? <p className="admin-empty-list" role="status">Memuat data admin…</p> : (
            <>
          {authError && <p className="inline-error" role="alert">Sesi admin belum bisa diverifikasi. Coba muat ulang atau keluar lalu masuk kembali.</p>}
          {actionError && <p className="inline-error" role="alert">{actionError}</p>}
          {activeSection === "notifications" ? <AdminNotifications /> : activeSection === "dashboard" ? (
            <>
              <PageTitle title="Ringkasan kelas" action={{ label: "Tambah tugas", onClick: () => onCreate("task") }}>
                {pending.length ? `${pending.length} kiriman menunggu persetujuan.` : "Belum ada kiriman yang menunggu persetujuan."}
              </PageTitle>
              <div className="admin-dashboard-grid">
                <section className="admin-summary-block">
                  <h3>Kiriman menunggu <span>{pending.length}</span></h3>
                  {pending.length ? pending.slice(0, 4).map((material) => (
                    <button className="admin-summary-row" key={material.id} type="button" onClick={() => goTo("inbox")}>
                      <strong>{material.title}</strong><span>{courseById.get(material.courseId) || "Mata kuliah"}</span>
                    </button>
                  )) : <EmptyList>Belum ada kiriman masuk.</EmptyList>}
                  <button type="button" className="admin-text-button" onClick={() => goTo("inbox")}>Buka antrean <ArrowUpRight size={15} aria-hidden="true" /></button>
                </section>
                <section className="admin-summary-block">
                  <h3>Tugas dengan deadline terdekat</h3>
                  {nearTasks.length ? nearTasks.map((task) => <div className="admin-summary-row" key={task.id}><TaskSummary task={task} courseName={courseById.get(task.courseId)} /></div>) : <EmptyList>Belum ada tugas dengan deadline mendatang.</EmptyList>}
                </section>
              </div>
              <div className="admin-shortcuts">
                {MENU.map(({ id, label, icon: Icon }) => <button type="button" key={id} onClick={() => goTo(id)}><Icon size={18} aria-hidden="true" />{label}<span>{id === "notifications" ? "Atur" : id === "inbox" ? pending.length : id === "courses" ? data.courses.length : id === "materials" ? data.materials.filter((item) => item.status === "approved").length : id === "tasks" ? data.tasks.length : data.schedules.length}</span></button>)}
              </div>
            </>
          ) : activeSection === "inbox" ? (
            <>
              <PageTitle title="Kiriman masuk">{pending.length} kiriman menunggu persetujuan.</PageTitle>
              {pending.length ? <div className="approval-list">{pending.map((material) => (
                <PendingMaterial
                  key={material.id}
                  material={material}
                  courses={data.courses}
                  onApprove={(row, title, courseId) => runAction(onApprove, row.id, { title, courseId })}
                  onEdit={(row, title, courseId) => runAction(onUpdatePending, row.id, { title, courseId })}
                  onReject={(row) => onReject("material", row)}
                />
              ))}</div> : <EmptyList>Antrean kiriman masih kosong.</EmptyList>}
            </>
          ) : (
            <>
              <PageTitle
                title={menuItem?.label ?? "Admin"}
                action={activeSection === "schedules"
                  ? { label: "Ubah jadwal mingguan", onClick: () => onCreate("schedule") }
                  : activeSection !== "inbox" ? { label: `Tambah ${activeSection === "courses" ? "mata kuliah" : activeSection === "tasks" ? "tugas" : "materi"}`, onClick: () => onCreate(activeSection === "courses" ? "course" : activeSection === "tasks" ? "task" : "material") } : null}
              >
                {activeSection === "schedules"
                  ? "Jadwal mingguan dan perubahan satu kali."
                  : isSimulated ? "Mode development: perubahan hanya tersimpan sementara." : "Perubahan tersimpan di Supabase."}
              </PageTitle>
              {listSection}
            </>
          )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
