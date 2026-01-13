"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { CSSProperties } from "react";

interface CodeBlockProps {
    content: string;
    language?: string;
}

export default function CodeBlock({ content, language }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);
    const codeString = String(content).replace(/\n$/, "");

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(codeString);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    return (
        // ✅ globals.css의 .dev-panel 스타일과 .prose pre 스타일을 결합
        <div className="relative group my-4 overflow-hidden rounded-xl border border-zinc-800/50 bg-black/60 backdrop-blur-md shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/40 border-b border-zinc-800/30">
                <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                    {language || "code"}
                </span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-emerald-400 transition-all duration-200 active:scale-95"
                >
                    {copied ? (
                        <>
                            <Check size={12} className="text-emerald-500" />
                            <span className="text-[10px] text-emerald-500 font-bold uppercase">
                                COPIED
                            </span>
                        </>
                    ) : (
                        <>
                            <Copy size={12} />
                            <span className="text-[10px] font-bold uppercase">
                                COPY
                            </span>
                        </>
                    )}
                </button>
            </div>

            {/* 코드 출력부: .custom-scrollbar 적용 가능 */}
            <div className="text-[13px] leading-relaxed overflow-x-auto custom-scrollbar">
                <SyntaxHighlighter
                    style={atomDark as { [key: string]: CSSProperties }}
                    language={language || "javascript"}
                    PreTag="div"
                    customStyle={{
                        margin: 0,
                        padding: "1.25rem",
                        backgroundColor: "transparent",
                        fontFamily: "var(--font-mono)",
                    }}
                >
                    {codeString}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}
