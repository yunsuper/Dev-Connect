import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
});

export const viewport: Viewport = {
    themeColor: "#0a0a0a",
    width: "device-width",
    initialScale: 1,
};

export const metadata: Metadata = {
    title: {
        default: "Dev-Connect | Developer Shared Office",
        template: "%s | Dev-Connect",
    },
    description:
        "개발자들을 위한 실시간 공유 오피스 커뮤니티. 코드를 나누고 함께 성장하세요.",
    keywords: [
        "개발자 커뮤니티",
        "실시간 채팅",
        "공유 오피스",
        "코딩",
        "Dev-Connect",
    ],
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" className="dark" suppressHydrationWarning>
            <body
                className={`${geistMono.variable} font-mono antialiased bg-background text-zinc-200 custom-scrollbar flex flex-col min-h-screen`}
            >
                {/* ✅ flex flex-col min-h-screen 을 추가하여 
                   컨텐츠가 적어도 푸터가 항상 바닥에 머물게 합니다. 
                */}

                <div className="flex-1 flex flex-col">{children}</div>

                {/* ✅ 사이트 최하단 디지털 도장(Footer) */}
                <Footer />
            </body>
        </html>
    );
}
