"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";

export default function ChatInput() {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // ✅ 스토어에서 전송 액션 가져오기
    const sendMessageAction = useStore((state) => state.sendMessage);

    // 입력창 높이 자동 조절
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
        }
    }, [input]);

    const handleSendMessage = async () => {
        const trimmedInput = input.trim();
        if (!trimmedInput || isLoading) return;

        setIsLoading(true);
        try {
            // ✅ 스토어의 sendMessage 호출 (내부에서 user_id 처리)
            await sendMessageAction(trimmedInput);
            setInput("");

            // 전송 후 입력창 포커스 복구
            setTimeout(() => textareaRef.current?.focus(), 0);
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "알 수 없는 오류";
            console.error("전송 에러 발생:", errorMessage);
            alert(`전송 실패: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <footer className="dev-panel border-x-0 border-b-0 p-6 bg-background/90 backdrop-blur-xl">
            <div className="dev-container flex gap-3 items-end">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        // 한글 입력 중 엔터 키 중복 실행 방지
                        if (e.nativeEvent.isComposing) return;
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
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
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    className="px-6 h-12 rounded-xl bg-emerald-600 text-white font-black text-[12px] active:scale-95 disabled:bg-zinc-800 transition-all shadow-lg shadow-emerald-900/20"
                >
                    {isLoading ? "BUSY" : "SEND_CMD"}
                </button>
            </div>
        </footer>
    );
}
