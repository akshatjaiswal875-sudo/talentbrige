"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
              <CardDescription>How we handle your data and protect your privacy.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">We collect minimal data required to operate the platform, including account information and application details. We never sell personal data.</p>
              <p className="mb-4">We use industry-standard security practices to protect your information. For detailed information, please contact our support.</p>
              <p className="mt-6 text-sm text-muted-foreground">Last updated: Oct 11, 2025</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
