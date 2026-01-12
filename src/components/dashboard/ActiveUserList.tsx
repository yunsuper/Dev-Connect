"use client";

import { useStore } from "@/store/useStore";
import { OnlineUser } from "@/types";
import { Terminal, Coffee } from "lucide-react";

export default function ActiveUserList() {
    // ✅ store의 상태 이름이 onlineUserList인지 확인하세요 (앞선 에러에서는 onlineUsers였습니다)
    const { onlineUserList } = useStore();

    // ✅ 해결: 중복된 ID를 가진 유저를 제거하여 유니크한 리스트를 만듭니다.
    // Presence 특성상 동일 ID가 여러 개 올 수 있으므로 Map을 사용해 중복을 거릅니다.
    const uniqueUsers = Array.from(
        new Map((onlineUserList || []).map((user) => [user.id, user])).values()
    );

    if (uniqueUsers.length === 0) {
        return (
            <div className="p-8 text-center text-zinc-600 text-[10px] uppercase tracking-widest font-mono">
                No developers online
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <ul className="p-3 space-y-2">
                {uniqueUsers.map((user: OnlineUser) => {
                    const isCoding = user.status === "coding";

                    return (
                        <li
                            key={user.id} // ✅ 이제 유일한 ID임이 보장되어 에러가 사라집니다.
                            className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/30 border border-zinc-800/50 hover:border-zinc-700 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 group-hover:border-zinc-600 transition-all">
                                        {isCoding ? (
                                            <Terminal
                                                size={18}
                                                className="text-emerald-500"
                                            />
                                        ) : (
                                            <Coffee
                                                size={18}
                                                className="text-amber-500"
                                            />
                                        )}
                                    </div>
                                    {/* 온라인 상태 표시등 */}
                                    <span
                                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0B0C10] ${
                                            isCoding
                                                ? "bg-emerald-500"
                                                : "bg-amber-500"
                                        }`}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">
                                        {user.nickname}
                                    </span>
                                    <span
                                        className={`text-[10px] font-black uppercase tracking-widest ${
                                            isCoding
                                                ? "text-emerald-500/70"
                                                : "text-amber-500/70"
                                        }`}
                                    >
                                        {user.status || "coding"}
                                    </span>
                                </div>
                            </div>

                            {/* 상태 배지 */}
                            <div
                                className={`px-2 py-1 rounded-md text-[9px] font-black border ${
                                    isCoding
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                        : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                                }`}
                            >
                                {isCoding ? "CODING" : "RESTING"}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
