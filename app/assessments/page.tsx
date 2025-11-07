"use client";

import React, { useEffect, useState } from "react";
import AssessmentTest from "@/components/Assessments/AssessmentTest";
import { Header } from "../../components/header";

export default function AssessmentsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data?.authenticated && data.user?.id && mounted) {
          setUserId(data.user.id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const [selectedType, setSelectedType] = useState<"aptitude" | "english" | "gn">("aptitude");

  if (loading) return <div className="p-4">Loading...</div>;
  if (!userId) return <div className="p-4">You must be logged in to take assessments.</div>;

  return (
    <>
      <Header />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Take Assessment</h1>
          <div className="flex items-center gap-2">
            <label className="text-sm">Choose test:</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value as any)} className="p-2 border rounded">
              <option value="aptitude">Aptitude</option>
              <option value="english">English</option>
              <option value="gn">General Knowledge</option>
            </select>
          </div>
        </div>

        <AssessmentTest userId={userId} initialTestType={selectedType} />

        <div className="mt-6">
          <p className="text-sm text-muted-foreground">Your results will be saved to your profile and visible to recruiters who filter by score.</p>
        </div>
      </div>
    </>
  );
}
