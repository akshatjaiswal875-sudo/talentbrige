"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check } from "lucide-react";

interface ManualPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  price: string;
  courseId: string;
}

export function ManualPaymentModal({ isOpen, onClose, courseTitle, price, courseId }: ManualPaymentModalProps) {
  const [utr, setUtr] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const UPI_ID = "8188864146@axl";

  const handleCopy = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utr.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/payment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, utr, amount: price }),
      });

      if (!res.ok) throw new Error("Failed to submit payment");
      
      setSubmitted(true);
    } catch (err) {
      alert("Failed to submit payment details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase {courseTitle}</DialogTitle>
          <DialogDescription>
            Pay <strong>{price}</strong> via UPI to enroll.
          </DialogDescription>
        </DialogHeader>
        
        {!submitted ? (
          <div className="space-y-6 py-4">
            <div className="bg-muted p-4 rounded-lg space-y-2 text-center">
              <p className="text-sm font-medium text-muted-foreground">Scan QR or Pay to UPI ID</p>
              <div className="flex items-center justify-center gap-2 bg-background p-2 rounded border">
                <code className="text-lg font-bold">{UPI_ID}</code>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              {/* Optional: Add QR Code Image Here if available */}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="utr">Enter UTR / Transaction ID</Label>
                <Input 
                  id="utr" 
                  placeholder="e.g. 3245xxxxxxxx" 
                  value={utr} 
                  onChange={(e) => setUtr(e.target.value)}
                  required 
                />
                <p className="text-xs text-muted-foreground">
                  After payment, enter the 12-digit UTR number from your payment app.
                </p>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Payment Details"}
              </Button>
            </form>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Payment Submitted!</h3>
              <p className="text-muted-foreground mt-1">
                We have received your request. Access will be granted after admin verification (usually within 24 hours).
              </p>
            </div>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
