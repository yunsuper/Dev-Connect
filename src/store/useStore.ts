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

// ✅ 알림 중복 방지를 위한 로컬 메모리 (컴포넌트 리렌더링과 무관하게 유지)
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
                    }
                )
                // ✅ 1. 수정 이벤트 구독 추가
                .on(
                    "postgres_changes",
                    {
                        event: "UPDATE",
                        schema: "public",
                        table: "chat_messages",
                    },
                    (payload) => {
                        console.log("메시지 수정 수신:", payload);
                        get().updateMessage(payload.new as ChatMessage);
                    }
                )
                // ✅ 2. 삭제 이벤트 구독 추가
                .on(
                    "postgres_changes",
                    {
                        event: "DELETE",
                        schema: "public",
                        table: "chat_messages",
                    },
                    (payload) => {
                        console.log("메시지 삭제 수신:", payload);
                        get().deleteMessage(payload.old.id);
                    }
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
                        }
                    );
                    get().setPresence(userList);
                })
                /**
                 * ✅ 입장/퇴장 로그 최적화 구간
                 */
                .on("presence", { event: "join" }, ({ newPresences }) => {
                    if (!newPresences) return;

                    const state = get();
                    if (!state) return;

                    newPresences.forEach((p) => {
                        const presence = p as unknown as PresenceData;
                        const name = presence.user_name || "Unknown User";

                        // ✅ [수정된 핵심 로직]
                        // 현재 내 스토어의 onlineUserList에 이 이름이 이미 있는지 확인합니다.
                        // 이미 있다면 '접속'이 아니라 '상태 변경'이므로 로그를 남기지 않습니다.
                        const isAlreadyOnline = (
                            state.onlineUserList || []
                        ).some((u) => u.nickname === name);

                        if (!isAlreadyOnline) {
                            // 이전에 알림 방어막(Set)을 썼다면 그것도 유지하되,
                            // 이 onlineUserList 체크가 다른 브라우저에서의 중복 로그를 막아주는 핵심입니다.
                            state.addSystemLog(
                                `${name} HAS JOINED THE OFFICE.`,
                                name
                            );
                        }
                    });
                })
                .on("presence", { event: "leave" }, ({ leftPresences }) => {
                    if (!leftPresences) return;

                    leftPresences.forEach((p) => {
                        const presence = p as unknown as PresenceData;
                        const name = presence.user_name || "Unknown User";

                        // 💡 0.1초 정도의 시차를 두어 Supabase가 명단을 최신화할 시간을 줍니다.
                        setTimeout(() => {
                            const currentState = channel.presenceState();

                            // 현재 명단에 이 이름이 정말로 없는지 다시 확인
                            const isStillInOffice = Object.keys(
                                currentState || {}
                            ).includes(name);

                            if (!isStillInOffice) {
                                // ✅ 정말로 방을 나간 경우에만 로그 기록
                                get().addSystemLog(
                                    `${name} HAS LEFT THE OFFICE.`,
                                    name
                                );
                                recentNotifications.delete(name);
                            } else {
                                // ✅ 명단에 아직 있다면, 이건 단순히 '상태 변경(코딩/레스팅)' 중인 것임
                                console.log(
                                    `[Presence] ${name} is just changing status, skip leave log.`
                                );
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
                // 💡 상태 변경 시에는 '최근 알림' 목록에 이름을 넣어 입/퇴장 로그가 뜨지 않게 락을 겁니다.
                recentNotifications.add(nickname);

                await state.activeChannel.track({
                    user_name: nickname,
                    status: newStatus,
                    online_at: new Date().toISOString(),
                    userId: state.user?.id,
                });

                // 상태 변경 처리가 끝난 후 1초 뒤에 락 해제
                setTimeout(() => recentNotifications.delete(nickname), 1000);
            }
        },
    };
});
