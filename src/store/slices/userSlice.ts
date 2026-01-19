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
    setUser: (user) => set(() => ({ user })),
});
