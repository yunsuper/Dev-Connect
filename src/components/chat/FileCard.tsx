// src/components/chat/FileCard.tsx
import React from "react";

interface FileCardProps {
    url: string;
    type: "archive" | "document";
}

export const FileCard = ({ url, type }: FileCardProps) => {
    const isDoc = type === "document";
    const fileName =
        url.split("/").pop()?.split("?")[0]?.split("-").pop() ||
        "Untitled_File";

    return (
        <a
            href={url}
            download
            className={`flex items-center gap-4 my-2 p-4 bg-zinc-900/60 border ${
                isDoc ? "border-blue-500/30" : "border-emerald-500/30"
            } rounded-xl hover:scale-[1.01] hover:bg-zinc-900 transition-all group max-w-[320px] no-underline shadow-xl`}
        >
            <div
                className={`p-3 ${
                    isDoc ? "bg-blue-500/10" : "bg-emerald-500/10"
                } rounded-lg group-hover:scale-110 transition-transform`}
            >
                {isDoc ? (
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                ) : (
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 8V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h11l5 5z"></path>
                        <path d="M12 18v-6"></path>
                        <path d="m9 15 3 3 3-3"></path>
                    </svg>
                )}
            </div>
            <div className="flex flex-col overflow-hidden text-left">
                <span className="text-[12px] font-bold text-zinc-100 truncate uppercase tracking-tighter">
                    {decodeURIComponent(fileName)}
                </span>
                <span
                    className={`text-[9px] ${
                        isDoc ? "text-blue-500" : "text-emerald-500"
                    } font-black tracking-widest uppercase opacity-80 mt-1`}
                >
                    {isDoc ? "DOCUMENT_VIEW" : "ARCHIVE_DOWNLOAD"}
                </span>
            </div>
        </a>
    );
};
