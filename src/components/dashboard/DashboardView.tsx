"use client";

import { useStore } from "@/store/useStore";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/store/slices/userSlice";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import dynamic from "next/dynamic";

const ChatInput = dynamic(() => import("@/components/chat/ChatInput"), {
    ssr: false,
});
const ChatList = dynamic(() => import("@/components/chat/ChatList"), {
    ssr: false,
});
const Header = dynamic(() => import("@/components/chat/Header"), {
    ssr: false,
});
const ActiveUserList = dynamic(
    () => import("@/components/dashboard/ActiveUserList"),
    { ssr: false }
);
const PomodoroTimer = dynamic(
    () => import("@/components/dashboard/PomodoroTimer"),
    { ssr: false }
);
const TodoList = dynamic(() => import("@/components/dashboard/TodoList"), {
    ssr: false,
});
const GithubStats = dynamic(
    () => import("@/components/dashboard/GithubStats"),
    { ssr: false }
);

export default function DashboardView({ user }: { user: UserProfile }) {
    const { messages, onlineUsers, fetchMessages } = useStore();

    const handleRefreshData = () => {
        fetchMessages();
    };

    const handleLogout = async () => {
        if (!confirm("로그아웃 하시겠습니까?")) return;
        await supabase.auth.signOut();
        window.location.reload();
    };

    return (
        <main className="flex flex-col lg:h-screen w-full bg-background text-foreground overflow-hidden">
            <Header
                myNickname={user.nickname}
                onRefresh={handleRefreshData}
                onLogout={handleLogout}
                messageCount={messages.length}
                onlineCount={onlineUsers}
            />

            <div className="flex-1 flex flex-col lg:flex-row min-w-0 overflow-hidden">
                <aside className="hidden lg:flex w-64 sidebar-container border-r flex-col h-full overflow-hidden">
                    <div className="p-4 border-b border-zinc-800 font-bold text-zinc-500 text-xs tracking-widest uppercase flex justify-between items-center">
                        <span>Online</span>
                        <span className="px-1.5 py-0.5 bg-zinc-800 rounded text-[10px]">
                            {onlineUsers}
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <ActiveUserList />
                    </div>
                    {user.is_admin && (
                        <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
                            <Link
                                href="/admin"
                                className="flex items-center justify-center gap-2 w-full py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-black hover:bg-red-500 hover:text-white transition-all tracking-widest group"
                            >
                                <ShieldCheck
                                    size={14}
                                    className="group-hover:animate-bounce"
                                />
                                ADMIN CONSOLE
                            </Link>
                        </div>
                    )}
                </aside>

                <section className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto lg:custom-scrollbar">
                    <div className="p-4 space-y-6 pb-40">
                        <div
                            className="dev-panel rounded-xl flex flex-col overflow-hidden"
                            style={{
                                height: "calc(100vh - 220px)",
                                minHeight: "600px",
                                maxHeight: "850px",
                            }}
                        >
                            <div className="flex-1 overflow-hidden flex flex-col p-2">
                                <ChatList myNickname={user.nickname} />
                            </div>
                            <div className="p-4 border-t border-zinc-800 bg-black/20">
                                <ChatInput />
                            </div>
                        </div>

                        <div className="xl:hidden space-y-6">
                            <div className="dev-panel p-5 rounded-xl">
                                <h3 className="text-xs font-bold text-zinc-500 mb-4 tracking-tighter uppercase">
                                    Focus Timer
                                </h3>
                                <PomodoroTimer myNickname={user.nickname} />
                            </div>
                            <div className="dev-panel p-5 rounded-xl h-100 flex flex-col">
                                <h3 className="text-xs font-bold text-zinc-500 mb-4 tracking-tighter uppercase">
                                    Task Board
                                </h3>
                                <div className="flex-1 overflow-y-auto custom-scrollbar">
                                    <TodoList />
                                </div>
                            </div>
                        </div>

                        <div className="dev-panel rounded-xl p-6">
                            <GithubStats />
                        </div>
                    </div>
                </section>

                <aside className="hidden xl:flex w-80 sidebar-container border-l p-4 space-y-6 h-full overflow-hidden flex-col">
                    <div className="dev-panel p-5 rounded-xl">
                        <h3 className="text-xs font-bold text-zinc-500 mb-4 tracking-tighter uppercase">
                            Focus Timer
                        </h3>
                        <PomodoroTimer myNickname={user.nickname} />
                    </div>
                    <div className="dev-panel flex-1 p-5 rounded-xl overflow-hidden flex flex-col">
                        <h3 className="text-xs font-bold text-zinc-500 mb-4 tracking-tighter uppercase">
                            Task Board
                        </h3>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <TodoList />
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
