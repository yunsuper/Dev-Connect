import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "./ClientLayoutWrapper";

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
});

// ✅ 대망의 메타데이터 설정!
export const metadata: Metadata = {
    title: "Dev-Connect | 개발자 실시간 공유 오피스",
    description: "뽀모도로, 깃허브 연동 기능을 갖춘 개발자들의 힙한 소통 공간",
    openGraph: {
        title: "Dev-Connect",
        description: "개발자를 위한 가장 힙한 실시간 공유 오피스에 참여하세요!",
        url: "https://dev-connect-gules.vercel.app/",
        siteName: "Dev-Connect",
        images: [
            {
                url: "https://github.com/user-attachments/assets/ca3657a2-0c80-4703-b3f5-16e571ffa4d7",
                width: 1200,
                height: 630,
                alt: "Dev-Connect 메인 화면",
            },
        ],
        locale: "ko_KR",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Dev-Connect",
        description: "개발자 전용 실시간 공유 오피스",
        images: [
            "https://github.com/user-attachments/assets/ca3657a2-0c80-4703-b3f5-16e571ffa4d7",
        ],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko" className="dark" suppressHydrationWarning>
            <body
                className={`${geistMono.variable} font-mono antialiased bg-background text-zinc-200 flex flex-col h-screen overflow-hidden`}
            >
                {/* 클라이언트 로직(푸터 제어 등)은 Wrapper에서 처리 */}
                <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
            </body>
        </html>
    );
}
