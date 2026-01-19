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

        const channel = supabase
            .channel(`message_reactions_${messageId}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "message_reactions",
                    filter: `message_id=eq.${messageId}`,
                },
                () => {
                    loadReactions();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [messageId]);

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
                return prev.filter((r) => r.id !== isExist.id);
            }

            const newReaction: MessageReaction = {
                id: Math.random().toString(),
                message_id: messageId,
                user_id: currentUserId,
                emoji: emoji,
                created_at: new Date().toISOString(),
            };

            return [...prev, newReaction];
        });

        try {
            const { error } = await toggleReaction(
                messageId,
                currentUserId,
                emoji
            );
            if (error) throw error;

            setShowPicker(false);
        } catch (err) {
            console.error("REACTION_ERROR:", err);
            const data = await fetchReactions(messageId);
            setReactions(data as MessageReaction[]);
        }
    };

    return (
        <div className="relative flex flex-wrap gap-1 mt-2 items-center min-h-6">
            <button
                onClick={() => setShowPicker(!showPicker)}
                className="p-1 text-zinc-600 hover:text-emerald-500 transition-colors rounded-md hover:bg-emerald-500/10"
                title="리액션 추가"
            >
                <Smile size={14} />
            </button>

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
