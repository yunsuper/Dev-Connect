import { StateCreator } from "zustand";
import { supabase } from "@/lib/supabase";
import { ChatMessage } from "@/types";
import { RootState } from "../useStore";

export interface ChatSlice {
    messages: ChatMessage[];
    fetchMessages: () => Promise<void>;
    addMessage: (message: ChatMessage) => void;
    sendMessage: (content: string) => Promise<void>;
    addSystemLog: (content: string, userName: string) => void;
}

export const createChatSlice: StateCreator<RootState, [], [], ChatSlice> = (
    set,
    get
) => ({
    messages: [],

    // 1. 기존 메시지 로드 (DB에서 전체 목록 가져오기)
    fetchMessages: async () => {
        const { data, error } = await supabase
            .from("chat_messages")
            .select("*")
            .order("created_at", { ascending: true });

        if (error) {
            console.error("❌ 메시지 로드 실패:", error.message);
            return;
        }
        if (data) set({ messages: data as ChatMessage[] });
    },

    // 2. 실시간 수신 메시지 추가 (중복 체크 포함)
    addMessage: (message) => {
        set((state) => {
            // ✅ 이미 존재하는 메시지 ID라면 추가하지 않음 (실시간 중복 수신 방지)
            const exists = state.messages.some((m) => m.id === message.id);
            if (exists) return state;

            return {
                messages: [...state.messages, message],
            };
        });
    },

    // 3. 메시지 전송 (user_id 포함)
    sendMessage: async (content: string) => {
        const user = get().user;
        if (!user) {
            console.error("로그인 정보가 없습니다.");
            return;
        }

        const { error } = await supabase.from("chat_messages").insert([
            {
                content: content.trim(),
                sender_name: user.nickname,
                user_id: user.id,
            },
        ]);

        if (error) {
            console.error("❌ 전송 에러:", error.message);
            throw error;
        }
    },

    // 4. 시스템 로그 (입퇴장 알림 등)
    addSystemLog: (content, userName) => {
        set((state) => ({
            messages: [
                ...state.messages,
                {
                    id: `sys-${Date.now()}-${Math.random()
                        .toString(36)
                        .substring(2, 7)}-${userName}`,
                    sender_name: "SYSTEM",
                    content,
                    created_at: new Date().toISOString(),
                    type: "system",
                } as ChatMessage,
            ],
        }));
    },
});
