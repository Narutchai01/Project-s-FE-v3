import { createContext, FC, ReactNode, useContext, useState } from "react";

type CompareContextType = {
  compare: number[] ;
  setCompare: (compare: number[]) => void;
  isCompare: boolean;
  setIsCompare: (isCompare: boolean) => void;
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

  const valuesContext = {
    compare,
    setCompare,
    isCompare,
    setIsCompare,
  };

  return (
    <CompareContext.Provider value={valuesContext}>
      {children}
    </CompareContext.Provider>
  );
};
