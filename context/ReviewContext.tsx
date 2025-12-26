import { ISkincare } from "@/interface/skincare";
import { createContext, FC, ReactNode, useContext, useState } from "react";

type ReviewContextType = {
  review: ISkincare[];
  setReview: (review: ISkincare[]) => void; 
  isReview: boolean; 
  setIsReview: (isReview: boolean) => void; 
  image: string | null; 
  setImage: (image: string | null) => void;
  skincare: ISkincare[]; 
  setSkincare: (skincare: ISkincare[]) => void;
};

const ReviewContext = createContext<ReviewContextType | null>(null);

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReview must be used within a ReviewProvider");
  }
  return context;
};

export const ReviewProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [review, setReview] = useState<ISkincare[]>([]);
  const [isReview, setIsReview] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [skincare, setSkincare] = useState<ISkincare[]>([]);

  const valuesContext = {
    review,
    setReview,
    isReview,
    setIsReview,
    image,
    setImage,
    skincare, 
    setSkincare,
  };

  return (
    <ReviewContext.Provider value={valuesContext}>
      {children}
    </ReviewContext.Provider>
  );
};
