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

// 화면에 묶어서 보여주기 위한 가공된 타입
export interface ReactionGroup {
    emoji: string;
    count: number;
    meClicked: boolean;
    usernames: string[]; // 누가 눌렀는지 툴팁용
}
