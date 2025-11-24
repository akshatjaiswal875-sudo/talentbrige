import { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "We'll Be Back Soon | Talent Bridge",
  description: "Talent Bridge is undergoing scheduled maintenance. We'll be back online shortly.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MaintenancePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16 text-center">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 rounded-2xl border border-border bg-card p-10 shadow-sm">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
          <AlertTriangle className="h-7 w-7" />
        </span>
        <h1 className="text-3xl font-semibold tracking-tight">We'll Be Back Soon</h1>
        <p className="text-muted-foreground">
          Talent Bridge is taking a short break for maintenance and upgrades. Thank you for your
          patience while we make things even better for you.
        </p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Estimated downtime: under 24 hours.</p>
          <p>Need urgent assistance? Reach out anytime.</p>
        </div>
        <Button asChild size="lg" className="gap-2">
          <Link href="mailto:support@talentbridge.com">
            <Mail className="h-4 w-4" />
            Contact Support
          </Link>
        </Button>
      </div>
    </main>
  );
}
