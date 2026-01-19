"use client";

import { useAuthSync } from "@/hooks/useAuthSync";
// import LandingView from "@/components/auth/LandingView";
// import DashboardView from "@/components/dashboard/DashboardView";
import GithubStats from "@/components/dashboard/GithubStats";
import dynamic from "next/dynamic";

const LandingView = dynamic(() => import("@/components/auth/LandingView"), {
    ssr: false,
});
const DashboardView = dynamic(
    () => import("@/components/dashboard/DashboardView"),
    {
        ssr: false,
        loading: () => <div className="h-screen bg-black" />,
    }
);

export default function Page() {
    const { user, loading } = useAuthSync();

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


    if (!user) {
        return <LandingView />;
    }

    return <DashboardView user={user} />;
}
