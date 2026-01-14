"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toggleReaction, fetchReactions } from "@/lib/reactions";
import { MessageReaction, ReactionGroup } from "@/types/reaction";
import { supabase } from "@/lib/supabase";
import { Smile } from "lucide-react";

interface Props {
    messageId: string;
    currentUserId: string;
}

const EMOJI_LIST = ["👍", "❤️", "🔥", "✅", "😮"];

export default function ReactionButtons({ messageId, currentUserId }: Props) {
    const [reactions, setReactions] = useState<MessageReaction[]>([]);
    const [showPicker, setShowPicker] = useState(false);

    // 1. 초기 데이터 로드 및 실시간 구독
    useEffect(() => {
        const loadReactions = async () => {
            const data = await fetchReactions(messageId);
            setReactions(data as MessageReaction[]);
        };

        loadReactions();

        // 실시간 리액션 감지
        const channel = supabase
            .channel(`message_reactions_${messageId}`) // 채널명 고유화
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "message_reactions",
                    // message_id가 정확히 일치하는지 확인
                    filter: `message_id=eq.${messageId}`,
                },
                (payload) => {
                    console.log("Reaction change detected:", payload); // 디버깅용 로그
                    loadReactions(); // 변경 감지 시 즉시 다시 로드
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [messageId]);

    // 2. 데이터를 그룹화 (이모티콘별 숫자 계산)
    const reactionGroups: ReactionGroup[] = EMOJI_LIST.map((emoji) => {
        const filtered = reactions.filter((r) => r.emoji === emoji);
        return {
            emoji,
            count: filtered.length,
            meClicked: filtered.some((r) => r.user_id === currentUserId),
            usernames: filtered.map((r) => r.profiles?.nickname || "익명"),
        };
    }).filter((group) => group.count > 0);

    const handleEmojiClick = async (emoji: string) => {
        setReactions((prev) => {
            const isExist = prev.find(
                (r) => r.emoji === emoji && r.user_id === currentUserId
            );
            if (isExist) {
                // 이미 존재하면 제거 (취소)
                return prev.filter((r) => r.id !== isExist.id);
            }

            // 존재하지 않으면 추가 (임시 객체 생성)
            // ✅ any 대신 MessageReaction 타입을 명시하고 필수 속성을 채워줍니다.
            const newReaction: MessageReaction = {
                id: Math.random().toString(), // 임시 ID
                message_id: messageId,
                user_id: currentUserId,
                emoji: emoji,
                created_at: new Date().toISOString(),
            };

            return [...prev, newReaction];
        });

        try {
            // 2. 실제 DB 요청
            const { error } = await toggleReaction(
                messageId,
                currentUserId,
                emoji
            );
            if (error) throw error;

            setShowPicker(false);
        } catch (err) {
            console.error("REACTION_ERROR:", err);
            // 에러 발생 시 최신 데이터를 다시 불러와서 화면을 롤백하거나 갱신합니다.
            const data = await fetchReactions(messageId);
            setReactions(data as MessageReaction[]);
        }
    };

    return (
        <div className="relative flex flex-wrap gap-1 mt-2 items-center min-h-6">
            {/* 리액션 피커 열기 버튼 */}
            <button
                onClick={() => setShowPicker(!showPicker)}
                className="p-1 text-zinc-600 hover:text-emerald-500 transition-colors rounded-md hover:bg-emerald-500/10"
                title="리액션 추가"
            >
                <Smile size={14} />
            </button>

            {/* 이미 등록된 리액션들 표시 */}
            <div className="flex flex-wrap gap-1">
                {reactionGroups.map((group) => (
                    <motion.button
                        key={group.emoji}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEmojiClick(group.emoji)}
                        className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-mono transition-all ${
                            group.meClicked
                                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                                : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                        }`}
                        title={group.usernames.join(", ")}
                    >
                        <span>{group.emoji}</span>
                        <span className="font-bold">{group.count}</span>
                    </motion.button>
                ))}
            </div>

            {/* 이모티콘 선택창 (Pop-up) */}
            <AnimatePresence>
                {showPicker && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowPicker(false)}
                        />
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 10, opacity: 0 }}
                            className="absolute bottom-8 left-0 z-20 flex gap-2 p-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl backdrop-blur-md"
                        >
                            {EMOJI_LIST.map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => handleEmojiClick(emoji)}
                                    className="text-lg hover:scale-125 transition-transform p-1"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
