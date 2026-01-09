import { create } from "zustand";
import { supabase } from "../lib/supabase";

export interface ChatMessage {
    id: string;
    sender_name: string;
    content: string;
    created_at: string;
    type?: "user" | "system";
}

interface PresenceUser {
    user_name: string;
    online_at: string;
}

interface ChatState {
    messages: ChatMessage[];
    onlineUsers: number;
    fetchMessages: () => Promise<void>;
    addMessage: (message: ChatMessage) => void;
    // 🚀 시스템 메시지를 전용으로 추가하는 내부 함수용 타입 (선택 사항)
    addSystemLog: (content: string, userName: string) => void;
    subscribeMessages: (nickname: string) => () => void;
}

export const useChatStore = create<ChatState>((set) => ({
    messages: [],
    onlineUsers: 1,

    fetchMessages: async () => {
        const { data } = await supabase
            .from("chat_messages")
            .select("*")
            .order("created_at", { ascending: true });
        if (data) set({ messages: data });
    },

    addMessage: (message) => {
        set((state) => ({
            messages: [...state.messages, message],
        }));
    },

    // ✅ 중복 제거: 입/퇴장 로그 생성 로직을 하나로 합쳤습니다.
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
                },
            ],
        }));
    },

    subscribeMessages: (nickname: string) => {
        const channel = supabase.channel("chat-room");

        channel
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "chat_messages" },
                (payload) => {
                    const {
                        eventType,
                        new: newRecord,
                        old: oldRecord,
                    } = payload;

                    if (eventType === "INSERT") {
                        set((state) => ({
                            messages: [
                                ...state.messages,
                                newRecord as ChatMessage,
                            ],
                        }));
                    } else if (eventType === "UPDATE") {
                        set((state) => ({
                            messages: state.messages.map((m) =>
                                m.id === (newRecord as ChatMessage).id
                                    ? (newRecord as ChatMessage)
                                    : m
                            ),
                        }));
                    } else if (eventType === "DELETE") {
                        const deletedId = (oldRecord as { id: string }).id;
                        set((state) => ({
                            messages: state.messages.filter(
                                (m) => m.id !== deletedId
                            ),
                        }));
                    }
                }
            )
            .on("presence", { event: "sync" }, () => {
                const newState = channel.presenceState();
                set({ onlineUsers: Object.keys(newState).length });
            })
            .on("presence", { event: "join" }, ({ newPresences }) => {
                newPresences.forEach((p) => {
                    const presence = p as unknown as PresenceUser;
                    // ✅ 자기 자신은 시스템 로그에 띄우지 않고 싶다면 if(presence.user_name !== nickname) 조건 추가 가능
                    useChatStore
                        .getState()
                        .addSystemLog(
                            `${presence.user_name} HAS JOINED THE OFFICE.`,
                            presence.user_name
                        );
                });
            })
            .on("presence", { event: "leave" }, ({ leftPresences }) => {
                leftPresences.forEach((p) => {
                    const presence = p as unknown as PresenceUser;
                    useChatStore
                        .getState()
                        .addSystemLog(
                            `${presence.user_name} HAS LEFT THE OFFICE.`,
                            presence.user_name
                        );
                });
            })
            .subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    await channel.track({
                        user_name: nickname,
                        online_at: new Date().toISOString(),
                    });
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    },
}));
