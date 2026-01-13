"use client";

import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { PostgrestError } from "@supabase/supabase-js";

export default function AdminPage() {
    const { user, setUser } = useStore(); // ✅ setUser가 있다면 가져오기
    const router = useRouter();
    const [isCleaning, setIsCleaning] = useState(false);
    const [isValidating, setIsValidating] = useState(true); // ✅ 검증 중 상태 추가

    useEffect(() => {
        const validateAdmin = async () => {
            try {
                // 1. 세션 확인
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (!session) {
                    router.push("/");
                    return;
                }

                // 2. profiles 테이블에서 관리자 여부 직접 조회 (Zustand 유실 대비)
                const { data: profile, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", session.user.id)
                    .single();

                if (error || !profile?.is_admin) {
                    alert("접근 권한이 없습니다.");
                    router.push("/");
                    return;
                }

                // 3. 스토어 정보가 비어있다면 복구 (선택 사항)
                if (!user && setUser) {
                    setUser(profile);
                }

                setIsValidating(false); // ✅ 검증 완료
            } catch (err) {
                console.error("VALIDATION_ERROR:", err);
                router.push("/");
            }
        };

        validateAdmin();
    }, [user, router, setUser]);

    // ✅ 검증 중이거나 유저 정보가 없을 때 로딩 화면 표시
    if (isValidating || !user) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono gap-4">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <div className="text-emerald-500 animate-pulse text-[10px] tracking-[0.3em] uppercase">
                    Authenticating_Admin_Access...
                </div>
            </div>
        );
    }

    // ✅ DB 정화: 직접 삭제(Direct Delete) 방식
    const handlePurgeMessages = async () => {
        if (!confirm("⚠️ 경고: 모든 채팅 데이터를 영구 삭제하시겠습니까?"))
            return;

        setIsCleaning(true);
        try {
            // ✅ chat_messages 테이블 정화
            const { error } = await supabase
                .from("chat_messages")
                .delete()
                .not("id", "is", null);

            if (error) throw error;

            alert("✨ SYSTEM_PURGE_COMPLETE: 모든 데이터가 소멸되었습니다.");
            window.location.reload();
        } catch (err) {
            const error = err as PostgrestError;
            console.error("PURGE_ERROR_LOG:", error);
            alert(`오류 발생: ${error.message || "권한 설정을 확인하세요."}`);
        } finally {
            setIsCleaning(false);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white p-8 font-mono flex flex-col">
            <header className="mb-10 flex justify-between items-start border-b border-zinc-800 pb-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-emerald-500 italic">
                        ADMIN_CONSOLE_v1.0
                    </h1>
                    <p className="text-zinc-500 text-[10px] mt-1 uppercase tracking-[0.2em]">
                        Operator: {user.nickname || "ADMIN"}
                    </p>
                </div>
                <Link
                    href="/"
                    className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded text-[10px] hover:bg-zinc-800 transition-all active:scale-[0.98]"
                >
                    RETURN_TO_DASHBOARD
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                {/* 패널 1: DB 제어 */}
                <div className="border border-red-500/30 bg-red-500/5 p-6 rounded-xl flex flex-col justify-between shadow-[0_0_20px_rgba(239,68,68,0.05)]">
                    <div>
                        <h2 className="text-red-500 text-xs font-bold mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                            DATABASE_PURGE_SYSTEM
                        </h2>
                        <p className="text-zinc-500 text-[11px] mb-6 leading-relaxed">
                            이 명령은 `chat_messages` 테이블의 모든 데이터를
                            즉시 삭제합니다.
                        </p>
                    </div>
                    <button
                        onClick={handlePurgeMessages}
                        disabled={isCleaning}
                        className="w-full py-4 bg-red-600/10 border border-red-600/50 hover:bg-red-600 hover:text-white transition-all text-[11px] font-black rounded-lg disabled:opacity-30 uppercase tracking-widest active:scale-[0.98]"
                    >
                        {isCleaning
                            ? "WIPING_DATABASE..."
                            : "EXECUTE_GLOBAL_PURGE"}
                    </button>
                </div>

                {/* 패널 2: 시스템 상태 */}
                <div className="border border-zinc-800 bg-zinc-900/30 p-6 rounded-xl">
                    <h2 className="text-emerald-500 text-xs font-bold mb-4 uppercase tracking-widest">
                        System_Information
                    </h2>
                    <ul className="space-y-4 text-[10px] text-zinc-400 font-mono">
                        <li className="flex justify-between border-b border-zinc-800/50 pb-2">
                            <span>OPERATOR_ID</span>
                            <span className="text-zinc-300 select-all">
                                {user.id}
                            </span>
                        </li>
                        <li className="flex justify-between border-b border-zinc-800/50 pb-2">
                            <span>AUTH_LEVEL</span>
                            <span className="text-emerald-500 font-black italic">
                                ROOT_ADMIN
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mt-8 p-4 bg-zinc-950 border border-zinc-900 rounded font-mono text-[9px] text-zinc-600 leading-tight shadow-inner">
                <p className="text-zinc-500 font-bold mb-1">[SYSTEM_LOG]</p>
                <p>&gt; SESSION_VALIDATED: {new Date().toLocaleTimeString()}</p>
                <p className="animate-pulse">&gt; WAITING_FOR_PURGE_COMMAND_</p>
            </div>
        </main>
    );
}
