"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    // Simulate send
    await new Promise((r) => setTimeout(r, 700));
    setStatus("sent");
    setName(""); setEmail(""); setMessage("");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
                <CardDescription>Have questions or need help? Send us a message and we&apos;ll get back shortly.</CardDescription>
            </CardHeader>
            <CardContent>
              {status === "sent" ? (
                <div className="p-4 rounded bg-secondary/10">Thanks! We&apos;ll reply soon.</div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                  <Input placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-[120px] rounded-md border px-3 py-2 bg-transparent" />
                  <div>
                    <Button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending..." : "Send Message"}</Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
