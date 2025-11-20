"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
  courseTitle: string;
  price: string;
  courseId: string;
}

export function PaymentModal({ isOpen, onClose, onSuccess, courseTitle, price, courseId }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    
    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
      // 1. Create Order
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      // 2. Open Razorpay Checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "TalentBridge",
        description: `Purchase ${courseTitle}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // 3. Verify Payment
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: courseId
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              onSuccess(response.razorpay_payment_id);
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
      
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase Course</DialogTitle>
          <DialogDescription>
            Get full access to <strong>{courseTitle}</strong> for <strong>{price}</strong>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Secure payment via Razorpay (UPI, Cards, Netbanking)
            </p>
          </div>
          
          <Button 
            size="lg" 
            className="w-full" 
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : `Pay ${price} Now`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

