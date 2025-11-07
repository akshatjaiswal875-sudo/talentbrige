"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  // hide footer on admin routes
  if (pathname && pathname.startsWith("/admin")) return null;
  return <Footer />;
}
