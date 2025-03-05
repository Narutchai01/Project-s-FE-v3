import { create } from "zustand";
import { ISkincare } from "@/interface/skincare";
import { axiosInstance } from "@/lib/axios_instance";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SkincareStore = {
  skincares: ISkincare[];
  fetchSkincares: () => Promise<void>;
  loadSkincares: () => Promise<void>;
};

export const useSkincareStore = create<SkincareStore>((set) => ({
  skincares: [],
  fetchSkincares: async () => {
    try {
      const response = await axiosInstance.get("/skincare/");
      if (response.data.status) {
        set({ skincares: response.data.data });
        await AsyncStorage.setItem(
          "skincares",
          JSON.stringify(response.data.data)
        );
      }
    } catch (error) {
      console.error("Error fetching skincares:", error);
    }
  },
  loadSkincares: async () => {
    try {
      const skincares = await AsyncStorage.getItem("skincares");
      if (skincares) {
        set({ skincares: JSON.parse(skincares) });
      }
    } catch (error) {
      console.error("Error loading skincares:", error);
    }
  },
  clearSkincares: () => {
    set({ skincares: [] });
  },
}));
