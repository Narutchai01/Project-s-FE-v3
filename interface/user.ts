import {Dayjs} from "dayjs";

export interface ILogin{
    email: string;
    password: string;
}
export interface ISignUp{
    full_name: string;
    birthday: Dayjs | null;
    email: string;
    password: string;
    sensitive_skin: boolean;
}