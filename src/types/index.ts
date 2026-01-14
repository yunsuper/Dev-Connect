export interface ChatMessage {
    id: string;
    sender_name: string;
    content: string;
    created_at: string;
    type?: "user" | "system";
}

export interface OnlineUser {
    id: string;
    nickname: string;
    status?: string;
    online_at: string;
}

export interface PresenceEntry {
    presence_ref: string;
    online_at: string;
    user_name: string;
    [key: string]: unknown;
}

export interface PresenceUser {
    user_name: string;
    online_at: string;
}

export interface Todo {
    id: string;
    user_id: string;
    content: string;
    is_completed: boolean;
    created_at: string;
}