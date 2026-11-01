import { useEffect, useState } from "react";
import { OverlayShell } from "../ui/OverlayShell.jsx";
import { WEEKDAYS } from "../../lib/config.js";
import {
  approveMaterial,
  saveCourse,
  saveMaterial,
  saveSchedule,
  saveScheduleChange,
  saveTask,
  updateMaterialDetails,
} from "../../services/admin.js";

const EMPTY_RECORD = {};

function localDateTimeValue(value) {
  if (!value) return "";
  const date = new Date(value);
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

function Field({ label, children, hint }) {
  return <label className="admin-field">{label}{children}{hint && <small>{hint}</small>}</label>;
}

export function AdminEditorOverlay({
  editor,
  courses,
  schedules,
  onClose,
  onSaved,
  isAdmin,
}) {
  const [form, setForm] = useState(EMPTY_RECORD);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);
  const record = editor?.record ?? EMPTY_RECORD;
  const type = editor?.type;

  useEffect(() => {
    if (!editor) return;
    setForm({ ...record, deadlineLocal: localDateTimeValue(record.deadline) });
    setError("");
    setTaskDetailsOpen(Boolean(record.deadline || record.submissionMethod || record.description));
  }, [editor, record]);

  if (!editor) return null;
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const title = `${record.id ? "Ubah" : "Tambah"} ${
    ({ course: "mata kuliah", task: "tugas", material: "materi", schedule: "jadwal", scheduleChange: "perubahan jadwal" })[type]
  }`;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSaving(true);
    try {
      if (type === "course") await saveCourse(form, isAdmin);
      if (type === "task") await saveTask(form, isAdmin);
      if (type === "schedule") await saveSchedule(form, isAdmin);
      if (type === "scheduleChange") await saveScheduleChange(form, isAdmin);
      if (type === "material" && form.status === "pending") {
        await approveMaterial(record.id, form, isAdmin);
      } else if (type === "material" && record.id) {
        await updateMaterialDetails(record.id, form, isAdmin);
      } else if (type === "material") {
        await saveMaterial(form, isAdmin);
      }
      onSaved();
    } catch (saveError) {
      setError(saveError.message || "Perubahan belum bisa disimpan. Coba lagi.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <OverlayShell open onClose={onClose} titleId="admin-editor-title" panelClassName="admin-editor-panel">
      <header className="admin-editor-heading">
        <h2 id="admin-editor-title">{title}</h2>
        {type === "task" && <p>Catat tugas kelas. Deadline dan rincian pengumpulan bisa ditambahkan di bagian opsional.</p>}
      </header>
      <form className="admin-form" onSubmit={handleSubmit}>
        {type === "course" && (
          <>
            <Field label="Nama mata kuliah"><input value={form.name ?? ""} onChange={(event) => update("name", event.target.value)} required maxLength={120} /></Field>
            <Field label="Dosen"><input value={form.lecturer ?? ""} onChange={(event) => update("lecturer", event.target.value)} maxLength={120} /></Field>
            <Field label="SKS"><input type="number" min="1" max="6" value={form.credits ?? ""} onChange={(event) => update("credits", event.target.value)} /></Field>
            <Field label="Urutan"><input type="number" value={form.sortOrder ?? 0} onChange={(event) => update("sortOrder", event.target.value)} /></Field>
            <Field label="Warna kartu">
              <select value={form.color ?? "sage"} onChange={(event) => update("color", event.target.value)}>
                {["sage", "mustard", "terracotta", "blue"].map((color) => <option value={color} key={color}>{color}</option>)}
              </select>
            </Field>
          </>
        )}
        {type === "task" && (
          <>
            <Field label="Judul tugas"><input value={form.title ?? ""} onChange={(event) => update("title", event.target.value)} required maxLength={150} /></Field>
            <Field label={<>Mata kuliah <span className="admin-optional-label">(opsional)</span></>}>
              <select value={form.courseId ?? ""} onChange={(event) => update("courseId", event.target.value)}>
                <option value="">Tanpa mata kuliah</option>
                {courses.map((course) => <option value={course.id} key={course.id}>{course.name}</option>)}
              </select>
            </Field>
            <details className="admin-optional-details" open={taskDetailsOpen} onToggle={(event) => setTaskDetailsOpen(event.currentTarget.open)}>
              <summary>Deadline dan cara pengumpulan <span>(opsional)</span></summary>
              <div className="admin-optional-fields">
                <Field label={<>Deadline <span className="admin-optional-label">(WIB, opsional)</span></>}><input type="datetime-local" value={form.deadlineLocal ?? ""} onChange={(event) => update("deadlineLocal", event.target.value)} /></Field>
                <Field label={<>Cara pengumpulan <span className="admin-optional-label">(opsional)</span></>}><input value={form.submissionMethod ?? ""} onChange={(event) => update("submissionMethod", event.target.value)} maxLength={180} /></Field>
                <Field label={<>Keterangan <span className="admin-optional-label">(opsional)</span></>} hint="Tautan http/https yang ditempel bisa dibuka langsung dari detail tugas."><textarea rows="4" value={form.description ?? ""} onChange={(event) => update("description", event.target.value)} maxLength={4000} /></Field>
              </div>
            </details>
          </>
        )}
        {type === "material" && (
          <>
            <Field label="Mata kuliah">
              <select value={form.courseId ?? ""} onChange={(event) => update("courseId", event.target.value)} required>
                <option value="">Pilih mata kuliah</option>
                {courses.map((course) => <option value={course.id} key={course.id}>{course.name}</option>)}
              </select>
            </Field>
            <Field label="Judul materi"><input value={form.title ?? ""} onChange={(event) => update("title", event.target.value)} required maxLength={150} /></Field>
            {record.id ? (
              <p className="admin-file-summary">{record.fileName} · {Math.ceil((record.fileSize ?? 0) / 1024)} KB</p>
            ) : (
              <Field label="File" hint="PDF, DOCX, PPTX, XLSX, JPG, PNG, WebP, atau ZIP. Maksimal 20 MB.">
                <input type="file" accept=".pdf,.docx,.pptx,.xlsx,.jpg,.jpeg,.png,.webp,.zip" onChange={(event) => update("file", event.target.files?.[0] ?? null)} required />
              </Field>
            )}
          </>
        )}
        {type === "schedule" && (
          <>
            <Field label="Mata kuliah"><select value={form.courseId ?? ""} onChange={(event) => update("courseId", event.target.value)} required>
              <option value="">Pilih mata kuliah</option>{courses.map((course) => <option value={course.id} key={course.id}>{course.name}</option>)}
            </select></Field>
            <Field label="Hari"><select value={form.dayOfWeek ?? ""} onChange={(event) => update("dayOfWeek", event.target.value)} required>
              <option value="">Pilih hari</option>{WEEKDAYS.map((day) => <option value={day.value} key={day.value}>{day.label}</option>)}
            </select></Field>
            <div className="admin-time-fields">
              <Field label="Jam mulai"><input type="time" value={form.startTime ?? ""} onChange={(event) => update("startTime", event.target.value)} required /></Field>
              <Field label="Jam selesai"><input type="time" value={form.endTime ?? ""} onChange={(event) => update("endTime", event.target.value)} required /></Field>
            </div>
            <Field label="Ruangan"><input value={form.room ?? ""} onChange={(event) => update("room", event.target.value)} maxLength={60} /></Field>
            <div className="admin-time-fields">
              <Field label="Berlaku mulai (opsional)"><input type="date" value={form.startsOn ?? ""} onChange={(event) => update("startsOn", event.target.value)} /></Field>
              <Field label="Berlaku sampai (opsional)"><input type="date" value={form.endsOn ?? ""} onChange={(event) => update("endsOn", event.target.value)} /></Field>
            </div>
          </>
        )}
        {type === "scheduleChange" && (
          <>
            <Field label="Jenis perubahan"><select value={form.kind ?? "cancelled"} onChange={(event) => update("kind", event.target.value)}>
              <option value="cancelled">Batalkan</option><option value="rescheduled">Pindahkan</option><option value="extra">Tambah kuliah pengganti/tambahan</option>
            </select></Field>
            {form.kind === "extra" ? (
              <>
                <Field label="Mata kuliah"><select value={form.courseId ?? ""} onChange={(event) => update("courseId", event.target.value)} required>
                  <option value="">Pilih mata kuliah</option>{courses.map((course) => <option value={course.id} key={course.id}>{course.name}</option>)}
                </select></Field>
                <Field label="Tanggal kuliah tambahan"><input type="date" value={form.newDate ?? ""} onChange={(event) => update("newDate", event.target.value)} required /></Field>
              </>
            ) : (
              <>
                <Field label="Jadwal"><select value={form.scheduleId ?? ""} onChange={(event) => update("scheduleId", event.target.value)} required>
                  <option value="">Pilih jadwal</option>{schedules.map((schedule) => <option value={schedule.id} key={schedule.id}>{courses.find((course) => course.id === schedule.courseId)?.name ?? "Mata kuliah"} · {WEEKDAYS.find((day) => day.value === schedule.dayOfWeek)?.label} · {schedule.startTime}</option>)}
                </select></Field>
                <Field label="Tanggal kuliah asal"><input type="date" value={form.originalDate ?? ""} onChange={(event) => update("originalDate", event.target.value)} required /></Field>
                {form.kind === "rescheduled" && (
                  <>
                    <Field label="Tanggal baru"><input type="date" value={form.newDate ?? ""} onChange={(event) => update("newDate", event.target.value)} required /></Field>
                    <div className="admin-time-fields">
                      <Field label="Jam mulai baru"><input type="time" value={form.startTime ?? ""} onChange={(event) => update("startTime", event.target.value)} /></Field>
                      <Field label="Jam selesai baru"><input type="time" value={form.endTime ?? ""} onChange={(event) => update("endTime", event.target.value)} /></Field>
                    </div>
                    <Field label="Ruangan baru (opsional)"><input value={form.room ?? ""} onChange={(event) => update("room", event.target.value)} /></Field>
                  </>
                )}
              </>
            )}
            {form.kind === "extra" && (
              <div className="admin-time-fields">
                <Field label="Jam mulai"><input type="time" value={form.startTime ?? ""} onChange={(event) => update("startTime", event.target.value)} required /></Field>
                <Field label="Jam selesai"><input type="time" value={form.endTime ?? ""} onChange={(event) => update("endTime", event.target.value)} required /></Field>
              </div>
            )}
            {(form.kind === "extra" || form.kind === "rescheduled") && (
              <Field label="Ruangan"><input value={form.room ?? ""} onChange={(event) => update("room", event.target.value)} /></Field>
            )}
            <Field label="Catatan singkat"><textarea rows="2" value={form.note ?? ""} onChange={(event) => update("note", event.target.value)} maxLength={180} /></Field>
          </>
        )}
        {error && <p className="inline-error" role="alert">{error}</p>}
        <div className="admin-form-actions">
          <button type="button" className="button-secondary" onClick={onClose}>Batal</button>
          <button type="submit" className="button-primary" disabled={isSaving}>{isSaving ? "Menyimpan…" : "Simpan"}</button>
        </div>
      </form>
    </OverlayShell>
  );
}
