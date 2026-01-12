"use client";

import { supabase } from "@/lib/supabase";

export default function LandingView() {
    const handleLogin = () => {
        supabase.auth.signInWithOAuth({
            provider: "github",
            options: { redirectTo: window.location.origin },
        });
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-black px-4">
            <div className="mb-12 text-center">
                <div className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 text-[10px] font-bold tracking-widest uppercase mb-4">
                    Developer Shared Office
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4">
                    DEV<span className="text-emerald-500">.</span>CONNECT
                </h1>
                <p className="text-zinc-500 text-sm max-w-md mx-auto">
                    공유 오피스 감성으로 소통하고 함께 성장하는 개발자 전용
                    프라이빗 커뮤니티입니다.
                </p>
            </div>

            <button
                onClick={handleLogin}
                className="flex items-center gap-3 px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all active:scale-95"
            >
                GITHUB LOGIN
            </button>
        </div>
    );
}
