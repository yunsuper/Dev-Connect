"use client";

import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AdminPage() {
    const { user } = useStore();
    const router = useRouter();
    const [isCleaning, setIsCleaning] = useState(false);

    // ✅ 관리자 권한 보안 체크
    useEffect(() => {
        if (!user?.is_admin) {
            alert("접근 권한이 없습니다.");
            router.push("/");
        }
    }, [user, router]);

    // ✅ DB 정화: 모든 채팅 메시지 삭제 기능
    const handlePurgeMessages = async () => {
        if (!confirm("⚠️ 주의: 모든 채팅 데이터를 영구 삭제하시겠습니까?"))
            return;

        setIsCleaning(true);
        try {
            // 모든 메시지 삭제 쿼리 (단축키처럼 작동)
            const { error } = await supabase
                .from("messages")
                .delete()
                .neq("id", "00000000-0000-0000-0000-000000000000"); // 모든 행 선택

            if (error) throw error;
            alert("정화 완료: 모든 데이터가 소멸되었습니다.");
        } catch (err) {
            console.error(err);
            alert("오류 발생: 권한이나 네트워크를 확인하세요.");
        } finally {
            setIsCleaning(false);
        }
    };

    if (!user?.is_admin) return null;

    return (
        <main className="min-h-screen bg-black text-white p-8 font-mono">
            <header className="mb-10 flex justify-between items-start border-b border-zinc-800 pb-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-emerald-500 italic">
                        ADMIN_CONSOLE_v1.0
                    </h1>
                    <p className="text-zinc-500 text-[10px] mt-1 uppercase tracking-[0.2em]">
                        Authorized Access Only: {user.nickname}
                    </p>
                </div>
                <Link
                    href="/"
                    className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded text-[10px] hover:bg-zinc-800 transition-all"
                >
                    RETURN_TO_DASHBOARD
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 패널 1: DB 제어 */}
                <div className="border border-red-500/20 bg-red-500/5 p-6 rounded-xl">
                    <h2 className="text-red-500 text-xs font-bold mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        DATABASE_PURGE_SYSTEM
                    </h2>
                    <p className="text-zinc-500 text-xs mb-6 leading-relaxed">
                        이 명령은 복구할 수 없습니다. 시스템 점검 시에만
                        실행하세요.
                    </p>
                    <button
                        onClick={handlePurgeMessages}
                        disabled={isCleaning}
                        className="w-full py-4 bg-red-600/20 border border-red-600 hover:bg-red-600 hover:text-white transition-all text-xs font-black rounded-lg disabled:opacity-30"
                    >
                        {isCleaning
                            ? "PROCESS_PURGING..."
                            : "EXECUTE_GLOBAL_PURGE"}
                    </button>
                </div>

                {/* 패널 2: 시스템 상태 */}
                <div className="border border-zinc-800 bg-zinc-900/50 p-6 rounded-xl">
                    <h2 className="text-emerald-500 text-xs font-bold mb-4 uppercase">
                        System_Information
                    </h2>
                    <ul className="space-y-3 text-[10px] text-zinc-400">
                        <li className="flex justify-between border-b border-zinc-800/50 pb-2">
                            <span>OPERATOR_ID</span>
                            <span className="text-white">{user.id}</span>
                        </li>
                        <li className="flex justify-between border-b border-zinc-800/50 pb-2">
                            <span>AUTH_STATUS</span>
                            <span className="text-emerald-500 font-bold italic">
                                PRIVILEGED
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
