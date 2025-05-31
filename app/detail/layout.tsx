import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Product Details | Latte Coffee",
  description: "Explore the details of our premium beverages",
};

export default function DetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
