"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { uploadFileToStorage } from "@/lib/storage";

export default function ChatInput() {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sendMessageAction = useStore((state) => state.sendMessage);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
        }
    }, [input]);

    const handleFileProcess = async (file: File) => {
        if (isLoading) return;
        const MAX_SIZE = 50 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            alert("🚨 파일 용량이 너무 큽니다! (최대 50MB까지 가능)");
            return;
        }
        setIsLoading(true);
        try {
            const uploadedUrl = await uploadFileToStorage(file);
            if (uploadedUrl) await sendMessageAction(uploadedUrl);
        } catch (error) {
            console.error("파일 처리 중 오류:", error);
        } finally {
            setIsLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) await handleFileProcess(files[0]);
    };

    const onPaste = async (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].kind === "file") {
                const file = items[i].getAsFile();
                if (file) { e.preventDefault(); await handleFileProcess(file); return; }
            }
        }
    };

    const handleSendMessage = async () => {
        const trimmedInput = input.trim();
        if (!trimmedInput || isLoading) return;
        setIsLoading(true);
        try {
            await sendMessageAction(trimmedInput);
            setInput("");
            setTimeout(() => textareaRef.current?.focus(), 0);
        } finally {
            setIsLoading(false);
        }
    };

    const getPlaceholder = () => {
        if (isLoading) return "BUSY...";
        return "TYPE_CMD_OR_DROP..."; 
    };

    return (
        <footer
            className={`dev-panel border-x-0 border-b-0 p-6 bg-background/90 backdrop-blur-xl transition-all duration-200 ${
                isDragging ? "bg-emerald-500/10 border-t-emerald-500" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="dev-container flex gap-3 items-end relative">
                {isDragging && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-emerald-500/5 backdrop-blur-[2px] rounded-xl border-2 border-dashed border-emerald-500/50 pointer-events-none">
                        <p className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em] animate-pulse">DROP_FILES_HERE</p>
                    </div>
                )}

                <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileProcess(file); }} />

                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="flex items-center justify-center min-w-12 w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-emerald-500 transition-all active:scale-90 shadow-inner"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                </button>

                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onPaste={onPaste}
                    onKeyDown={(e) => { if (!e.nativeEvent.isComposing && e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                    className="flex-1 bg-black/40 border border-zinc-800 p-3 rounded-xl outline-none focus:border-emerald-500/50 text-[13px] md:text-sm font-mono text-emerald-100 placeholder:text-[11px] md:placeholder:text-xs resize-none max-h-40 custom-scrollbar transition-all"
                    placeholder={getPlaceholder()}
                    disabled={isLoading}
                    rows={1}
                />

                <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    className="px-6 h-12 rounded-xl bg-emerald-600 text-white font-black text-[12px] active:scale-95 disabled:bg-zinc-800 transition-all shadow-lg shadow-emerald-900/20 uppercase tracking-widest min-w-20"
                >
                    {isLoading ? "BUSY" : "SEND"}
                </button>
            </div>
        </footer>
    );
}