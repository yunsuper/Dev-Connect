import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { createChatSlice, ChatSlice } from "./slices/chatSlice";
import { createPresenceSlice, PresenceSlice } from "./slices/presenceSlice";
import { createTodoSlice, TodoSlice } from "./slices/todoSlice";
import { createUserSlice, UserSlice } from "./slices/userSlice";
import { ChatMessage, OnlineUser } from "@/types";

interface PresenceData {
    userId?: string;
    user_name?: string;
    status?: string;
    online_at?: string;
}

const recentNotifications = new Set<string>();

export type RootState = ChatSlice &
    PresenceSlice &
    TodoSlice &
    UserSlice & {
        subscribeMessages: (nickname: string) => () => void;
        syncPresenceStatus: (
            nickname: string,
            newStatus: string
        ) => Promise<void>;
    };

export const useStore = create<RootState>()((...a) => {
    const [, get] = a;

    return {
        ...createChatSlice(...a),
        ...createPresenceSlice(...a),
        ...createTodoSlice(...a),
        ...createUserSlice(...a),

        subscribeMessages: (nickname: string) => {
            if (!nickname) return () => {};

            const activeChannel = get().activeChannel;
            if (activeChannel) {
                supabase.removeChannel(activeChannel);
            }

            const channel = supabase.channel("chat-room", {
                config: { presence: { key: nickname } },
            });

            get().setActiveChannel(channel);

            channel
                .on(
                    "postgres_changes",
                    {
                        event: "INSERT",
                        schema: "public",
                        table: "chat_messages",
                    },
                    (payload) => {
                        get().addMessage(payload.new as ChatMessage);
                    },
                )
                .on(
                    "postgres_changes",
                    {
                        event: "UPDATE",
                        schema: "public",
                        table: "chat_messages",
                    },
                    (payload) => {
                        get().updateMessage(payload.new as ChatMessage);
                    },
                )
                .on(
                    "postgres_changes",
                    {
                        event: "DELETE",
                        schema: "public",
                        table: "chat_messages",
                    },
                    (payload) => {
                        get().deleteMessage(payload.old.id);
                    },
                )
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "todos",
                    },
                    (payload) => {
                        console.log("TODO 변경 감지:", payload.eventType);

                        get().fetchTodos();

                        /* 또는 개별 처리하고 싶다면:
            if (payload.eventType === 'DELETE') {
                // deleteTodo는 DB 삭제용이니, 상태만 지우는 로직이 slice에 필요할 수 있음
                // 지금은 fetchTodos()가 가장 속 편합니다.
            }
            */
                    },
                )
                .on("presence", { event: "sync" }, () => {
                    const newState = channel.presenceState();
                    const userList: OnlineUser[] = Object.entries(newState).map(
                        ([key, presences]) => {
                            const p = (
                                presences as unknown as PresenceData[]
                            )[0];
                            return {
                                id: p?.userId || key,
                                nickname: key,
                                online_at:
                                    p?.online_at || new Date().toISOString(),
                                status: p?.status || "coding",
                            };
                        },
                    );
                    get().setPresence(userList);
                })
                .on("presence", { event: "join" }, ({ newPresences }) => {
                    if (!newPresences) return;

                    const state = get();
                    if (!state) return;

                    newPresences.forEach((p) => {
                        const presence = p as unknown as PresenceData;
                        const name = presence.user_name || "Unknown User";

                        const isAlreadyOnline = (
                            state.onlineUserList || []
                        ).some((u) => u.nickname === name);

                        if (!isAlreadyOnline) {
                            state.addSystemLog(
                                `${name} HAS JOINED THE OFFICE.`,
                                name,
                            );
                        }
                    });
                })
                .on("presence", { event: "leave" }, ({ leftPresences }) => {
                    if (!leftPresences) return;

                    leftPresences.forEach((p) => {
                        const presence = p as unknown as PresenceData;
                        const name = presence.user_name || "Unknown User";
                        setTimeout(() => {
                            const currentState = channel.presenceState();

                            const isStillInOffice = Object.keys(
                                currentState || {},
                            ).includes(name);

                            if (!isStillInOffice) {
                                get().addSystemLog(
                                    `${name} HAS LEFT THE OFFICE.`,
                                    name,
                                );
                                recentNotifications.delete(name);
                            }
                        }, 100);
                    });
                })
                .subscribe(async (status) => {
                    if (status === "SUBSCRIBED") {
                        const state = get();
                        await channel.track({
                            userId: state.user?.id,
                            user_name: nickname,
                            status: state.myStatus || "coding",
                            online_at: new Date().toISOString(),
                        });
                    }
                });

            return () => {
                get().setActiveChannel(null);
                supabase.removeChannel(channel);
            };
        },

        syncPresenceStatus: async (nickname: string, newStatus: string) => {
            const state = get();
            state.setMyStatus(newStatus);

            if (state.activeChannel) {
                recentNotifications.add(nickname);

                await state.activeChannel.track({
                    user_name: nickname,
                    status: newStatus,
                    online_at: new Date().toISOString(),
                    userId: state.user?.id,
                });

                setTimeout(() => recentNotifications.delete(nickname), 1000);
            }
        },
    };
});
