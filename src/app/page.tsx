"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { getRandomNickname } from "../lib/utils";
import Header from "../components/Header";
import ChatList from "../components/ChatList";
import ChatInput from "../components/ChatInput";

export default function Home() {
    const { messages, onlineUsers, fetchMessages, subscribeMessages } =
        useChatStore();

    const [myNickname, setMyNickname] = useState("");
    const [mounted, setMounted] = useState(false);

    // ✅ 구독 해지 함수를 저장해둘 ref (닉네임 변경 시 이전 구독을 확실히 끊기 위함)
    const unsubscribeRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
            const initialName = getRandomNickname();
            setMyNickname(initialName);

            fetchMessages();
            // 기존 구독이 있다면 끊고 새로 연결
            if (unsubscribeRef.current) unsubscribeRef.current();
            unsubscribeRef.current = subscribeMessages(initialName);
        }, 0);

        return () => {
            clearTimeout(timer);
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
                unsubscribeRef.current = null;
            }
        };
    }, [fetchMessages, subscribeMessages]);

    // ✅ 닉네임 새로고침 시 기존 구독을 끊지 않으면 메시지가 중복으로 들릴 수 있습니다.
    const handleRefreshNickname = useCallback(() => {
        const newName = getRandomNickname();
        setMyNickname(newName);

        if (unsubscribeRef.current) unsubscribeRef.current();
        unsubscribeRef.current = subscribeMessages(newName);
    }, [subscribeMessages]);

    return (
        // ✅ bg-[#0a0a0a] 대신 테마 변수 bg-background 사용 (Lighthouse 대응)
        <main className="flex flex-col h-screen overflow-hidden bg-background">
            <Header
                myNickname={mounted ? myNickname : ""}
                onRefresh={handleRefreshNickname}
                messageCount={messages.length}
                onlineCount={onlineUsers}
            />

            <div className="flex-1 overflow-hidden dev-container flex flex-col">
                <ChatList myNickname={mounted ? myNickname : ""} />
            </div>

            <ChatInput nickname={mounted ? myNickname : ""} />
        </main>
    );
}
