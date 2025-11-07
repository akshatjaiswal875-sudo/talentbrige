"use client";

import React, { useEffect, useState } from "react";
import AssessmentTest from "../../../components/Assessments/AssessmentTest";
import { Header } from "../../../components/header";
import { useParams } from "next/navigation";

const skillNames: Record<string, string> = {
  python: "Python",
  java: "Java",
  web: "Web",
};

export default function SkillTestPage() {
  const params = useParams();
  const skill = typeof params.skill === "string" ? params.skill : Array.isArray(params.skill) ? params.skill[0] : "python";
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

  if (loading) return <div className="p-4">Loading...</div>;
  if (!userId) return <div className="p-4">You must be logged in to take skill verification tests.</div>;

  return (
    <>
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Skill Verification Test: {skillNames[skill] || skill}</h1>
        <AssessmentTest userId={userId} initialTestType={`skill-${skill}`} />
        <div className="mt-6">
          <p className="text-sm text-muted-foreground">Your skill test results will be saved and visible to recruiters.</p>
        </div>
      </div>
    </>
  );
}
