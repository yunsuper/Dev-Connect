"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { CSSProperties } from "react";

// ✅ [에러 해결] CodeBlock은 이제 'content'와 'language'를 명확히 받습니다.
interface CodeBlockProps {
    content: string;
    language?: string;
}

export default function CodeBlock({ content, language }: CodeBlockProps) {
    const codeString = String(content).replace(/\n$/, "");

    return (
        <div className="relative group/code my-2 overflow-hidden rounded-xl border border-zinc-800/50">
            <div className="absolute right-2 top-2 opacity-0 group-hover/code:opacity-100 transition-opacity z-10">
                <button
                    onClick={() => navigator.clipboard.writeText(codeString)}
                    className="px-2 py-1 bg-zinc-800 text-[10px] text-zinc-400 rounded hover:text-white border border-zinc-700"
                >
                    COPY
                </button>
            </div>
            <SyntaxHighlighter
                style={atomDark as { [key: string]: CSSProperties }}
                language={language || "javascript"}
                PreTag="div"
                customStyle={{
                    margin: 0,
                    padding: "1.5rem 1rem 1rem 1rem",
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    fontSize: "13px",
                }}
            >
                {codeString}
            </SyntaxHighlighter>
        </div>
    );
}
