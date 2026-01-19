"use client";

import Image from "next/image";
import React from "react";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";
import GistPreview from "./GistPreview";
import { FileCard } from "./FileCard";
import { getFileType } from "../../lib/fileUtils";
import { isImageUrl } from "../../lib/utils";

export default function MessageContent({
    content,
    isEditing,
    editContent,
    setEditContent,
}: {
    content: string;
    isEditing?: boolean;
    editContent?: string;
    setEditContent?: (val: string) => void;
}) {
    if (isEditing && setEditContent) {
        return (
            <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-black/40 text-foreground p-3 rounded-xl border border-zinc-800/50 focus:border-emerald-500/50 focus:outline-none min-h-20 text-sm resize-none custom-scrollbar transition-all font-mono"
                autoFocus
            />
        );
    }

    const trimmedContent = content.trim();
    const fileType = getFileType(trimmedContent);

    // 1. 이미지
    if (fileType === "image" || isImageUrl(trimmedContent)) {
        return (
            <div className="my-2 relative group max-w-lg overflow-hidden rounded-lg border border-white/10 shadow-lg bg-zinc-900">
                <Image
                    src={trimmedContent}
                    alt="img"
                    width={0}
                    height={0}
                    sizes="100vw"
                    unoptimized
                    style={{ width: "100%", height: "auto" }}
                    className="max-h-125 object-contain"
                />
                {trimmedContent.toLowerCase().includes(".gif") && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-[10px] font-bold text-emerald-400 rounded-md backdrop-blur-md">
                        GIF_ANIM
                    </span>
                )}
            </div>
        );
    }

    if (fileType === "archive" || fileType === "document") {
        return <FileCard url={trimmedContent} type={fileType} />;
    }

    if (
        trimmedContent.startsWith("https://gist.github.com/") &&
        !trimmedContent.includes(" ")
    ) {
        return <GistPreview url={trimmedContent} />;
    }

    // 4. 일반 텍스트 (Markdown)
    return (
        <div className="prose prose-invert max-w-none">
            <ReactMarkdown
                components={{
                    p: ({ children }) => (
                        <div className="mb-4 last:mb-0">{children}</div>
                    ),

                    code({ className, children }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const isBlock = match || content.includes("```");
                        return isBlock ? (
                            <CodeBlock
                                content={String(children).replace(/\n$/, "")}
                                language={match ? match[1] : "bash"}
                            />
                        ) : (
                            <code className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded text-[12px] font-mono border border-emerald-500/20">
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
