import { createContext, FC, ReactNode, useContext, useState } from "react";

type ReviewContextType = {
  review: number[];
  setReview: (review: number[]) => void;
  isReview: boolean;
  setIsReview: (isReview: boolean) => void;
};


const ReviewContext = createContext<ReviewContextType | null>(null);

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReview must be used within an ReviewProvider");
  }
  return context;
};

export const ReviewProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [review, setReview] = useState<number[]>([]);
  const [isReview, setIsReview] = useState<boolean>(false);

  const valuesContext = {
    review,
    setReview,
    isReview,
    setIsReview,
  };

  return (
    <ReviewContext.Provider value={valuesContext}>
      {children}
    </ReviewContext.Provider>
  );
};