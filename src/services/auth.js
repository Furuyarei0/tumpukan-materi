import { getSupabaseClient } from "../lib/supabase.js";

export async function verifyAdminSession(session) {
  if (!session?.user) return null;

  const { data, error } = await getSupabaseClient().rpc("is_admin");
  if (error) throw error;
  if (data === true) return session;

  const { error: signOutError } = await getSupabaseClient().auth.signOut();
  if (signOutError) throw signOutError;
  return null;
}

export async function getAdminSession() {
  const { data, error } = await getSupabaseClient().auth.getSession();
  if (error) throw error;
  return verifyAdminSession(data.session);
}

export async function signInAdmin(email, password) {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) throw new Error("Email atau kata sandi tidak cocok.");

  try {
    const session = await verifyAdminSession(data.session);
    if (session) return session;
  } catch {
    const { error: signOutError } = await getSupabaseClient().auth.signOut();
    if (signOutError) throw new Error("Sesi belum bisa diverifikasi. Keluar lalu coba lagi.");
    throw new Error("Email atau kata sandi tidak cocok.");
  }

  throw new Error("Email atau kata sandi tidak cocok.");
}

export async function signOutAdmin() {
  const { error } = await getSupabaseClient().auth.signOut();
  if (error) throw error;
}

export async function sendAdminPasswordReset(email) {
  const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email.trim(), {
    redirectTo: window.location.origin,
  });
  if (error) throw new Error("Email reset belum bisa dikirim. Coba lagi.");
}

export async function updateAdminPassword(password) {
  const { error } = await getSupabaseClient().auth.updateUser({ password });
  if (error) throw new Error("Kata sandi belum bisa diperbarui. Coba lagi.");
}
