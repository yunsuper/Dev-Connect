// src/lib/reactions.ts
import { supabase } from "./supabase";

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

export const toggleReaction = async (
    messageId: string,
    userId: string,
    emoji: string
) => {
    const { data: existing } = await supabase
        .from("message_reactions")
        .select("id")
        .match({ message_id: messageId, user_id: userId, emoji: emoji })
        .single();

    if (existing) {
        return await supabase
            .from("message_reactions")
            .delete()
            .match({ message_id: messageId, user_id: userId, emoji: emoji });
    } else {
        return await supabase
            .from("message_reactions")
            .insert({ message_id: messageId, user_id: userId, emoji: emoji });
    }
};
