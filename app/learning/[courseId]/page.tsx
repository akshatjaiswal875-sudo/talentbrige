"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Lock, FileText, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { PaymentModal } from "@/components/PaymentModal";

interface Lecture {
  _id: string;
  title: string;
  videoUrl?: string;
  duration?: string;
  description?: string;
  isPreview?: boolean;
  notesUrl?: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  price: string;
  bannerUrl?: string;
  lectures: Lecture[];
}

export default function CoursePage() {
  const { courseId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [completedLectures, setCompletedLectures] = useState<Set<string>>(new Set());
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [courseId, user]);

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
  }, [activeLecture, user, hasAccess, courseId, completedLectures]);

  async function fetchCourse() {
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      const data = await res.json();
      if (data.course) {
        setCourse(data.course);
        setHasAccess(data.hasAccess);
        
        let initialLecture = null;
        if (data.course.lectures?.length > 0) {
            if (data.hasAccess) {
                initialLecture = data.course.lectures[0];
            } else {
                initialLecture = data.course.lectures.find((l: Lecture) => l.isPreview);
            }
        }

        // If user is logged in and has access, fetch progress
        if (user && data.hasAccess) {
            try {
                const pRes = await fetch(`/api/courses/${courseId}/progress`);
                if (pRes.ok) {
                    const pData = await pRes.json();
                    setCompletedLectures(new Set(pData.completedLectures || []));
                    if (pData.lastPlayedLectureId) {
                        const last = data.course.lectures.find((l: Lecture) => l._id === pData.lastPlayedLectureId);
                        if (last) initialLecture = last;
                    }
                }
            } catch (e) { console.error(e); }
        }
        
        if (initialLecture) setActiveLecture(initialLecture);
      }
    } catch (e) {
      console.error("Failed to fetch course", e);
    } finally {
      setLoading(false);
    }
  }

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

  async function handlePaymentSuccess(paymentId: string) {
    setShowPayment(false);
    fetchCourse(); // Refresh to get access
  }

  if (loading) return <div className="p-8 text-center">Loading course...</div>;
  if (!course) return <div className="p-8 text-center">Course not found</div>;

  return (
    <div className="container mx-auto py-6 px-4">
      <PaymentModal 
        isOpen={showPayment} 
        onClose={() => setShowPayment(false)} 
        onSuccess={handlePaymentSuccess}
        courseTitle={course.title}
        price={course.price}
        courseId={course._id}
      />
      
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
                          <Lock className="h-12 w-12 mx-auto text-muted-foreground" />
                          <h3 className="text-xl font-bold">This course is locked</h3>
                          <p className="text-muted-foreground">Purchase this course to access all lectures.</p>
                          <Button size="lg" onClick={() => setShowPayment(true)}>
                              {`Buy Course for ${course.price}`}
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
                                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
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
                    <Button onClick={() => setShowPayment(true)}>
                        {`Buy for ${course.price}`}
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
                            <CheckCircle className="h-5 w-5 mt-0.5 text-green-600 shrink-0" />
                        ) : (
                            <PlayCircle className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                        )}
                        <div>
                        <div className="font-medium text-sm flex items-center gap-2">
                            {index + 1}. {lecture.title}
                            {lecture.isPreview && <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">Preview</span>}
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
