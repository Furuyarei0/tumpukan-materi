# Supabase Edge Function: `notify-submission`

Fungsi ini bertugas mengirimkan notifikasi **Email (via Resend)** dan **Web Push Browser** ke admin ketika mahasiswa mengirim materi baru (`status = 'pending'`).

---

## 1. Secrets / Environment Variables yang Dibutuhkan

Atur secret berikut di **Supabase Dashboard > Settings > Edge Functions (Secrets)**:

| Nama Secret | Deskripsi | Contoh / Keterangan |
|---|---|---|
| `ADMIN_NOTIFY_EMAIL` | Alamat email tujuan notifikasi admin (Gmail Anda) | `admin@gmail.com` |
| `RESEND_API_KEY` | API Key dari [Resend.com](https://resend.com) | `re_123456789...` |
| `VAPID_PUBLIC_KEY` | Public Key VAPID untuk Web Push | String base64url |
| `VAPID_PRIVATE_KEY` | Private Key VAPID untuk Web Push | String base64url |
| `VAPID_SUBJECT` | Subject identitas VAPID (email atau URL) | `mailto:admin@gmail.com` |
| `SITE_URL` | URL website produksi untuk tautan email | `https://tumpukanmaterii.netlify.app` |

> [!NOTE]
> `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` otomatis disuntikkan oleh runtime Supabase Edge Functions.

---

## 2. Cara Deploy Edge Function

Gunakan Supabase CLI di terminal komputer Anda:

```bash
# Login ke Supabase (jika belum)
supabase login

# Tautkan proyek (ganti <project-ref> dengan ref proyek Anda)
supabase link --project-ref csxfmuysrooutciblgay

# Deploy Edge Function
supabase functions deploy notify-submission --no-verify-jwt
```

---

## 3. Menghubungkan Database Webhook

Agar fungsi terpanggil otomatis setiap ada kiriman baru:

1. Buka **Supabase Dashboard > Database > Webhooks**.
2. Klik **Create a new webhook**.
3. Isi konfigurasi:
   - **Name**: `notify_submission_webhook`
   - **Table**: `materials`
   - **Events**: Beri centang hanya pada **Insert**
   - **Type of webhook**: Pilih **Supabase Edge Functions**
   - **Edge Function**: Pilih `notify-submission`
   - **HTTP Method**: `POST`
4. Klik **Save Webhook**.

---

## 4. Keamanan & Anti-Flood

- **Sanitasi HTML**: Semua teks masukan dari mahasiswa (`title`, `submitted_by`, nama matkul) disanitasi dengan fungsi `escapeHtml` untuk mencegah injeksi HTML / XSS pada email.
- **Rate Limiting**: Membatasi frekuensi email dalam durasi 10 menit agar kotak masuk admin tidak banjir jika terjadi spam kiriman.
- **Fail-safe**: Kegagalan pengiriman email/push dicatat ke log fungsi dan **tidak akan membatalkan/menggagalkan** kiriman materi mahasiswa di database.
