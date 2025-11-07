"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

type ThemeToggleProps = {
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
};

export function ThemeToggle({ variant = "default", size, className }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const current = document.documentElement.classList.contains("dark");
    setIsDark(current);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "theme" && e.newValue) {
        const nextDark = e.newValue === "dark";
        document.documentElement.classList.toggle("dark", nextDark);
        setIsDark(nextDark);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = () => {
    if (typeof window === "undefined") return;
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    setIsDark(next);
  };

  // Avoid hydration mismatch: render nothing until we know state
  if (isDark === null) {
    return (
      <Button aria-label="Toggle theme" variant={variant} size={size} className={className} disabled>
        <Moon className="size-4" />
      </Button>
    );
  }

  return (
    <Button onClick={toggle} aria-pressed={isDark} aria-label="Toggle theme" variant={variant} size={size} className={className}>
      {isDark ? (
        <>
          <Sun className="size-4" />
          Light
        </>
      ) : (
        <>
          <Moon className="size-4" />
          Dark
        </>
      )}
    </Button>
  );
}
