import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CartProvider } from "./components/CartContext";
import Header from "./components/header";
import ToastWrapper from "./components/ToastWrapper";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Latte Coffee",
  description: "Order your favorite coffee drinks online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Header />
          <main className="min-h-screen bg-gradient-to-br from-[#F9F6F1] to-[#F0EBE3]">
            {children}
          </main>
          <ToastWrapper />
        </CartProvider>
      </body>
    </html>
  );
}
