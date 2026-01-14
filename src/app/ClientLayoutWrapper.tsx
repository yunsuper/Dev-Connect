"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/layout/Footer";

export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith("/dashboard");

    return (
        <>
            <div className="flex-1 flex flex-col overflow-hidden">
                {children}
            </div>
            {!isDashboard && <Footer />}
        </>
    );
}
