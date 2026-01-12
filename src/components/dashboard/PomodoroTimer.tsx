"use client";

import { useState, useEffect, useRef } from "react";
import { useStore } from "@/store/useStore"; 

export default function PomodoroTimer({ myNickname }: { myNickname: string }) {
    const [mode, setMode] = useState<"coding" | "resting">("coding");
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);

    const { syncPresenceStatus } = useStore();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // 1. 타이머 카운트다운 로직
    useEffect(() => {
        if (!isActive) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setIsActive(false);
                    if (timerRef.current) clearInterval(timerRef.current);

                    setTimeout(() => {
                        alert(
                            mode === "coding"
                                ? "코딩 세션 종료! 잠시 쉽시다."
                                : "휴식 종료! 다시 집중해볼까요?"
                        );
                    }, 100);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, mode]);

    // 2. 모드 변경 처리 (상태 동기화 포함)
    const handleModeChange = (newMode: "coding" | "resting") => {
        setIsActive(false);
        setMode(newMode);
        setTimeLeft(newMode === "coding" ? 25 * 60 : 5 * 60);
        syncPresenceStatus(myNickname, newMode);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    return (
        <div className="flex flex-col items-center">
            {/* 탭 버튼 UI: dev-panel 클래스 적용 */}
            <div className="flex gap-2 mb-6 dev-panel p-1.5">
                <button
                    onClick={() => handleModeChange("coding")}
                    className={`btn-mode ${
                        mode === "coding"
                            ? "btn-mode-active-emerald"
                            : "btn-mode-inactive"
                    }`}
                >
                    <span className="text-base">💻</span>
                    <span>CODING</span>
                </button>
                <button
                    onClick={() => handleModeChange("resting")}
                    className={`btn-mode ${
                        mode === "resting"
                            ? "btn-mode-active-amber"
                            : "btn-mode-inactive"
                    }`}
                >
                    <span className="text-base">☕</span>
                    <span>RESTING</span>
                </button>
            </div>

            {/* 타이머 숫자: timer-glow 클래스 적용 */}
            <div
                className={`text-6xl font-mono font-black tracking-tighter mb-6 ${
                    mode === "coding"
                        ? "timer-glow-emerald"
                        : "timer-glow-amber"
                }`}
            >
                {formatTime(timeLeft)}
            </div>

            {/* 제어 버튼 영역 */}
            <div className="flex gap-4">
                <button
                    onClick={() => setIsActive(!isActive)}
                    className={`flex items-center justify-center w-14 h-14 rounded-full transition-all active:scale-95 shadow-lg ${
                        isActive
                            ? "bg-zinc-700 text-white hover:bg-zinc-600"
                            : "bg-zinc-800 text-emerald-500 hover:bg-emerald-500 hover:text-black"
                    }`}
                >
                    {isActive ? (
                        <svg
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <rect x="6" y="4" width="4" height="16" />
                            <rect x="14" y="4" width="4" height="16" />
                        </svg>
                    ) : (
                        <svg
                            width="28"
                            height="28"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="ml-1"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>

                <button
                    onClick={() => {
                        setIsActive(false);
                        setTimeLeft(mode === "coding" ? 25 * 60 : 5 * 60);
                    }}
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-zinc-800 text-zinc-500 hover:bg-zinc-700 transition-all active:scale-95 shadow-lg"
                >
                    <svg
                        width="22"
                        height="22"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                    >
                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
