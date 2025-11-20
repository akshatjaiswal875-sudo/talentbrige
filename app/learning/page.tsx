"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LearningNavbar } from "@/components/LearningNavbar";

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

export default function LearningPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (data.courses) setCourses(data.courses);
      } catch (e) {
        console.error("Failed to fetch courses", e);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <LearningNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <LearningNavbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Available Courses</h1>
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
                <CardDescription>{course.duration} • {course.price}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">{course.description}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/learning/${course._id}`} className="w-full">
                  <Button className="w-full">View Course</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        {courses.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No courses available yet. Check back later!
          </div>
        )}
      </div>
    </div>
  );
}
