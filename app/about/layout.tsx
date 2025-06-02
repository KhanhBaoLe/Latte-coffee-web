import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "About us | Latte Coffee",
    //   description: "Review and manage your selected beverages",
};
export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
