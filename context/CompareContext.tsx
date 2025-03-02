import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAcneStore } from "@/store/acneStore";
import { useFacialStore } from "@/store/facialStore";
import { useSkinsStore } from "@/store/skinStore";
import { useSkincareStore } from "@/store/skincare";
import { ISkin } from "@/interface/skin";
import { IAcne } from "@/interface/acne";
import { IFacial } from "@/interface/facial";
import { ISkincare } from "@/interface/skincare";

type CompareContextType = {
  compare: number[];
  setCompare: (compare: number[]) => void;
  isCompare: boolean;
  setIsCompare: (isCompare: boolean) => void;
  skins: ISkin[];
  acnes: IAcne[];
  facials: IFacial[];
  skincares: ISkincare[];
};

const CompareContext = createContext<CompareContextType | null>(null);

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within an CompareProvider");
  }
  return context;
};

export const CompareProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [compare, setCompare] = useState<number[]>([]);
  const [isCompare, setIsCompare] = useState<boolean>(false);
  const { skins, loadskinsFromStore, fetchskins } = useSkinsStore();
  const { acnes, loadAcnes, fetchAcnes } = useAcneStore();
  const { facials, loadFacials, fetchFacials } = useFacialStore();
  const { skincares, loadSkincares, fetchSkincares } = useSkincareStore();

  useEffect(() => {
    fetchskins();
    fetchAcnes();
    fetchFacials();
    fetchSkincares();

    loadskinsFromStore();
    loadAcnes();
    loadFacials();
    loadSkincares();
  }, []);

  const valuesContext = {
    compare,
    setCompare,
    isCompare,
    setIsCompare,
    skins,
    acnes,
    facials,
    skincares,
  };

  return (
    <CompareContext.Provider value={valuesContext}>
      {children}
    </CompareContext.Provider>
  );
};
