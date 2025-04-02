import {Dayjs} from "dayjs";

export type IUser = {

    full_name: string;
    birthday: Dayjs | null;
    email: string;
    password: string;
    sensitive_skin: boolean | null;
    image: string;
    follower: number;   
    following: number; 
}

export type IPubicUser = Omit<IUser, "password">;
export type ILogin = Omit<IUser, "fullname" | "birthday" | "sensitive_skin" | "image">;
export type ISignUp = Omit<IUser, "image">;
export type IGoogleLogin = Omit<IUser, "password" | "birthday">;