"use client";

export default function Footer() {
    return (
        <footer className="w-full py-6 px-8 border-t border-zinc-800/50 bg-black/20 backdrop-blur-md">
            <div className="max-w-350 mx-auto flex flex-col md:flex-row justify-between items-center gap-6 select-none">
                <div className="flex items-center gap-5">
                    <div className="flex flex-col">
                        <span className="text-[13px] font-black tracking-[0.3em] text-emerald-400 uppercase drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                            Dev-Connect
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 mt-0.5">
                            PROPERTY OF CLOUD_OFFICE_LABS
                        </span>
                    </div>
                    <div className="hidden md:block h-10 w-px bg-zinc-800" />
                    <div className="hidden md:flex flex-col">
                        <span className="text-[11px] font-bold text-zinc-300">
                            CORE_v0.0.1
                        </span>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-tighter">
                            Secure Terminal Session
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 bg-zinc-900/50 border border-zinc-800 px-4 py-1.5 rounded-full shadow-inner">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-[0.2em]">
                        System_Status:{" "}
                        <span className="text-emerald-400">Operational</span>
                    </span>
                </div>

                <div className="text-right flex flex-col items-end font-mono">
                    <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-tight">
                        Verified Access Path
                    </span>
                    <span className="text-[10px] text-zinc-400 mt-0.5">
                        © 2026 YUNSUPER. ALL RIGHTS RESERVED.
                    </span>
                </div>
            </div>
        </footer>
    );
}
