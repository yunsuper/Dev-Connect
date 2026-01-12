"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "../../store/useStore";
import ChatItem from "./ChatItem";

export default function ChatList({ myNickname }: { myNickname: string }) {
    const { messages } = useStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    const [isAtBottom, setIsAtBottom] = useState(true);
    const [newMessageCount, setNewMessageCount] = useState(0);
    const lastProcessedId = useRef<string | number | null>(null);

    // ✅ 1. 데이터 중복 제거 (useMemo로 성능 최적화)
    const uniqueMessages = useMemo(() => {
        return Array.from(new Map(messages.map((m) => [m.id, m])).values());
    }, [messages]);

    // ✅ 2. 바닥으로 스크롤 이동 함수
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

    // ✅ 3. 스크롤 이벤트 핸들러 (중복 제거 및 로직 통합)
    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        // 바닥에서 100px 이내에 있으면 바닥에 있는 것으로 간주
        const reachedBottom = scrollHeight - scrollTop - clientHeight < 100;

        setIsAtBottom(reachedBottom);
        if (reachedBottom) {
            setNewMessageCount(0);
        }
    };

    // ✅ 4. 새 메시지 도착 시 스크롤 처리 로직
    useEffect(() => {
        if (uniqueMessages.length === 0) return;

        const lastMessage = uniqueMessages[uniqueMessages.length - 1];

        // 이미 처리한 메시지(ID)라면 리턴 (중복 실행 방지)
        if (lastProcessedId.current === lastMessage.id) return;
        lastProcessedId.current = lastMessage.id;

        const isMyMessage = lastMessage.sender_name === myNickname;

        // 짧은 지연 후 스크롤 로직 실행 (DOM 렌더링 시간 고려)
        const timer = setTimeout(() => {
            if (isAtBottom || isMyMessage) {
                scrollToBottom("smooth");
            } else if (lastMessage.type !== "system") {
                // 바닥에 있지 않고 남의 메시지일 때만 알림 카운트 증가
                setNewMessageCount((prev) => prev + 1);
            }
        }, 50);

        return () => clearTimeout(timer);
    }, [uniqueMessages, myNickname, isAtBottom, scrollToBottom]);

    return (
        <div className="relative flex-1 overflow-hidden flex flex-col">
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 space-y-2"
            >
                <div className="dev-container">
                    {/* ✅ 5. 중복이 제거된 uniqueMessages로 렌더링 */}
                    {uniqueMessages.map((m) => (
                        <ChatItem key={m.id} m={m} myNickname={myNickname} />
                    ))}
                </div>
            </div>

            {/* ✅ 6. 새 메시지 알림 버튼 */}
            {newMessageCount > 0 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
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
