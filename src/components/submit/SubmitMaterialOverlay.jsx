import { useEffect, useRef, useState } from "react";
import { FilePlus2 } from "lucide-react";
import { validateMaterialFile } from "../../lib/file-validation.js";
import { getSubmissionCooldownRemaining, recordSuccessfulSubmission } from "../../services/submissionCooldown.js";
import { submitMaterial } from "../../services/submissions.js";
import { OverlayShell } from "../ui/OverlayShell.jsx";

function formatCooldown(milliseconds) {
  return `${Math.ceil(milliseconds / 1000)} dtk`;
}

export function SubmitMaterialOverlay({ open, onClose, courses, initialCourseId }) {
  const [courseId, setCourseId] = useState(initialCourseId ?? "");
  const [title, setTitle] = useState("");
  const [senderName, setSenderName] = useState("");
  const [file, setFile] = useState(null);
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState("uploading");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [cooldown, setCooldown] = useState(() => getSubmissionCooldownRemaining());
  const requestInProgress = useRef(false);
  const fileInput = useRef(null);

  useEffect(() => {
    if (courses.some((course) => course.id === initialCourseId)) setCourseId(initialCourseId);
    else setCourseId("");
  }, [courses, initialCourseId]);

  useEffect(() => {
    if (!open) return undefined;
    const updateCooldown = () => setCooldown(getSubmissionCooldownRemaining());
    updateCooldown();
    const timer = window.setInterval(updateCooldown, 1000);
    return () => window.clearInterval(timer);
  }, [open]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (honeypot || requestInProgress.current) return;

    const fileError = validateMaterialFile(file);
    if (fileError) {
      setError(fileError);
      return;
    }
    if (!courseId || !title.trim()) {
      setError("Pilih mata kuliah dan isi judul materi.");
      return;
    }
    const remaining = getSubmissionCooldownRemaining();
    if (remaining) {
      setCooldown(remaining);
      setError(`Tunggu ${formatCooldown(remaining)} sebelum mengirim lagi.`);
      return;
    }

    requestInProgress.current = true;
    setError("");
    setIsSubmitting(true);
    setProgress(0);
    try {
      await submitMaterial(
        { courseId, title: title.trim(), senderName: senderName.trim(), file },
        {
          onProgress: (value, stage) => {
            setProgress(value);
            setUploadStage(stage);
          },
        },
      );
      recordSuccessfulSubmission();
      setCooldown(getSubmissionCooldownRemaining());
      setSubmitted(true);
    } catch (submissionError) {
      setError(submissionError.message || "Materi belum bisa dikirim. Coba lagi.");
    } finally {
      requestInProgress.current = false;
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setSubmitted(false);
    setTitle("");
    setSenderName("");
    setFile(null);
    setError("");
    if (fileInput.current) fileInput.current.value = "";
    onClose();
  }

  function closeForm() {
    if (isSubmitting) return;
    setSubmitted(false);
    setError("");
    setTitle("");
    setSenderName("");
    setFile(null);
    if (fileInput.current) fileInput.current.value = "";
    onClose();
  }

  return (
    <OverlayShell open={open} onClose={closeForm} titleId="submit-material-title" panelClassName="submit-material-panel">
      {submitted ? (
        <div className="submit-success" role="status">
          <span className="empty-file"><FilePlus2 size={26} aria-hidden="true" /></span>
          <h2 id="submit-material-title">Terima kasih!</h2>
          <p>Terima kasih! Materimu menunggu persetujuan admin.</p>
          <button type="button" className="button-primary" onClick={resetForm}>Selesai</button>
        </div>
      ) : (
        <>
          <div className="submit-heading">
            <span className="empty-file"><FilePlus2 size={25} aria-hidden="true" /></span>
            <h2 id="submit-material-title">Kirim materi</h2>
            <p>Isi materi yang ingin dibagikan ke teman sekelas.</p>
          </div>
          <form className="submit-form" onSubmit={handleSubmit} noValidate>
            <label>
              Mata kuliah
              <select value={courseId} onChange={(event) => setCourseId(event.target.value)} required>
                <option value="">Pilih mata kuliah</option>
                {courses.map((course) => <option value={course.id} key={course.id}>{course.name}</option>)}
              </select>
            </label>
            {!courses.length && <p className="inline-error">Pilihan mata kuliah belum tersedia.</p>}
            <label>
              Judul materi
              <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} required />
            </label>
            <label>
              Nama pengirim <span>(opsional)</span>
              <input value={senderName} onChange={(event) => setSenderName(event.target.value)} maxLength={60} />
            </label>
            <label>
              File materi
              <input
                ref={fileInput}
                type="file"
                accept=".pdf,.docx,.pptx,.xlsx,.jpg,.jpeg,.png,.webp,.zip"
                aria-describedby="submit-file-help"
                onChange={(event) => {
                  setFile(event.target.files?.[0] ?? null);
                  setError("");
                }}
              />
              <small id="submit-file-help">PDF, DOCX, PPTX, XLSX, JPG, PNG, WebP, atau ZIP. Maksimal 20 MB.</small>
            </label>
            {file && <p className="selected-file">{file.name}</p>}
            <div className="submission-honeypot" aria-hidden="true">
              <label htmlFor="website-address">Jangan isi kolom ini</label>
              <input id="website-address" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
            </div>
            {error && <p className="inline-error" role="alert">{error}</p>}
            {isSubmitting && (
              <div className="upload-progress">
                <div><span>{uploadStage === "saving" ? "Menyimpan kiriman" : "Mengunggah file"}</span><span>{progress}%</span></div>
                <progress value={progress} max="100" aria-label="Progress pengiriman materi" />
              </div>
            )}
            <button type="submit" className="button-primary" disabled={isSubmitting || !courses.length || cooldown > 0}>
              {isSubmitting ? "Mengirim…" : cooldown ? `Kirim lagi dalam ${formatCooldown(cooldown)}` : "Kirim materi"}
            </button>
          </form>
        </>
      )}
    </OverlayShell>
  );
}
