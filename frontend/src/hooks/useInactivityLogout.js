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

  const logout = useCallback(async () => {
    await logoutApi();
    navigate("/login");
  }, [navigate]);

  const resetTimer = useCallback(() => {
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

  useEffect(() => {
    if (!isAuthenticated) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warnRef.current) clearTimeout(warnRef.current);
      return;
    }

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warnRef.current) clearTimeout(warnRef.current);
    };
  }, [isAuthenticated, resetTimer]); // ← isAuthenticated dependency
}