"use client";

import AdminApplications from "@/components/admin/AdminApplications";

export default function AdminApplicationsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-4">Applications (Admin)</h1>
        <AdminApplications />
      </main>
    </div>
  );
}
