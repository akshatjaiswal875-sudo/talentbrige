"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type User = { _id?: string; name?: string; email?: string; image?: string };
type Internship = { _id?: string; title?: string; company?: string };
type Application = {
  _id?: string;
  internship?: Internship | string;
  applicant?: User | string;
  name?: string;
  email?: string;
  resumeLink?: string;
  message?: string;
  status?: string;
  createdAt?: string;
};

export function AdminApplications({ preview = false }: { preview?: boolean }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingActions, setUpdatingActions] = useState<Record<string, "accept" | "reject" | "pending">>({});

  async function fetchApplications() {
    setLoading(true);
    setError(null);
    try {
  const res = await fetch("/api/admin/applications?order=desc");
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) throw new Error("Unauthorized: admin access required");
        throw new Error("Failed to fetch applications");
      }
      const j = await res.json();
      setApplications(j.applications || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  async function updateStatus(id: string, status: "pending" | "accepted" | "rejected") {
    if (!id) return;
    setError(null);
  const action = status === "accepted" ? "accept" : status === "rejected" ? "reject" : "pending";
  setUpdatingActions((s) => ({ ...s, [id]: action }));
    // optimistic update
    const prev = applications;
    setApplications((cur) => cur.map((c) => (c._id === id ? { ...c, status } : c)));
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Failed to update status");
      }
      const j = await res.json();
      // ensure we sync with server response if provided
      if (j?.application) {
        setApplications((cur) => cur.map((c) => (c._id === id ? j.application : c)));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      // rollback
      setApplications(prev);
    } finally {
      setUpdatingActions((s) => {
        const next = { ...s };
        delete next[id];
        return next;
      });
    }
  }

  function groupByInternship(apps: Application[]) {
    const map = new Map<string, { internship: Internship | null; apps: Application[] }>();
    for (const a of apps) {
      const internship = a.internship as Internship | undefined;
      const id = internship?._id ?? String(internship ?? "unknown");
      if (!map.has(id)) map.set(id, { internship: internship ?? null, apps: [] });
      map.get(id)!.apps.push(a);
    }
    return Array.from(map.values());
  }

  const groups = groupByInternship(preview ? applications.slice(0, 12) : applications);

  if (loading)
    return (
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, gi) => (
          <Card key={`apps-skel-${gi}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-muted/20 rounded w-48 mb-2 animate-pulse" />
                  <div className="h-3 bg-muted/10 rounded w-32 animate-pulse" />
                </div>
                <div className="h-3 bg-muted/10 rounded w-8 animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={`a-skel-${gi}-${i}`} className="border-t pt-3">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <div className="h-4 bg-muted/20 rounded w-32 mb-1 animate-pulse" />
                        <div className="h-3 bg-muted/10 rounded w-24 animate-pulse" />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-16 bg-muted/10 rounded animate-pulse" />
                        <div className="h-6 w-12 bg-muted/10 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (groups.length === 0) return <div className="text-sm text-muted-foreground">No applications found.</div>;

  return (
    <div className="grid gap-4">
      {groups.map((g) => (
        <Card key={g.internship?._id ?? `group-${String(g.internship?.title ?? "unknown")}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">{g.internship?.title ?? "(No title)"}</div>
                <div className="text-xs text-muted-foreground">{g.internship?.company ?? ""}</div>
              </div>
              <div className="text-xs text-muted-foreground">{g.apps.length} app{g.apps.length !== 1 ? "s" : ""}</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {g.apps.slice(0, preview ? 3 : 50).map((a) => {
                const appId = a._id;
                const key = appId ?? `${a.email ?? a.name ?? Math.random()}`;
                return (
                  <div key={key} className="border-t pt-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium">{a.name || a.email}</div>
                        <div className="text-xs text-muted-foreground">{a.email}</div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 md:gap-2 items-start">
                        <div className="flex items-center gap-2">
                          <Badge variant={a.status === "accepted" ? "secondary" : a.status === "rejected" ? "destructive" : "outline"}>{a.status ?? "pending"}</Badge>
                          {a.resumeLink && (
                            <a href={a.resumeLink} target="_blank" rel="noreferrer" className="text-xs underline">Resume</a>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
                          {appId && a.status !== "accepted" && (
                            <button
                              className="w-full sm:w-auto text-xs px-2 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
                              onClick={async () => await updateStatus(appId, "accepted")}
                              disabled={Boolean(updatingActions[appId])}
                              aria-disabled={Boolean(updatingActions[appId])}
                            >
                                {updatingActions[appId] === "accept" ? (
                                  <span className="inline-flex items-center gap-2">
                                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Accepting</span>
                                  </span>
                                ) : (
                                  "Accept"
                                )}
                            </button>
                          )}
                          {appId && a.status !== "rejected" && (
                            <button
                              className="w-full sm:w-auto text-xs px-2 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                              onClick={async () => await updateStatus(appId, "rejected")}
                              disabled={Boolean(updatingActions[appId])}
                              aria-disabled={Boolean(updatingActions[appId])}
                            >
                              {updatingActions[appId] === "reject" ? (
                                <span className="inline-flex items-center gap-2">
                                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>Rejecting</span>
                                </span>
                              ) : (
                                "Reject"
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default AdminApplications;
