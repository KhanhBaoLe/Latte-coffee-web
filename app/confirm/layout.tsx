import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Order Confirmed | Latte Coffee",
  description: "Thank you for your order!",
};

export default function ConfirmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
