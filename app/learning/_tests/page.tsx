"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, GraduationCap, CheckCircle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface Course {
  _id: string;
  title: string;
  description: string;
  bannerUrl?: string;
  questions?: any[];
}

export default function TestsPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [coursesRes, myCoursesRes] = await Promise.all([
          fetch("/api/courses", { cache: 'no-store' }),
          fetch("/api/courses/my-courses", { cache: 'no-store' })
        ]);

        const coursesData = await coursesRes.json();
        if (coursesData.courses) {
          setCourses(coursesData.courses);
        }

        if (myCoursesRes.ok) {
            const myCoursesData = await myCoursesRes.json();
            if (myCoursesData.courses) {
                setEnrolledCourseIds(new Set(myCoursesData.courses.map((c: any) => c._id)));
            }
        }
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  if (loading) {
    return <div className="p-8 text-center">Loading tests...</div>;
  }

  // Filter courses that have questions
  const coursesWithTests = courses.filter(c => c.questions && c.questions.length > 0);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold">Course Tests</h1>
        <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
            {coursesWithTests.length} Available
        </span>
      </div>
      <p className="text-muted-foreground mb-8">Take tests for your enrolled courses to test your knowledge.</p>

      {coursesWithTests.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/20">
          <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No tests available yet</h3>
          <p className="text-muted-foreground">Check back later for new course assessments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesWithTests.map(course => {
            const isEnrolled = enrolledCourseIds.has(course._id);
            
            return (
              <Card key={course._id} className="flex flex-col overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  {course.bannerUrl ? (
                    <img 
                      src={course.bannerUrl} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                      <GraduationCap className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  {!isEnrolled && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Lock className="h-8 w-8 text-white/80" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-sm text-muted-foreground">
                    {course.questions?.length} Questions
                  </div>
                </CardContent>
                <CardFooter>
                  {isEnrolled ? (
                    <Button asChild className="w-full gap-2">
                      <Link href={`/learning/tests/${course._id}`}>
                        <GraduationCap className="h-4 w-4" />
                        Take Test
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="secondary" asChild className="w-full gap-2">
                      <Link href={`/learning/${course._id}`}>
                        <Lock className="h-4 w-4" />
                        Unlock Course
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
