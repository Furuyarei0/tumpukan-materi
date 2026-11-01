import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { OverlayShell } from "../ui/OverlayShell.jsx";

export function AdminConfirmOverlay({ confirmation, onClose, onConfirm }) {
  const [error, setError] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  if (!confirmation) return null;

  async function confirm() {
    setError("");
    setIsWorking(true);
    try {
      await onConfirm(confirmation);
    } catch (actionError) {
      setError(actionError.message || "Perubahan belum bisa dilakukan. Coba lagi.");
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <OverlayShell open onClose={onClose} titleId="admin-confirm-title" panelClassName="admin-confirm-panel">
      <span className="empty-file"><AlertTriangle size={24} aria-hidden="true" /></span>
      <h2 id="admin-confirm-title">{confirmation.title}</h2>
      <p>{confirmation.message}</p>
      {error && <p className="inline-error" role="alert">{error}</p>}
      <div className="admin-form-actions">
        <button type="button" className="button-secondary" onClick={onClose}>Batal</button>
        <button type="button" className="button-primary danger-button" onClick={confirm} disabled={isWorking}>{isWorking ? "Memproses…" : confirmation.actionLabel || "Hapus"}</button>
      </div>
    </OverlayShell>
  );
}
