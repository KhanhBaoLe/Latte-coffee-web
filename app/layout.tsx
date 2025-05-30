import { CartProvider } from "@/app/components/CartContext";
import DashboardSkeleton from "@/app/components/DashboardSkeleton";
import Footer from "@/app/components/footer";
import Header from "@/app/components/header";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Suspense fallback={<DashboardSkeleton />}>
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </Suspense>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
