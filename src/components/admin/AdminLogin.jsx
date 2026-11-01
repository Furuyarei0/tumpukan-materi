import { useState } from "react";
import { OverlayShell } from "../ui/OverlayShell.jsx";
import logo from "../../assets/logo/logo.svg";

export function AdminLogin({ onSignIn, onPasswordReset, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setNotice("");
    try {
      if (!email.trim() || !password) {
        setError("Email atau kata sandi tidak cocok.");
        return;
      }
      await onSignIn(email, password);
    } catch (signInError) {
      setError(signInError instanceof Error && signInError.message.startsWith("Konfigurasi Supabase belum tersedia.")
        ? "Koneksi login belum dikonfigurasi untuk lingkungan ini. Hubungi pengelola."
        : "Email atau kata sandi tidak cocok.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasswordReset() {
    setIsSubmitting(true);
    setError("");
    setNotice("");
    try {
      if (!email.trim()) {
        setError("Masukkan email akun admin terlebih dahulu.");
        return;
      }
      await onPasswordReset(email);
      setNotice("Jika akun admin terdaftar, email reset akan dikirim.");
    } catch {
      setError("Email reset belum bisa dikirim. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <OverlayShell open onClose={onBack} titleId="admin-login-title" panelClassName="admin-login-panel">
      <div className="admin-login-content admin-login-form-content">
        <button type="button" className="admin-login-brand" onClick={onBack} aria-label="Kembali ke beranda">
          <img src={logo} alt="Tumpukan Materi" />
        </button>
        <h1 id="admin-login-title">Masuk admin</h1>
        <p>Gunakan akun admin untuk mengelola materi kelas.</p>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label className="admin-field">Email
            <input autoComplete="username" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <div className="admin-login-password-field">
            <div className="admin-login-password-heading">
              <label htmlFor="admin-login-password">Kata sandi</label>
              <button type="button" className="admin-login-reset" onClick={handlePasswordReset} disabled={isSubmitting}>Lupa kata sandi?</button>
            </div>
            <input id="admin-login-password" autoComplete="current-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          {error && <p className="inline-error" role="alert">{error}</p>}
          {notice && <p className="admin-login-notice" role="status">{notice}</p>}
          <button type="submit" className="button-primary" disabled={isSubmitting}>
            {isSubmitting ? "Memeriksa…" : "Masuk"}
          </button>
        </form>
        <button type="button" className="admin-back-link" onClick={onBack}>Kembali ke beranda</button>
      </div>
    </OverlayShell>
  );
}
