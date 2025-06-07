import { CartProvider } from "@/app/components/CartContext";
import DashboardSkeleton from "@/app/components/DashboardSkeleton";
import Footer from "@/app/components/footer";
import Header from "@/app/components/header";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Latte Coffee - Premium Coffee Experience",
  description:
    "Discover our handcrafted selection of premium coffees, expertly prepared to delight your senses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LMF9N93D5D"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LMF9N93D5D');
          `}
        </Script>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <Suspense fallback={<DashboardSkeleton />}>
              <main className="flex-grow">{children}</main>
            </Suspense>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
