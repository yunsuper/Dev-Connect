import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap", // 폰트 로딩 중에도 텍스트가 보이게 하여 성능(LCP) 향상
});

// ✅ 라이트하우스 접근성(Accessibility) 만점을 위한 설정
export const viewport: Viewport = {
    themeColor: "#0a0a0a",
    width: "device-width",
    initialScale: 1,
    // 🚀 [중요 수정] maximumScale: 1 설정을 제거했습니다.
    // 저시력 사용자가 핀치 줌으로 화면을 확대할 수 있도록 허용해야 접근성 점수 100점이 나옵니다.
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
                className={`${geistMono.variable} font-mono antialiased bg-background text-zinc-200 custom-scrollbar`}
            >
                {children}
            </body>
        </html>
    );
}
