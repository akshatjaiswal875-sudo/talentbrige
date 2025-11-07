"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

type User = { _id?: string; name: string; email: string; role?: string; image?: string; createdAt?: string };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const j = await res.json();
      setUsers(j.data || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <div className="mb-4 flex items-center gap-2"> 
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={`user-skel-${i}`}>
              <CardContent>
                <div className="flex items-center gap-3 animate-pulse">
                  <div className="h-10 w-10 rounded-full bg-muted/20" />
                  <div className="flex-1">
                    <div className="h-4 bg-muted/20 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-muted/10 rounded w-3/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid gap-3">
        {users.map((u) => (
          <Card key={u._id || u.email}>
            <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={u.image || "/icon.png"} alt={u.name || 'avatar'} width={40} height={40} className="object-cover" unoptimized />
                </div>
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-sm text-muted-foreground">{u.email}</div>
                </div>
              </div>
              <div className="mt-2 sm:mt-0 flex items-center gap-4">
                <div className="text-sm text-muted-foreground">{u.role ?? "user"}</div>
                <div className="text-xs text-muted-foreground">{u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
