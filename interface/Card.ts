import { ThreadCard } from '@/components/Card';
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
export interface ThreadCardProps {
  image: string;
  title: string;
  user: string;
  userAvatar: string;
}