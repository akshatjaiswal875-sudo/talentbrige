"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS } from "../../data/questions";
import { Header } from "../../components/header";
import { Button } from "../../components/ui/button";

const skillTypes = Array.from(new Set(QUESTIONS.filter(q => q.type.startsWith("skill-")).map(q => q.type.replace("skill-", ""))));

export default function SkillsTestSelection() {
  const router = useRouter();
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
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Skill Verification Tests</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillTypes.map(skill => (
            <div key={skill} className="p-6 bg-card text-card-foreground rounded-lg shadow-md border border-border hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">
                {skill.charAt(0).toUpperCase() + skill.slice(1)}
              </h2>
              <p className="text-muted-foreground mb-4">
                Verify your {skill} skills with our comprehensive assessment.
              </p>
              <Button
                onClick={() => router.push(`/skills-test/${skill}`)}
                className="w-full"
              >
                Take Test
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <p className="text-sm text-muted-foreground">
            Each skill test is carefully designed to assess your proficiency level. Results will be visible to recruiters.
          </p>
        </div>
      </div>
    </>
  );
}