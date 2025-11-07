"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  internshipId: string;
  onClose?: () => void;
  onSuccess?: (data: unknown) => void;
};

export default function ApplyModal({ internshipId, onClose, onSuccess }: Props) {
  const [resumeLink, setResumeLink] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResumeError(null);
    setMessageError(null);

    // Client-side validation: both fields are required
    if (!resumeLink.trim()) {
      setResumeError("Resume link is required");
      setLoading(false);
      return;
    }

    // basic URL validation
    try {
      // allow simple emails or urls, but prefer a valid URL
      // If URL constructor fails, we treat it as invalid
      new URL(resumeLink);
    } catch {
      setResumeError("Please enter a valid URL (https://...)");
      setLoading(false);
      return;
    }

    if (!message.trim()) {
      setMessageError("Message is required");
      setLoading(false);
      return;
    }

    if (message.trim().length < 20) {
      setMessageError("Please provide a bit more detail in your message (min 20 characters)");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internshipId, resumeLink, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        // If the API explicitly returns unauthorized, close modal and trigger the login flow
        if (res.status === 401 || data?.error === 'Unauthorized') {
          // Close this modal first
          onClose?.();
          // Ask the global UI to open the login dialog
          if (typeof window !== 'undefined') {
            // small timeout to allow modal to unmount first
            setTimeout(() => window.dispatchEvent(new CustomEvent('open-login')), 150);
          }
          return;
        }

        if (res.status === 409) throw new Error(data.error || "You have already applied to this internship.");
        throw new Error(data.error || "Failed");
      }
      onSuccess?.(data);
      onClose?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose?.(); }}>
      <DialogContent>
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Apply to this internship</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">Provide a link to your resume and a short message to the employer.</p>
          </DialogHeader>

          <div className="grid gap-4 mt-4">
            <div>
              <Label htmlFor="resume">Resume link</Label>
              <Input
                id="resume"
                value={resumeLink}
                onChange={(e) => { setResumeLink(e.target.value); if (resumeError) setResumeError(null); }}
                placeholder="https://"
                aria-invalid={!!resumeError}
              />
              {resumeError ? (
                <p className="text-xs text-destructive mt-1">{resumeError}</p>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">We recommend a public link to your resume (Google Drive, Dropbox, or personal site).</p>
              )}
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                className="min-h-[100px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs"
                value={message}
                onChange={(e) => { setMessage(e.target.value); if (messageError) setMessageError(null); }}
                aria-invalid={!!messageError}
                placeholder="Write a short message to the employer (why you\'re a good fit)."
              />
              <div className="flex items-center justify-between mt-1">
                {messageError ? (
                  <p className="text-xs text-destructive">{messageError}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">Minimum 20 characters</p>
                )}
                <p className="text-xs text-muted-foreground">{message.length}/500</p>
              </div>
            </div>

            {error && <div className="text-sm text-destructive">{error}</div>}
          </div>

          <DialogFooter>
            <div className="flex gap-2 w-full">
              <Button variant="outline" type="button" onClick={() => onClose?.()} className="w-1/2">Cancel</Button>
              <Button type="submit" disabled={loading} className="w-1/2">
                {loading ? "Applying..." : "Apply"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
