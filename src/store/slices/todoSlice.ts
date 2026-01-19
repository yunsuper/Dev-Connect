import { StateCreator } from "zustand";
import { Todo } from "@/types";
import { RootState } from "../useStore";
import { supabase } from "@/lib/supabase";

export interface TodoSlice {
    todos: Todo[];
    fetchTodos: () => Promise<void>;
    addTodo: (content: string) => Promise<void>;
    toggleTodo: (id: string, is_completed: boolean) => Promise<void>;
    deleteTodo: (id: string) => Promise<void>;
    updateTodoOrder: (reorderedTodos: Todo[]) => Promise<void>;
}

export const createTodoSlice: StateCreator<RootState, [], [], TodoSlice> = (
    set,
    get
) => ({
    todos: [],

    fetchTodos: async () => {
        const { data, error } = await supabase
            .from("todos")
            .select("*")
            .order("order_index", { ascending: true })
            .order("created_at", { ascending: true });

        if (!error && data) {
            set({ todos: data });
        }
    },

    addTodo: async (content) => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const nextOrderIndex = get().todos.length;

        const { error } = await supabase.from("todos").insert({
            content,
            user_id: user.id,
            order_index: nextOrderIndex,
        });

        if (!error) {
            await get().fetchTodos();
        }
    },

    toggleTodo: async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from("todos")
            .update({ is_completed: !currentStatus })
            .eq("id", id);

        if (!error) {
            await get().fetchTodos();
        } else {
            console.error("업데이트 에러:", error.message);
        }
    },

    deleteTodo: async (id) => {
        const { error } = await supabase.from("todos").delete().eq("id", id);

        if (!error) {
            await get().fetchTodos();
        }
    },

    updateTodoOrder: async (reorderedTodos: Todo[]) => {
        set({ todos: reorderedTodos });

        const updates = reorderedTodos.map((todo, index) => ({
            id: todo.id,
            user_id: todo.user_id,
            content: todo.content,
            is_completed: todo.is_completed,
            order_index: index,
        }));

        const { error } = await supabase.from("todos").upsert(updates);

        if (error) {
            console.error("순서 저장 실패:", error);
            await get().fetchTodos();
        }
    },
});
