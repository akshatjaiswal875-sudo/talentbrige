"use client";

import React, { useEffect, useState } from "react";

type AssessmentRow = {
  _id: string;
  score: number;
  total: number;
  testType: string;
  createdAt: string;
  student: { _id?: string; name?: string; email?: string } | null;
};

export default function AdminAssessmentsPage() {
  const [minScore, setMinScore] = useState<number | "">(""
  );
  const [testType, setTestType] = useState<string>("");
  const [results, setResults] = useState<AssessmentRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (minScore !== "") params.set("minScore", String(minScore));
      if (testType) params.set("testType", testType);
      const res = await fetch(`/api/assessments?${params.toString()}`);
      const data = await res.json();
      if (data?.success) setResults(data.results || []);
      else setResults([]);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assessments — Recruiter Filter</h1>
      <div className="mb-4 flex items-center gap-3">
        <label className="flex items-center gap-2">
          Min score:
          <input type="number" value={minScore as any} onChange={(e) => setMinScore(e.target.value === "" ? "" : Number(e.target.value))} className="ml-2 p-1 border rounded" />
        </label>
        <label className="flex items-center gap-2">
          Test type:
          <select value={testType} onChange={(e) => setTestType(e.target.value)} className="ml-2 p-1 border rounded">
            <option value="">All</option>
            <option value="aptitude">Aptitude</option>
            <option value="gn">GN</option>
          </select>
        </label>
        <button className="btn-primary" onClick={fetchResults}>Filter</button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1">Student</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Test</th>
              <th className="border px-2 py-1">Score</th>
              <th className="border px-2 py-1">Date</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r._id}>
                <td className="border px-2 py-1">{r.student?.name || "-"}</td>
                <td className="border px-2 py-1">{r.student?.email || "-"}</td>
                <td className="border px-2 py-1">{r.testType}</td>
                <td className="border px-2 py-1">{r.score} / {r.total}</td>
                <td className="border px-2 py-1">{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
