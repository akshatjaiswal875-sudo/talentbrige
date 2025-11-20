"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LearningNavbar } from "@/components/LearningNavbar";
import { useAuth } from "@/components/AuthProvider";

interface Course {
  _id: string;
  title: string;
  category: string;
  price: string;
  duration: string;
  bannerUrl: string;
  description: string;
  lectures: any[];
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchMyCourses() {
      try {
        const res = await fetch('/api/courses/my-courses');
        if (res.status === 401) {
            // Not logged in
            setLoading(false);
            return;
        }
        const data = await res.json();
        if (data.courses) setCourses(data.courses);
      } catch (e) {
        console.error("Failed to fetch my courses", e);
      } finally {
        setLoading(false);
      }
    }
    if (user) {
        fetchMyCourses();
    } else {
        // Wait for auth check? Or just show empty if not logged in
        // AuthProvider handles initial load.
        // If user is null after some time, we can assume not logged in.
        // But let's just wait for user to be truthy or authChecked
    }
  }, [user]);

  // If auth is still loading, we might want to show loading.
  // But useAuth provides authChecked.
  
  if (loading && user) {
    return (
      <div className="min-h-screen bg-background">
        <LearningNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">Loading your courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <LearningNavbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">My Courses</h1>
        
        {!user ? (
            <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Please login to view your purchased courses.</p>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <Card key={course._id} className="flex flex-col">
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted relative">
                        {course.bannerUrl ? (
                        <img src={course.bannerUrl} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground">
                            No Image
                        </div>
                        )}
                        <Badge className="absolute top-2 right-2">{course.category}</Badge>
                    </div>
                    <CardHeader>
                        <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                        <CardDescription>{course.duration}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground line-clamp-3">{course.description}</p>
                    </CardContent>
                    <CardFooter>
                        <Link href={`/learning/${course._id}`} className="w-full">
                        <Button className="w-full">Continue Learning</Button>
                        </Link>
                    </CardFooter>
                    </Card>
                ))}
                </div>
                {courses.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    You haven't enrolled in any courses yet.
                    <div className="mt-4">
                        <Link href="/learning">
                            <Button variant="outline">Browse Courses</Button>
                        </Link>
                    </div>
                </div>
                )}
            </>
        )}
      </div>
    </div>
  );
}
