'use client';

import Header from "@/app/components/header";
import { usePathname } from 'next/navigation';

export default function ConditionalHeader() {
    const pathname = usePathname();
    // Kiểm tra URL cho tất cả các trang liên quan đến table
    const isTablePage = 
        pathname.match(/^\/table\/\d+$/) || // trang table chính
        pathname.match(/^\/table\/\d+\/detail/) || // trang detail
        pathname.match(/^\/table\/checkout/) || // trang checkout
        pathname.match(/^\/table\/checkout\/confirmorder/); // trang confirm order

    return (
        <>
            {!isTablePage && <Header />}
        </>
    );
} 