import {
  createContext,
  useContext,
  useState,
  FC,
  ReactNode,
  useEffect,
} from "react";
import { IResult } from "@/interface/result";
import { axiosInstance } from "@/lib/axios_instance";
import { ISkincare } from "@/interface/skincare";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ISkin } from "@/interface/skin";
import { IAcne } from "@/interface/acne";
import { IFacial } from "@/interface/facial";

type HomeContextType = {
  results: IResult[] | null;
  skincares: ISkincare[] | null;
  resultLatest: IResult | null;
  skins : ISkin[] | null
  acnes : IAcne[] | null
  facials : IFacial[] | null
};

const HomeContext = createContext<HomeContextType | null>(null);

export const useHome = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error("useHome must be used within an HomeProvider");
  }
  return context;
};

export const HomeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [results, setResults] = useState<IResult[] | null>(null);
  const [skincares, setSkincares] = useState<ISkincare[] | null>(null);
  const [resultLatest, setResultLatest] = useState<IResult | null>(null);
  const [skins, setSkins] = useState<ISkin[] | null>(null);
  const [acnes , setAcnes] = useState<IAcne[] | null>(null);
  const [facials , setFacials] = useState<IFacial[] | null>(null);

  useEffect(() => {
    if (results && results.length > 0) {
      setResultLatest(results[results.length - 1]);
    }
  }, [results]);

  const getResults = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        return;
      }
      const response = await axiosInstance.get("/results/", {
        headers: {
          token: token,
        },
      });
      setResults(response.data.data);
    } catch (error) {
      console.error("HomeContext", error);
    }
  };

  const getSkincares = async () => {
    try {
      await axiosInstance.get("/skincare/").then((response) => {
        setSkincares(response.data.data);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getSkin = async () => {
    try {
      await axiosInstance.get("/skin").then((response) => {
        setSkins(response.data.data);
      });
    } catch (error) {
      console.error(error);
    }
  };


  const getAcne = async () => {
    try {
      await axiosInstance.get("/acne").then((response) => {
        setAcnes(response.data.data);
      });
    } catch (error) {
      console.error(error);
    }
  }


  const getFacial = async () => {
    try {
      await axiosInstance.get("/facial").then((response) => {
        setFacials(response.data.data);
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getResults();
    getSkincares();
    getSkin();
    getAcne();
    getFacial();
  }, [results]);

  const contextValue = {
    results,
    skincares,
    resultLatest,
    skins,
    acnes,
    facials
  };

  return (
    <HomeContext.Provider value={contextValue}>{children}</HomeContext.Provider>
  );
};
