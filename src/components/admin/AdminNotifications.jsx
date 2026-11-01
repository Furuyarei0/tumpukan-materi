import { useEffect, useState } from "react";
import {
  getCurrentPushSubscription,
  getNotificationPermission,
  isPushSupported,
  sendLocalTestNotification,
  subscribeToPush,
  unsubscribeFromPush,
} from "../../services/notifications.js";

export function AdminNotifications() {
  const [permission, setPermission] = useState(getNotificationPermission);
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const supported = isPushSupported();
  const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

  useEffect(() => {
    async function loadSubscription() {
      if (!supported) {
        setIsLoading(false);
        return;
      }
      try {
        const sub = await getCurrentPushSubscription();
        setSubscription(sub);
      } catch (err) {
        console.warn("Gagal membaca status subscription:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSubscription();
  }, [supported]);

  async function handleEnablePush() {
    setErrorMessage("");
    setStatusMessage("");
    setIsProcessing(true);

    try {
      const sub = await subscribeToPush(vapidKey);
      setSubscription(sub);
      setPermission("granted");
      setStatusMessage("Notifikasi web push berhasil diaktifkan untuk browser ini.");
    } catch (err) {
      setPermission(getNotificationPermission());
      setErrorMessage(err.message || "Gagal mengaktifkan notifikasi push.");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleDisablePush() {
    setErrorMessage("");
    setStatusMessage("");
    setIsProcessing(true);

    try {
      await unsubscribeFromPush();
      setSubscription(null);
      setStatusMessage("Langganan notifikasi web push untuk browser ini telah dinonaktifkan.");
    } catch (err) {
      setErrorMessage(err.message || "Gagal menonaktifkan notifikasi.");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleTestNotification() {
    setErrorMessage("");
    setStatusMessage("");
    try {
      await sendLocalTestNotification();
      setStatusMessage("Notifikasi uji coba berhasil dikirim ke browser!");
    } catch (err) {
      setErrorMessage(err.message || "Gagal menampilkan notifikasi uji coba.");
    }
  }

  const isSubscribed = Boolean(subscription);

  const statusText = !supported
    ? "Browser ini belum mendukung notifikasi"
    : permission === "denied"
      ? "Izin notifikasi diblokir"
      : isSubscribed
        ? "Aktif (Notifikasi push siap diterima)"
        : permission === "granted"
          ? "Izin diberikan, push belum aktif"
          : "Belum diaktifkan";

  return (
    <>
      <div className="admin-page-title">
        <div>
          <h2>Notifikasi browser</h2>
          <p>Terima pemberitahuan saat ada kiriman materi baru, meski panel admin sedang tidak dibuka.</p>
        </div>
      </div>
      <div className="admin-notification-settings">
        <section className="admin-notification-row" aria-labelledby="admin-notification-device">
          <div>
            <h3 id="admin-notification-device">Browser ini</h3>
            <p>Aktifkan push pada perangkat ini. Perangkat lain perlu diaktifkan masing-masing.</p>
          </div>
          <div className="admin-notification-state">
            <p className="admin-notification-status" role="status">
              <span
                className={`admin-notification-dot ${
                  isSubscribed
                    ? "allowed"
                    : permission === "denied"
                      ? "blocked"
                      : ""
                }`}
                aria-hidden="true"
              />
              {statusText}
            </p>

            {supported && !isSubscribed && permission !== "denied" && (
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                <button
                  type="button"
                  className="button-primary"
                  onClick={handleEnablePush}
                  disabled={isProcessing || isLoading}
                >
                  {isProcessing ? "Memproses…" : "Aktifkan notifikasi push"}
                </button>
              </div>
            )}

            {supported && isSubscribed && (
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                <button
                  type="button"
                  className="button-secondary"
                  onClick={handleTestNotification}
                  disabled={isProcessing}
                >
                  Uji coba notifikasi
                </button>
                <button
                  type="button"
                  className="button-secondary danger-button"
                  onClick={handleDisablePush}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Menonaktifkan…" : "Nonaktifkan notifikasi"}
                </button>
              </div>
            )}

            {permission === "denied" && (
              <p className="admin-notification-message blocked">
                Izin notifikasi diblokir di peramban ini. Buka pengaturan situs di browser untuk mengizinkan notifikasi, lalu muat ulang halaman.
              </p>
            )}

            {!supported && (
              <p className="admin-notification-message">
                Gunakan browser modern yang mendukung Service Worker dan Web Push pada koneksi HTTPS untuk mengaktifkan notifikasi.
              </p>
            )}

            {statusMessage && (
              <p className="admin-notification-message" role="status" style={{ color: "var(--forest)" }}>
                {statusMessage}
              </p>
            )}

            {errorMessage && (
              <p className="admin-notification-message blocked" role="alert">
                {errorMessage}
              </p>
            )}

            {!vapidKey && supported && (
              <p className="admin-notification-help" style={{ fontSize: "13px", opacity: 0.85 }}>
                Catatan: Kunci <code>VITE_VAPID_PUBLIC_KEY</code> belum diisi di environment. Tombol uji coba lokal tetap dapat dicoba.
              </p>
            )}

            {supported && (
              <p className="admin-notification-help">
                Pengaturan ini tersimpan di browser ini dan tersinkronisasi ke database Supabase saat Anda masuk sebagai admin.
              </p>
            )}
          </div>
        </section>

        <section className="admin-notification-row" aria-labelledby="admin-notification-preview">
          <div>
            <h3 id="admin-notification-preview">Contoh pemberitahuan</h3>
            <p>Push hanya berisi ringkasan singkat. Klik notifikasi untuk langsung membuka antrean Kiriman masuk.</p>
          </div>
          <div className="admin-notification-preview" aria-label="Contoh tampilan notifikasi">
            <strong>Tumpukan Materi</strong>
            <b>Ada kiriman materi baru</b>
            <span>Struktur Data dan Algoritma · Pertemuan 4</span>
            <span>Klik untuk membuka dan meninjau file.</span>
          </div>
        </section>
      </div>
    </>
  );
}
