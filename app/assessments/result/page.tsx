"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ResultContent() {
  const search = useSearchParams();
  const router = useRouter();
  const scoreStr = search.get('score');
  const totalStr = search.get('total');
  const testType = search.get('testType') || 'test';

  const score = scoreStr ? parseInt(scoreStr, 10) : null;
  const total = totalStr ? parseInt(totalStr, 10) : null;

  function getBadge(score: number, total: number) {
    const percent = (score / total) * 100;
    if (percent < 40) return { color: "bg-yellow-400 text-yellow-900", label: "Beginner" };
    if (percent < 60) return { color: "bg-blue-400 text-blue-900", label: "Average" };
    if (percent < 85) return { color: "bg-green-400 text-green-900", label: "Good" };
    return { color: "bg-red-500 text-white", label: "Excellent" };
  }

  if (score === null || total === null) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Result not available</h2>
        <p className="mb-4">No result data was provided. Please retake the test.</p>
        <div className="flex gap-2">
          <button className="p-2 border rounded" onClick={() => router.push('/')}>Return Home</button>
          <button className="p-2 border rounded" onClick={() => router.back()}>Back</button>
        </div>
      </div>
    );
  }

  const badge = getBadge(score, total);

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Test Results</h2>
      <div className="mb-4">Test: <span className="font-semibold">{testType}</span></div>
      <div className="mb-4">Score: <span className="font-semibold">{score} / {total}</span></div>
      <div className="mb-6">
        <span className={`px-4 py-2 rounded-full font-bold text-lg ${badge.color}`}>{badge.label}</span>
      </div>
      <div className="flex gap-2">
        <button className="btn-primary" onClick={() => router.push('/')}>Return Home</button>
        <button className="p-2 border rounded" onClick={() => router.push('/assessments')}>Back to Assessments</button>
      </div>
    </div>
  );
}

export default function AssessmentResultPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading results...</div>}>
      <ResultContent />
    </Suspense>
  );
}
