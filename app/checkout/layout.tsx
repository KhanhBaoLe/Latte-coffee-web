import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Checkout | Latte Coffee",
  description: "Complete your order with secure checkout",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
