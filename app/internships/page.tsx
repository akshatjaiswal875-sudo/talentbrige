"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Header } from "@/components/header";
import ApplyModal from "@/components/ApplyModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

type Internship = {
  _id?: string;
  title: string;
  company: string;
  description: string;
  location?: string;
  stipend?: string;
  skillsRequired?: string[];
};

type Application = {
  _id?: string;
  internship?: { _id?: string } | string;
  status?: string;
};

export default function InternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  // filter state
  const [titleQuery, setTitleQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [stipendMin, setStipendMin] = useState<string>("");
  const [projectTheme, setProjectTheme] = useState("");
  const [color, setColor] = useState("");
  const [workFromHome, setWorkFromHome] = useState(false);
  const [partTimeOnly, setPartTimeOnly] = useState(false);
  const [stipendSlider, setStipendSlider] = useState<number>(0);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [applicationStatusMap, setApplicationStatusMap] = useState<Record<string, string>>({});

  const [applyingTo, setApplyingTo] = useState<string | null>(null);

  const fetchUserApplications = useCallback(async () => {
    try {
      const res = await fetch("/api/applications");
      if (!res.ok) {
        setAppliedIds(new Set());
        setApplicationStatusMap({});
        return;
      }
      const j = await res.json();
      const apps: Application[] = j.applications || [];
      const ids = new Set<string>();
      const statusMap: Record<string, string> = {};
      for (const a of apps) {
        const internship = a.internship;
        const id = internship && typeof internship === "object" ? internship._id : internship;
        if (id) ids.add(String(id));
        if (id && a.status) statusMap[String(id)] = a.status;
      }
      setAppliedIds(ids);
      setApplicationStatusMap(statusMap);
    } catch {
      setAppliedIds(new Set());
      setApplicationStatusMap({});
    }
  }, []);


  const fetchInternships = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/internships");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const raw = data.data || [];
      // sanitize incoming objects to only known fields so we don't surface backend internals
      const safe = raw.map((it: unknown) => {
        const obj = it as Record<string, unknown>;
        const skillsField = obj["skillsRequired"];
        const skillsArr = Array.isArray(skillsField)
          ? (skillsField as unknown[]).filter((s) => typeof s === "string") as string[]
          : [];

        const stipendField = obj["stipend"];
        const stipendStr = typeof stipendField === "string" ? stipendField : (stipendField != null ? String(stipendField) : undefined);

        return {
          _id: obj["_id"] as string | undefined,
          title: typeof obj["title"] === "string" ? obj["title"] as string : String(obj["title"] ?? ""),
          company: typeof obj["company"] === "string" ? obj["company"] as string : String(obj["company"] ?? ""),
          description: typeof obj["description"] === "string" ? obj["description"] as string : String(obj["description"] ?? ""),
          location: typeof obj["location"] === "string" ? obj["location"] as string : undefined,
          stipend: stipendStr,
          skillsRequired: skillsArr,
        } as Internship;
      });
      setInternships(safe);
      // After fetching internships, refresh user's applications so we can mark applied ones
      await fetchUserApplications();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [fetchUserApplications]);

  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);
  // derive filtered results from internships + filters
  const filtered = useMemo(() => {
    const parseStipendNumber = (s?: string) => {
      if (!s) return null;
      const m = s.replace(/,/g, "").match(/(\d+)/);
      return m ? Number(m[0]) : null;
    };

  const min = stipendMin ? Number(stipendMin) : null;

    return internships.filter((it) => {
      // title / company search
      if (titleQuery) {
        const q = titleQuery.toLowerCase();
        if (!(it.title?.toLowerCase().includes(q) || it.company?.toLowerCase().includes(q))) return false;
      }
      // location
      if (locationQuery) {
        const q = locationQuery.toLowerCase();
        if (!(it.location?.toLowerCase().includes(q))) return false;
      }
      // work from home filter: match common tokens in location
      if (workFromHome) {
        const loc = (it.location || "").toLowerCase();
        if (!(loc.includes("remote") || loc.includes("work from home") || loc.includes("wfh"))) return false;
      }
      // part-time filter: look for part-time mentions in title/description
      if (partTimeOnly) {
        const txt = ((it.title || "") + " " + (it.description || "")).toLowerCase();
        if (!(txt.includes("part") || txt.includes("part-time") || txt.includes("part time"))) return false;
      }
      // skills: all selected skills must be present
      if (skills.length > 0) {
        const lowerSkills = (it.skillsRequired || []).map((s) => s.toLowerCase());
        for (const s of skills) {
          if (!lowerSkills.includes(s.toLowerCase())) return false;
        }
      }
      // stipend minimum (try to parse numeric portion)
      if (min !== null) {
        const num = parseStipendNumber(it.stipend);
        if (num === null) return false;
        if (num < min) return false;
      }
      // project theme (simple text match against description)
      if (projectTheme) {
        const q = projectTheme.toLowerCase();
        if (!(it.description?.toLowerCase().includes(q))) return false;
      }
      // color - we don't have color on internship, but allow filtering by hex present in description or title
      if (color) {
        const q = color.toLowerCase();
        if (!((it.title || "").toLowerCase().includes(q) || (it.description || "").toLowerCase().includes(q))) return false;
      }

      return true;
    });
  }, [internships, titleQuery, locationQuery, skills, stipendMin, projectTheme, color, workFromHome, partTimeOnly]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Available Internships</h1>
            <p className="text-muted-foreground">Browse and apply for opportunities that match your skills</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Seed / Add controls moved to admin panel */}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1">
            <div className="sticky top-20">
              <Card className="mb-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 01.8 1.6l-4.6 5.5V17a1 1 0 01-1.45.89L8 14H4a1 1 0 01-1-1V5z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-lg font-semibold">Filters</h3>
                  </div>

                  <div className="mb-3">
                    <Label className="mb-1">Skill</Label>
                    <Input placeholder="e.g. React, SQL" value={titleQuery} onChange={(e) => setTitleQuery(e.target.value)} />
                  </div>

                  <div className="mb-3">
                    <Label className="mb-1">Location</Label>
                    <Input placeholder="e.g. Delhi" value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)} />
                  </div>

                  <div className="flex flex-col gap-2 mb-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={workFromHome} onChange={(e) => setWorkFromHome(e.target.checked)} className="h-4 w-4 rounded border" />
                      <span>Work from home</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={partTimeOnly} onChange={(e) => setPartTimeOnly(e.target.checked)} className="h-4 w-4 rounded border" />
                      <span>Part-time</span>
                    </label>
                  </div>

                  <div className="mb-3">
                    <Label className="mb-1">Desired minimum monthly stipend (₹)</Label>
                    <div className="flex items-center gap-3">
                      <input type="range" min={0} max={20000} step={500} value={stipendSlider} onChange={(e) => { const v = Number(e.target.value); setStipendSlider(v); setStipendMin(String(v)); }} className="w-full" />
                      <div className="w-16 text-right text-sm">{stipendSlider}</div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0</span>
                      <span>2K</span>
                      <span>4K</span>
                      <span>6K</span>
                      <span>8K</span>
                      <span>10K</span>
                    </div>
                  </div>

                  <div className="mt-2">
                    <button className="text-sm text-primary" onClick={() => setShowMoreFilters((s) => !s)}>{showMoreFilters ? 'Hide more filters' : 'View more filters'}</button>
                  </div>

                  {showMoreFilters && (
                    <div className="mt-3 border-t pt-3 space-y-3">
                      <div>
                        <Label className="mb-1">Skills</Label>
                        <div className="flex gap-2">
                          <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); const v = skillInput.trim(); if (v && !skills.includes(v)) setSkills((s) => [...s, v]); setSkillInput(''); } }} placeholder="Add skill" />
                          <Button onClick={() => { const v = skillInput.trim(); if (v && !skills.includes(v)) setSkills((s) => [...s, v]); setSkillInput(''); }}>Add</Button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {skills.map((s) => (
                            <Badge key={s} variant="secondary" className="cursor-pointer" onClick={() => setSkills((prev) => prev.filter((x) => x !== s))}>{s} ×</Badge>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <button className="text-sm text-muted-foreground" onClick={() => { setTitleQuery(''); setLocationQuery(''); setSkillInput(''); setSkills([]); setStipendMin(''); setProjectTheme(''); setColor(''); setWorkFromHome(false); setPartTimeOnly(false); setStipendSlider(0); }}>Clear all</button>
                    <div className="text-sm text-muted-foreground">Showing {filtered.length} of {internships.length}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          <section className="md:col-span-3">
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="flex flex-col gap-6">
              {loading ? (
                // skeleton list: show 4 placeholders that match Card layout
                Array.from({ length: 4 }).map((_, i) => (
                  <Card key={`skeleton-${i}`}>
                    <CardContent className="p-6">
                      <div className="animate-pulse">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="h-6 w-16 bg-muted/30 rounded" />
                              <div className="h-6 w-12 bg-muted/30 rounded" />
                            </div>
                            <div className="h-6 w-3/4 bg-muted/30 rounded mb-2" />
                            <div className="h-4 w-1/3 bg-muted/30 rounded mb-3" />
                            <div className="space-y-2">
                              <div className="h-3 bg-muted/30 rounded" />
                              <div className="h-3 bg-muted/30 rounded w-5/6" />
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0">
                            <div className="h-10 w-28 bg-muted/30 rounded" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                filtered.map((it) => (
                  <Card key={it._id || it.title}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="secondary">{it.skillsRequired?.[0] ?? "Role"}</Badge>
                            <Badge variant="outline">{it.location ?? "Remote"}</Badge>
                          </div>
                          <h2 className="text-xl font-semibold">{it.title}</h2>
                          <p className="text-muted-foreground text-sm mt-1">{it.company}</p>
                          <div className="mt-3">
                            <p className="text-sm">{it.description}</p>
                            {it.stipend && <p className="mt-2"><span className="font-medium">Stipend:</span> {it.stipend}</p>}
                          </div>
                        </div>
                        {appliedIds.has(it._id || "") ? (
                          // show status badge when available
                          applicationStatusMap[it._id || ""] ? (
                            <Badge variant={applicationStatusMap[it._id || ""] === "accepted" ? "secondary" : applicationStatusMap[it._id || ""] === "rejected" ? "destructive" : "outline"} className="whitespace-nowrap">
                              {applicationStatusMap[it._id || ""]}
                            </Badge>
                          ) : (
                            <Button className="whitespace-nowrap" disabled>Applied</Button>
                          )
                        ) : (
                          <Button className="whitespace-nowrap" onClick={() => setApplyingTo(it._id || null)}>Apply Now</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
              {applyingTo && (
                <ApplyModal internshipId={applyingTo} onClose={() => setApplyingTo(null)} onSuccess={() => {
                  // refresh list
                  fetchInternships();
                }} />
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}