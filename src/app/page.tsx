"use client";

import { useAuthSync } from "@/hooks/useAuthSync";
import LandingView from "@/components/auth/LandingView";
import DashboardView from "@/components/dashboard/DashboardView";
import GithubStats from "@/components/dashboard/GithubStats";

export default function Page() {
    const { user, loading } = useAuthSync();

    // 1. 로딩 상태 (인증 확인 중)
    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-black gap-4">
                <GithubStats />
                <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="text-zinc-500 text-xs font-mono animate-pulse uppercase tracking-widest">
                    Verifying Session...
                </p>
            </div>
        );
    }

    // 2. 미인증 상태 -> 로그인(랜딩) 페이지
    if (!user) {
        return <LandingView />;
    }

    // 3. 인증 완료 상태 -> 메인 대시보드
    return <DashboardView user={user} />;
}
