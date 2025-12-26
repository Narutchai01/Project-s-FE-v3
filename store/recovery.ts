import { create } from "zustand";

type RecoveryStore = {
  user_id: number;
  email: string;
  setUserId: (id: number) => void;
  setEmail: (email: string) => void;
};

export const useRecoveryStore = create<RecoveryStore>((set) => ({
  user_id: 0,
  email: "",
  setUserId: (id: number) => set({ user_id: id }),
  setEmail: (email: string) => set({ email }),
}));
