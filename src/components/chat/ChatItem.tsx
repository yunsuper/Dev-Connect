"use client";

import { motion } from "framer-motion";
import { memo, useState } from "react";
import { getUserColorClass } from "../../lib/colors";
import { supabase } from "../../lib/supabase";
import { ChatMessage } from "@/types";
import ChatBubble from "./ChatBubble";
import ReactionButtons from "./ReactionButtons";

interface ChatItemProps {
    m: ChatMessage;
    myNickname: string;
    currentUserId: string;
}

const ChatItem = memo(({ m, myNickname, currentUserId }: ChatItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(m.content);

    const [prevContent, setPrevContent] = useState(m.content);
    if (m.content !== prevContent) {
        setEditContent(m.content);
        setPrevContent(m.content);
    }

    const isMine = m.sender_name === myNickname;

    if (m.type === "system") {
        return (
            <div className="flex justify-center my-6 w-full text-center">
                <div className="bg-zinc-800/20 px-4 py-1.5 rounded-full border border-zinc-700/30 backdrop-blur-sm">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                        {m.content}
                    </span>
                </div>
            </div>
        );
    }

    const handleUpdate = async () => {
        if (!editContent.trim() || editContent === m.content) {
            setIsEditing(false);
            return;
        }

        const { error } = await supabase
            .from("chat_messages")
            .update({ content: editContent })
            .eq("id", m.id);

        if (error) {
            console.error("수정 실패:", error.message);
        } else {
            setIsEditing(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        const { error } = await supabase
            .from("chat_messages")
            .delete()
            .eq("id", m.id);
        if (error) console.error("삭제 실패:", error.message);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`flex w-full mb-5 ${
                isMine ? "justify-end" : "justify-start"
            }`}
        >
            <div
                className={`flex flex-col max-w-[85%] min-w-0 ${
                    isMine ? "items-end" : "items-start"
                }`}
            >
                <div
                    className={`flex items-center gap-2 mb-1.5 ${
                        isMine ? "flex-row-reverse" : "flex-row"
                    }`}
                >
                    <span
                        className={`text-[10px] font-black uppercase tracking-wider ${
                            isMine
                                ? "text-emerald-500"
                                : getUserColorClass(m.sender_name)
                        }`}
                    >
                        {isMine ? "ME" : m.sender_name}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono opacity-70">
                        {new Date(m.created_at).toLocaleTimeString([], {
                            hour12: false,
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                </div>

                <div
                    className={`relative group flex flex-col w-full min-w-0 ${
                        isMine ? "items-end" : "items-start"
                    }`}
                >
                    <div
                        className={`flex items-center gap-2 w-full ${
                            isMine ? "flex-row-reverse" : "flex-row"
                        }`}
                    >
                        <ChatBubble
                            content={m.content}
                            isMine={isMine}
                            isEditing={isEditing}
                            editContent={editContent}
                            onEditChange={setEditContent}
                            onUpdate={handleUpdate}
                            onCancel={() => {
                                setEditContent(m.content);
                                setIsEditing(false);
                            }}
                        />

                        {isMine && !isEditing && (
                            <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="p-1.5 rounded-lg bg-zinc-900/50 text-zinc-500 hover:text-emerald-400 border border-zinc-800/50 backdrop-blur-md shadow-lg"
                                >
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="p-1.5 rounded-lg bg-zinc-900/50 text-zinc-500 hover:text-red-500 border border-zinc-800/50 backdrop-blur-md shadow-lg"
                                >
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    <div
                        className={`-mt-1.5 ${
                            isMine ? "self-end mr-1" : "self-start ml-1"
                        }`}
                    >
                        <ReactionButtons
                            messageId={m.id.toString()}
                            currentUserId={currentUserId}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

ChatItem.displayName = "ChatItem";
export default ChatItem;
