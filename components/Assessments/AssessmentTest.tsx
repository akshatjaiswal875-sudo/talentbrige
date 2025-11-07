"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS, Question as QType, DEFAULT_QUESTIONS_PER_TEST } from "../../data/questions";

type AnswerRecord = { id: string; selected: number | null };

export default function AssessmentTest({ userId, initialTestType = "aptitude" }: { userId: string; initialTestType?: string }) {
  // State declarations
  const router = useRouter();
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [testType, setTestType] = useState<string>(initialTestType);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{ score: number; total: number } | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  
  // Privacy/anti-cheat: block right-click, copy, paste, and auto-submit on tab switch/close
  useEffect(() => {
    function blockEvent(e: Event) {
      e.preventDefault();
      return false;
    }
    document.addEventListener("contextmenu", blockEvent);
    document.addEventListener("copy", blockEvent);
    document.addEventListener("paste", blockEvent);
    document.addEventListener("cut", blockEvent);

    let submitted = false;
    function autoSubmit() {
      if (!submitted && testStarted && !showSummary && !submittedResult) {
        submitted = true;
        setShowSummary(true);
        setTimeout(() => handleSubmit(), 100); // auto-submit after blur/unload
      }
    }
    window.addEventListener("blur", autoSubmit);
    window.addEventListener("beforeunload", autoSubmit);

    return () => {
      document.removeEventListener("contextmenu", blockEvent);
      document.removeEventListener("copy", blockEvent);
      document.removeEventListener("paste", blockEvent);
      document.removeEventListener("cut", blockEvent);
      window.removeEventListener("blur", autoSubmit);
      window.removeEventListener("beforeunload", autoSubmit);
    };
  }, [showSummary, submittedResult, testStarted]);

  // Webcam: start when user starts the test, stop on submit/unmount
  useEffect(() => {
    let mounted = true;
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (!mounted) return;
        setCameraAllowed(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {
        console.warn('Camera not allowed', e);
        setCameraAllowed(false);
      }
    }

    if (testStarted) startCamera();

    return () => {
      mounted = false;
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraAllowed(false);
    };
  }, [testStarted]);

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
  const currentQ = questions[currentIndex];

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

  function getBadge(score: number, total: number) {
    const percent = (score / total) * 100;
    if (percent < 40) return { color: "bg-yellow-400 text-yellow-900", label: "Beginner" };
    if (percent < 60) return { color: "bg-blue-400 text-blue-900", label: "Average" };
    if (percent < 85) return { color: "bg-green-400 text-green-900", label: "Good" };
    return { color: "bg-red-500 text-white", label: "Excellent" };
  }

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const result = computeScore();
      // stop camera tracks
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraAllowed(false);
      setSubmittedResult(result);
      // Navigate to results page with query params
      const params = new URLSearchParams({ score: String(result.score), total: String(result.total), testType });
      router.push(`/assessments/result?${params.toString()}`);
    } catch (error) {
      console.error('Failed to submit test:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      {/* Webcam feed requirement */}
      <div className="mb-4">
        <div className="font-semibold mb-1">Camera must be ON during the test</div>
        <video ref={videoRef} autoPlay playsInline width={180} height={120} className="rounded border" style={{ background: '#222' }} />
        {!testStarted && (
          <div className="text-center mt-3">
            <p className="mb-3">To begin the test please click Start Test and allow camera access.</p>
            <div className="flex justify-center">
              <button className="btn-primary" onClick={() => setTestStarted(true)}>Start Test</button>
            </div>
          </div>
        )}
        {!cameraAllowed && testStarted && <div className="text-red-600 mt-2">Camera access is required to start the test.</div>}
      </div>

  {testStarted ? (!cameraAllowed ? (
        <div className="text-center text-lg text-red-600">Please allow camera access to begin the test.</div>
      ) : (
        <React.Fragment>
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
                <select value={testType} onChange={(e) => setTestType(e.target.value)} className="p-2 border rounded">
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
                <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Confirm & Submit'}
                </button>
                <button className="p-2 border rounded" onClick={() => setShowSummary(false)}>
                  Back to questions
                </button>
              </div>
            </div>
          ) : (
            <div>
              {currentQ ? (
                <div>
                  <div className="mb-3 font-medium">{currentIndex + 1}. {currentQ.text}</div>
                  {isSkillTest && currentQ.difficulty && (
                    <div className={`inline-block px-2 py-1 text-xs rounded ${
                      currentQ.difficulty === "easy" 
                        ? "bg-green-100 text-green-800" 
                        : currentQ.difficulty === "moderate" 
                        ? "bg-yellow-100 text-yellow-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      Difficulty: {currentQ.difficulty.charAt(0).toUpperCase() + currentQ.difficulty.slice(1)}
                    </div>
                  )}
                  <div className="space-y-2">
                    {currentQ.options.map((opt, idx) => (
                      <label 
                        key={idx} 
                        className={`flex items-center gap-3 p-2 border rounded cursor-pointer ${
                          answers[currentQ.id] === idx ? 'bg-indigo-50 border-indigo-300' : ''
                        }`}
                      >
                        <input 
                          type="radio" 
                          name={currentQ.id} 
                          checked={answers[currentQ.id] === idx} 
                          onChange={() => handleSelect(currentQ.id, idx)} 
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2 border rounded" 
                        onClick={handlePrev} 
                        disabled={currentIndex === 0}
                      >
                        Previous
                      </button>
                      <button 
                        className="p-2 border rounded" 
                        onClick={handleNext} 
                        disabled={currentIndex === total - 1}
                      >
                        Next
                      </button>
                    </div>
                    <button 
                      className="p-2 border rounded" 
                      onClick={() => setShowSummary(true)}
                    >
                      Review & Submit
                    </button>
                  </div>
                </div>
              ) : (
                <div>No questions available for selected test.</div>
              )}
            </div>
          )}

          {submittedResult && (
            <div className="mt-4 p-3 border rounded flex flex-col items-center">
              <div className="font-medium mb-2">Submitted</div>
              <div className="mb-2">Your score: {submittedResult.score} / {submittedResult.total}</div>
              {(() => {
                const badge = getBadge(submittedResult.score, submittedResult.total);
                return (
                  <span className={`px-4 py-2 rounded-full font-bold text-lg ${badge.color}`}>
                    {badge.label}
                  </span>
                );
              })()}
            </div>
          )}
        </React.Fragment>
      )) : null }
    </div>
  );
}