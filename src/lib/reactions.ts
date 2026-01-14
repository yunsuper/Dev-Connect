// src/lib/reactions.ts
import { supabase } from "./supabase";

// 특정 메시지의 모든 리액션 가져오기
export const fetchReactions = async (messageId: string) => {
    const { data, error } = await supabase
        .from("message_reactions")
        .select(`*, profiles(nickname)`)
        .eq("message_id", messageId);

    if (error) {
        console.error("REACTION_FETCH_ERROR:", error);
        return [];
    }
    return data;
};

// 리액션 추가 또는 삭제 (토글 방식)
export const toggleReaction = async (
    messageId: string,
    userId: string,
    emoji: string
) => {
    // 1. 이미 내가 눌렀는지 확인
    const { data: existing } = await supabase
        .from("message_reactions")
        .select("id")
        .match({ message_id: messageId, user_id: userId, emoji: emoji })
        .single();

    if (existing) {
        // 이미 있다면 삭제 (취소)
        return await supabase
            .from("message_reactions")
            .delete()
            .match({ message_id: messageId, user_id: userId, emoji: emoji });
    } else {
        // 없다면 추가
        return await supabase
            .from("message_reactions")
            .insert({ message_id: messageId, user_id: userId, emoji: emoji });
    }
};
