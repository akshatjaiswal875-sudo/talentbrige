import Link from "next/link";
import AdminApplications from "@/components/admin/AdminApplications";
import AdminStats from '@/components/admin/AdminStats';

export default async function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Live stats (client component) */}
      <AdminStats />

      <div className="mb-4">
        <Link href="/admin/internships" className="text-primary underline">Manage Internships</Link>
        <Link href="/admin/applications" className="ml-4 text-primary underline">Review Applications</Link>
      </div>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Recent applications</h2>
        <AdminApplications preview />
      </section>
    </div>
  );
}
