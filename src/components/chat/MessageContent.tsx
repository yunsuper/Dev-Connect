"use client";

import Image from "next/image"; // ✅ Next.js Image 컴포넌트 임포트
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";
import { isImageUrl } from "../../lib/utils";

export default function MessageContent({ content }: { content: string }) {
    const cleanContent = content.replace(/\s+/g, "");

    if (isImageUrl(cleanContent)) {
        return (
            <div className="my-2 overflow-hidden rounded-lg border border-white/10 shadow-lg bg-zinc-900">
                {/* ✅ Next.js 경고 해결: width/height를 0으로 설정하고 sizes와 style을 조합합니다. */}
                <Image
                    src={cleanContent}
                    alt="shared-img"
                    width={0}
                    height={0}
                    sizes="100vw"
                    unoptimized // 외부 URL 이미지 허용
                    priority // 우선순위 로딩
                    style={{
                        width: "100%",
                        height: "auto",
                        display: "block", // 하단 미세 공백 제거
                    }}
                    className="max-h-75 object-contain transition-transform hover:scale-[1.02]"
                />
            </div>
        );
    }

    return (
        <div className="prose prose-invert max-w-none text-inherit wrap-break-word">
            <ReactMarkdown
                components={{
                    // Hydration 에러 방지를 위해 p 대신 div 사용
                    p({ children }) {
                        return <div className="mb-4 last:mb-0">{children}</div>;
                    },
                    code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const value = String(children).replace(/\n$/, "");
                        const isBlock = match || content.includes("```");

                        return isBlock ? (
                            <CodeBlock
                                content={value}
                                language={match ? match[1] : "bash"}
                            />
                        ) : (
                            <code
                                className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded text-[12px] font-mono border border-emerald-500/20"
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
