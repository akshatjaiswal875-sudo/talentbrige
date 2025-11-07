"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Users, FileText, Menu as MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/components/LoginDialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/components/AuthProvider";
import { ThemeToggle } from "@/components/theme-toggle";

const items = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/internships", label: "Internships", icon: Briefcase },
  { href: "/admin/applications", label: "Applications", icon: FileText },
  { href: "/admin/users", label: "Users", icon: Users },
];

function NavItem({ href, label, Icon, active, onClick }: { href: string; label: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; active?: boolean; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={"flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground " + (active ? "bg-accent/60 font-medium" : "")}
    >
      <Icon className="size-4 opacity-80" />
      <span>{label}</span>
    </Link>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { user, authChecked, logout } = useAuth();
  const pathname = usePathname();

  async function handleLogout() {
    await logout();
  }

  const menu = (
    <div className="flex flex-col gap-4 p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="font-semibold text-lg">Admin</div>
        {/* desktop only spacer for avatar */}
        {authChecked && user && (
          <div className="hidden md:block h-8 w-8 rounded-full overflow-hidden">
            <Image src={user.image || '/icon.png'} alt={user.name || 'avatar'} width={32} height={32} className="object-cover" unoptimized />
          </div>
        )}
      </div>

      <nav className="flex flex-col gap-1">
        {items.map((it) => (
          <NavItem key={it.href} href={it.href} label={it.label} Icon={it.icon} active={pathname === it.href} onClick={() => setSheetOpen(false)} />
        ))}
      </nav>

      <div className="mt-4 border-t border-border pt-4 flex flex-col gap-2">
        {authChecked ? (
          user ? (
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden">
                <Image src={user.image || '/icon.png'} alt={user.name || 'avatar'} width={40} height={40} className="object-cover" unoptimized />
              </div>
              <div className="flex-1 flex flex-col">
                <div>
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
                <div className="mt-3 hidden md:flex gap-2 items-start">
                  <ThemeToggle variant="outline" size="sm" />
                  <Button variant="outline" size="sm" onClick={handleLogout} aria-label="Logout">Logout</Button>
                </div>
              </div>
            </div>
          ) : (
            <Button variant="outline" onClick={() => { setOpen(true); setSheetOpen(false); }}>Admin Login</Button>
          )
        ) : (
          <div className="h-10 w-full bg-muted/30 animate-pulse rounded" />
        )}
      </div>

      {/* mobile-only simple logout/login placed in menu footer */}
      <div className="md:hidden">
        {authChecked ? (
          user ? (
            <div className="pt-2 flex flex-col gap-2">
              <ThemeToggle variant="outline" size="sm" />
              <Button variant="outline" onClick={() => { handleLogout(); setSheetOpen(false); }} className="w-full">Logout</Button>
            </div>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <ThemeToggle variant="outline" size="sm" />
              <Button variant="outline" onClick={() => { setOpen(true); setSheetOpen(false); }} className="w-full">Login</Button>
            </div>
          )
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: persistent fixed sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 h-screen w-64 border-r border-border bg-background">
        {menu}
      </aside>

      {/* Mobile: header with Sheet menu */}
      <div className="md:hidden border-b border-border bg-background">
        <div className="flex items-center justify-between p-3">
          {/* left: fixed-width slot for menu trigger so center title is stable during hydration */}
          <div className="w-10 flex items-center justify-start">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger>
                <Button variant="ghost" size="sm" aria-label="Open menu">
                  <MenuIcon className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                {menu}
              </SheetContent>
            </Sheet>
          </div>

          {/* center: title */}
          <div className="flex-1 flex items-center justify-center">
            <div className="font-semibold">Admin</div>
          </div>

          {/* right: avatar or login button to balance left slot */}
          <div className="w-10 flex items-center justify-end">
            {authChecked ? (
              user ? (
                <Link href="/admin" aria-label="Profile">
                  <div className="h-8 w-8 rounded-full overflow-hidden">
                    <Image src={user.image || '/icon.png'} alt={user.name || 'avatar'} width={32} height={32} className="object-cover" unoptimized />
                  </div>
                </Link>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => { setOpen(true); setSheetOpen(false); }} aria-label="Login">Login</Button>
              )
            ) : (
              <div className="h-8 w-8 bg-muted/30 rounded" />
            )}
          </div>
        </div>
      </div>

      <LoginDialog isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
