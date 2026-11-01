import { getSupabaseClient } from "../lib/supabase.js";
import { getMaterialMimeType, validateMaterialFile } from "../lib/file-validation.js";

function createFilePath(courseId, file) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${courseId}/${crypto.randomUUID()}-${safeName}`;
}

function uploadFile({ supabaseUrl, apiKey, accessToken, path, file, onProgress }) {
  return new Promise((resolve, reject) => {
    const encodedPath = path.split("/").map(encodeURIComponent).join("/");
    const request = new XMLHttpRequest();
    request.open("POST", `${supabaseUrl}/storage/v1/object/submissions/${encodedPath}`);
    request.setRequestHeader("apikey", apiKey);
    request.setRequestHeader("Authorization", `Bearer ${accessToken || apiKey}`);
    request.setRequestHeader("Content-Type", getMaterialMimeType(file));
    request.setRequestHeader("x-upsert", "false");
    request.timeout = 120000;

    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 90));
    });
    request.addEventListener("load", () => {
      if (request.status >= 200 && request.status < 300) {
        resolve();
        return;
      }

      let message = "File gagal diunggah. Coba lagi.";
      try {
        const response = JSON.parse(request.responseText);
        message = response.message || response.error || message;
      } catch {
        if (request.status === 413) message = "Ukuran file maksimal 20 MB.";
      }
      reject(new Error(message));
    });
    request.addEventListener("error", () => reject(new Error("Koneksi terputus saat mengunggah file. Coba lagi.")));
    request.addEventListener("timeout", () => reject(new Error("Upload terlalu lama dan dibatalkan. Periksa koneksi lalu coba lagi.")));
    request.addEventListener("abort", () => reject(new Error("Upload dibatalkan.")));
    request.send(file);
  });
}

export async function submitMaterial(submission, {
  onProgress = () => {},
  client,
  supabaseUrl = import.meta.env.VITE_SUPABASE_URL,
  apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY,
} = {}) {
  if (!submission.courseId || !submission.title?.trim()) {
    throw new Error("Pilih mata kuliah dan isi judul materi.");
  }
  if (submission.title.trim().length > 150) throw new Error("Judul materi maksimal 150 karakter.");
  if (submission.senderName?.trim().length > 60) throw new Error("Nama pengirim maksimal 60 karakter.");
  const fileError = validateMaterialFile(submission.file);
  if (fileError) throw new Error(fileError);

  const supabase = client ?? getSupabaseClient();
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!supabaseUrl || !apiKey) {
    throw new Error("Koneksi kirim materi belum dikonfigurasi. Hubungi pengelola.");
  }

  const path = createFilePath(submission.courseId, submission.file);
  onProgress(0, "uploading");
  await uploadFile({
    supabaseUrl,
    apiKey,
    accessToken: sessionData.session?.access_token,
    path,
    file: submission.file,
    onProgress: (progress) => onProgress(progress, "uploading"),
  });

  onProgress(95, "saving");
  const { error } = await supabase.from("materials").insert({
    course_id: submission.courseId,
    title: submission.title.trim(),
    file_path: path,
    file_name: submission.file.name,
    file_size: submission.file.size,
    mime_type: getMaterialMimeType(submission.file),
    status: "pending",
    submitted_by: submission.senderName?.trim() || null,
  });

  if (error) {
    const { error: cleanupError } = await supabase.storage.from("submissions").remove([path]);
    if (cleanupError) {
      throw new Error(`Kiriman gagal disimpan dan file sementara gagal dibersihkan: ${cleanupError.message}`);
    }
    throw error;
  }

  onProgress(100, "complete");
  return { status: "pending" };
}
