import { StateCreator } from "zustand";
import { supabase } from "@/lib/supabase";
import { ChatMessage } from "@/types";
import { RootState } from "../useStore";

export interface ChatSlice {
    messages: ChatMessage[];
    fetchMessages: () => Promise<void>;
    addMessage: (message: ChatMessage) => void;
    // ✅ any 제거: 수신된 업데이트 페이로드를 ChatMessage의 일부로 정의
    updateMessage: (payload: Partial<ChatMessage> & { id: string }) => void;
    deleteMessage: (id: string) => void;
    sendMessage: (content: string) => Promise<void>;
    addSystemLog: (content: string, userName: string) => void;
}

export const createChatSlice: StateCreator<RootState, [], [], ChatSlice> = (
    set,
    get
) => ({
    messages: [],

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

    addMessage: (message) => {
        set((state) => {
            const exists = state.messages.some((m) => m.id === message.id);
            if (exists) return state;
            return { messages: [...state.messages, message] };
        });
    },

    // ✅ Partial 타입을 사용하여 안전하게 업데이트
    updateMessage: (payload) => {
        set((state) => ({
            messages: state.messages.map((m) =>
                m.id === payload.id ? { ...m, ...payload } : m
            ),
        }));
    },

    deleteMessage: (id) => {
        set((state) => ({
            messages: state.messages.filter((m) => m.id !== id),
        }));
    },

    sendMessage: async (content: string) => {
        const user = get().user;
        if (!user) return;

        const { error } = await supabase.from("chat_messages").insert([
            {
                content: content.trim(),
                sender_name: user.nickname,
                user_id: user.id,
            },
        ]);

        if (error) throw error;
    },

    addSystemLog: (content, userName) => {
        set((state) => ({
            messages: [
                ...state.messages,
                {
                    id: `sys-${Date.now()}-${userName}`,
                    sender_name: "SYSTEM",
                    content,
                    created_at: new Date().toISOString(),
                    type: "system",
                } as ChatMessage,
            ],
        }));
    },
});
