"use client";

import MessageContent from "./MessageContent";

interface ChatBubbleProps {
    content: string;
    isMine: boolean;
    isEditing: boolean;
    editContent: string;
    onEditChange: (val: string) => void;
    onUpdate: () => void;
    onCancel: () => void;
}

export default function ChatBubble({
    content,
    isMine,
    isEditing,
    editContent,
    onEditChange,
    onUpdate,
    onCancel,
}: ChatBubbleProps) {
    return (
        <div
            className={`p-3 rounded-xl text-[13.5px] leading-relaxed shadow-xl border transition-all duration-300
            ${
                isMine
                    ? "bg-emerald-600 border-emerald-500 text-white rounded-tr-none shadow-emerald-900/10"
                    : "bg-zinc-900/80 border-zinc-800 text-zinc-100 rounded-tl-none"
            }`}
        >
            {isEditing ? (
                <div className="flex flex-col gap-2 min-w-64">
                    <textarea
                        value={editContent}
                        onChange={(e) => onEditChange(e.target.value)}
                        className="bg-black/60 border border-white/20 text-white p-2 rounded-lg text-sm outline-none resize-none focus:border-emerald-400/50"
                        rows={3}
                        autoFocus
                    />
                    <div className="flex justify-end gap-2 mt-1">
                        <button
                            onClick={onCancel}
                            className="text-[10px] text-white/50 px-2 font-bold"
                        >
                            CANCEL
                        </button>
                        <button
                            onClick={onUpdate}
                            className="bg-white text-emerald-700 px-3 py-1 rounded-md text-[10px] font-black"
                        >
                            SAVE
                        </button>
                    </div>
                </div>
            ) : (
                <MessageContent content={content} />
            )}
        </div>
    );
}
