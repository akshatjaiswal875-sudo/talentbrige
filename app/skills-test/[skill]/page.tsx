"use client";

import React, { useEffect, useState } from "react";
import AssessmentTest from "@/components/Assessments/AssessmentTest";
import { Header } from "../../../components/header";
import { notFound, useParams } from "next/navigation";
import { QUESTIONS } from "../../../data/questions";

const skillTypes = Array.from(new Set(QUESTIONS.filter(q => q.type.startsWith("skill-")).map(q => q.type.replace("skill-", ""))));

export default function SkillTestPage() {
  const params = useParams();
  const skill = (params.skill as string).toLowerCase();
  
  // Validate if this is a valid skill
  if (!skillTypes.includes(skill)) {
    notFound();
  }
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
        <h1 className="text-2xl font-bold mb-4">
          {skill.charAt(0).toUpperCase() + skill.slice(1)} Skill Verification Test
        </h1>
        <AssessmentTest userId={userId} initialTestType={`skill-${skill}`} />
        <div className="mt-6">
          <p className="text-sm text-muted-foreground">Your skill test results will be saved and visible to recruiters.</p>
        </div>
      </div>
    </>
  );
}
