"use client";

import Link from "next/link";
import { ArrowRight, Briefcase, GraduationCap, Building, Search, FileCheck, Trophy, CheckCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/header";
import ApplyModal from "@/components/ApplyModal";

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

export default function Home() {
  const [featured, setFeatured] = useState<Internship[]>([]);
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

  const fetchFeatured = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/internships/featured");
      if (!res.ok) throw new Error("Failed to fetch featured internships");
      const data = await res.json();
      setFeatured(data.data || []);
      await fetchUserApplications();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [fetchUserApplications]);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      {error && (
        <div className="container mx-auto px-6 mt-4">
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
        </div>
      )}
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-primary/10 to-transparent" />
        <div className="container mx-auto px-6 pt-20 pb-12">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden bg-card/70 backdrop-blur-sm rounded-2xl border p-6 md:p-10">
              {/* decorative shape */}
              <svg className="pointer-events-none absolute -right-10 -top-10 hidden w-48 opacity-20 md:block" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path fill="currentColor" d="M42.4,-55.3C55.8,-46.9,68,-34.2,73.6,-18.1C79.2,-2,78.2,17.5,70.9,31.6C63.6,45.7,49.9,54.4,35.8,59.3C21.7,64.2,10.9,65.2,-1,67.1C-12.9,69,-25.8,71.8,-36.8,67.1C-47.7,62.5,-56.7,50.3,-62.2,36.6C-67.8,22.9,-69.8,7.7,-68.4,-7.1C-67.1,-21.9,-62.4,-36.9,-51.9,-45.7C-41.5,-54.5,-25.3,-57.1,-9.8,-56.6C5.6,-56.2,11.2,-52.7,42.4,-55.3Z" transform="translate(100 100)" />
              </svg>

              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <Badge className="mb-4">Now Accepting Applications</Badge>
                  <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                    Kickstart your career with the right opportunity
                  </h1>
                  <p className="mt-4 text-muted-foreground text-lg">
                    Find current internships from top companies, tailored to your skills. Search roles, browse companies, and apply in a few clicks.
                  </p>

                  {/* Search + CTAs */}
                  <HeroActions />
                </div>

                {/* quick stats */}
                <div className="mt-6 md:mt-0 md:ml-8 shrink-0 w-full md:w-56">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 md:grid-cols-1">
                    <Stat label="Opportunities" value="1.2k+" />
                    <Stat label="Companies" value="350+" />
                    <Stat label="Active Applicants" value="45k+" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-primary" />
              Current Internships
            </CardTitle>
            <CardDescription>Find the perfect match for your skills and interests</CardDescription>
          </CardHeader>
          <CardContent>
            Browse through hand-picked opportunities from top companies across various industries.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-primary" />
              Student Resources
            </CardTitle>
            <CardDescription>Get the support you need to succeed</CardDescription>
          </CardHeader>
          <CardContent>
            Access resume templates, interview guides, and career advice from industry professionals.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Building className="h-5 w-5 text-primary" />
              Company Profiles
            </CardTitle>
            <CardDescription>Learn about potential employers</CardDescription>
          </CardHeader>
          <CardContent>
            Research company cultures, values, and growth opportunities before applying.
          </CardContent>
        </Card>
      </section>

      {/* Explore & Highlights */}
      <section className="container mx-auto px-6 py-6">
        {/* Explore by skills (responsive, scrollable on mobile) */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-3">Explore by skills</h3>
          <p className="text-sm text-muted-foreground mb-4">Quickly jump into internships that match your top skills.</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[
              "React",
              "Node.js",
              "Python",
              "Data Science",
              "UI/UX",
              "Product",
              "Marketing",
              "Go",
            ].map((s) => (
              <Badge key={s} className="whitespace-nowrap px-3 py-2" variant="outline">{s}</Badge>
            ))}
          </div>
        </div>

        {/* Top categories */}
        <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Software", count: "640+", icon: Briefcase },
            { title: "Design", count: "230+", icon: GraduationCap },
            { title: "Business", count: "180+", icon: Building },
            { title: "Data", count: "120+", icon: Briefcase },
          ].map((c) => (
            <Card key={c.title} className="hover:shadow-lg transition">
              <CardContent className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                  <c.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">{c.title}</div>
                  <div className="text-sm text-muted-foreground">{c.count} opportunities</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How it works (simple three-step) */}
        <div className="mb-10">
          <h3 className="text-2xl font-semibold mb-4">How it works</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-4 text-center">
              <CardContent>
                <div className="mx-auto h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground mb-3">
                  <Search className="h-6 w-6" />
                </div>
                <div className="font-semibold">Discover</div>
                <div className="text-sm text-muted-foreground">Search current internships tailored for your skills.</div>
              </CardContent>
            </Card>
            <Card className="p-4 text-center">
              <CardContent>
                <div className="mx-auto h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground mb-3">
                  <FileCheck className="h-6 w-6" />
                </div>
                <div className="font-semibold">Apply</div>
                <div className="text-sm text-muted-foreground">One-click applications with resume and status tracking.</div>
              </CardContent>
            </Card>
            <Card className="p-4 text-center">
              <CardContent>
                <div className="mx-auto h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground mb-3">
                  <Trophy className="h-6 w-6" />
                </div>
                <div className="font-semibold">Succeed</div>
                <div className="text-sm text-muted-foreground">Get offers and kickstart your career with real experience.</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-10">
          <h3 className="text-2xl font-semibold mb-4">What students say</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { quote: "Found my dream internship in weeks!", name: "Asha R.", role: "Frontend Intern" },
              { quote: "Excellent listings and fast responses.", name: "Karan P.", role: "Data Intern" },
              { quote: "Great support from the team.", name: "Maya S.", role: "Product Intern" },
            ].map((t) => (
              <Card key={t.name} className="hover:shadow-md transition">
                <CardContent>
                  <p className="italic text-sm">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">{t.name.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-sm text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trusted companies */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-3">Trusted by top companies</h3>
          <p className="text-sm text-muted-foreground mb-4">Companies hiring through TalentBridge.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['Acme Corp', 'Nimbus', 'Stellar', 'ByteLabs', 'OpenWave', 'Summit'].map((n) => (
              <div key={n} className="rounded-lg border bg-card/60 p-3 flex items-center justify-center text-sm font-medium">{n}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Internships */}
      <section className="bg-background py-10">
        <div className="container mx-auto px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold">Featured Opportunities</h2>
            <p className="mt-2 text-muted-foreground">Apply to these trending positions</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {loading ? (
              // show 3 skeleton cards matching the card layout
              Array.from({ length: 3 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="animate-pulse">
                  <div className="border rounded-lg p-6 bg-card">
                    <div className="h-4 w-24 bg-muted/30 dark:bg-muted/30 rounded mb-3" />
                    <div className="h-5 w-3/4 bg-muted/30 dark:bg-muted/30 rounded mb-2" />
                    <div className="h-3 w-1/2 bg-muted/30 dark:bg-muted/30 rounded mb-4" />
                    <div className="space-y-2">
                      <div className="h-3 bg-muted/30 dark:bg-muted/30 rounded" />
                      <div className="h-3 bg-muted/30 dark:bg-muted/30 rounded w-5/6" />
                    </div>
                    <div className="mt-4 h-8 w-32 bg-muted/30 dark:bg-muted/30 rounded" />
                  </div>
                </div>
              ))
            ) : (
              featured.map((it) => (
                <Card key={it._id || it.title}>
                  <CardHeader>
                    <Badge className="w-fit" variant="secondary">{it.skillsRequired?.[0] ?? "Role"}</Badge>
                    <CardTitle className="mt-2">{it.title}</CardTitle>
                    <CardDescription>{it.location ?? "Remote"} • {it.stipend ? `Stipend ${it.stipend}` : ""}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{it.description}</p>
                    <div className="mt-4">
                      {appliedIds.has(it._id || "") ? (
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
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/internships">View All Opportunities</Link>
            </Button>
          </div>
        </div>
      </section>

      {applyingTo && (
        <ApplyModal internshipId={applyingTo} onClose={() => setApplyingTo(null)} onSuccess={() => {
          // refresh featured list and user applications
          fetchFeatured();
        }} />
      )}
    </div>
  );
}

function HeroActions() {
  return (
    <div className="mt-8 w-full">
      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex gap-3">
          <Button asChild size="lg">
            <Link href="/internships" className="inline-flex items-center gap-2 px-4 py-3">
              Browse Opportunities
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="hidden sm:inline-flex">For Employers</Button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
        <div className="inline-flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Free to use</div>
        <div className="inline-flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" /> Current roles</div>
        <div className="inline-flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" /> Career resources</div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card px-4 py-3 text-center">
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
