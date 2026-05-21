// This component logs user out after 1 hour of inactivity, with a warning at 55 minutes. It listens to various user events to reset the timer.
import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { logoutApi } from "../models/authApi";
import toast from 'react-hot-toast';

const TIMEOUT_MS = 60 * 60 * 1000;
const WARN_MS = 55 * 60 * 1000;

export function useInactivityLogout(isAuthenticated) {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const warnRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  const logout = useCallback(async () => {
    await logoutApi();
    navigate("/login");
  }, [navigate]);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (timerRef.current) clearTimeout(timerRef.current);
    if (warnRef.current) clearTimeout(warnRef.current);

    warnRef.current = setTimeout(() => {
      toast("Sinut kirjataan ulos 5 minuutin kuluttua inaktiivisuuden vuoksi.", {
        icon: "⏱️",
        duration: 10000,
      });
    }, WARN_MS);

    timerRef.current = setTimeout(logout, TIMEOUT_MS);
  }, [logout]);

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === "visible") {
      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed >= TIMEOUT_MS) {
        logout();
      } else if (elapsed >= WARN_MS) {
        toast("Sinut kirjataan ulos 5 minuutin kuluttua inaktiivisuuden vuoksi.", {
          icon: "⏱️",
          duration: 5000,
        });
      }
    }
  }, [logout]);

  const handleBeforeUnload = useCallback(() => {
    sessionStorage.setItem("isReloading", "true");
  }, []);

  const handlePageHide = useCallback(() => {
    const isReloading = sessionStorage.getItem("isReloading");
    if (!isReloading) {
      logoutApi();
    }
    sessionStorage.removeItem("isReloading");
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warnRef.current) clearTimeout(warnRef.current);
      return;
    }

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];
    events.forEach(e => window.addEventListener(e, resetTimer));
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);         
    resetTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warnRef.current) clearTimeout(warnRef.current);
    };
  }, [isAuthenticated, resetTimer, handleVisibilityChange, handleBeforeUnload, handlePageHide]);
}