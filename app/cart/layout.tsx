import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Your Cart | Latte Coffee",
  description: "Review and manage your selected beverages",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
