"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Trash2, CheckCircle2, Circle, Plus, GripVertical } from "lucide-react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";

export default function TodoList() {
    const {
        todos,
        fetchTodos,
        addTodo,
        toggleTodo,
        deleteTodo,
        updateTodoOrder,
    } = useStore();
    const [input, setInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        fetchTodos();
        return () => cancelAnimationFrame(animation);
    }, [fetchTodos]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isSubmitting) return;
        setIsSubmitting(true);
        await addTodo(input.trim());
        setInput("");
        setIsSubmitting(false);
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(todos);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        updateTodoOrder(items);
    };

    if (!enabled) return null;

    return (
        <div className="flex flex-col h-full space-y-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="NEW_TASK_INPUT..."
                    className="flex-1 bg-black/40 border border-zinc-800 rounded-xl px-4 py-2 text-xs font-mono text-emerald-100 outline-none focus:border-emerald-500/50"
                    disabled={isSubmitting}
                />
                <button
                    type="submit"
                    disabled={isSubmitting || !input.trim()}
                    className="p-2 bg-zinc-800 hover:bg-emerald-600 text-white rounded-xl transition-all"
                >
                    <Plus size={18} />
                </button>
            </form>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                    droppableId="todos-list"
                    // ✅ 핵심: 드래그 시 실제 요소를 복제하여 별도 레이어에 띄움
                    renderClone={(provided, snapshot, rubric) => {
                        const todo = todos[rubric.source.index];
                        return (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={
                                    {
                                        ...provided.draggableProps.style,
                                        width: "100%", // 너비 고정
                                    } as React.CSSProperties
                                }
                                className="flex items-center justify-between p-3 rounded-xl border bg-zinc-800 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)] z-9999 ring-2 ring-emerald-500/40 scale-[1.03]"
                            >
                                <div className="flex items-center gap-3">
                                    <GripVertical
                                        size={16}
                                        className="text-emerald-500"
                                    />
                                    <div className="w-4.5 h-4.5 rounded-full border border-emerald-500 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                    </div>
                                    <span className="text-xs font-mono text-zinc-100">
                                        {todo.content}
                                    </span>
                                </div>
                            </div>
                        );
                    }}
                >
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2"
                        >
                            {todos.map((todo, index) => (
                                <Draggable
                                    key={todo.id}
                                    draggableId={todo.id}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            style={
                                                provided.draggableProps.style
                                            }
                                            className={`group flex items-center justify-between p-3 rounded-xl border transition-all ${
                                                snapshot.isDragging
                                                    ? "opacity-0 invisible" // ✅ 드래그 시 원본은 아예 숨김 (복제본이 대신 보임)
                                                    : "bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700/50"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    {...provided.dragHandleProps}
                                                    className="text-zinc-700 hover:text-zinc-500 cursor-grab active:cursor-grabbing"
                                                >
                                                    <GripVertical size={16} />
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        toggleTodo(
                                                            todo.id,
                                                            todo.is_completed
                                                        )
                                                    }
                                                >
                                                    {todo.is_completed ? (
                                                        <CheckCircle2
                                                            size={18}
                                                            className="text-emerald-500"
                                                        />
                                                    ) : (
                                                        <Circle
                                                            size={18}
                                                            className="text-zinc-700 hover:text-zinc-500"
                                                        />
                                                    )}
                                                </button>
                                                <span
                                                    className={`text-xs font-mono select-none ${
                                                        todo.is_completed
                                                            ? "line-through text-zinc-600"
                                                            : "text-zinc-300"
                                                    }`}
                                                >
                                                    {todo.content}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    deleteTodo(todo.id)
                                                }
                                                className="opacity-0 group-hover:opacity-100 p-1 text-zinc-600 hover:text-red-500 transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}
