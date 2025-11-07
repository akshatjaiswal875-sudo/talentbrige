"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/components/LoginDialog";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Menu } from "lucide-react";
import Image from "next/image";

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, authChecked, logout: authLogout } = useAuth();
  // local open state still required for dropdowns/dialog
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarMenu, setAvatarMenu] = useState(false);
  const avatarRef = useRef<HTMLDivElement | null>(null);

  // auth is provided by AuthProvider

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarMenu(false);
    }
    document.addEventListener('click', onDoc);
    // listen for global request to open login dialog (e.g., after auth guard)
    function onOpenLogin() {
      setOpen(true);
    }
    window.addEventListener('open-login', onOpenLogin as EventListener);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  async function logout() {
    await authLogout();
  }
  return (
    <header className="w-full border-b border-border bg-card/80 backdrop-blur sticky top-0 z-30">
      <div className="flex items-center justify-between py-3 px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-primary">
          <Briefcase className="h-6 w-6" />
          TalentBridge
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-sm font-medium hover:text-primary">Home</Link>
            <Link href="/internships" className="text-sm font-medium hover:text-primary">Internships</Link>
            <Link href="/companies" className="text-sm font-medium hover:text-primary">Companies</Link>
            <Link href="/success_story" className="text-sm font-medium hover:text-primary">Success Stories</Link>
          </nav>

          {/* Desktop avatar + theme + logout */}
          <div className="hidden md:flex items-center gap-3">
            {authChecked ? (user ? (
              <div className="relative" ref={avatarRef}>
                <button onClick={() => setAvatarMenu((s) => !s)} className="p-1">
                  <div className="h-8 w-8 rounded-full overflow-hidden">
                    <Image src={user.image || '/icon.png'} alt={user.name || 'avatar'} width={32} height={32} className="object-cover" unoptimized />
                  </div>
                </button>
                {avatarMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded shadow p-2">
                    <div className="text-sm font-medium mb-2">{user.name}</div>
                    <Button onClick={logout} variant="outline" size="sm" className="w-full">Logout</Button>
                  </div>
                )}
              </div>
            ) : (
              // show Login button on desktop once auth check completes
              <>
                <Button variant="outline" onClick={() => setOpen(true)}>Login</Button>
              </>
            )) : (
              <div className="h-8 w-8" />
            )}

            {/* Profile is placed before theme toggle on desktop */}
            <ThemeToggle variant="outline" />

            {/* Desktop logout button (visible next to theme) */}
            {user && (
              <Button onClick={logout} variant="outline" className="hidden md:inline-flex">Logout</Button>
            )}
          </div>

          {/* Mobile: avatar/login before menu button */}
          <div className="flex md:hidden items-center gap-2">
            {authChecked ? (user ? (
              <div className="relative" ref={avatarRef}>
                <button onClick={() => setAvatarMenu((s) => !s)} className="p-1">
                  <div className="h-8 w-8 rounded-full overflow-hidden">
                    <Image src={user.image || '/icon.png'} alt={user.name || 'avatar'} width={32} height={32} className="object-cover" unoptimized />
                  </div>
                </button>
                {avatarMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded shadow p-2">
                    <div className="text-sm font-medium mb-2">{user.name}</div>
                    <Button onClick={logout} variant="outline" size="sm" className="w-full">Logout</Button>
                  </div>
                )}
              </div>
            ) : (
              // show styled login button on mobile after auth check
              <div>
                <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="px-2">Login</Button>
              </div>
            )) : (
              <div className="h-8 w-20" />
            )}

            <button onClick={() => setMenuOpen((s) => !s)} aria-label="menu" className="p-2">
              <Menu />
            </button>
          </div>
          </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="p-4 flex flex-col gap-2">
            <Link href="/">Home</Link>
            <Link href="/internships">Internships</Link>
            <Link href="/companies">Companies</Link>
            <Link href="/students">Success Stories</Link>
            <div className="pt-2">
              <ThemeToggle variant="outline" />
            </div>
            {user ? (
              <Button onClick={logout} variant="outline">Logout</Button>
            ) : (
              <Button variant="outline" onClick={() => setOpen(true)}>Login</Button>
            )}
          </div>
        </div>
      )}
      {/* Global LoginDialog instance */}
      <LoginDialog isOpen={open} onClose={() => setOpen(false)} />
    </header>
  );
}