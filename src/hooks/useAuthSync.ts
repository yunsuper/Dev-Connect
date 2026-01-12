import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/useStore";
import { UserProfile } from "@/store/slices/userSlice";
import { getRandomNickname } from "@/lib/utils";

export function useAuthSync() {
    const { setUser, fetchMessages, subscribeMessages } = useStore();
    const [loading, setLoading] = useState(true);

    // ✅ 중복 실행을 물리적으로 막기 위한 '락(Lock)' Ref
    // 비동기 작업이 시작되자마자 true로 바꿔서 다음 호출을 차단합니다.
    const isProcessing = useRef(false);

    useEffect(() => {
        const syncProfile = async (userId: string) => {
            // 💡 이미 처리 중이라면 즉시 리턴하여 중복 실행을 막습니다.
            if (isProcessing.current) return;
            isProcessing.current = true; // 🔒 문을 잠급니다.

            try {
                // 🎭 사용자님의 아이디어: 접속 시마다 새로운 닉네임 생성
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
                    isProcessing.current = false; // 실패 시 다시 시도할 수 있게 락 해제
                    return;
                }

                if (data) {
                    console.log("🎭 새 익명 페르소나 적용됨:", data.nickname);

                    // 1. 스토어에 유저 정보 저장
                    setUser(data as UserProfile);

                    // 2. 기존 메시지 로드
                    await fetchMessages();

                    // 3. 실시간 구독 시작
                    subscribeMessages(data.nickname);
                }
            } catch (err) {
                console.error("❌ Auth Sync 도중 예상치 못한 에러:", err);
                isProcessing.current = false; // 에러 발생 시 락 해제
            } finally {
                setLoading(false);
            }
        };

        // 초기 세션 확인
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
            if (session?.user) {
                syncProfile(session.user.id);
            } else if (event === "SIGNED_OUT") {
                setUser(null);
                isProcessing.current = false; // 🔓 로그아웃 시 다시 접속 가능하도록 락 해제
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [setUser, fetchMessages, subscribeMessages]);

    return { user: useStore.getState().user, loading };
}
