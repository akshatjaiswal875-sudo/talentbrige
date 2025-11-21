"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl md:text-3xl font-bold text-primary">Shipping & Delivery Policy</CardTitle>
              <CardDescription className="text-base">
                Information regarding the delivery of our digital services and products.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm md:text-base leading-relaxed">
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-3 text-foreground">1. Digital Delivery</h2>
                <p className="text-muted-foreground">
                  TalentBridge primarily offers digital services, including online courses, internship programs, and assessments. Upon successful purchase or registration, you will receive immediate access to the content via your user dashboard. No physical items will be shipped to your address.
                </p>
              </section>
              
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-3 text-foreground">2. Order Confirmation</h2>
                <p className="text-muted-foreground">
                  After completing a transaction, you will receive an email confirmation containing your order details and instructions on how to access your purchased course or service. If you do not receive this email within 15 minutes, please check your spam folder or contact support.
                </p>
              </section>

              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-3 text-foreground">3. Access Issues</h2>
                <p className="text-muted-foreground">
                  If you experience any issues accessing your purchased content after payment, please ensure you are logged in with the correct account. If the issue persists, contact our support team immediately for resolution.
                </p>
              </section>

              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-3 text-foreground">4. Physical Goods</h2>
                <p className="text-muted-foreground">
                  In the rare event that physical goods (such as certificates, merchandise, or study materials) are offered, shipping timelines and costs will be clearly communicated at the time of purchase. We are not responsible for delays caused by third-party courier services.
                </p>
              </section>

              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-3 text-foreground">5. Contact Us</h2>
                <p className="text-muted-foreground">
                  For any questions regarding the delivery of your services, please contact us at <a href="mailto:support@talentbridge.com" className="text-primary hover:underline">support@talentbridge.com</a>.
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
