"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Lock, FileText, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Lecture {
  _id: string;
  title: string;
  videoUrl?: string;
  duration?: string;
  description?: string;
  isPreview?: boolean;
  notesUrl?: string;
}

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  price: string;
  bannerUrl?: string;
  lectures: Lecture[];
  questions?: Question[];
}

import { ManualPaymentModal } from "@/components/ManualPaymentModal";

export default function CoursePage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedLectures, setCompletedLectures] = useState<Set<string>>(new Set());
  const [marking, setMarking] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<'success' | 'failed' | 'pending' | null>(null);
  const [transactionReason, setTransactionReason] = useState<string | null>(null);
  const [showApprovalNotice, setShowApprovalNotice] = useState(false);
  const approvalNoticeShownRef = useRef(false);
  const previousAccessRef = useRef<boolean | null>(null);

  const fetchCourse = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      const data = await res.json();
      if (data.course) {
        setCourse(data.course);
        setHasAccess(data.hasAccess);
        
        // Set initial active lecture (default to first or preview)
        if (!activeLecture && data.course.lectures?.length > 0) {
            if (data.hasAccess) {
                setActiveLecture(data.course.lectures[0]);
            } else {
                const preview = data.course.lectures.find((l: Lecture) => l.isPreview);
                if (preview) setActiveLecture(preview);
            }
        }
      }
    } catch (e) {
      console.error("Failed to fetch course", e);
    } finally {
      setLoading(false);
    }
  }, [courseId, activeLecture]);

  const fetchProgress = React.useCallback(async () => {
    try {
        const res = await fetch(`/api/courses/${courseId}/progress`);
        if (res.ok) {
            const data = await res.json();
            setCompletedLectures(new Set(data.completedLectures || []));
            
            // If we have a last played lecture, switch to it
            // Only if the user hasn't manually selected one yet (or we just loaded)
            // For simplicity, we'll just switch if it's the initial load (we can track this if needed, but let's just switch)
            if (data.lastPlayedLectureId && course) {
                 const last = course.lectures.find((l: Lecture) => l._id === data.lastPlayedLectureId);
                 if (last) setActiveLecture(last);
            }
        }
    } catch (e) {
        console.error("Failed to fetch progress", e);
    }
  }, [courseId, course]);

  const fetchPaymentStatus = React.useCallback(async () => {
    try {
        const res = await fetch(`/api/payment/status?courseId=${courseId}`, { cache: "no-store" });
        if (res.status === 401) {
          setTransactionStatus(null);
          setTransactionReason(null);
          return;
        }
        if (!res.ok) {
          setTransactionStatus(null);
          setTransactionReason(null);
          return;
        }
        const data = await res.json();
        if (!data || !data.status) {
          setTransactionStatus(null);
          setTransactionReason(null);
          return;
        }
        setTransactionStatus(data.status);
        setTransactionReason(data.declineReason || null);

        if (data.status === 'success') {
          fetchCourse();
        }
    } catch (e) {
        console.error("Failed to fetch payment status", e);
    }
  }, [courseId, fetchCourse]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  useEffect(() => {
    if (user && course) {
        fetchProgress();
    }
  }, [user, course, fetchProgress]); // Depend on course ID to avoid deep object diff issues

  useEffect(() => {
    if (!user || !course) return;
    if (!hasAccess || !approvalNoticeShownRef.current) {
        fetchPaymentStatus();
    }
  }, [user, course, hasAccess, fetchPaymentStatus]);

  useEffect(() => {
    if (transactionStatus === 'success' && !approvalNoticeShownRef.current) {
        setShowApprovalNotice(true);
        approvalNoticeShownRef.current = true;
    }
  }, [transactionStatus]);

  useEffect(() => {
    if (previousAccessRef.current === null) {
        previousAccessRef.current = hasAccess;
        return;
    }

    if (!previousAccessRef.current && hasAccess && !approvalNoticeShownRef.current) {
        setShowApprovalNotice(true);
        approvalNoticeShownRef.current = true;
    }

    previousAccessRef.current = hasAccess;
  }, [hasAccess]);

  useEffect(() => {
    if (activeLecture && user && hasAccess) {
        // Update last played lecture without changing completion status
        const isCompleted = completedLectures.has(activeLecture._id);
        fetch(`/api/courses/${courseId}/progress`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lectureId: activeLecture._id, completed: isCompleted })
        }).catch(() => {});
    }
  }, [activeLecture, user, hasAccess, courseId, completedLectures]); // Removed completedLectures from dependency to avoid loop

  async function toggleComplete(lectureId: string) {
    if (!hasAccess) return;
    setMarking(true);
    const isComplete = completedLectures.has(lectureId);
    const newStatus = !isComplete;
    
    // Optimistic update
    const next = new Set(completedLectures);
    if (newStatus) next.add(lectureId);
    else next.delete(lectureId);
    setCompletedLectures(next);

    try {
        await fetch(`/api/courses/${courseId}/progress`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lectureId, completed: newStatus })
        });
    } catch (e) {
        // Revert on error
        console.error("Failed to update progress", e);
        setCompletedLectures(completedLectures);
    } finally {
        setMarking(false);
    }
  }

  function handleNext() {
    if (!course || !activeLecture) return;
    const idx = course.lectures.findIndex(l => l._id === activeLecture._id);
    if (idx !== -1 && idx < course.lectures.length - 1) {
        setActiveLecture(course.lectures[idx + 1]);
    }
  }

  function handlePrev() {
    if (!course || !activeLecture) return;
    const idx = course.lectures.findIndex(l => l._id === activeLecture._id);
    if (idx > 0) {
        setActiveLecture(course.lectures[idx - 1]);
    }
  }

  function handleEnroll() {
    if (!course) return;
    if (transactionStatus === 'pending') {
      alert("Your payment is currently under review. We'll notify you once it's approved.");
      return;
    }
    setIsPaymentModalOpen(true);
  }

  function handleCloseApprovalNotice() {
    setShowApprovalNotice(false);
    setTransactionStatus(null);
    setTransactionReason(null);
  }

  if (loading) return <div className="p-8 text-center">Loading course...</div>;
  if (!course) return <div className="p-8 text-center">Course not found</div>;

  return (
    <div className="container mx-auto py-6 px-4">
      {transactionStatus === 'pending' && (
        <div className="mb-6 rounded-md border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          Your payment request is pending verification. We will email you once access is granted.
        </div>
      )}
      {transactionStatus === 'failed' && (
        <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Your last payment submission was declined. {transactionReason ? <span>Reason: {transactionReason}</span> : "Please review your payment details and try again."}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
            {activeLecture && activeLecture.videoUrl ? (
              <iframe
                src={getEmbedUrl(activeLecture.videoUrl)}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white bg-slate-900 p-6 text-center relative">
                {course.bannerUrl && (
                  <>
                    <img 
                      src={course.bannerUrl} 
                      alt={course.title} 
                      className="absolute inset-0 w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                  </>
                )}
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  {hasAccess ? (
                      <p>Select a lecture to start watching</p>
                  ) : (
                      <div className="space-y-4">
                          <Lock className="h-12 w-12 mx-auto text-slate-400" />
                          <h3 className="text-xl font-bold">This course is locked</h3>
                          <p className="text-slate-300">Enroll in this course to access all lectures.</p>
                        <Button size="lg" onClick={handleEnroll} disabled={transactionStatus === 'pending'}>
                          {transactionStatus === 'pending' ? "Payment Pending" : "Enroll Now"}
                          </Button>
                      </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{activeLecture?.title || course.title}</h1>
                    <p className="text-muted-foreground mt-2">{activeLecture?.description || course.description}</p>
                    
                    {/* Navigation & Actions */}
                    {activeLecture && hasAccess && (
                        <div className="flex flex-wrap items-center gap-3 mt-4">
                            <Button variant="outline" onClick={handlePrev} disabled={course.lectures.findIndex(l => l._id === activeLecture._id) === 0}>
                                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                            </Button>
                            
                            <Button 
                                variant={completedLectures.has(activeLecture._id) ? "secondary" : "default"}
                                onClick={() => toggleComplete(activeLecture._id)}
                                disabled={marking}
                            >
                                {completedLectures.has(activeLecture._id) ? (
                                    <>
                                        <CheckCircle className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                                        Completed
                                    </>
                                ) : (
                                    "Mark as Complete"
                                )}
                            </Button>

                            <Button variant="outline" onClick={handleNext} disabled={course.lectures.findIndex(l => l._id === activeLecture._id) === course.lectures.length - 1}>
                                Next <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    )}

                    {activeLecture?.notesUrl && (
                      <Button variant="outline" className="mt-4 gap-2" asChild>
                        <a href={activeLecture.notesUrl} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4" />
                          View Lecture Notes
                        </a>
                      </Button>
                    )}
                </div>
                {!hasAccess && (
                  <Button onClick={handleEnroll} disabled={transactionStatus === 'pending'}>
                    {transactionStatus === 'pending' ? "Payment Pending" : "Enroll Now"}
                    </Button>
                )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              {hasAccess && course.lectures.length > 0 && (
                  <div className="mt-2">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>{Math.round((completedLectures.size / course.lectures.length) * 100)}% Complete</span>
                          <span>{completedLectures.size}/{course.lectures.length}</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-300" 
                            style={{ width: `${(completedLectures.size / course.lectures.length) * 100}%` }} 
                          />
                      </div>
                  </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {course.lectures.map((lecture, index) => {
                  const isLocked = !hasAccess && !lecture.isPreview;
                  const isCompleted = completedLectures.has(lecture._id);
                  return (
                    <button
                        key={lecture._id}
                        onClick={() => {
                            if (!isLocked) setActiveLecture(lecture);
                        }}
                        disabled={isLocked}
                        className={`w-full p-4 text-left hover:bg-accent transition-colors flex items-start gap-3 ${
                        activeLecture?._id === lecture._id ? "bg-accent" : ""
                        } ${isLocked ? "opacity-75 cursor-not-allowed" : ""}`}
                    >
                        {isLocked ? (
                            <Lock className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
                        ) : isCompleted ? (
                            <CheckCircle className="h-5 w-5 mt-0.5 text-green-600 dark:text-green-400 shrink-0" />
                        ) : (
                            <PlayCircle className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                        )}
                        <div>
                        <div className="font-medium text-sm flex items-center gap-2">
                            {index + 1}. {lecture.title}
                            {lecture.isPreview && <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded">Preview</span>}
                        </div>
                        {lecture.duration && (
                            <div className="text-xs text-muted-foreground mt-1">{lecture.duration}</div>
                        )}
                        </div>
                    </button>
                  );
                })}
                {course.lectures.length === 0 && (
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    No lectures uploaded yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={showApprovalNotice} onOpenChange={(open) => {
        if (!open) {
          handleCloseApprovalNotice();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Course Approved!</DialogTitle>
            <DialogDescription>
              Your live class starts on 1st December 2025. We'll send reminders as the date approaches.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleCloseApprovalNotice} autoFocus>
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {course && (
        <ManualPaymentModal 
          isOpen={isPaymentModalOpen} 
          onClose={() => setIsPaymentModalOpen(false)} 
          courseTitle={course.title} 
          price={course.price || "₹0"} 
          courseId={course._id} 
          existingStatus={transactionStatus}
          declineReason={transactionReason}
          onSubmitted={() => {
            setIsPaymentModalOpen(false);
            fetchPaymentStatus();
          }}
        />
      )}
    </div>
  );
}

function getEmbedUrl(url: string) {
  if (!url) return "";
  // Simple YouTube embed converter
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
}
