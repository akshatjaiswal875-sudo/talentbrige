"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function CancellationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl md:text-3xl font-bold text-primary">Cancellation & Refund Policy</CardTitle>
              <CardDescription className="text-base">
                Please read our terms regarding cancellations and refunds carefully.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm md:text-base leading-relaxed">
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-3 text-foreground">1. Course Cancellation</h2>
                <p className="text-muted-foreground">
                  We understand that plans can change. If you have enrolled in a course by mistake or wish to cancel your enrollment, you may do so within <strong>24 hours</strong> of purchase for a full refund, provided you have not accessed more than 10% of the course content.
                </p>
              </section>
              
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-3 text-foreground">2. Refund Process</h2>
                <p className="text-muted-foreground">
                  Once a cancellation request is approved, refunds will be initiated immediately. The amount will be credited back to your original payment method within <strong>5-7 business days</strong>, depending on your bank's processing time.
                </p>
              </section>

              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-3 text-foreground">3. Non-Refundable Items</h2>
                <p className="text-muted-foreground">
                  Certain services, such as personalized career counseling sessions that have already taken place or certification fees once the certificate has been issued, are non-refundable.
                </p>
              </section>

              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-3 text-foreground">4. Internship Applications</h2>
                <p className="text-muted-foreground">
                  Internship applications are free to submit. You may withdraw an application at any time from your dashboard before it is reviewed by the employer. Withdrawing an application does not incur any penalty.
                </p>
              </section>

              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-3 text-foreground">5. Contact Support</h2>
                <p className="text-muted-foreground">
                  If you encounter any issues with cancellations or refunds, please reach out to our support team at <a href="mailto:support@talentbridge.com" className="text-primary hover:underline">support@talentbridge.com</a>. We are here to help!
                </p>
              </section>

              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Last updated: November 21, 2025
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
