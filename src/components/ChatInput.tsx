"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export default function ChatInput({ nickname }: { nickname: string }) {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
        }
    }, [input]);

    const sendMessage = useCallback(async () => {
        if (!input.trim() || isLoading) return;
        setIsLoading(true);
        try {
            const { error } = await supabase
                .from("chat_messages")
                .insert([{ sender_name: nickname, content: input.trim() }]);
            if (error) throw error;
            setInput("");
            setTimeout(() => textareaRef.current?.focus(), 0);
        } catch (error) {
            console.error(error);
            alert("전송 중 에러 발생");
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, nickname]);

    return (
        <footer className="dev-panel border-x-0 border-b-0 p-6 bg-background/90 backdrop-blur-xl">
            <div className="dev-container flex gap-3 items-end">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.nativeEvent.isComposing) return; // ⚡️ 한글 중복 입력 방지
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    className="flex-1 bg-black/40 border border-zinc-800 p-3 rounded-xl outline-none focus:border-emerald-500/50 text-[16px] md:text-sm font-mono text-emerald-100 disabled:opacity-50 resize-none max-h-40 custom-scrollbar"
                    placeholder={
                        isLoading ? "STATUS: SENDING..." : "TYPE_MESSAGE..."
                    }
                    disabled={isLoading}
                    rows={1}
                />
                <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="px-6 h-12 rounded-xl bg-emerald-600 text-white font-black text-[12px] active:scale-95 disabled:bg-zinc-800 transition-all shadow-lg shadow-emerald-900/20"
                >
                    {isLoading ? "BUSY" : "SEND_CMD"}
                </button>
            </div>
        </footer>
    );
}
