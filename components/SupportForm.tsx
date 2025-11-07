"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SupportForm() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    // Simulate send
    await new Promise((r) => setTimeout(r, 700));
    setStatus("sent");
    setEmail("");
    setSubject("");
    setMessage("");
  }

  return (
    <div>
      {status === "sent" ? (
        <div className="p-4 rounded bg-secondary/10">Thanks! We&apos;ll reply soon.</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Your email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1" />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-md border p-3 mt-1 bg-background text-foreground"
              placeholder="Please provide as much detail as you can."
            />
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending..." : "Send request"}</Button>
          </div>
        </form>
      )}
    </div>
  );
}
