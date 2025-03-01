import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IAcne } from "@/interface/acne";
import { axiosInstance } from "@/lib/axios_instance";

type skinsStore = {
  skins: IAcne[];
  fetchskins: () => Promise<void>;
  loadskinsFromStore: () => Promise<void>;
};

const skinsKey = "skin";

export const useSkinsStore = create<skinsStore>((set) => ({
  skins: [],
  fetchskins: async () => {
    try {
      const response = await axiosInstance.get("/skin/");
      if (response.data.status) {
        set({ skins: response.data.data });
        await AsyncStorage.setItem(
          skinsKey,
          JSON.stringify(response.data.data)
        );
      }
    } catch (error) {
      console.error("Error fetching skins:", error);
    }
  },
  loadskinsFromStore: async () => {
    try {
      const skins = await AsyncStorage.getItem(skinsKey);
      if (skins) {
        set({ skins: JSON.parse(skins) });
      }
    } catch (error) {
      console.error("Error loading skins:", error);
    }
  },
  clearskins: () => {
    set({ skins: [] });
  },
}));
