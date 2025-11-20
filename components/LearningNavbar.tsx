"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export function LearningNavbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full border-b border-border bg-card/80 backdrop-blur sticky top-0 z-30">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-primary">
          <Briefcase className="h-6 w-6" />
          TalentBridge Learning
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/learning">
            <Button variant={pathname === "/learning" ? "secondary" : "ghost"}>
              All Courses
            </Button>
          </Link>
          <Link href="/learning/my-courses">
            <Button variant={pathname === "/learning/my-courses" ? "secondary" : "ghost"}>
              My Courses
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
