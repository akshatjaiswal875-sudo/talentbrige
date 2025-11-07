"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// removed unused import 'cn'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

type Internship = {
  _id?: string;
  title: string;
  company: string;
  description: string;
  location?: string;
  stipend?: string;
  skillsRequired?: string[];
  lastDateToApply?: string;
  postedBy?: string;
  createdAt?: string;
};
// Note: removed specialized Textarea (was unused in this file) to satisfy linter rules.

export default function AdminInternshipsPage() {
  const [items, setItems] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(false);
  // showForm removed (unused) — form is provided via Dialog instead
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [stipend, setStipend] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [lastDateToApply, setLastDateToApply] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  // removed unused Textarea helper

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/internships");
      const j = await res.json();
      setItems(j.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!createSuccess) return;
    const t = setTimeout(() => setCreateSuccess(null), 4000);
    return () => clearTimeout(t);
  }, [createSuccess]);

  async function remove(id?: string) {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/internships/${id}`, { method: "DELETE" });
      if (res.ok) await load();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // seed removed from admin UI (moved to admin-only tools)

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title,
        company,
        description,
        location,
        stipend,
        skillsRequired: skillsRequired.split(",").map((s) => s.trim()).filter(Boolean),
        lastDateToApply: lastDateToApply ? new Date(lastDateToApply).toISOString() : undefined,
        postedBy,
      };
      const res = await fetch("/api/internships", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Create failed");
      setTitle(""); setCompany(""); setDescription(""); setLocation(""); setStipend(""); setSkillsRequired(""); setLastDateToApply(""); setPostedBy("");
      setCreateSuccess('Internship created successfully');
      await load();
    } catch (err) {
      console.error(err);
      setCreateError((err as Error)?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-4">Manage Internships</h2>
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger>
              <Button variant="outline">Add Internship</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Internship</DialogTitle>
                <DialogDescription>Fill the fields below to create a new internship.</DialogDescription>
              </DialogHeader>
              <form onSubmit={create} className="grid gap-3">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location (e.g. Remote, City)" />
                  </div>
                  <div>
                    <Label htmlFor="stipend">Stipend</Label>
                    <Input id="stipend" value={stipend} onChange={(e) => setStipend(e.target.value)} placeholder="e.g. $500/mo or Unpaid" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="skills">Skills (comma separated)</Label>
                  <div className="flex gap-2 items-center">
                    <Input id="skills" value={skillsRequired} onChange={(e) => setSkillsRequired(e.target.value)} placeholder="React,Node,SQL" />
                    <Button type="button" variant="ghost" onClick={() => setSkillsRequired("")}>Clear</Button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {skillsRequired.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                      <span key={s} className="text-xs bg-muted/10 px-2 py-1 rounded flex items-center gap-2">
                        {s}
                        <button type="button" onClick={() => {
                          const arr = skillsRequired.split(',').map(x => x.trim()).filter(Boolean).filter(x => x !== s);
                          setSkillsRequired(arr.join(', '));
                        }} className="ml-1 text-muted-foreground">×</button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="lastDate">Last date to apply</Label>
                    <Input id="lastDate" type="date" value={lastDateToApply} onChange={(e) => setLastDateToApply(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="postedBy">Posted by (email)</Label>
                    <Input id="postedBy" value={postedBy} onChange={(e) => setPostedBy(e.target.value)} placeholder="admin@example.com" />
                  </div>
                </div>
                {createError && <div className="text-sm text-red-600">{createError}</div>}
                {createSuccess && <div className="text-sm text-green-600">{createSuccess}</div>}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={Boolean(loading || !title || !company || !description || (postedBy && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(postedBy)))}>Create</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={`skeleton-${i}`}>
              <CardContent>
                <div className="animate-pulse">
                  <div className="h-5 bg-muted/30 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-muted/20 rounded w-1/2 mb-3" />
                  <div className="h-24 bg-muted/10 rounded mb-3" />
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-20 bg-muted/20 rounded" />
                    <div className="h-8 w-12 bg-muted/20 rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* Removed legacy inline form (Add uses Dialog). Kept showForm state for future use. */}
      <div className="grid gap-4">
        {items.map((it) => (
          <Card key={it._id || it.title}>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-lg font-semibold">{it.title}</div>
                    <div className="text-sm text-muted-foreground">• {it.company}</div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{it.description}</p>

                  <div className="mt-3 flex flex-wrap gap-2 items-center">
                    {it.skillsRequired?.map((s: string) => (
                      <span key={s} className="text-xs bg-muted/10 px-2 py-1 rounded">{s}</span>
                    ))}
                    <span className="text-xs text-muted-foreground ml-2">{it.location ?? 'Remote'}</span>
                    {it.stipend && <span className="text-xs text-muted-foreground ml-2">• {it.stipend}</span>}
                  </div>

                  <div className="mt-2 text-xs text-muted-foreground">
                    Posted by: {it.postedBy ?? '—'} • {it.createdAt ? new Date(it.createdAt).toLocaleDateString() : '—'}
                    {it.lastDateToApply && (
                      <span className="ml-2">• Apply by {new Date(it.lastDateToApply).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 flex gap-2 items-center">
                  <Button variant="ghost" onClick={() => remove(it._id)} className="text-destructive">Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
