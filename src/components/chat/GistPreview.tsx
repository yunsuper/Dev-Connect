"use client";

import React, { useEffect, useState } from "react";

interface GistFileData {
    filename: string;
    content: string;
    language: string;
}

interface GistData {
    description: string;
    owner: {
        login: string;
    };
    files: Record<string, GistFileData>;
}

export default function GistPreview({ url }: { url: string }) {
    const [gistData, setGistData] = useState<GistData | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const fetchGist = async () => {
            try {
                const match = url.match(
                    /gist\.github\.com\/[a-zA-Z0-9_-]+\/([a-z0-9]+)/i
                );
                const gistId = match
                    ? match[1]
                    : url.split("/").filter(Boolean).pop()?.split(/[#?]/)[0];
                if (!gistId) return;

                const res = await fetch(
                    `https://api.github.com/gists/${gistId}`
                );
                if (res.ok) {
                    const data: GistData = await res.json();
                    setGistData(data);
                } else {
                    setHasError(true);
                }
            } catch {
                setHasError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchGist();
    }, [url]);

    if (loading)
        return (
            <div className="text-xs text-zinc-500 animate-pulse my-2 italic font-mono">
                [SYSTEM]: GIST_LOADING...
            </div>
        );
    if (hasError || !gistData) return null;

    const firstFile = Object.values(gistData.files)[0];

    return (
        <div className="my-3 border border-zinc-700 rounded-lg overflow-hidden bg-zinc-900/50 shadow-md max-w-md not-prose">
            <div className="bg-zinc-800 px-3 py-2 flex items-center justify-between border-b border-zinc-700">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <svg
                            viewBox="0 0 16 16"
                            width="12"
                            height="12"
                            fill="black"
                        >
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                        </svg>
                    </div>
                    <span className="text-xs font-semibold text-zinc-300 truncate max-w-50">
                        {gistData.description ||
                            firstFile?.filename ||
                            "GitHub Gist"}
                    </span>
                </div>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-blue-400 hover:underline"
                >
                    VIEW_ON_GITHUB
                </a>
            </div>
            <div className="p-3">
                <pre className="text-[11px] text-zinc-400 font-mono line-clamp-3 bg-zinc-950/50 p-2 rounded whitespace-pre-wrap">
                    {firstFile?.content}
                </pre>
            </div>
        </div>
    );
}
