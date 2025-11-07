import { AdminSidebar } from "./components/Sidebar";
import AdminThemeGuard from "./components/AdminThemeGuard";

export const metadata = {
  title: "Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminThemeGuard />
      <AdminSidebar />
      <main className="flex-1 p-6 md:ml-64">{children}</main>
    </div>
  );
}
