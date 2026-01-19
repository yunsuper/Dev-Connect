"use client";

import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { PostgrestError } from "@supabase/supabase-js";
import {
    Activity,
    ShieldCheck,
    Database,
    ArrowLeft,
    Github,
} from "lucide-react";

export default function AdminPage() {
    const { user, setUser } = useStore();
    const router = useRouter();
    const [isCleaning, setIsCleaning] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    const [githubLinked, setGithubLinked] = useState<boolean>(false);

    useEffect(() => {
        const validateAdmin = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();
                if (!session) {
                    router.push("/");
                    return;
                }
                setGithubLinked(!!session.provider_token);
                const { data: profile, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", session.user.id)
                    .single();

                if (error || !profile?.is_admin) {
                    alert("ACCESS_DENIED: 관리자 권한이 없습니다.");
                    router.push("/");
                    return;
                }
                if (!user && setUser) setUser(profile);
                setIsValidating(false);
            } catch (err) {
                console.error("VALIDATION_ERROR:", err);
                router.push("/");
            }
        };
        validateAdmin();
    }, [user, router, setUser]);

    if (isValidating || !user) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-black gap-4 font-mono text-red-500">
                <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
                <p className="text-xs animate-pulse uppercase tracking-[0.3em]">
                    Verifying_Admin_Access...
                </p>
            </div>
        );
    }

    const handlePurgeMessages = async () => {
        if (!confirm("⚠️ WARNING: 모든 채팅 데이터를 영구 삭제하시겠습니까?"))
            return;
        setIsCleaning(true);
        try {
            const { error } = await supabase
                .from("chat_messages")
                .delete()
                .not("id", "is", null);
            if (error) throw error;
            alert("✨ SYSTEM_PURGE_COMPLETE");
            window.location.reload();
        } catch (err) {
            const error = err as PostgrestError;
            alert(`ERROR: ${error.message}`);
        } finally {
            setIsCleaning(false);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white p-6 md:p-12 font-mono flex flex-col overflow-y-auto custom-scrollbar pb-20 selection:bg-red-500/30">
            <header className="mb-10 flex justify-between items-start border-b border-zinc-800 pb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-red-500 italic flex items-center gap-3">
                        <ShieldCheck size={32} /> ADMIN_CONSOLE_v1.0
                    </h1>
                    <div className="text-zinc-500 text-[10px] mt-3 uppercase tracking-[0.2em] flex flex-col gap-1.5">
                        <span>Operator: {user.nickname || "ROOT_ADMIN"}</span>
                        <span>Session_ID: {user.id}</span>
                    </div>
                </div>
                <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded text-[10px] hover:bg-zinc-800 hover:border-zinc-600 transition-all active:scale-[0.95] text-zinc-400"
                >
                    <ArrowLeft size={14} /> RETURN_TO_DASHBOARD
                </Link>
            </header>

            <div className="flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="border border-red-500/30 bg-red-500/5 p-8 rounded-2xl flex flex-col min-h-75 justify-between">
                        <div>
                            <h2 className="text-red-500 text-xs font-bold mb-6 flex items-center gap-2 uppercase tracking-widest">
                                <Database size={16} /> Database_Purge_System
                            </h2>
                            <div className="p-5 bg-black/40 border border-red-500/20 rounded-lg mb-6">
                                <p className="text-red-200/60 text-[11px] leading-relaxed">
                                    [CRITICAL_ACTION]: chat_messages 테이블의
                                    모든 데이터를 삭제합니다.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handlePurgeMessages}
                            disabled={isCleaning}
                            className="w-full py-4 bg-red-600/10 border border-red-600/50 hover:bg-red-600 hover:text-white transition-all text-[11px] font-black rounded-xl disabled:opacity-30 uppercase tracking-[0.2em]"
                        >
                            {isCleaning
                                ? "WIPING_DATABASE..."
                                : "EXECUTE_GLOBAL_PURGE"}
                        </button>
                    </div>

                    <div className="border border-zinc-800 bg-zinc-900/30 p-8 rounded-2xl min-h-75">
                        <h2 className="text-emerald-500 text-xs font-bold mb-6 uppercase tracking-widest flex items-center gap-2">
                            <Activity size={16} /> System_Status_Monitor
                        </h2>
                        <ul className="space-y-4 text-[11px] text-zinc-500 font-mono">
                            <li className="flex justify-between border-b border-zinc-800/50 pb-3">
                                <span>AUTH_LEVEL</span>
                                <span className="text-emerald-500 font-black italic">
                                    ROOT_ADMIN
                                </span>
                            </li>
                            <li className="flex justify-between border-b border-zinc-800/50 pb-3">
                                <span>GITHUB_API_LINK</span>
                                <span
                                    className={
                                        githubLinked
                                            ? "text-emerald-500"
                                            : "text-zinc-600"
                                    }
                                >
                                    {githubLinked
                                        ? "ACTIVE (TOKEN_READY)"
                                        : "INACTIVE"}
                                </span>
                            </li>
                            <li className="flex justify-between border-b border-zinc-800/50 pb-3">
                                <span>REALTIME_SYNC</span>
                                <span className="text-emerald-500 animate-pulse">
                                    OPERATIONAL
                                </span>
                            </li>
                        </ul>

                        <div className="mt-8 p-4 rounded-xl bg-black/40 border border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Github
                                    size={20}
                                    className={
                                        githubLinked
                                            ? "text-white"
                                            : "text-zinc-800"
                                    }
                                />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-zinc-300">
                                        GitHub_Provider
                                    </span>
                                    <span className="text-[9px] text-zinc-600 font-mono">
                                        v3_REST_ACCESS
                                    </span>
                                </div>
                            </div>
                            <div
                                className={`w-2 h-2 rounded-full ${
                                    githubLinked
                                        ? "bg-emerald-500 shadow-[0_0_8px_#10b981]"
                                        : "bg-zinc-800"
                                }`}
                            />
                        </div>
                    </div>
                </div>

                <footer className="p-6 bg-zinc-950/80 backdrop-blur-sm border border-zinc-900 rounded-2xl font-mono text-[9px] text-zinc-400 leading-tight">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-zinc-400 font-bold tracking-widest">
                            [SYSTEM_LOG]
                        </span>
                        <span className="text-zinc-200">
                            {new Date().toISOString()}
                        </span>
                    </div>
                    <div className="space-y-1.5">
                        <p>&gt; ADMIN_SESSION_VALIDATED: {user.id}</p>
                        <p>
                            &gt; GITHUB_OAUTH_SCOPE:{" "}
                            {githubLinked ? "READ_USER, REPO" : "NONE"}
                        </p>
                        <p className="animate-pulse text-zinc-200">
                            &gt; LISTENING_FOR_OPERATOR_COMMAND_LINE_...
                        </p>
                    </div>
                </footer>
            </div>
        </main>
    );
}
