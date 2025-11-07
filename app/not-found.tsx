import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle>404 — Page not found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">We could not find the page you are looking for.</p>
          <div className="flex gap-2">
            <Link href="/">
              <Button>Go home</Button>
            </Link>
            <Link href="/internships">
              <Button variant="outline">Browse Internships</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
