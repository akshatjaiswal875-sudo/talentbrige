"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Terms of Service</CardTitle>
              <CardDescription>Rules and responsibilities when using Talent Bridge.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">By using Talent Bridge you agree to our terms and to use the site responsibly. Users must provide accurate information and not impersonate others.</p>
              <p className="mb-4">We reserve the right to remove content that violates our policies. For disputes or takedown requests, contact support.</p>
              <p className="mt-6 text-sm text-muted-foreground">Last updated: Oct 11, 2025</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
