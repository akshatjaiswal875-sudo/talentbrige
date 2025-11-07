"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>About Talent Bridge</CardTitle>
              <CardDescription>Connecting students with meaningful internships and companies with great early talent.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                Talent Bridge is a platform built to help students discover internships that fit their skills and goals. We partner with companies to surface curated opportunities and simplify the application process.
              </p>
              <p className="mb-4">
                Our mission is to make career discovery accessible and efficient. We focus on quality listings, a clean application experience, and tools for employers to find motivated candidates.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/contact">Contact our team</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
