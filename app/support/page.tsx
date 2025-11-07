import React from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import SupportForm from "../../components/SupportForm";

export const metadata = {
  title: "Support — TalentBridge",
  description: "Get help, read FAQs, or contact TalentBridge support.",
};

export default function SupportPage() {
  return (
    <main className="max-w-7xl mx-auto p-6 md:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Support</h1>
          <p className="text-muted-foreground mb-6">
            Need help? Browse our frequently asked questions, or open a support request below. Our team typically responds within 1-2 business days.
          </p>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-2">Open a support request</h2>
            <p className="text-sm text-muted-foreground mb-4">Describe your issue and we&apos;ll get back to you.</p>

            <SupportForm />
            <div className="mt-4">
              <Button variant="ghost" asChild>
                <Link href="/contact">Contact page</Link>
              </Button>
            </div>
          </Card>
        </section>

        <aside>
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Quick links</h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link href="/faq" className="text-primary underline">Frequently asked questions</Link>
              </li>
              <li>
                <a href="mailto:support@talentbridge.example" className="underline">Email support</a>
              </li>
              <li>
                <Link href="/terms" className="underline">Terms &amp; policies</Link>
              </li>
              <li>
                <Link href="/privacy" className="underline">Privacy policy</Link>
              </li>
            </ul>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium">Report a bug</h4>
              <p className="text-xs text-muted-foreground">Found something wrong? Send a quick note to our team.</p>
              <Button variant="link" className="p-0 mt-2" asChild>
                <a href="mailto:bugs@talentbridge.example">Report bug</a>
              </Button>
            </div>
          </Card>
        </aside>
      </div>
    </main>
  );
}
