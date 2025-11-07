"use client";

import { useEffect } from "react";

// Small client-only guard to ensure admin pages respect the user's theme
// preference (re-applies the html.dark class based on localStorage or prefers-color-scheme).
export default function AdminThemeGuard() {
  useEffect(() => {
    try {
      let dark = true;
      const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
      if (stored === "dark") dark = true;
      else if (stored === "light") dark = false;
      else if (typeof window !== "undefined" && window.matchMedia)
        dark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      const root = document.documentElement;
      root.classList.toggle("dark", dark);

      try {
        let meta = document.querySelector('meta[name="color-scheme"]');
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name','color-scheme');
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', dark ? 'dark light' : 'light dark');
      } catch {}
    } catch {}
  }, []);

  return null;
}
