import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AppProviders } from "@/components/providers/app-providers";
import { SosPresence } from "@/components/sos/sos-presence";
import { geistMono, geistSans, notoBengali, tiroBangla } from "@/lib/fonts";
import { THEME_STORAGE_KEY } from "@/lib/theme-storage";

export const metadata: Metadata = {
  title: "লাইফলিংক — LifeLink | মানুষের সেবা এক ঠাঁইয়ে",
  description:
    "রক্ত, ক্লিনিক, ফার্মেসি, চাকরি, শিক্ষক ও সংবাদ — বাংলা ভাষায় চলা পরিবার ও ব্যবসার জন্য এক জায়গায়।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeBoot = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k)||'light';function d(){return window.matchMedia('(prefers-color-scheme:dark)').matches;}var isDark=t==='dark'||(t==='system'&&d());document.documentElement.classList.toggle('dark',isDark);}catch(e){}})();`;

  return (
    <html
      lang="bn"
      suppressHydrationWarning
      className={`${notoBengali.variable} ${tiroBangla.variable} ${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full text-foreground antialiased">
        <Script id="theme-boot" strategy="beforeInteractive">
          {themeBoot}
        </Script>
        <AppProviders>
          <div className="flex min-h-full flex-col">
            <SiteHeader />
            <SosPresence />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
