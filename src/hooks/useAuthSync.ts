"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/useStore";
import { UserProfile } from "@/store/slices/userSlice";
import { getRandomNickname } from "@/lib/utils";

export function useAuthSync() {
    const { setUser, fetchMessages, subscribeMessages } = useStore();
    const [loading, setLoading] = useState(true);
    const isProcessing = useRef(false);

    useEffect(() => {
        const syncProfile = async (userId: string) => {
            if (isProcessing.current) return;
            isProcessing.current = true;

            try {
                // 접속 시마다 새로운 랜덤 닉네임 생성
                const newNickname = getRandomNickname();

                const { data, error } = await supabase
                    .from("profiles")
                    .upsert({
                        id: userId,
                        nickname: newNickname,
                        updated_at: new Date().toISOString(),
                    })
                    .select("id, nickname, is_admin")
                    .single();

                if (error) {
                    console.error("❌ 프로필 동기화 실패:", error.message);
                    isProcessing.current = false;
                    return;
                }

                if (data) {
                    console.log("🎭 새 익명 페르소나 적용됨:", data.nickname);
                    setUser(data as UserProfile);
                    await fetchMessages();
                    subscribeMessages(data.nickname);
                }
            } catch (err) {
                console.error("❌ Auth Sync 도중 예상치 못한 에러:", err);
                isProcessing.current = false;
            } finally {
                setLoading(false);
            }
        };

        // 초기 세션 확인 및 깃허브 토큰 존재 여부 체크
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                syncProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // 인증 상태 변화 감지
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            console.log(`🔔 인증 이벤트 발생: ${event}`);

            if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
                if (session?.user) {
                    syncProfile(session.user.id);
                }
            } else if (event === "SIGNED_OUT") {
                setUser(null);
                isProcessing.current = false;
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [setUser, fetchMessages, subscribeMessages]);

    return { user: useStore.getState().user, loading };
}
