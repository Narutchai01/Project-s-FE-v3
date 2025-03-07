import { IResult } from "./result";
import { ISkincare } from "./skincare";

export interface CardSkincareProps {
  image: string;
  name: string;
}

export interface DiaryCardProps {
  data : IResult;
  compareMode?: boolean;
  selectItem?: () => void;
  selectArray?: number[];
}
export interface ThreadCardProps {
  image: string;
  title: string;
  user: string;
  userAvatar: string;
}

export interface CardReviewProps {
  data: ISkincare;
  setItem : (item: ISkincare) => void;
  selectArray?: ISkincare[];
}
export interface AddPhotoProps {
  image: string | null;
  setImage: (image: string | null) => void;
}

export interface CardPopularSkincare {
  image: string;
  name: string;
}