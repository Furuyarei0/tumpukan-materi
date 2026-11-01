import { useCallback, useEffect, useState } from "react";
import { getSupabaseClient } from "../lib/supabase.js";
import { getAdminSession, signInAdmin, signOutAdmin, updateAdminPassword, verifyAdminSession } from "../services/auth.js";

const developmentAdminEnabled = import.meta.env.DEV && import.meta.env.VITE_DEV_ROLE === "admin";

export function useAdminSession() {
  const [isAdmin, setIsAdmin] = useState(developmentAdminEnabled);
  const [isLoading, setIsLoading] = useState(!developmentAdminEnabled);
  const [error, setError] = useState(null);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  useEffect(() => {
    if (developmentAdminEnabled) return undefined;
    let active = true;
    let subscription;

    async function restoreSession() {
      try {
        const session = await getAdminSession();
        if (active) setIsAdmin(Boolean(session));
      } catch (sessionError) {
        if (active) setError(sessionError);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    restoreSession();
    try {
      ({ data: { subscription } } = getSupabaseClient().auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_OUT") {
          setIsAdmin(false);
          setIsPasswordRecovery(false);
          return;
        }
        if (session) {
          verifyAdminSession(session)
            .then((currentSession) => {
              if (!active) return;
              setIsAdmin(Boolean(currentSession));
              setIsPasswordRecovery(event === "PASSWORD_RECOVERY" && Boolean(currentSession));
            })
            .catch((sessionError) => {
              if (active) {
                setError(sessionError);
                setIsPasswordRecovery(false);
              }
            });
        }
      }));
    } catch (sessionError) {
      setError(sessionError);
      setIsLoading(false);
    }

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    setError(null);
    if (developmentAdminEnabled) {
      if (!email.trim() || !password) throw new Error("Email atau kata sandi tidak cocok.");
      setIsAdmin(true);
      return;
    }

    setIsLoading(true);
    try {
      await signInAdmin(email, password);
      setIsAdmin(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    if (!developmentAdminEnabled) await signOutAdmin();
    setIsAdmin(false);
  }, []);

  const updatePassword = useCallback(async (password) => {
    await updateAdminPassword(password);
    setIsPasswordRecovery(false);
    setIsAdmin(true);
  }, []);

  return {
    isAdmin,
    isLoading,
    error,
    signIn,
    signOut,
    updatePassword,
    isPasswordRecovery,
    isSimulated: developmentAdminEnabled,
  };
}
