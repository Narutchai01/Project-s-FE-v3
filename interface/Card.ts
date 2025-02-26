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
  selectMode?: boolean;
  selectItem?: (id: number) => void;
  selectArray?: number[];
}
