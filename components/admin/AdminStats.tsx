"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Briefcase, Activity } from 'lucide-react';

type Stats = {
  totalInternships: number;
  totalApplications: number;
  totalUsers: number;
  activeUsers: number;
  uniqueApplicants: number;
  pendingApplications: number;
  updatedAt: string;
};

function StatTile({ title, value, help, icon }: { title: string; value: number | string; help?: string; icon?: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs sm:text-sm">{title}</CardTitle>
          {icon && <div className="opacity-70 hidden sm:block">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl sm:text-2xl font-semibold">{value}</div>
            {help && <div className="text-xs text-muted-foreground mt-1 hidden sm:block">{help}</div>}
          </div>
          <div className="hidden sm:block">
            <Badge variant="secondary">Live</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchStats() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/stats');
      if (!res.ok) throw new Error('Failed to load');
      const j = await res.json();
      if (j.success && j.data) setStats(j.data as Stats);
      else throw new Error(j.error || 'Bad response');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
    const id = setInterval(fetchStats, 30000); // poll every 30s
    return () => clearInterval(id);
  }, []);

  if (loading && !stats) {
    return (
      <div className="mb-6">
        {/* compact mobile chips while loading */}
        <div className="flex gap-2 overflow-x-auto sm:hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 w-28 bg-muted/30 rounded animate-pulse" />
          ))}
        </div>
        {/* full cards on sm+ while loading */}
        <div className="hidden sm:grid gap-3 grid-cols-3 mt-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4 sm:p-6"><div className="animate-pulse h-12 bg-muted/30 rounded" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return <div className="text-destructive">Error loading stats: {error}</div>;
  }

  return (
    <div>
      {/* Mobile compact chip row (only show on xs) */}
      <div className="flex gap-2 overflow-x-auto sm:hidden mb-3">
        <div className="flex items-center gap-2">
          <div className="px-3 py-2 bg-muted/10 rounded">
            <div className="text-sm font-semibold">{stats?.totalInternships ?? '—'}</div>
            <div className="text-xs text-muted-foreground">Internships</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-2 bg-muted/10 rounded">
            <div className="text-sm font-semibold">{stats?.uniqueApplicants ?? '—'}</div>
            <div className="text-xs text-muted-foreground">Applicants</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-2 bg-muted/10 rounded">
            <div className="text-sm font-semibold">{stats?.activeUsers ?? '—'}</div>
            <div className="text-xs text-muted-foreground">Active (30d)</div>
          </div>
        </div>
      </div>

      {/* Full cards for sm+ screens */}
      <div className="hidden sm:grid gap-3 grid-cols-3 mb-6">
        <StatTile title="Total Internships" value={stats?.totalInternships ?? '—'} help="Active listings in DB" icon={<Briefcase />} />
        <StatTile title="Applicants" value={stats?.uniqueApplicants ?? '—'} help={`${stats?.totalApplications ?? 0} applications total`} icon={<Users />} />
        <StatTile title="Active Users (30d)" value={stats?.activeUsers ?? '—'} help={`Total users: ${stats?.totalUsers ?? 0}`} icon={<Activity />} />
      </div>

      <div className="hidden sm:grid gap-3 grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-semibold">{stats?.pendingApplications ?? 0}</div>
              <div className="text-xs text-muted-foreground">Updated: {stats?.updatedAt ? new Date(stats.updatedAt).toLocaleTimeString() : '—'}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-semibold">{stats?.totalUsers ?? 0}</div>
              <div className="text-xs text-muted-foreground">Refreshed every 30s</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
