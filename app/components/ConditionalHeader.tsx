'use client';

import Header from "@/app/components/header";
import { usePathname } from 'next/navigation';

export default function ConditionalHeader() {
    const pathname = usePathname();
    const isTablePage = pathname.startsWith('/table/');

    return (
        <>
            {!isTablePage && <Header />}
        </>
    );
} 