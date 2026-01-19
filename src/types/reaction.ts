// src/types/reaction.ts
export interface MessageReaction {
    id: string;
    message_id: string;
    user_id: string;
    emoji: string;
    created_at: string;
    profiles?: {
        nickname: string;
    };
}

export interface ReactionGroup {
    emoji: string;
    count: number;
    meClicked: boolean;
    usernames: string[];
}
