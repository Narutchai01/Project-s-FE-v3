import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IAcne } from "@/interface/acne";
import { axiosInstance } from "@/lib/axios_instance";

type AcneStore = {
  acnes: IAcne[];
  fetchAcnes: () => Promise<void>;
  loadAcnes: () => Promise<void>;
};

export const useAcneStore = create<AcneStore>((set) => ({
  acnes: [],
  fetchAcnes: async () => {
    try {
      const response = await axiosInstance.get("/acne/");
      if (response.data.status) {
        set({ acnes: response.data.data });
        await AsyncStorage.setItem("acnes", JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.error("Error fetching acnes:", error);
    }
  },
  loadAcnes: async () => {
    try {
      const acnes = await AsyncStorage.getItem("acnes");
      if (acnes) {
        set({ acnes: JSON.parse(acnes) });
      }
    } catch (error) {
      console.error("Error loading acnes:", error);
    }
  },
  clearAcnes: () => {
    set({ acnes: [] });
  },
}));
