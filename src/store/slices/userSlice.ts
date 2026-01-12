// src/store/slices/userSlice.ts

import { StateCreator } from "zustand";
import { RootState } from "../useStore";

export interface UserProfile {
    id: string;
    nickname: string;
    is_admin: boolean;
}

export interface UserSlice {
    user: UserProfile | null;
    setUser: (user: UserProfile | null) => void;
}

export const createUserSlice: StateCreator<RootState, [], [], UserSlice> = (
    set
) => ({
    user: null,
    // ✅ (state: RootState)를 명시하여 타입 추론을 돕습니다.
    setUser: (user) => set(() => ({ user })),
});
