"use client";

import { getUserColorClass } from "../lib/colors";

interface HeaderProps {
    myNickname: string;
    onRefresh: () => void;
    messageCount: number;
    onlineCount: number;
}

export default function Header({
    myNickname,
    onRefresh,
    messageCount,
    onlineCount,
}: HeaderProps) {
    return (
        <header className="dev-panel sticky top-0 z-20 p-6 flex justify-between items-center border-t-0 border-x-0 bg-background/80 backdrop-blur-md">
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold tracking-tighter text-emerald-400">
                        DEV-CONNECT
                    </h1>

                    {/* 실시간 접속자 뱃지 */}
                    <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-500 tracking-wider">
                            {onlineCount} ONLINE
                        </span>
                    </div>
                </div>
                {/* ✅ [대비율 개선] text-zinc-500 -> text-zinc-400 */}
                <p className="text-[10px] text-zinc-400 uppercase mt-1 tracking-widest font-medium">
                    {messageCount} MESSAGES_IN_HISTORY
                </p>
            </div>

            {/* 닉네임 섹션 */}
            {/* ✅ [대비율 개선] bg-zinc-800/40 -> bg-zinc-800/60, border 대비 상향 */}
            <div className="flex items-center gap-4 bg-zinc-800/60 p-2 px-4 rounded-full border border-zinc-700 hover:border-emerald-500/30 transition-colors group/panel">
                <div className="flex flex-col items-end">
                    {/* ✅ [대비율 개선] text-zinc-500 -> text-zinc-400 */}
                    <span className="text-[9px] text-zinc-400 leading-none mb-1 font-bold">
                        SESSION_ID
                    </span>
                    <span
                        className={`text-sm font-bold tracking-tight ${
                            myNickname
                                ? getUserColorClass(myNickname)
                                : "text-zinc-400"
                        }`}
                    >
                        {myNickname || "IDENTIFYING..."}
                    </span>
                </div>

                <button
                    onClick={onRefresh}
                    className="w-8 h-8 flex items-center justify-center hover:bg-zinc-700/50 rounded-full transition-all active:scale-90 group/btn"
                    title="닉네임 새로고침"
                >
                    <span className="text-sm group-hover/btn:rotate-180 transition-transform duration-500">
                        🔄
                    </span>
                </button>
            </div>
        </header>
    );
}
