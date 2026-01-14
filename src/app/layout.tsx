"use client";

import { usePathname } from "next/navigation";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";

// 1. 폰트 정의
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();

    // ✅ 2. 이 변수를 사용하여 푸터 중복을 막습니다.
    // DashboardView.tsx 내부에서 푸터를 직접 넣었으므로, 루트 푸터는 숨깁니다.
    const isDashboard = pathname?.startsWith("/dashboard");

    return (
        <html lang="ko" className="dark" suppressHydrationWarning>
            <body
                className={`${geistMono.variable} font-mono antialiased bg-background text-zinc-200 flex flex-col h-screen overflow-hidden`}
            >
                {/* 3. 본문 영역 */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {children}
                </div>

                {/* ✅ 4. isDashboard 변수를 여기서 사용합니다 (에러 해결 지점)
                   대시보드 경로가 아닐 때만 루트 레이아웃의 푸터를 보여줍니다.
                */}
                {!isDashboard && <Footer />}
            </body>
        </html>
    );
}
