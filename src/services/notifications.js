import { getSupabaseClient } from "../lib/supabase.js";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function isPushSupported() {
  return (
    typeof window !== "undefined" &&
    window.isSecureContext &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function getNotificationPermission() {
  if (!isPushSupported()) return null;
  return Notification.permission;
}

export async function getServiceWorkerRegistration() {
  if (!isPushSupported()) return null;
  const registration = await navigator.serviceWorker.getRegistration("/sw.js");
  if (registration) return registration;
  return navigator.serviceWorker.register("/sw.js", { scope: "/" });
}

export async function getCurrentPushSubscription() {
  if (!isPushSupported()) return null;
  try {
    const registration = await getServiceWorkerRegistration();
    if (!registration) return null;
    return await registration.pushManager.getSubscription();
  } catch {
    return null;
  }
}

export async function subscribeToPush(vapidPublicKey) {
  if (!isPushSupported()) {
    throw new Error("Browser ini tidak mendukung notifikasi Web Push.");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Izin notifikasi tidak diberikan oleh pengguna.");
  }

  const registration = await getServiceWorkerRegistration();
  if (!registration) {
    throw new Error("Gagal mendaftarkan service worker.");
  }

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    if (!vapidPublicKey) {
      throw new Error("Kunci VAPID public belum dikonfigurasi.");
    }
    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });
  }

  // Simpan atau perbarui subscription ke Supabase jika login sebagai admin
  const json = subscription.toJSON();
  const endpoint = json.endpoint;
  const p256dh = json.keys?.p256dh;
  const auth = json.keys?.auth;

  if (endpoint && p256dh && auth) {
    try {
      const supabase = getSupabaseClient();
      const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
      if (sessionErr) throw sessionErr;

      const userId = sessionData?.session?.user?.id;
      if (!userId) {
        console.warn("User belum login sebagai admin di Supabase Auth saat berlangganan push.");
      }

      const { error: dbError } = await supabase.from("push_subscriptions").upsert(
        {
          endpoint,
          p256dh,
          auth,
          user_id: userId || null,
          user_agent: navigator.userAgent.slice(0, 255),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "endpoint" },
      );

      if (dbError) {
        throw new Error(`Gagal menyimpan ke database: ${dbError.message}`);
      }
    } catch (saveError) {
      console.error("Error sinkronisasi push subscription:", saveError);
      throw saveError;
    }
  }

  return subscription;
}

export async function unsubscribeFromPush() {
  if (!isPushSupported()) return;

  try {
    const registration = await getServiceWorkerRegistration();
    if (!registration) return;

    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      const endpoint = subscription.endpoint;
      await subscription.unsubscribe();

      try {
        const supabase = getSupabaseClient();
        await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
      } catch (dbError) {
        console.warn("Gagal menghapus subscription dari database:", dbError);
      }
    }
  } catch (error) {
    console.error("Gagal berhenti berlangganan notifikasi:", error);
    throw error;
  }
}

export async function sendLocalTestNotification() {
  if (!isPushSupported()) {
    throw new Error("Browser tidak mendukung notifikasi.");
  }

  if (Notification.permission !== "granted") {
    const next = await Notification.requestPermission();
    if (next !== "granted") {
      throw new Error("Izin notifikasi belum diberikan.");
    }
  }

  const registration = await getServiceWorkerRegistration();
  if (!registration) {
    throw new Error("Service worker belum siap.");
  }

  await registration.showNotification("Tumpukan Materi (Uji Coba)", {
    body: "Notifikasi browser berhasil diaktifkan dan bekerja dengan baik!",
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    data: { url: "/#admin/notifications" },
    tag: "test-notification",
  });
}
