"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatItem from "./ChatItem";

export default function ChatList({ myNickname }: { myNickname: string }) {
    const { messages } = useChatStore();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [newMessageCount, setNewMessageCount] = useState(0);
    const lastProcessedId = useRef<string | number | null>(null);

    const scrollToBottom = useCallback(
        (behavior: ScrollBehavior = "smooth") => {
            if (scrollRef.current) {
                scrollRef.current.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior,
                });
            }
            setNewMessageCount(0);
        },
        []
    );

    useEffect(() => {
        if (messages.length === 0) return;
        const lastMessage = messages[messages.length - 1];
        if (lastProcessedId.current === lastMessage.id) return;
        lastProcessedId.current = lastMessage.id;

        const isMyMessage = lastMessage.sender_name === myNickname;

        const timer = setTimeout(() => {
            if (isAtBottom || isMyMessage) {
                scrollToBottom("smooth");
            } else if (lastMessage.type !== "system") {
                setNewMessageCount((prev) => prev + 1);
            }
        }, 50);
        return () => clearTimeout(timer);
    }, [messages, myNickname, isAtBottom, scrollToBottom]);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const reachedBottom = scrollHeight - scrollTop - clientHeight < 150;
        setIsAtBottom(reachedBottom);
        if (reachedBottom) setNewMessageCount(0);
    };

    return (
        <div className="relative flex-1 overflow-hidden flex flex-col">
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 space-y-2"
            >
                <div className="dev-container">
                    {messages.map((m) => (
                        <ChatItem key={m.id} m={m} myNickname={myNickname} />
                    ))}
                </div>
            </div>
            {newMessageCount > 0 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-100">
                    <button
                        onClick={() => scrollToBottom("smooth")}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400/50 flex items-center gap-2 animate-bounce transition-all active:scale-95"
                    >
                        <span className="text-xs font-black tracking-tight drop-shadow-md">
                            ↓ 아래에 새로운 메시지 {newMessageCount}개
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
}
