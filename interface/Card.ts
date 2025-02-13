import { IResult } from "./result";

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