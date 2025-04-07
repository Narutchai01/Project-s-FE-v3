import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/lib/axios_instance";
import { IReview } from "@/interface/review";

type ReviewStore = {
  reviews: IReview[] | null;
  fetchReviews: () => Promise<void>;
  favoriteReview: (id: number) => Promise<void>;
};

export const useReviewStore = create<ReviewStore>((set) => ({
  reviews: null,
  

  fetchReviews: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axiosInstance.get("/reviews", {
        headers: { token },
      });
      if (res.data.status) {
        set({ reviews: res.data.data });
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  },

  favoriteReview: async (id: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axiosInstance.post(`/favorite/review/skincare/${id}`, null, {
        headers: { token },
      });

      const res = await axiosInstance.get("/reviews", {
        headers: { token },
      });

      if (res.data.status) {
        set({ reviews: res.data.data });
      }
    } catch (error) {
      console.error("Favorite error:", error);
    }
  },
}));
