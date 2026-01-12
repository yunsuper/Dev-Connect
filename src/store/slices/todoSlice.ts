import { StateCreator } from "zustand";
import { Todo } from "@/types"; 
import { RootState } from "../useStore";

export interface TodoSlice {
    todos: Todo[];
    addTodo: (text: string) => void;
    toggleTodo: (id: string) => void;
    deleteTodo: (id: string) => void;
}

export const createTodoSlice: StateCreator<RootState, [], [], TodoSlice> = (
    set
) => ({
    todos: [],

    addTodo: (text) =>
        set((state: RootState) => ({
            todos: [
                ...state.todos,
                {
                    id: Math.random().toString(36).substring(2, 9),
                    text,
                    completed: false,
                    created_at: new Date().toISOString(),
                },
            ],
        })),

    toggleTodo: (id) =>
        set((state: RootState) => ({
            todos: state.todos.map((todo: Todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            ),
        })),

    deleteTodo: (id) =>
        set((state: RootState) => ({
            todos: state.todos.filter((todo: Todo) => todo.id !== id),
        })),
});
