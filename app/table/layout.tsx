import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Reserve a Table | Latte Coffee",
  description: "Book your table at Latte Coffee for a premium dining experience",
};

export default function TableLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
