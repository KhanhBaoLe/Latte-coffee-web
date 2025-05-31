import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Our Menu | Latte Coffee",
    description: "Discover our wide selection of premium beverages - Coffee, Milk Tea, Matcha Latte, and Fruit Tea",
};

export default function MenuLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
