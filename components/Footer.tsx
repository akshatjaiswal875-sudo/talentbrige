"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="border-t bg-background text-foreground">
      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Talent Bridge</h3>
            <p className="text-sm text-muted-foreground">
              Helping students find meaningful internships and companies discover great talent.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Badge>Trusted</Badge>
              <Badge variant="outline">Remote-friendly</Badge>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/internships" className="hover:text-foreground">Internships</Link></li>
              <li><Link href="/companies" className="hover:text-foreground">Companies</Link></li>
              <li><Link href="/admin" className="hover:text-foreground">Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground">About</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Stay updated</h4>
            <p className="text-sm text-muted-foreground mb-3">Get curated internships and product updates.</p>
            {subscribed ? (
              <div className="text-sm text-muted-foreground">Thanks for subscribing!</div>
            ) : (
              <div className="flex gap-2">
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" />
                <Button onClick={() => { setSubscribed(true); setEmail(""); }}>
                  Subscribe
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 border-t pt-6 flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} Talent Bridge — All rights reserved.</div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/support" className="hover:text-foreground">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
