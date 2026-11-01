import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { OverlayShell } from "../ui/OverlayShell.jsx";

export function AdminPasswordRecovery({ onUpdatePassword, onComplete, onCancel }) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Kata sandi harus terdiri dari minimal 8 karakter.");
      return;
    }
    if (password !== confirmation) {
      setError("Konfirmasi kata sandi belum cocok.");
      return;
    }

    setIsSaving(true);
    try {
      await onUpdatePassword(password);
      onComplete();
    } catch (saveError) {
      setError(saveError.message || "Kata sandi belum bisa diperbarui. Coba lagi.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <OverlayShell open onClose={onCancel} titleId="admin-password-recovery-title" panelClassName="admin-login-panel">
      <div className="admin-login-content">
        <span className="empty-file"><LockKeyhole size={25} aria-hidden="true" /></span>
        <h1 id="admin-password-recovery-title">Buat kata sandi baru</h1>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>Kata sandi baru
            <input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} />
          </label>
          <label>Ulangi kata sandi
            <input type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required minLength={8} />
          </label>
          {error && <p className="inline-error" role="alert">{error}</p>}
          <button type="submit" className="button-primary" disabled={isSaving}>{isSaving ? "Menyimpan…" : "Perbarui kata sandi"}</button>
        </form>
      </div>
    </OverlayShell>
  );
}
