"use client";

import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";
import { isImageUrl } from "../lib/utils";

export default function MessageContent({ content }: { content: string }) {
    const cleanContent = content.replace(/\s+/g, "");

    if (isImageUrl(cleanContent)) {
        return (
            <div className="my-2 overflow-hidden rounded-lg border border-white/10 shadow-lg bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={cleanContent}
                    alt="shared-img"
                    loading="lazy"
                    className="max-h-75 w-full object-contain block transition-transform hover:scale-[1.02]"
                    style={{ maxHeight: "300px" }}
                />
            </div>
        );
    }

    return (
        <div className="prose prose-invert max-w-none text-inherit wrap-break-word">
            <ReactMarkdown
                components={{
                    // ✅ [에러 해결] 최신 react-markdown 규격에 맞춘 인자 정의
                    code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const isInline = !match;
                        const value = String(children).replace(/\n$/, "");

                        // ✅ [에러 해결] CodeBlock 호출 시 content와 language를 정확히 전달
                        return !isInline ? (
                            <CodeBlock content={value} language={match[1]} />
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
