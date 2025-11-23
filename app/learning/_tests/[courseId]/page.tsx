"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Lock } from "lucide-react";
import { CourseTest } from "@/components/CourseTest";
import Link from "next/link";

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Course {
  _id: string;
  title: string;
  questions?: Question[];
}

export default function TestPlayerPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        const data = await res.json();
        if (data.course) {
          setCourse(data.course);
          setHasAccess(data.hasAccess);
        }
      } catch (e) {
        console.error("Failed to fetch course", e);
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [courseId]);

  if (loading) return <div className="p-8 text-center">Loading test...</div>;
  if (!course) return <div className="p-8 text-center">Course not found</div>;

  if (!hasAccess) {
    return (
      <div className="container mx-auto py-12 px-4 text-center max-w-md">
        <div className="bg-muted/30 p-8 rounded-lg border">
            <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-6">
            You need to purchase this course to take the test.
            </p>
            <Button asChild className="w-full">
            <Link href={`/learning/${courseId}`}>Go to Course Page</Link>
            </Button>
        </div>
      </div>
    );
  }

  if (!course.questions || course.questions.length === 0) {
    return (
        <div className="container mx-auto py-12 px-4 text-center">
            <h2 className="text-xl font-semibold">No questions available</h2>
            <p className="text-muted-foreground mt-2">This course doesn't have a test yet.</p>
            <Button variant="outline" className="mt-4" onClick={() => router.back()}>
                Go Back
            </Button>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
            <Link href="/learning/tests" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ChevronLeft className="h-4 w-4" /> Back to Tests
            </Link>
        </Button>
        <h1 className="text-2xl font-bold mt-2">{course.title} - Final Test</h1>
      </div>
      
      <CourseTest 
        questions={course.questions} 
        onComplete={(score) => {
            console.log("Test completed with score:", score);
            // You could save the score here if you wanted
        }} 
      />
    </div>
  );
}
