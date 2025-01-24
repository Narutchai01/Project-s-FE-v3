export interface ILogin{
    email: string;
    password: string;
}
export interface ISignUp{
    full_name: string;
    birthday: Date | null;
    email: string;
    password: string;
    sensitive_skin: boolean;
}