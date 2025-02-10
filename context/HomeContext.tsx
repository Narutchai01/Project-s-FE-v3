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

type HomeContextType = {
  results: IResult[] | null;
  skincares: ISkincare[] | null;
  resultLatest: IResult | null;
  skins : ISkin[] | null
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

  useEffect(() => {
    if (results && results.length > 0) {
      setResultLatest(results[results.length - 1]);
    }
  }, [results]);

  const getResults = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Token is not available");
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

  useEffect(() => {
    getResults();
    getSkincares();
    getSkin();
  }, []);

  const contextValue = {
    results,
    skincares,
    resultLatest,
    skins
  };

  return (
    <HomeContext.Provider value={contextValue}>{children}</HomeContext.Provider>
  );
};
