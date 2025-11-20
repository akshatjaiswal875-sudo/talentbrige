import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/components/AuthProvider";
import FooterWrapper from "@/components/FooterWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Talent Bridge",
  description: "Talent Bridge — connect students and companies with meaningful internship opportunities.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* No-flash theme init */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  let dark = true;
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') dark = true;
    else if (stored === 'light') dark = false;
    else if (window.matchMedia) dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {}
  const root = document.documentElement;
  if (dark) root.classList.add('dark'); else root.classList.remove('dark');
  try {
    // Hint to UA for form controls etc.
    let meta = document.querySelector('meta[name="color-scheme"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name','color-scheme'); document.head.appendChild(meta); }
    meta.setAttribute('content', dark ? 'dark light' : 'light dark');
  } catch {}
})();`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GoogleOAuthProvider clientId={`${process.env.GOOGLE_CLIENT_ID}`}>
          <AuthProvider>
            {/* auto-open login dialog when ?openLogin=1 is present */}
            <script dangerouslySetInnerHTML={{ __html: `
              try {
                const params = new URLSearchParams(window.location.search);
                if (params.get('openLogin') === '1') {
                  window.dispatchEvent(new CustomEvent('open-login'));
                  // remove the param from the URL so it doesn't re-open on refresh
                  const url = new URL(window.location.href);
                  url.searchParams.delete('openLogin');
                  window.history.replaceState({}, '', url.toString());
                }
              } catch (e) { /* ignore */ }
            ` }} />
            {children}
            <FooterWrapper />
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
