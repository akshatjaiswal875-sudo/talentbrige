"use client";

import React, { useEffect, useMemo, useState } from "react";
import { QUESTIONS, Question as QType, DEFAULT_QUESTIONS_PER_TEST } from "../../data/questions";

type AnswerRecord = { id: string; selected: number | null };

export default function AssessmentTest({ userId, initialTestType = "aptitude" }: { userId: string; initialTestType?: string }) {
  const [testType, setTestType] = useState<typeof initialTestType>(initialTestType);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{ score: number; total: number } | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  // For skill tests, show all questions ordered by difficulty; for CRT/other, use default count
  const isSkillTest = testType.startsWith("skill-");
  const pool = useMemo(() => QUESTIONS.filter((q) => q.type === testType), [testType]);
  const questions = useMemo(() => isSkillTest
    ? [...pool.filter(q => q.difficulty === "easy"), ...pool.filter(q => q.difficulty === "moderate"), ...pool.filter(q => q.difficulty === "hard")]
    : pool.slice(0, DEFAULT_QUESTIONS_PER_TEST), [pool, isSkillTest]);

  useEffect(() => {
    setAnswers({});
    setCurrentIndex(0);
    setShowSummary(false);
    setSubmittedResult(null);
  }, [testType]);

  const total = questions.length;

  const handleSelect = (qid: string, idx: number) => {
    setAnswers((s) => ({ ...s, [qid]: idx }));
  };

  const handleNext = () => setCurrentIndex((i) => Math.min(i + 1, total - 1));
  const handlePrev = () => setCurrentIndex((i) => Math.max(i - 1, 0));

  const computeScore = () => {
    let score = 0;
    const answerArray: AnswerRecord[] = questions.map((q) => ({ id: q.id, selected: answers[q.id] ?? null }));
    questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) score += 1;
    });
    return { score, total, answerArray };
  };

  const handleSubmit = async () => {
    const { score, answerArray } = computeScore();
    setSubmitting(true);
    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: userId,
          testType,
          answers: answerArray,
          score,
          total,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        setSubmittedResult({ score, total });
        setShowSummary(false);
      } else {
        console.error("Submit failed", data);
        alert("Failed to submit assessment. Check console for details.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error when submitting assessment");
    } finally {
      setSubmitting(false);
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">
          {testType.startsWith("skill-")
            ? `Skill Test: ${testType.replace("skill-", "").toUpperCase()}`
            : testType === "gn"
            ? "General Knowledge Test"
            : testType === "english"
            ? "English Test"
            : "Aptitude Test"}
        </h2>
        {!isSkillTest && (
          <div className="flex items-center gap-2">
            <label className="text-sm">Test:</label>
            <select value={testType} onChange={(e) => setTestType(e.target.value as any)} className="p-2 border rounded">
              <option value="aptitude">Aptitude</option>
              <option value="english">English</option>
              <option value="gn">General Knowledge</option>
            </select>
          </div>
        )}
      </div>

      <div className="mb-3">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600" style={{ width: `${((currentIndex) / Math.max(1, total)) * 100}%` }} />
        </div>
        <div className="text-sm text-gray-600 mt-1">Question {currentIndex + 1} of {total}</div>
      </div>

      {showSummary ? (
        <div>
          <h3 className="text-lg font-medium mb-2">Summary</h3>
          <ul className="space-y-2 mb-4">
            {questions.map((q, i) => (
              <li key={q.id} className="p-3 border rounded">
                <div className="font-medium">{i + 1}. {q.text}</div>
                <div className="mt-2 text-sm">
                  Your answer: <span className="font-semibold">{typeof answers[q.id] === 'number' ? q.options[answers[q.id] as number] : 'No answer'}</span>
                </div>
                <div className="text-sm text-green-700">Correct answer: <span className="font-semibold">{q.options[q.correctIndex]}</span></div>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>{submitting ? 'Submitting...' : 'Confirm & Submit'}</button>
            <button className="p-2 border rounded" onClick={() => setShowSummary(false)}>Back to questions</button>
          </div>
        </div>
      ) : (
        <div>
          {currentQ ? (
            <div>
              <div className="mb-3 font-medium">{currentIndex + 1}. {currentQ.text}</div>
              {isSkillTest && currentQ.difficulty && (
                <div className={`inline-block px-2 py-1 text-xs rounded ${currentQ.difficulty === "easy" ? "bg-green-100 text-green-800" : currentQ.difficulty === "moderate" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>Difficulty: {currentQ.difficulty.charAt(0).toUpperCase() + currentQ.difficulty.slice(1)}</div>
              )}
              <div className="space-y-2">
                {currentQ.options.map((opt, idx) => (
                  <label key={idx} className={`flex items-center gap-3 p-2 border rounded cursor-pointer ${answers[currentQ.id] === idx ? 'bg-indigo-50 border-indigo-300' : ''}`}>
                    <input type="radio" name={currentQ.id} checked={answers[currentQ.id] === idx} onChange={() => handleSelect(currentQ.id, idx)} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="p-2 border rounded" onClick={handlePrev} disabled={currentIndex === 0}>Previous</button>
                  <button className="p-2 border rounded" onClick={handleNext} disabled={currentIndex === total - 1}>Next</button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 border rounded" onClick={() => { setShowSummary(true); }}>Review & Submit</button>
                </div>
              </div>
            </div>
          ) : (
            <div>No questions available for selected test.</div>
          )}
        </div>
      )}

      {submittedResult && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="font-medium">Submitted</div>
          <div>Your score: {submittedResult.score} / {submittedResult.total}</div>
        </div>
      )}
    </div>
  );
}
