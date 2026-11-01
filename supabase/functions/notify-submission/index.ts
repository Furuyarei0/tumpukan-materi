// Supabase Edge Function: notify-submission
// Mengirim notifikasi email (Resend) dan Web Push ke admin saat ada kiriman materi baru (status: pending)
// Sesuai dengan instruksi di .github/copilot-instructions.md Bagian 8.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";
import webPush from "npm:web-push@3.6.7";

function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatWibDate(isoString?: string): string {
  try {
    const date = isoString ? new Date(isoString) : new Date();
    return (
      new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date) + " WIB"
    );
  } catch {
    return isoString || "Waktu tidak diketahui";
  }
}

// In-memory rate limiting tracker (mencegah banjir email dalam window 10 menit)
let recentNotificationsCount = 0;
let windowStartTime = Date.now();
const WINDOW_DURATION_MS = 10 * 60 * 1000; // 10 menit
const MAX_NOTIFICATIONS_PER_WINDOW = 5;

function checkRateLimit(): { allow: boolean; isFlood: boolean } {
  const now = Date.now();
  if (now - windowStartTime > WINDOW_DURATION_MS) {
    windowStartTime = now;
    recentNotificationsCount = 0;
  }
  recentNotificationsCount++;
  if (recentNotificationsCount > MAX_NOTIFICATIONS_PER_WINDOW) {
    return { allow: false, isFlood: true };
  }
  return { allow: true, isFlood: false };
}

serve(async (req) => {
  // Hanya menerima metode POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();

    // Payload bisa berasal dari Supabase Database Webhook: { type: 'INSERT', table: 'materials', record: {...} }
    // atau pemanggilan langsung: { record: {...} } atau { ... }
    const record = body.record || (body.table === "materials" ? body.record : body);

    if (!record || !record.id) {
      return new Response(JSON.stringify({ message: "Payload tidak berisi record materi yang valid." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Hanya proses materi berstatus 'pending'
    if (record.status !== "pending") {
      return new Response(
        JSON.stringify({ message: "Diabaikan: status materi bukan 'pending'.", status: record.status }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    // Konfigurasi Supabase Client untuk Edge Function
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Ambil nama mata kuliah
    let courseName = "Mata kuliah tidak diketahui";
    if (record.course_id) {
      const { data: course } = await supabase
        .from("courses")
        .select("name")
        .eq("id", record.course_id)
        .maybeSingle();
      if (course?.name) courseName = course.name;
    }

    const title = record.title || "Tanpa judul";
    const submitter = record.submitted_by || "Mahasiswa (Anonim)";
    const dateFormatted = formatWibDate(record.created_at);

    const escapedTitle = escapeHtml(title);
    const escapedCourse = escapeHtml(courseName);
    const escapedSubmitter = escapeHtml(submitter);

    const adminEmail = Deno.env.get("ADMIN_NOTIFY_EMAIL");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY");
    const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY");
    const vapidSubject = Deno.env.get("VAPID_SUBJECT") || `mailto:${adminEmail || "admin@tumpukanmateri.local"}`;
    const siteUrl = Deno.env.get("SITE_URL") || "https://tumpukanmaterii.netlify.app";

    const results = {
      emailSent: false,
      pushSentCount: 0,
      errors: [] as string[],
    };

    // 1. PENGIRIMAN EMAIL VIA RESEND
    if (resendApiKey && adminEmail) {
      const { allow, isFlood } = checkRateLimit();

      if (allow) {
        const emailHtml = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F3EBD8; margin: 0; padding: 24px; color: #2B2A24; }
    .card { background-color: #FBF6E9; max-width: 560px; margin: 0 auto; border-radius: 8px; border: 1px solid #DDD7CA; box-shadow: 0 4px 12px rgba(43,42,36,0.08); overflow: hidden; }
    .header { background-color: #3F5B3A; color: #FFFFFF; padding: 20px 24px; }
    .header h1 { margin: 0; font-size: 20px; font-weight: bold; letter-spacing: -0.3px; }
    .content { padding: 24px; }
    .intro { margin-top: 0; margin-bottom: 20px; font-size: 15px; line-height: 1.5; color: #555146; }
    .item-box { background-color: #FFFFFF; border: 1px solid #E5DFD3; border-radius: 6px; padding: 16px; margin-bottom: 24px; }
    .item-row { margin-bottom: 10px; font-size: 14px; line-height: 1.4; }
    .item-row:last-child { margin-bottom: 0; }
    .label { font-weight: 600; color: #736D5E; display: inline-block; width: 130px; }
    .value { font-weight: 500; color: #2B2A24; }
    .btn-container { text-align: center; margin: 28px 0 16px; }
    .btn { display: inline-block; background-color: #3F5B3A; color: #FFFFFF !important; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: 600; font-size: 14px; }
    .footer { border-top: 1px solid #E5DFD3; padding: 16px 24px; font-size: 12px; color: #8C8678; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Tumpukan Materi — Kiriman Baru</h1>
    </div>
    <div class="content">
      <p class="intro">Ada kiriman materi kuliah baru yang menunggu persetujuan Anda di panel admin:</p>
      <div class="item-box">
        <div class="item-row"><span class="label">Judul Materi:</span> <span class="value"><strong>${escapedTitle}</strong></span></div>
        <div class="item-row"><span class="label">Mata Kuliah:</span> <span class="value">${escapedCourse}</span></div>
        <div class="item-row"><span class="label">Pengirim:</span> <span class="value">${escapedSubmitter}</span></div>
        <div class="item-row"><span class="label">Waktu Kirim:</span> <span class="value">${dateFormatted}</span></div>
        <div class="item-row"><span class="label">Status:</span> <span class="value" style="color:#C4674A; font-weight:600;">Menunggu Persetujuan</span></div>
      </div>
      <div class="btn-container">
        <a href="${siteUrl}/#admin/inbox" class="btn">Tinjau Kiriman di Panel Admin</a>
      </div>
    </div>
    <div class="footer">
      Email ini dikirim otomatis oleh sistem Tumpukan Materi saat ada kiriman baru.
    </div>
  </div>
</body>
</html>
        `.trim();

        try {
          const resendRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Tumpukan Materi <onboarding@resend.dev>",
              to: [adminEmail],
              subject: `[Kiriman Baru] ${title} (${courseName})`,
              html: emailHtml,
            }),
          });

          if (resendRes.ok) {
            results.emailSent = true;
          } else {
            const errText = await resendRes.text();
            results.errors.push(`Resend error: ${errText}`);
            console.error("Gagal mengirim email via Resend:", errText);
          }
        } catch (emailErr: any) {
          results.errors.push(`Email error: ${emailErr.message}`);
          console.error("Kesalahan jaringan saat memanggil Resend:", emailErr);
        }
      } else if (isFlood) {
        console.warn("Batas frekuensi email tercapai, notifikasi email dilewati untuk mencegah spam.");
      }
    } else {
      results.errors.push("RESEND_API_KEY atau ADMIN_NOTIFY_EMAIL belum dikonfigurasi.");
    }

    // 2. PENGIRIMAN WEB PUSH NOTIFICATION
    if (vapidPublicKey && vapidPrivateKey) {
      try {
        webPush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

        const { data: subscriptions, error: subError } = await supabase
          .from("push_subscriptions")
          .select("id, endpoint, p256dh, auth");

        if (!subError && subscriptions && subscriptions.length > 0) {
          const pushPayload = JSON.stringify({
            title: "Ada kiriman materi baru!",
            body: `${title} · ${courseName}`,
            url: "/#admin/inbox",
          });

          for (const sub of subscriptions) {
            try {
              await webPush.sendNotification(
                {
                  endpoint: sub.endpoint,
                  keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth,
                  },
                },
                pushPayload,
              );
              results.pushSentCount++;
            } catch (pushErr: any) {
              console.warn(`Gagal mengirim push ke endpoint: ${sub.endpoint}`, pushErr.message);
              // Jika endpoint sudah 410 (Gone) atau 404 (Not Found), hapus dari database
              if (pushErr.statusCode === 410 || pushErr.statusCode === 404) {
                await supabase.from("push_subscriptions").delete().eq("id", sub.id);
              }
            }
          }
        }
      } catch (pushInitErr: any) {
        results.errors.push(`Push init error: ${pushInitErr.message}`);
        console.error("Kesalahan konfigurasi web push:", pushInitErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Proses notifikasi selesai dijalankan.",
        details: results,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err: any) {
    // Kegagalan pada fungsi notifikasi TIDAK BOLEH menggagalkan request dengan fatal
    console.error("Error pada notify-submission:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || "Terjadi kesalahan internal pada Edge Function notify-submission.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});
