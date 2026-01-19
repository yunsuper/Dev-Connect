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
              ? "bg-emerald-600 border-emerald-500 text-white rounded-tr-none shadow-(--shadow-emerald)"
              : "dev-panel text-zinc-100 rounded-tl-none border-zinc-800/60"
      } ${isEditing ? "w-full min-w-75" : "max-w-prose"}`}
        >
            <MessageContent
                content={content}
                isEditing={isEditing}
                editContent={editContent}
                setEditContent={onEditChange}
            />

            {isEditing && (
                <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-white/10">
                    <button
                        onClick={onCancel}
                        className="text-[10px] text-white/50 px-2 py-1 font-bold hover:text-white transition-colors"
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={onUpdate}
                        className="bg-white text-emerald-700 px-3 py-1 rounded-md text-[10px] font-black hover:bg-emerald-50 shadow-sm transition-all active:scale-95"
                    >
                        SAVE
                    </button>
                </div>
            )}
        </div>
    );
}
