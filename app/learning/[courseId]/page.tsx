"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Lock, FileText } from "lucide-react";
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

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  async function fetchCourse() {
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      const data = await res.json();
      if (data.course) {
        setCourse(data.course);
        setHasAccess(data.hasAccess);
        // Select first lecture or first preview
        if (data.course.lectures?.length > 0) {
            // If has access, select first. If not, select first preview or nothing.
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
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {course.lectures.map((lecture, index) => {
                  const isLocked = !hasAccess && !lecture.isPreview;
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
