import { create } from "zustand";

type RecoveryStore = {
  user_id: number;
  setUserId: (id: number) => void;
};

export const useRecoveryStore = create<RecoveryStore>((set) => ({
  user_id: 0,
  setUserId: (id: number) => set({ user_id: id }),
}));
