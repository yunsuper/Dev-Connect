import { StateCreator } from "zustand";
import { OnlineUser } from "@/types";
import { RootState } from "../useStore";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface PresenceSlice {
    onlineUsers: number;
    onlineUserList: OnlineUser[];
    myStatus: string;
    activeChannel: RealtimeChannel | null;
    setPresence: (users: OnlineUser[]) => void;
    setMyStatus: (status: string) => void;
    setActiveChannel: (channel: RealtimeChannel | null) => void;
}

export const createPresenceSlice: StateCreator<
    RootState,
    [],
    [],
    PresenceSlice
> = (set) => ({
    onlineUsers: 0,
    onlineUserList: [],
    myStatus: "coding",
    activeChannel: null,

    setPresence: (list) =>
        set({
            onlineUserList: list,
            onlineUsers: list.length,
        }),

    setMyStatus: (status) => set({ myStatus: status }),

    setActiveChannel: (channel) => set({ activeChannel: channel }),
});
