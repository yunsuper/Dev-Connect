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
    updateTodoOrder: (reorderedTodos: Todo[]) => Promise<void>; // ✅ 인터페이스 정의 추가
}

export const createTodoSlice: StateCreator<RootState, [], [], TodoSlice> = (
    set,
    get
) => ({
    todos: [],

    // 1. 할 일 목록 불러오기 (order_index 순으로 정렬)
    fetchTodos: async () => {
        const { data, error } = await supabase
            .from("todos")
            .select("*")
            .order("order_index", { ascending: true }) // ✅ 순서 기반 정렬 우선
            .order("created_at", { ascending: true });

        if (!error && data) {
            set({ todos: data });
        }
    },

    // 2. 새로운 할 일 추가 (마지막 순서로 추가)
    addTodo: async (content) => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // ✅ 현재 리스트의 가장 마지막 index 부여
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

    // 3. 완료 상태 토글
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

    // 4. 할 일 삭제
    deleteTodo: async (id) => {
        const { error } = await supabase.from("todos").delete().eq("id", id);

        if (!error) {
            await get().fetchTodos();
        }
    },

    // 5. 할 일 순서 업데이트 (드래그 앤 드롭용)
    updateTodoOrder: async (reorderedTodos: Todo[]) => {
        // 🚀 Optimistic Update: 서버 응답 전 화면부터 갱신
        set({ todos: reorderedTodos });

        // DB에 바뀐 순서들을 한꺼번에 업데이트 (upsert)
        const updates = reorderedTodos.map((todo, index) => ({
            id: todo.id,
            user_id: todo.user_id,
            content: todo.content,
            is_completed: todo.is_completed,
            order_index: index, // 드래그된 결과에 따른 새 인덱스
        }));

        const { error } = await supabase.from("todos").upsert(updates);

        if (error) {
            console.error("순서 저장 실패:", error);
            // 에러 시 원래 데이터를 다시 불러와서 복구
            await get().fetchTodos();
        }
    },
});
