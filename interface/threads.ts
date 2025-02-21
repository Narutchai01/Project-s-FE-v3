import { ISkincare } from "./skincare";

export interface IThreadDetail {
  id: number;
  skincare: ISkincare;
  caption: string;
}

export interface IUser {
    id: number;
    full_name: string;
    email: string;
    birthday: string | null;
    sensitive_skin: boolean | null;
    image: string;
  }
  
  export interface IThread {
    id: number;
    user_id: number;
    user: IUser;
    thread_detail: IThreadDetail[];
  }