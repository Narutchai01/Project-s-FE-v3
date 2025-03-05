import {create} from 'zustand';
import {IFacial} from '@/interface/facial';
import {axiosInstance} from '@/lib/axios_instance';
import AsyncStorage from '@react-native-async-storage/async-storage';




type FacialStore = {
  facials: IFacial[];
  fetchFacials: () => Promise<void>;
  loadFacials: () => Promise<void>;
};


export const useFacialStore = create<FacialStore>((set) => ({
  facials: [],
  fetchFacials: async () => {
    try {
      const response = await axiosInstance.get('/facial/');
      if (response.data.status) {
        set({facials: response.data.data});
        await AsyncStorage.setItem('facials', JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.error('Error fetching facials:', error);
    }
  },
  loadFacials: async () => {
    try {
      const facials = await AsyncStorage.getItem('facials');
      if (facials) {
        set({facials: JSON.parse(facials)});
      }
    } catch (error) {
      console.error('Error loading facials:', error);
    }
  },
  clearFacials: () => {
    set({facials: []});
  },
}));