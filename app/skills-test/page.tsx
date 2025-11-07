"use client";

import React, { useEffect, useState } from "react";
import AssessmentTest from "../../components/Assessments/AssessmentTest";
import { QUESTIONS } from "../../data/questions";

const skillTypes = Array.from(new Set(QUESTIONS.filter(q => q.type.startsWith("skill-")).map(q => q.type.replace("skill-", ""))));

export default function SkillsTestPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState(skillTypes[0] || "python");

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
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Skill Verification Test</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm">Select skill:</label>
          <select value={selectedSkill} onChange={e => setSelectedSkill(e.target.value)} className="p-2 border rounded">
            {skillTypes.map(skill => (
              <option key={skill} value={skill}>{skill.charAt(0).toUpperCase() + skill.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>
      <AssessmentTest userId={userId} initialTestType={`skill-${selectedSkill}`} />
      <div className="mt-6">
        <p className="text-sm text-muted-foreground">Your skill test results will be saved and visible to recruiters.</p>
      </div>
    </div>
  );
}